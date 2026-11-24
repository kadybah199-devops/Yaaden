// Yaaden — réservations partagées.
// GET /api/bookings?passenger_id=<id> : réservations d'un passager.
// GET /api/bookings?ride_id=<id>&driver_id=<id> : réservations d'un trajet (conducteur).
// POST /api/bookings : réserver des places (décrémente les places restantes).
// DELETE /api/bookings?id=<id> : annuler (passager ou code admin, places rendues).
import { send, handleOptions, requireToken, adminOk, clean, newId, readBody,
  getJson, putJson, delBlob, listJson, todayISO } from './_lib.js';

const MAX = { id: 60, name: 80, phone: 30 };

function publicBooking(b) {
  return {
    id: b.id,
    created_at: b.created_at,
    ride_id: b.ride_id,
    passenger_id: b.passenger_id,
    passenger_name: b.passenger_name,
    passenger_phone: b.passenger_phone,
    seats: b.seats,
    status: b.status,
  };
}

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;
  const t = requireToken(res);
  if (!t) return;

  if (req.method === 'GET') {
    const q = req.query || {};
    const passengerId = clean(q.passenger_id, MAX.id);
    const rideId = typeof q.ride_id === 'string' ? q.ride_id : '';
    const driverId = clean(q.driver_id, MAX.id);
    try {
      const all = await listJson('bookings/', t);
      if (rideId) {
        if (!/^[A-Za-z0-9-]+$/.test(rideId) || !driverId) {
          return send(res, 400, { ok: false, error: 'Paramètres invalides.' });
        }
        const ride = await getJson('rides/' + rideId + '.json', t);
        if (!ride) return send(res, 404, { ok: false, error: 'Trajet introuvable.' });
        if (ride.driver_id !== driverId && !adminOk(req)) {
          return send(res, 403, { ok: false, error: 'Seul le conducteur voit ces réservations.' });
        }
        const list = all.filter((b) => b.ride_id === rideId && b.status === 'confirmed')
          .map(publicBooking);
        return send(res, 200, { ok: true, bookings: list });
      }
      if (!passengerId) {
        return send(res, 400, { ok: false, error: 'Indiquez passenger_id ou ride_id.' });
      }
      const list = all.filter((b) => b.passenger_id === passengerId && b.status === 'confirmed')
        .map(publicBooking);
      return send(res, 200, { ok: true, bookings: list });
    } catch (e) {
      console.error('bookings: lecture impossible', e);
      return send(res, 500, { ok: false, error: 'Lecture impossible pour le moment.' });
    }
  }

  if (req.method === 'POST') {
    const b = readBody(req);
    const rideId = typeof b.ride_id === 'string' ? b.ride_id : '';
    const passengerId = clean(b.passenger_id, MAX.id);
    const passengerName = clean(b.passenger_name, MAX.name);
    const passengerPhone = clean(b.passenger_phone, MAX.phone);
    const seats = Number(b.seats);
    if (!/^[A-Za-z0-9-]+$/.test(rideId) || !passengerId || !passengerName || !passengerPhone) {
      return send(res, 400, { ok: false, error: 'Champs obligatoires manquants ou invalides.' });
    }
    if (!Number.isInteger(seats) || seats < 1 || seats > 8) {
      return send(res, 400, { ok: false, error: 'Nombre de places invalide (1 à 8).' });
    }
    const ride = await getJson('rides/' + rideId + '.json', t);
    if (!ride) return send(res, 404, { ok: false, error: 'Trajet introuvable.' });
    if (ride.status !== 'active' || ride.date < todayISO()) {
      return send(res, 400, { ok: false, error: 'Ce trajet n\u2019est plus disponible.' });
    }
    if (ride.driver_id === passengerId) {
      return send(res, 400, { ok: false, error: 'Vous ne pouvez pas réserver votre propre trajet.' });
    }
    const left = ride.seats_left ?? ride.seats;
    if (left < seats) {
      return send(res, 400, { ok: false, error: 'Plus assez de places sur ce trajet.' });
    }
    const id = newId();
    const booking = {
      id,
      created_at: new Date().toISOString(),
      ride_id: rideId,
      passenger_id: passengerId,
      passenger_name: passengerName,
      passenger_phone: passengerPhone,
      seats,
      status: 'confirmed',
    };
    try {
      // Note : lecture-modification-écriture sans verrou ; à ce volume
      // (quelques réservations par jour), le risque de surréservation
      // simultanée est négligeable.
      ride.seats_left = left - seats;
      await putJson('rides/' + rideId + '.json', ride, t);
      await putJson('bookings/' + id + '.json', booking, t);
      return send(res, 200, { ok: true, booking: publicBooking(booking), seats_left: ride.seats_left });
    } catch (e) {
      console.error('bookings: réservation impossible', e);
      return send(res, 500, { ok: false, error: 'Réservation impossible pour le moment.' });
    }
  }

  if (req.method === 'DELETE') {
    const q = req.query || {};
    const id = typeof q.id === 'string' ? q.id : '';
    if (!/^[A-Za-z0-9-]+$/.test(id)) {
      return send(res, 400, { ok: false, error: 'Identifiant invalide.' });
    }
    const booking = await getJson('bookings/' + id + '.json', t);
    if (!booking) return send(res, 404, { ok: false, error: 'Réservation introuvable.' });
    const b = readBody(req);
    const passengerId = clean(b.passenger_id, MAX.id);
    if (!adminOk(req) && (!passengerId || passengerId !== booking.passenger_id)) {
      return send(res, 403, { ok: false, error: 'Seul le passager peut annuler cette réservation.' });
    }
    try {
      booking.status = 'cancelled';
      await putJson('bookings/' + id + '.json', booking, t);
      const ride = await getJson('rides/' + booking.ride_id + '.json', t);
      if (ride && ride.status === 'active') {
        ride.seats_left = Math.min(ride.seats, (ride.seats_left ?? ride.seats) + booking.seats);
        await putJson('rides/' + booking.ride_id + '.json', ride, t);
      }
      return send(res, 200, { ok: true });
    } catch (e) {
      console.error('bookings: annulation impossible', e);
      return send(res, 500, { ok: false, error: 'Annulation impossible pour le moment.' });
    }
  }

  res.setHeader('Allow', 'GET, POST, DELETE, OPTIONS');
  return send(res, 405, { ok: false, error: 'Méthode non autorisée.' });
}
