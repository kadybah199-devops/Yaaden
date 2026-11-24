// Yaaden — trajets partagés.
// GET /api/rides : trajets actifs à venir (filtres : id, driver_id, scope, from, to).
// POST /api/rides : publier un trajet (conducteur vérifié uniquement).
// DELETE /api/rides?id=<id> : le conducteur annule son trajet (driver_id dans
//   le corps) ; avec le code admin, suppression définitive.
import { send, handleOptions, requireToken, adminOk, clean, newId, readBody,
  getJson, putJson, delBlob, listJson, todayISO } from './_lib.js';

const SCOPES = ['ville', 'inter'];
const MAX = { driver_id: 60, name: 80, phone: 30, plate: 20, place: 40,
  date: 10, time: 5, car: 80, meeting: 120, desc: 500 };

function publicRide(r, verifiedMap) {
  const v = verifiedMap[r.driver_id];
  return {
    id: r.id,
    created_at: r.created_at,
    driver_id: r.driver_id,
    driver: r.driver,
    phone: r.phone,
    plate: r.plate || '',
    verified: v ? v.status === 'verified' : false,
    type: r.type,
    from: r.from,
    to: r.to,
    date: r.date,
    time: r.time,
    price: r.price,
    seats: r.seats,
    seats_left: r.seats_left,
    options: r.options || [],
    meeting: r.meeting || '',
    desc: r.desc || '',
    car: r.car || '',
    status: r.status,
    trip_status: r.trip_status || 'idle',
    trip_status_at: r.trip_status_at || null,
  };
}

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;
  const t = requireToken(res);
  if (!t) return;

  /* ---------- GET : liste ou trajet unique ---------- */
  if (req.method === 'GET') {
    const q = req.query || {};
    const id = typeof q.id === 'string' ? q.id : '';
    const driverId = clean(q.driver_id, MAX.driver_id);
    const scope = clean(q.scope, 10);
    const from = clean(q.from, MAX.place);
    const to = clean(q.to, MAX.place);
    try {
      const verifications = await listJson('verifications/', t);
      const verifiedMap = {};
      verifications.forEach((v) => { verifiedMap[v.driver_id] = v; });
      if (id) {
        if (!/^[A-Za-z0-9-]+$/.test(id)) {
          return send(res, 400, { ok: false, error: 'Identifiant invalide.' });
        }
        const r = await getJson('rides/' + id + '.json', t);
        if (!r) return send(res, 404, { ok: false, error: 'Trajet introuvable.' });
        return send(res, 200, { ok: true, ride: publicRide(r, verifiedMap) });
      }
      const all = await listJson('rides/', t);
      const today = todayISO();
      // Vue admin (?all=1 + code) : tous les trajets, y compris annulés et passés.
      const adminAll = q.all === '1' && adminOk(req);
      const rides = all
        .filter((r) => {
          if (driverId) return r.driver_id === driverId;
          if (adminAll) return true;
          if (r.status !== 'active') return false;
          if (r.date < today) return false;
          if ((r.seats_left ?? r.seats) <= 0) return false;
          return true;
        })
        .filter((r) => (!scope || r.type === scope) && (!from || r.from === from) && (!to || r.to === to))
        .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
        .map((r) => publicRide(r, verifiedMap));
      return send(res, 200, { ok: true, rides });
    } catch (e) {
      console.error('rides: lecture impossible', e);
      return send(res, 500, { ok: false, error: 'Lecture impossible pour le moment.' });
    }
  }

  /* ---------- POST : publier ---------- */
  if (req.method === 'POST') {
    const b = readBody(req);
    const driverId = clean(b.driver_id, MAX.driver_id);
    const driver = clean(b.driver, MAX.name);
    const phone = clean(b.phone, MAX.phone);
    const type = clean(b.type, 10);
    const from = clean(b.from, MAX.place);
    const to = clean(b.to, MAX.place);
    const date = clean(b.date, MAX.date);
    const time = clean(b.time, MAX.time);
    const car = clean(b.car, MAX.car);
    const meeting = clean(b.meeting, MAX.meeting);
    const desc = clean(b.desc, MAX.desc);
    const seats = Number(b.seats);
    const price = Number(b.price);
    const options = Array.isArray(b.options)
      ? b.options.filter((o) => ['clim', 'bagages', 'musique'].includes(o)) : [];

    if (!driverId || !driver || !phone || !SCOPES.includes(type) || !from || !to || from === to) {
      return send(res, 400, { ok: false, error: 'Champs obligatoires manquants ou invalides.' });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < todayISO()) {
      return send(res, 400, { ok: false, error: 'Date invalide (choisissez aujourd\u2019hui ou après).' });
    }
    if (!/^\d{2}:\d{2}$/.test(time)) {
      return send(res, 400, { ok: false, error: 'Heure invalide.' });
    }
    if (!Number.isInteger(seats) || seats < 1 || seats > 8) {
      return send(res, 400, { ok: false, error: 'Nombre de places invalide (1 à 8).' });
    }
    if (!Number.isInteger(price) || price < 1000 || price > 2000000) {
      return send(res, 400, { ok: false, error: 'Prix invalide.' });
    }

    // Porte de confiance : pas de publication sans identité vérifiée.
    const verif = await getJson('verifications/' + driverId + '.json', t);
    if (!verif || verif.status !== 'verified') {
      return send(res, 403, { ok: false, error: 'Vérification requise : faites vérifier votre identité avant de publier.', code: 'not_verified' });
    }

    const id = newId();
    const ride = {
      id,
      created_at: new Date().toISOString(),
      driver_id: driverId,
      driver,
      phone,
      plate: verif.plate || '',
      type,
      from,
      to,
      date,
      time,
      price,
      seats,
      seats_left: seats,
      options,
      meeting,
      desc,
      car,
      status: 'active',
      trip_status: 'idle',
      trip_status_at: null,
    };
    try {
      await putJson('rides/' + id + '.json', ride, t);
      const verifiedMap = {};
      verifiedMap[driverId] = verif;
      return send(res, 200, { ok: true, ride: publicRide(ride, verifiedMap) });
    } catch (e) {
      console.error('rides: publication impossible', e);
      return send(res, 500, { ok: false, error: 'Publication impossible pour le moment.' });
    }
  }

  /* ---------- DELETE : annuler (conducteur) ou supprimer (admin) ---------- */
  if (req.method === 'DELETE') {
    const q = req.query || {};
    const id = typeof q.id === 'string' ? q.id : '';
    if (!/^[A-Za-z0-9-]+$/.test(id)) {
      return send(res, 400, { ok: false, error: 'Identifiant invalide.' });
    }
    const ride = await getJson('rides/' + id + '.json', t);
    if (!ride) return send(res, 404, { ok: false, error: 'Trajet introuvable.' });
    if (adminOk(req)) {
      try {
        await delBlob('rides/' + id + '.json', t);
        const bookings = await listJson('bookings/', t);
        for (const bk of bookings.filter((x) => x.ride_id === id)) {
          await delBlob(bk._pathname, t).catch(() => {});
        }
        return send(res, 200, { ok: true });
      } catch (e) {
        console.error('rides: suppression impossible', e);
        return send(res, 500, { ok: false, error: 'Suppression impossible.' });
      }
    }
    const b = readBody(req);
    const driverId = clean(b.driver_id, MAX.driver_id);
    if (!driverId || driverId !== ride.driver_id) {
      return send(res, 403, { ok: false, error: 'Seul le conducteur peut annuler ce trajet.' });
    }
    ride.status = 'cancelled';
    try {
      await putJson('rides/' + id + '.json', ride, t);
      return send(res, 200, { ok: true });
    } catch (e) {
      console.error('rides: annulation impossible', e);
      return send(res, 500, { ok: false, error: 'Annulation impossible pour le moment.' });
    }
  }

  res.setHeader('Allow', 'GET, POST, DELETE, OPTIONS');
  return send(res, 405, { ok: false, error: 'Méthode non autorisée.' });
}
