// Yaaden — vérification d'identité des conducteurs.
// GET /api/verifications?driver_id=<id> : statut d'un conducteur (public, minimal).
// GET /api/verifications (code admin) : toutes les demandes, en attente d'abord.
// POST /api/verifications : envoyer une demande (pièce + selfie partent sur
//   WhatsApp, comme aujourd'hui ; ici on enregistre la demande et la plaque).
// POST /api/verifications?action=decide (code admin) : valider ou refuser.
// DELETE /api/verifications?driver_id=<id> (code admin) : supprimer une demande.
import { send, handleOptions, requireToken, requireAdmin, clean, readBody,
  getJson, putJson, delBlob, listJson } from './_lib.js';

const MAX = { driver_id: 60, name: 80, phone: 30, plate: 20, note: 300 };

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;
  const t = requireToken(res);
  if (!t) return;

  if (req.method === 'GET') {
    const q = req.query || {};
    const driverId = clean(q.driver_id, MAX.driver_id);
    if (driverId) {
      const v = await getJson('verifications/' + driverId + '.json', t);
      if (!v) return send(res, 200, { ok: true, status: 'none' });
      return send(res, 200, { ok: true, status: v.status, plate: v.plate || '' });
    }
    if (!requireAdmin(req, res)) return;
    try {
      const all = await listJson('verifications/', t);
      const order = { pending: 0, verified: 1, rejected: 2 };
      all.sort((a, b) => (order[a.status] ?? 3) - (order[b.status] ?? 3) ||
        String(b.submitted_at || '').localeCompare(String(a.submitted_at || '')));
      const items = all.map((v) => ({
        driver_id: v.driver_id,
        driver_name: v.driver_name,
        driver_phone: v.driver_phone,
        plate: v.plate || '',
        status: v.status,
        submitted_at: v.submitted_at,
        decided_at: v.decided_at || null,
        note: v.note || '',
      }));
      return send(res, 200, { ok: true, verifications: items });
    } catch (e) {
      console.error('verifications: lecture impossible', e);
      return send(res, 500, { ok: false, error: 'Lecture impossible pour le moment.' });
    }
  }

  if (req.method === 'POST') {
    const q = req.query || {};
    if (q.action === 'decide') {
      if (!requireAdmin(req, res)) return;
      const b = readBody(req);
      const driverId = clean(b.driver_id, MAX.driver_id);
      const decision = clean(b.decision, 10);
      const note = clean(b.note, MAX.note);
      if (!driverId || !['verified', 'rejected'].includes(decision)) {
        return send(res, 400, { ok: false, error: 'Décision invalide.' });
      }
      const v = await getJson('verifications/' + driverId + '.json', t);
      if (!v) return send(res, 404, { ok: false, error: 'Demande introuvable.' });
      v.status = decision;
      v.note = note;
      v.decided_at = new Date().toISOString();
      try {
        await putJson('verifications/' + driverId + '.json', v, t);
        return send(res, 200, { ok: true, status: decision });
      } catch (e) {
        console.error('verifications: décision impossible', e);
        return send(res, 500, { ok: false, error: 'Enregistrement impossible pour le moment.' });
      }
    }

    const b = readBody(req);
    const driverId = clean(b.driver_id, MAX.driver_id);
    const driverName = clean(b.driver_name, MAX.name);
    const driverPhone = clean(b.driver_phone, MAX.phone);
    const plate = clean(b.plate, MAX.plate);
    if (!driverId || !driverName || !driverPhone || !plate) {
      return send(res, 400, { ok: false, error: 'Champs obligatoires manquants ou invalides.' });
    }
    try {
      const existing = await getJson('verifications/' + driverId + '.json', t);
      if (existing && existing.status === 'verified') {
        existing.driver_name = driverName;
        existing.driver_phone = driverPhone;
        existing.plate = plate;
        await putJson('verifications/' + driverId + '.json', existing, t);
        return send(res, 200, { ok: true, status: 'verified' });
      }
      const v = {
        driver_id: driverId,
        driver_name: driverName,
        driver_phone: driverPhone,
        plate,
        status: 'pending',
        submitted_at: new Date().toISOString(),
        decided_at: null,
        note: '',
      };
      await putJson('verifications/' + driverId + '.json', v, t);
      return send(res, 200, { ok: true, status: 'pending' });
    } catch (e) {
      console.error('verifications: envoi impossible', e);
      return send(res, 500, { ok: false, error: 'Envoi impossible pour le moment.' });
    }
  }

  if (req.method === 'DELETE') {
    if (!requireAdmin(req, res)) return;
    const q = req.query || {};
    const driverId = clean(q.driver_id, MAX.driver_id);
    if (!driverId || !/^[A-Za-z0-9_-]+$/.test(driverId)) {
      return send(res, 400, { ok: false, error: 'Identifiant invalide.' });
    }
    try {
      await delBlob('verifications/' + driverId + '.json', t);
      return send(res, 200, { ok: true });
    } catch (e) {
      console.error('verifications: suppression impossible', e);
      return send(res, 500, { ok: false, error: 'Suppression impossible.' });
    }
  }

  res.setHeader('Allow', 'GET, POST, DELETE, OPTIONS');
  return send(res, 405, { ok: false, error: 'Méthode non autorisée.' });
}
