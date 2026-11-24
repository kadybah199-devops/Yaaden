// Yaaden — helpers partagés des fonctions API (Vercel, ESM).
// Stockage : magasin Blob privé « yaaden-data », un fichier JSON par objet.
// Le jeton vit dans BLOB_READ_WRITE_TOKEN (Vercel), jamais dans le code.
import { list, get, put, del } from '@vercel/blob';

/* CORS : l'application Android (Capacitor) appelle ces API depuis une autre
   origine que yaaden.vercel.app, donc on autorise toutes les origines. */
export function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-code');
}

export function send(res, status, obj) {
  setCors(res);
  return res.status(status).json(obj);
}

/* Répond aux requêtes pré-vol (OPTIONS) du navigateur / de l'application. */
export function handleOptions(req, res) {
  if (req.method === 'OPTIONS') {
    setCors(res);
    res.status(200).end();
    return true;
  }
  return false;
}

export function token() {
  return process.env.BLOB_READ_WRITE_TOKEN || null;
}

export function requireToken(res) {
  const t = token();
  if (!t) {
    send(res, 500, { ok: false, error: 'Stockage non configuré.' });
    return null;
  }
  return t;
}

/* Code admin (page admin.html) : en-tête « x-admin-code », comparé à
   la variable d'environnement ADMIN_CODE. */
export function adminOk(req) {
  const code = process.env.ADMIN_CODE;
  if (!code) return false;
  const given = req.headers['x-admin-code'];
  return typeof given === 'string' && given.length > 0 && given === code;
}

export function requireAdmin(req, res) {
  if (!process.env.ADMIN_CODE) {
    send(res, 500, { ok: false, error: 'Code admin non configuré.' });
    return false;
  }
  if (!adminOk(req)) {
    send(res, 401, { ok: false, error: 'Code incorrect.' });
    return false;
  }
  return true;
}

/* Nettoie une valeur texte : caractères de contrôle retirés, espaces
   superflus coupés, longueur plafonnée. */
export function clean(value, max) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);
}

export function newId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
}

export function readBody(req) {
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  if (!body || typeof body !== 'object') body = {};
  return body;
}

/* Lit un fichier JSON du magasin ; null s'il n'existe pas ou est illisible.
   Le magasin Blob met parfois une seconde à rendre une écriture visible :
   on réessaie 3 fois avant de conclure à l'absence (sinon, une décision
   prise juste après un envoi échouerait avec « introuvable »). */
export async function getJson(pathname, t) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const result = await get(pathname, { access: 'private', token: t });
      const text = await new Response(result.stream).text();
      return JSON.parse(text);
    } catch (e) {
      if (attempt < 2) await new Promise((r) => setTimeout(r, 400));
    }
  }
  return null;
}

export async function putJson(pathname, obj, t) {
  await put(pathname, JSON.stringify(obj), {
    access: 'private',
    contentType: 'application/json',
    allowOverwrite: true,
    token: t,
  });
}

export async function delBlob(pathname, t) {
  await del(pathname, { token: t });
}

/* Liste tous les objets JSON sous un préfixe (plus récents d'abord). */
export async function listJson(prefix, t) {
  const out = [];
  let cursor;
  let hasMore = true;
  let guard = 0;
  while (hasMore && guard < 10) {
    guard += 1;
    const page = await list({ prefix, limit: 100, cursor, token: t });
    for (const blob of page.blobs) {
      const obj = await getJson(blob.pathname, t);
      if (obj) {
        obj._pathname = blob.pathname;
        out.push(obj);
      }
    }
    hasMore = page.hasMore;
    cursor = page.cursor;
  }
  out.sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')));
  return out;
}

export function todayISO() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
}
