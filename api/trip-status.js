// Yaaden — signal d'arrivée partagé.
// POST /api/trip-status : le conducteur signale « j'arrive », « je suis arrivé »
//   ou annule le signal (le statut est enregistré sur le trajet).
// GET /api/trip-status?ride_id=<id> : statut actuel du trajet.
import { send, handleOptions, requireToken, clean, readBody, getJson, putJson } from './_lib.js';

const STATUSES = ['idle', 'arriving', 'arrived'];

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;
  const t = requireToken(res);
  if (!t) return;

  if (req.method === 'GET') {
    const q = req.query || {};
    const rideId = typeof q.ride_id === 'string' ? q.ride_id : '';
    if (!/^[A-Za-z0-9-]+$/.test(rideId)) {
      return send(res, 400, { ok: false, error: 'Identifiant invalide.' });
    }
    const ride = await getJson('rides/' + rideId + '.json', t);
    if (!ride) return send(res, 404, { ok: false, error: 'Trajet introuvable.' });
    return send(res, 200, {
      ok: true,
      ride_id: rideId,
      trip_status: ride.trip_status || 'idle',
      trip_status_at: ride.trip_status_at || null,
    });
  }

  if (req.method === 'POST') {
    const b = readBody(req);
    const rideId = typeof b.ride_id === 'string' ? b.ride_id : '';
    const driverId = clean(b.driver_id, 60);
    const status = clean(b.status, 10);
    if (!/^[A-Za-z0-9-]+$/.test(rideId) || !driverId || !STATUSES.includes(status)) {
      return send(res, 400, { ok: false, error: 'Champs obligatoires manquants ou invalides.' });
    }
    const ride = await getJson('rides/' + rideId + '.json', t);
    if (!ride) return send(res, 404, { ok: false, error: 'Trajet introuvable.' });
    if (ride.driver_id !== driverId) {
      return send(res, 403, { ok: false, error: 'Seul le conducteur peut signaler l\u2019arrivée.' });
    }
    ride.trip_status = status;
    ride.trip_status_at = status === 'idle' ? null : new Date().toISOString();
    try {
      await putJson('rides/' + rideId + '.json', ride, t);
      return send(res, 200, { ok: true, trip_status: status });
    } catch (e) {
      console.error('trip-status: mise à jour impossible', e);
      return send(res, 500, { ok: false, error: 'Mise à jour impossible pour le moment.' });
    }
  }

  res.setHeader('Allow', 'GET, POST, OPTIONS');
  return send(res, 405, { ok: false, error: 'Méthode non autorisée.' });
}
