/* Yaaden — covoiturage en Guinée. Un service Digifind.
   V1 : 100 % locale, données de démo + localStorage, aucun backend. */
'use strict';

/* ---------- Constantes ---------- */
const CITIES = ['Conakry','Kindia','Mamou','Labé','Kankan','Nzérékoré','Boké','Faranah','Siguiri','Coyah','Dubréka'];
/* Communes et quartiers de Conakry pour les trajets en ville. */
const CONAKRY_PLACES = ['Kaloum','Dixinn','Ratoma','Matam','Matoto','Kipé','Taouyah','Lambanyi','Cosa','Hamdallaye','Bambéto','Kaporo','Enco 5','Sangoyah','Nongo','Sonfonia','Kagbélen','Madina','Bonfi','Coléah'];
const LS_TRIPS = 'yaaden_my_trips_v1';
const LS_BOOKINGS = 'yaaden_bookings_v1';
const LS_PROFILE = 'yaaden_profile_v1';
const LS_CHAT = 'yaaden_chat_v1';
const LS_CHAT_SEEN = 'yaaden_chat_seen_v1';
const LS_STATUS = 'yaaden_trip_status_v1';
const LS_VERIFY = 'yaaden_verification_v1';
/* WhatsApp d'assistance Yaaden (équipe Digifind à Conakry). */
const SUPPORT_WA = '224620685645';
const SUPPORT_WA_MSG = 'Bonjour, j\u2019ai besoin d\u2019aide sur Yaaden.';
const AVATAR_COLORS = ['#00B894','#3DDC97','#4D9DE0','#8B7CF6','#E86AA8','#2BB3A3','#1B6FA8','#5B4DBC'];
/* Coordonnées approximatives des lieux de départ — pour « Près de moi ». */
const PLACE_COORDS = {
  'Conakry':[9.51,-13.71], 'Kindia':[10.06,-12.85], 'Mamou':[10.38,-12.09],
  'Labé':[11.32,-12.28], 'Kankan':[10.38,-9.31], 'Nzérékoré':[7.75,-8.82],
  'Boké':[10.94,-14.30], 'Faranah':[10.04,-13.57], 'Siguiri':[9.51,-9.17],
  'Coyah':[9.71,-13.38], 'Dubréka':[9.79,-13.52],
  'Kaloum':[9.51,-13.71], 'Dixinn':[9.54,-13.68], 'Ratoma':[9.62,-13.62],
  'Matam':[9.55,-13.67], 'Matoto':[9.57,-13.64], 'Kipé':[9.59,-13.65],
  'Taouyah':[9.56,-13.66], 'Lambanyi':[9.62,-13.60], 'Cosa':[9.60,-13.63],
  'Hamdallaye':[9.59,-13.66], 'Bambéto':[9.60,-13.61], 'Kaporo':[9.61,-13.60],
  'Enco 5':[9.60,-13.60], 'Sangoyah':[9.58,-13.61], 'Nongo':[9.63,-13.60],
  'Sonfonia':[9.63,-13.58], 'Kagbélen':[9.65,-13.57], 'Madina':[9.56,-13.67],
  'Bonfi':[9.53,-13.68], 'Coléah':[9.53,-13.69]
};
/* Rayon « Près de moi » : 10 km en ville, 50 km entre villes (ville de départ). */
const GEO_RADIUS_KM = { ville: 10, inter: 50 };
/* Vérification des conducteurs de démo : pièce d'identité + permis contrôlés. */
const DRIVER_INFO = {
  'Mamadou Bah':{verified:true, plate:'RC 1234 AB'},
  'Fatoumata Diallo':{verified:true, plate:'RC 5678 CD'},
  'Ibrahima Sow':{verified:true, plate:'RC 9012 EF'},
  'Aïcha Camara':{verified:true, plate:'RC 3456 GH'},
  'Abdoulaye Barry':{verified:false, plate:'RC 7890 IJ'},
  'Ousmane Sylla':{verified:true, plate:'RC 2345 KL'},
  'Mariam Condé':{verified:true, plate:'RC 6789 MN'},
  'Alpha Diallo':{verified:false, plate:'RC 1122 OP'},
  'Sekou Touré':{verified:true, plate:'RC 3344 QR'},
  'Aminata Touré':{verified:true, plate:'RC 5566 ST'},
  'Lamine Keïta':{verified:false, plate:'RC 7788 UV'},
  'Nabintou Baldé':{verified:true, plate:'RC 9900 WX'},
  'Moussa Konaté':{verified:false, plate:'RC 1212 YZ'},
  'Fodé Camara':{verified:true, plate:'RC 3434 AB'},
  'Thierno Diallo':{verified:true, plate:'RC 5656 CD'},
  'Kadiatou Barry':{verified:true, plate:'RC 7878 EF'},
  'Mamadou Yéro Bah':{verified:true, plate:'RC 9090 GH'},
  'Aïssatou Sow':{verified:false, plate:'RC 1313 IJ'},
  'Ibrahima Kalil Camara':{verified:true, plate:'RC 2424 KL'},
  'Fatoumata Binta Diallo':{verified:true, plate:'RC 3535 MN'},
  'Abdoul Karim Sylla':{verified:true, plate:'RC 4646 OP'},
  'Mariam Kaba':{verified:false, plate:'RC 5757 QR'},
  'Oumar Bangoura':{verified:true, plate:'RC 6868 ST'},
  'Saran Condé':{verified:true, plate:'RC 7979 UV'},
  'Lamine Touré':{verified:false, plate:'RC 8080 WX'}
};

/* Trajets de démo : day = décalage en jours à partir d'aujourd'hui (toujours futurs). */
const DEMO_TRIPS = [
  { from:'Conakry', to:'Kindia', day:1, time:'07:30', price:150000, seats:3, driver:'Mamadou Bah', rating:4.9, trips:42, car:'Toyota Corolla — grise', phone:'224622345678', options:['clim','bagages'], meeting:'Rond-point de Bambéto', desc:'Départ ponctuel, pause café à Coyah. Conduite tranquille.' },
  { from:'Conakry', to:'Kindia', day:1, time:'14:00', price:140000, seats:2, driver:'Fatoumata Diallo', rating:4.8, trips:27, car:'Hyundai i10 — blanche', phone:'224623456789', options:['bagages','musique'], meeting:'Marché Madina, porte 3', desc:'Je rentre à Kindia pour le week-end, 2 places libres.' },
  { from:'Conakry', to:'Mamou', day:1, time:'06:00', price:250000, seats:4, driver:'Ibrahima Sow', rating:4.7, trips:58, car:'Toyota Prado — noire', phone:'224624567890', options:['clim','bagages','musique'], meeting:'Gare routière de Matoto', desc:'Trajet direct, arrêt à Kindia pour le petit-déjeuner.' },
  { from:'Conakry', to:'Labé', day:2, time:'06:30', price:350000, seats:3, driver:'Aïcha Camara', rating:5.0, trips:19, car:'Mitsubishi Pajero — bleue', phone:'224625678901', options:['clim','bagages'], meeting:'Carrefour de Kagbélen', desc:'Départ tôt pour arriver avant la nuit. Bagages bienvenus.' },
  { from:'Conakry', to:'Boké', day:2, time:'08:00', price:200000, seats:2, driver:'Abdoulaye Barry', rating:4.6, trips:33, car:'Toyota Hilux — rouge', phone:'224626789012', options:['bagages'], meeting:'Km 36, station Total', desc:'Je vais à Boké pour le travail, places à l\u2019arrière.' },
  { from:'Conakry', to:'Kankan', day:3, time:'05:30', price:450000, seats:4, driver:'Ousmane Sylla', rating:4.9, trips:71, car:'Toyota Land Cruiser — blanche', phone:'224627890123', options:['clim','bagages','musique'], meeting:'Gare routière de Matoto', desc:'Grand voyage, départ très tôt. Pause déjeuner à Mamou.' },
  { from:'Kindia', to:'Conakry', day:1, time:'16:00', price:150000, seats:3, driver:'Mariam Condé', rating:4.8, trips:22, car:'Kia Picanto — rouge', phone:'224628901234', options:['musique','bagages'], meeting:'Centre-ville de Kindia, pharmacie', desc:'Retour à Conakry en fin de journée.' },
  { from:'Labé', to:'Conakry', day:3, time:'07:00', price:350000, seats:2, driver:'Alpha Diallo', rating:4.7, trips:15, car:'Nissan Patrol — verte', phone:'224629012345', options:['clim','bagages'], meeting:'Gare de Labé', desc:'Descente sur Conakry, 2 places disponibles.' },
  { from:'Conakry', to:'Nzérékoré', day:4, time:'05:00', price:600000, seats:3, driver:'Sekou Touré', rating:4.9, trips:48, car:'Toyota Prado — grise', phone:'224620123456', options:['clim','bagages','musique'], meeting:'Gare routière de Matoto', desc:'Long trajet vers la Guinée forestière. Départ à l\u2019aube.' },
  { from:'Conakry', to:'Faranah', day:2, time:'07:00', price:400000, seats:4, driver:'Aminata Touré', rating:4.8, trips:26, car:'Hyundai Tucson — noire', phone:'224621234567', options:['clim','bagages'], meeting:'Rond-point de Bambéto', desc:'Je rends visite à ma famille à Faranah.' },
  { from:'Conakry', to:'Coyah', day:1, time:'09:00', price:50000, seats:3, driver:'Lamine Keïta', rating:4.5, trips:64, car:'Toyota Yaris — jaune', phone:'224622234567', options:['bagages'], meeting:'Marché Madina', desc:'Petit trajet, je fais l\u2019aller-retour dans la journée.' },
  { from:'Mamou', to:'Labé', day:2, time:'10:00', price:120000, seats:2, driver:'Nabintou Baldé', rating:4.9, trips:12, car:'Suzuki Swift — bleue', phone:'224623234567', options:['musique'], meeting:'Gare de Mamou', desc:'Trajet entre les deux villes du Fouta.' },
  { from:'Kankan', to:'Siguiri', day:3, time:'08:30', price:120000, seats:3, driver:'Moussa Konaté', rating:4.6, trips:29, car:'Toyota Corolla — blanche', phone:'224624234567', options:['bagages','musique'], meeting:'Centre-ville de Kankan', desc:'Direction Siguiri, arrêt possible à Bouré.' },
  { from:'Conakry', to:'Dubréka', day:1, time:'11:00', price:60000, seats:2, driver:'Fodé Camara', rating:4.7, trips:18, car:'Renault Duster — grise', phone:'224625234567', options:['bagages'], meeting:'Km 36', desc:'Je monte à Dubréka, 2 places libres.' },
];

/* Trajets de démo EN VILLE à Conakry : petits prix (20 000 – 60 000 GNF). */
const DEMO_CITY_TRIPS = [
  { from:'Kipé', to:'Kaloum', day:1, time:'07:00', price:40000, seats:3, driver:'Thierno Diallo', rating:4.9, trips:86, car:'Toyota Corolla — blanche', phone:'224622112233', options:['clim','musique'], meeting:'Kipé, station Shell', desc:'Trajet du matin vers le centre-ville, tous les jours ouvrés.' },
  { from:'Bambéto', to:'Matoto', day:1, time:'07:30', price:30000, seats:2, driver:'Kadiatou Barry', rating:4.8, trips:41, car:'Kia Picanto — bleue', phone:'224623112233', options:['musique'], meeting:'Rond-point de Bambéto', desc:'Je descends à Matoto pour le travail, départ à l\u2019heure.' },
  { from:'Cosa', to:'Kaloum', day:1, time:'06:45', price:45000, seats:3, driver:'Mamadou Yéro Bah', rating:4.7, trips:63, car:'Hyundai i20 — grise', phone:'224624112233', options:['clim','bagages'], meeting:'Cosa, carrefour principal', desc:'Départ tôt pour éviter les embouteillages.' },
  { from:'Hamdallaye', to:'Dixinn', day:1, time:'08:00', price:25000, seats:4, driver:'Aïssatou Sow', rating:4.9, trips:35, car:'Toyota Yaris — rouge', phone:'224625112233', options:['musique','bagages'], meeting:'Hamdallaye, marché', desc:'Petit trajet vers Dixinn, 4 places.' },
  { from:'Lambanyi', to:'Matam', day:1, time:'07:15', price:35000, seats:2, driver:'Ibrahima Kalil Camara', rating:4.6, trips:24, car:'Nissan Micra — noire', phone:'224626112233', options:['clim'], meeting:'Lambanyi, mosquée', desc:'Direction Matam le matin, retour le soir.' },
  { from:'Nongo', to:'Kipé', day:1, time:'17:30', price:25000, seats:3, driver:'Fatoumata Binta Diallo', rating:4.8, trips:29, car:'Suzuki Swift — blanche', phone:'224627112233', options:['musique'], meeting:'Nongo, cité', desc:'Retour du soir vers Kipé.' },
  { from:'Sonfonia', to:'Kaloum', day:2, time:'07:00', price:50000, seats:3, driver:'Abdoul Karim Sylla', rating:4.9, trips:52, car:'Toyota Prado — noire', phone:'224628112233', options:['clim','bagages','musique'], meeting:'Sonfonia, gare', desc:'Grand trajet du matin, climatisé.' },
  { from:'Kagbélen', to:'Ratoma', day:2, time:'08:30', price:30000, seats:2, driver:'Mariam Kaba', rating:4.7, trips:17, car:'Kia Rio — grise', phone:'224629112233', options:['bagages'], meeting:'Kagbélen, carrefour', desc:'Je vais à Ratoma, 2 places libres.' },
  { from:'Taouyah', to:'Kaloum', day:2, time:'07:45', price:35000, seats:3, driver:'Oumar Bangoura', rating:4.8, trips:38, car:'Toyota Corolla — bleue', phone:'224620112233', options:['clim','musique'], meeting:'Taouyah, corniche', desc:'Descente vers Kaloum par la corniche.' },
  { from:'Kaporo', to:'Matoto', day:1, time:'16:30', price:40000, seats:2, driver:'Saran Condé', rating:4.9, trips:21, car:'Hyundai Tucson — blanche', phone:'224621112233', options:['clim','bagages'], meeting:'Kaporo Rails', desc:'Trajet de l\u2019après-midi vers Matoto.' },
  { from:'Kaloum', to:'Kipé', day:1, time:'18:00', price:40000, seats:3, driver:'Thierno Diallo', rating:4.9, trips:86, car:'Toyota Corolla — blanche', phone:'224622112233', options:['clim','musique'], meeting:'Kaloum, port', desc:'Retour du soir vers Kipé.' },
  { from:'Enco 5', to:'Madina', day:2, time:'09:00', price:20000, seats:4, driver:'Lamine Touré', rating:4.5, trips:47, car:'Toyota Starlet — jaune', phone:'224622223344', options:['bagages'], meeting:'Enco 5, marché', desc:'Petit trajet vers le marché Madina.' },
];

const OPTION_LABELS = { clim:'Climatisation', bagages:'Bagages acceptés', musique:'Musique' };
const OPTION_ICONS = { clim:'i-snow', bagages:'i-bag', musique:'i-music' };

/* ---------- État ---------- */
let myTrips = loadJSON(LS_TRIPS, []);
let bookings = loadJSON(LS_BOOKINGS, []);
let profile = loadJSON(LS_PROFILE, null);
let passengers = 1;
let pubSeats = 3;
let searchType = 'inter'; /* 'inter' = entre villes, 'ville' = en ville à Conakry */
let pubType = 'inter';
let currentTab = 'bookings';
let currentDetailId = null;
let detailSeats = 1;
let lastSearch = null;
let tripStatus = loadJSON(LS_STATUS, {});
let verification = loadJSON(LS_VERIFY, null);
let userPos = null; /* {lat, lng} — position du téléphone, jamais enregistrée */
let geoMode = false;
let verifiedOnly = false;

/* ---------- Utilitaires ---------- */
function loadJSON(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key)); return v === null || v === undefined ? fallback : v; }
  catch (e) { return fallback; }
}
function saveJSON(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {} }
function esc(s) {
  return String(s === undefined || s === null ? '' : s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function fmtGNF(n) { return Number(n).toLocaleString('fr-FR') + ' GNF'; }
function pad(n) { return String(n).padStart(2, '0'); }
function dateFromOffset(day) {
  const d = new Date(); d.setDate(d.getDate() + day);
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}
function prettyDate(iso) {
  const d = new Date(iso + 'T12:00:00');
  const today = new Date(); today.setHours(12, 0, 0, 0);
  const diff = Math.round((d - today) / 86400000);
  const label = d.toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long' });
  const cap = label.charAt(0).toUpperCase() + label.slice(1);
  if (diff === 0) return "Aujourd'hui · " + cap;
  if (diff === 1) return 'Demain · ' + cap;
  return cap;
}
function shortDate(iso) {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('fr-FR', { weekday:'short', day:'numeric', month:'short' });
}
function initials(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(function (w) { return w[0].toUpperCase(); }).join('');
}
function avatarColor(name) {
  let h = 0; for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 997;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}
function avatarHTML(name, cls) {
  return '<span class="avatar' + (cls ? ' ' + cls : '') + '" style="background:' + avatarColor(name) + '">' + esc(initials(name)) + '</span>';
}
function waLink(phone, text) {
  const num = String(phone).replace(/[^0-9]/g, '');
  const full = num.startsWith('224') ? num : '224' + num.replace(/^0/, '');
  return 'https://wa.me/' + full + '?text=' + encodeURIComponent(text);
}
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.hidden = false;
  clearTimeout(t._timer);
  t._timer = setTimeout(function () { t.hidden = true; }, 3200);
}

/* ---------- Géolocalisation : voitures près de moi ---------- */
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return 2 * R * Math.asin(Math.sqrt(a));
}
function placeCoords(name) { return PLACE_COORDS[name] || null; }
function tripDistanceKm(trip) {
  if (!userPos) return null;
  const c = placeCoords(trip.from);
  if (!c) return null;
  return haversineKm(userPos.lat, userPos.lng, c[0], c[1]);
}
function fmtDist(km) {
  if (km === null || km === undefined) return '';
  if (km < 0.1) return 'ici';
  if (km < 1) return 'à ' + Math.round(km * 1000) + ' m';
  if (km < 10) return 'à ' + km.toFixed(1).replace('.', ',') + ' km';
  return 'à ' + Math.round(km) + ' km';
}
function nearbyTrips(list, type) {
  if (!userPos) return [];
  const radius = GEO_RADIUS_KM[type] || 10;
  return list.filter(function (t) {
    const d = tripDistanceKm(t);
    return d !== null && d <= radius;
  }).sort(function (a, b) { return tripDistanceKm(a) - tripDistanceKm(b); });
}
function sortByDistance(list) {
  if (!userPos) return list;
  return list.slice().sort(function (a, b) {
    const da = tripDistanceKm(a), db = tripDistanceKm(b);
    if (da === null) return 1;
    if (db === null) return -1;
    return da - db;
  });
}

/* ---------- Vérification conducteurs ---------- */
function driverVerification(trip) {
  if (trip.mine) {
    if (verification && verification.status === 'verified') return { status:'verified', plate: verification.plate || '' };
    if (verification && verification.status === 'pending') return { status:'pending', plate: verification.plate || '' };
    return { status:'none', plate: '' };
  }
  const info = DRIVER_INFO[trip.driver];
  if (!info) return { status:'none', plate:'' };
  return { status: info.verified ? 'verified' : 'none', plate: info.plate || '' };
}
function verifyBadgeHTML(v) {
  if (v.status === 'verified') return '<span class="pill verified"><svg class="ic"><use href="#i-shield"/></svg>Vérifié</span>';
  if (v.status === 'pending') return '<span class="pill pending"><svg class="ic"><use href="#i-clock"/></svg>Vérification en cours</span>';
  return '';
}
function verifyLineHTML(v) {
  if (v.status === 'verified') return '<div class="verify-line ok"><svg class="ic"><use href="#i-shield"/></svg><span><b>Conducteur vérifié</b> — pièce d\u2019identité et permis contrôlés par l\u2019équipe Yaaden.</span></div>';
  if (v.status === 'pending') return '<div class="verify-line pending"><svg class="ic"><use href="#i-clock"/></svg><span><b>Vérification en cours</b> — documents envoyés, contrôle sous 24 h.</span></div>';
  return '<div class="verify-line none"><svg class="ic"><use href="#i-shield"/></svg><span><b>Identité non vérifiée.</b> Échangez sur WhatsApp avec le conducteur avant le départ.</span></div>';
}

/* ---------- Alerte d'arrivée ---------- */
function getTripStatus(id) { return tripStatus[id] || null; }
function setTripStatus(id, status) {
  if (status) tripStatus[id] = status; else delete tripStatus[id];
  saveJSON(LS_STATUS, tripStatus);
}
function arrivalBadgeHTML(trip) {
  const s = getTripStatus(trip.id);
  if (s === 'arrived') return '<span class="pill arrived"><svg class="ic"><use href="#i-pin"/></svg>Le conducteur est arrivé</span>';
  if (s === 'arriving') return '<span class="pill arriving"><svg class="ic"><use href="#i-car"/></svg>Le conducteur arrive</span>';
  return '';
}
function arrivalStatusHTML(trip) {
  const s = getTripStatus(trip.id);
  if (s === 'arrived') return '<div class="arrival-status arrived"><svg class="ic"><use href="#i-pin"/></svg><span><b>Le conducteur est arrivé</b> au point de rendez-vous.</span></div>';
  if (s === 'arriving') return '<div class="arrival-status arriving"><svg class="ic"><use href="#i-car"/></svg><span><b>Le conducteur arrive</b> — il est tout près.</span></div>';
  return '<div class="arrival-status idle"><svg class="ic"><use href="#i-clock"/></svg><span>Le conducteur vous préviendra quand il sera à côté.</span></div>';
}

/* ---------- Données : démo + publiés ---------- */
function allTrips() {
  const demo = DEMO_TRIPS.map(function (t, i) {
    return Object.assign({}, t, { id:'demo-' + i, type:'inter', date: dateFromOffset(t.day), mine:false });
  });
  const city = DEMO_CITY_TRIPS.map(function (t, i) {
    return Object.assign({}, t, { id:'city-' + i, type:'ville', date: dateFromOffset(t.day), mine:false });
  });
  const mine = myTrips.map(function (t) { return Object.assign({}, t, { type: t.type || 'inter', mine:true }); });
  return demo.concat(city, mine).sort(function (a, b) {
    return (a.date + a.time).localeCompare(b.date + b.time);
  });
}
function findTrip(id) {
  return allTrips().find(function (t) { return t.id === id; }) || null;
}
function seatsLeft(trip) {
  const taken = bookings.filter(function (b) { return b.tripId === trip.id; })
    .reduce(function (sum, b) { return sum + b.seats; }, 0);
  return Math.max(0, trip.seats - taken);
}
function myBookingFor(tripId) {
  return bookings.find(function (b) { return b.tripId === tripId; }) || null;
}

/* ---------- Rendu : cartes trajet ---------- */
function optionPills(trip) {
  return (trip.options || []).map(function (o) {
    return '<span class="pill"><svg class="ic"><use href="#' + OPTION_ICONS[o] + '"/></svg>' + esc(OPTION_LABELS[o]) + '</span>';
  }).join('');
}
function tripCardHTML(trip) {
  const left = seatsLeft(trip);
  const low = left <= 1;
  const booked = myBookingFor(trip.id);
  return '<button type="button" class="trip-card' + (trip.mine ? ' mine' : '') + '" data-trip="' + esc(trip.id) + '">' +
    '<div class="trip-top">' +
      '<div><div class="trip-route">' + esc(trip.from) + ' <span class="arrow">→</span> ' + esc(trip.to) + '</div>' +
      '<div class="route-visual" aria-hidden="true"><span class="rv-dot"></span><span class="rv-line"></span><span class="rv-dot end"></span></div>' +
      '<div class="trip-date"><svg class="ic"><use href="#i-cal"/></svg>' + esc(shortDate(trip.date)) +
      ' · <svg class="ic"><use href="#i-clock"/></svg>' + esc(trip.time) + '</div></div>' +
      '<div class="trip-price"><b>' + esc(fmtGNF(trip.price)) + '</b><span>par place</span></div>' +
    '</div>' +
    '<div class="trip-meta">' +
      (trip.type === 'ville'
        ? '<span class="pill city"><svg class="ic"><use href="#i-pin"/></svg>En ville · Conakry</span>'
        : '<span class="pill"><svg class="ic"><use href="#i-car"/></svg>Entre villes</span>') +
      '<span class="pill seats' + (low ? ' low' : '') + '"><svg class="ic"><use href="#i-seat"/></svg>' +
        (left === 0 ? 'Complet' : left + (left > 1 ? ' places restantes' : ' place restante')) + '</span>' +
      (userPos && tripDistanceKm(trip) !== null ? '<span class="pill dist"><svg class="ic"><use href="#i-pin"/></svg>Départ ' + esc(fmtDist(tripDistanceKm(trip))) + '</span>' : '') +
      verifyBadgeHTML(driverVerification(trip)) +
      arrivalBadgeHTML(trip) +
      (booked ? '<span class="booking-badge"><svg class="ic"><use href="#i-check"/></svg>Réservé : ' + booked.seats + ' place' + (booked.seats > 1 ? 's' : '') + '</span>' : '') +
      (trip.mine ? '<span class="pill"><svg class="ic"><use href="#i-car"/></svg>Mon trajet</span>' : '') +
      optionPills(trip) +
    '</div>' +
    '<div class="ticket-perfo" aria-hidden="true"></div>' +
    '<div class="trip-driver">' + avatarHTML(trip.driver) +
      '<div class="driver-info"><div class="driver-name">' + esc(trip.driver) + '</div>' +
      '<div class="driver-sub"><svg class="ic"><use href="#i-star"/></svg>' + trip.rating.toFixed(1) +
      ' · ' + trip.trips + ' trajets · ' + esc(trip.car) + '</div></div>' +
      '<svg class="ic chev"><use href="#i-chev"/></svg>' +
    '</div>' +
  '</button>';
}
function renderResults(list, title) {
  const box = document.getElementById('results');
  document.getElementById('results-title').textContent = title || 'Prochains départs';
  document.getElementById('results-count').textContent = list.length ? list.length + ' trajet' + (list.length > 1 ? 's' : '') : '';
  if (!list.length) {
    box.innerHTML = '<div class="empty"><strong>Aucun trajet trouvé</strong>' +
      '<p>Essayez une autre date ou un autre trajet, ou publiez votre propre trajet.</p>' +
      '<button type="button" class="btn btn-navy btn-small" id="empty-publish">Publier un trajet</button></div>';
    const b = document.getElementById('empty-publish');
    if (b) b.addEventListener('click', function () { showScreen('publish'); });
    return;
  }
  box.innerHTML = list.map(tripCardHTML).join('');
}
function upcomingTrips(type) {
  return allTrips().filter(function (t) {
    return seatsLeft(t) > 0 && (!type || t.type === type);
  });
}
function typeTitle(type) {
  return type === 'ville' ? 'Prochains départs · En ville à Conakry' : 'Prochains départs · Entre villes';
}
/* Filtres actifs : conducteurs vérifiés, puis « Près de moi » (ou tri par distance). */
function applyFilters(list) {
  let out = list;
  if (verifiedOnly) out = out.filter(function (t) { return driverVerification(t).status === 'verified'; });
  if (geoMode && userPos) {
    const near = nearbyTrips(out, searchType);
    out = near.length ? near : sortByDistance(out);
  } else if (userPos) {
    out = sortByDistance(out);
  }
  return out;
}
/* Bandeau « voitures près de vous » au-dessus des résultats. */
function renderGeoBanner(list) {
  const b = document.getElementById('geo-banner');
  if (!userPos) { b.hidden = true; return; }
  const near = nearbyTrips(list, searchType);
  if (geoMode) {
    b.hidden = false;
    b.innerHTML = near.length
      ? '<svg class="ic"><use href="#i-pin"/></svg><span><b>' + near.length + ' voiture' + (near.length > 1 ? 's' : '') + ' près de vous</b> — départ à moins de ' + GEO_RADIUS_KM[searchType] + ' km.</span>'
      : '<svg class="ic"><use href="#i-pin"/></svg><span><b>Aucune voiture à proximité.</b> Voici les prochains départs.</span>';
  } else if (near.length) {
    b.hidden = false;
    b.innerHTML = '<svg class="ic"><use href="#i-pin"/></svg><span><b>' + near.length + ' voiture' + (near.length > 1 ? 's' : '') + ' près de vous</b> dans ces résultats.</span>';
  } else {
    b.hidden = true;
  }
}
function renderSearchResults(list, title) {
  const filtered = applyFilters(list);
  if (geoMode && userPos && !lastSearch) title = 'Voitures près de vous';
  renderResults(filtered, title);
  renderGeoBanner(filtered);
}
/* Re-rend la liste de recherche selon la dernière recherche ou le type courant. */
function refreshResults() {
  if (lastSearch) {
    renderSearchResults(upcomingTrips(lastSearch.type).filter(function (t) {
      return t.from === lastSearch.from && t.to === lastSearch.to && (!lastSearch.date || t.date === lastSearch.date);
    }), lastSearch.from + ' → ' + lastSearch.to);
  } else {
    renderSearchResults(upcomingTrips(searchType), typeTitle(searchType));
  }
}
/* Bouton « Voitures près de moi » : demande la position, puis montre les départs proches. */
function toggleGeo() {
  const btn = document.getElementById('geo-btn');
  if (geoMode) {
    geoMode = false;
    btn.classList.remove('active');
    refreshResults();
    return;
  }
  if (!('geolocation' in navigator)) { toast('La géolocalisation n’est pas disponible sur cet appareil.'); return; }
  btn.classList.add('loading');
  navigator.geolocation.getCurrentPosition(function (pos) {
    userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    geoMode = true;
    btn.classList.remove('loading');
    btn.classList.add('active');
    lastSearch = null;
    refreshResults();
    document.getElementById('results').scrollIntoView({ behavior:'smooth', block:'start' });
  }, function () {
    btn.classList.remove('loading');
    toast('Impossible de vous localiser. Vérifiez que la localisation est autorisée pour Yaaden.');
  }, { enableHighAccuracy:false, timeout:8000, maximumAge:60000 });
}

/* ---------- Recherche ---------- */
function runSearch() {
  const from = document.getElementById('from').value;
  const to = document.getElementById('to').value;
  const date = document.getElementById('date').value;
  lastSearch = { from: from, to: to, date: date, type: searchType };
  const list = upcomingTrips(searchType).filter(function (t) {
    return t.from === from && t.to === to && (!date || t.date === date) && seatsLeft(t) >= passengers;
  });
  renderSearchResults(list, from + ' → ' + to);
  document.getElementById('results').scrollIntoView({ behavior:'smooth', block:'start' });
}
function showAll() {
  lastSearch = null;
  renderSearchResults(upcomingTrips(searchType), typeTitle(searchType));
}
function renderPopularChips() {
  const gradients = [
    'linear-gradient(135deg,#14324D,#0B5E4B)',
    'linear-gradient(135deg,#00B894,#0B5E4B)',
    'linear-gradient(135deg,#1B6FA8,#14324D)',
    'linear-gradient(135deg,#5B4DBC,#14324D)',
    'linear-gradient(135deg,#0B5E4B,#14324D)'
  ];
  const popular = searchType === 'ville' ? [
    { from:'Kipé', to:'Kaloum', price:40000 },
    { from:'Bambéto', to:'Matoto', price:30000 },
    { from:'Cosa', to:'Kaloum', price:45000 },
    { from:'Hamdallaye', to:'Dixinn', price:25000 },
    { from:'Sonfonia', to:'Kaloum', price:50000 },
  ] : [
    { from:'Conakry', to:'Kindia', price:150000 },
    { from:'Conakry', to:'Labé', price:350000 },
    { from:'Conakry', to:'Mamou', price:250000 },
    { from:'Conakry', to:'Kankan', price:450000 },
    { from:'Conakry', to:'Boké', price:200000 },
  ];
  document.getElementById('popular-chips').innerHTML = popular.map(function (p, i) {
    return '<button type="button" class="chip pop-card" style="background:' + gradients[i % gradients.length] + '" data-from="' + p.from + '" data-to="' + p.to + '">' +
      '<span class="pop-route">' + p.from + ' → ' + p.to + '</span>' +
      '<span class="pop-price">dès ' + fmtGNF(p.price) + '</span></button>';
  }).join('');
}
/* Bascule Entre villes / En ville : change les listes de lieux + les résultats. */
function setSearchType(type) {
  searchType = type;
  document.querySelectorAll('[data-search-type]').forEach(function (b) {
    b.classList.toggle('active', b.dataset.searchType === type);
  });
  if (type === 'ville') {
    fillCitySelect(document.getElementById('from'), 'Kipé', CONAKRY_PLACES);
    fillCitySelect(document.getElementById('to'), 'Kaloum', CONAKRY_PLACES);
  } else {
    fillCitySelect(document.getElementById('from'), 'Conakry', CITIES);
    fillCitySelect(document.getElementById('to'), 'Kindia', CITIES);
  }
  lastSearch = null;
  renderPopularChips();
  renderSearchResults(upcomingTrips(type), typeTitle(type));
}
function setPubType(type) {
  pubType = type;
  document.querySelectorAll('[data-pub-type]').forEach(function (b) {
    b.classList.toggle('active', b.dataset.pubType === type);
  });
  if (type === 'ville') {
    fillCitySelect(document.getElementById('pub-from'), 'Kipé', CONAKRY_PLACES);
    fillCitySelect(document.getElementById('pub-to'), 'Kaloum', CONAKRY_PLACES);
    document.getElementById('pub-price').placeholder = '40 000';
  } else {
    fillCitySelect(document.getElementById('pub-from'), 'Conakry', CITIES);
    fillCitySelect(document.getElementById('pub-to'), 'Kindia', CITIES);
    document.getElementById('pub-price').placeholder = '150 000';
  }
}

/* ---------- Mes trajets ---------- */
function renderMyTrips() {
  const box = document.getElementById('my-trips');
  document.getElementById('count-bookings').textContent = bookings.length || '';
  document.getElementById('count-published').textContent = myTrips.length || '';
  document.getElementById('trips-dot').hidden = bookings.length === 0 && myTrips.length === 0;

  if (currentTab === 'bookings') {
    if (!bookings.length) {
      box.innerHTML = '<div class="empty"><strong>Aucune réservation pour le moment</strong>' +
        '<button type="button" class="btn btn-primary btn-small" id="empty-search">Rechercher un trajet</button></div>';
      document.getElementById('empty-search').addEventListener('click', function () { showScreen('search'); });
      return;
    }
    box.innerHTML = bookings.map(function (b) {
      const trip = findTrip(b.tripId);
      if (!trip) return '';
      const msg = 'Bonjour ' + trip.driver + ' ! Je suis passager Yaaden pour le trajet ' +
        trip.from + ' → ' + trip.to + ' du ' + shortDate(trip.date) + ' à ' + trip.time +
        ' (' + b.seats + ' place' + (b.seats > 1 ? 's' : '') + ').';
      return '<div>' + tripCardHTML(trip) +
        arrivalStatusHTML(trip) +
        '<div class="my-trip-actions">' +
          '<a class="btn btn-wa btn-small" href="' + waLink(trip.phone, msg) + '" target="_blank" rel="noopener"><svg class="ic"><use href="#i-wa"/></svg> WhatsApp</a>' +
          '<button type="button" class="btn btn-danger btn-small" data-cancel-booking="' + esc(b.id) + '">Annuler</button>' +
        '</div></div>';
    }).join('');
  } else {
    if (!myTrips.length) {
      box.innerHTML = '<div class="empty"><strong>Vous n\u2019avez publié aucun trajet</strong>' +
        '<button type="button" class="btn btn-primary btn-small" id="empty-publish2">Publier un trajet</button></div>';
      document.getElementById('empty-publish2').addEventListener('click', function () { showScreen('publish'); });
      return;
    }
    box.innerHTML = myTrips.map(function (t) {
      const reserved = bookings.filter(function (b) { return b.tripId === t.id; })
        .reduce(function (s, b) { return s + b.seats; }, 0);
      const st = getTripStatus(t.id);
      const notifyMsg = 'Bonjour ! Je suis arrivé au point de rendez-vous pour le trajet Yaaden ' +
        t.from + ' → ' + t.to + ' du ' + shortDate(t.date) + ' à ' + t.time + '.';
      return '<div>' + tripCardHTML(t) +
        (st === 'arrived'
          ? '<div class="arrival-status arrived"><svg class="ic"><use href="#i-pin"/></svg><span><b>Vous avez signalé : je suis arrivé.</b> Vos passagers le voient.</span> <button type="button" class="link-btn" data-arrival-clear="' + esc(t.id) + '">Annuler</button></div>'
          : st === 'arriving'
          ? '<div class="arrival-status arriving"><svg class="ic"><use href="#i-car"/></svg><span><b>Vous avez signalé : j’arrive.</b> Vos passagers le voient.</span> <button type="button" class="link-btn" data-arrival-clear="' + esc(t.id) + '">Annuler</button></div>'
          : '') +
        '<div class="my-trip-actions">' +
          '<span class="booking-badge" style="align-self:center">' + reserved + ' place' + (reserved > 1 ? 's' : '') + ' réservée' + (reserved > 1 ? 's' : '') + '</span>' +
          '<button type="button" class="btn btn-outline btn-small" data-arrival="arriving" data-arrival-trip="' + esc(t.id) + '">J’arrive</button>' +
          '<button type="button" class="btn btn-primary btn-small" data-arrival="arrived" data-arrival-trip="' + esc(t.id) + '">Je suis arrivé</button>' +
        '</div>' +
        '<div class="my-trip-actions">' +
          '<a class="btn btn-wa btn-small" href="https://wa.me/?text=' + encodeURIComponent(notifyMsg) + '" target="_blank" rel="noopener"><svg class="ic"><use href="#i-wa"/></svg> Prévenir les passagers</a>' +
          '<button type="button" class="btn btn-danger btn-small" data-cancel-trip="' + esc(t.id) + '">Supprimer le trajet</button>' +
        '</div></div>';
    }).join('');
  }
}

/* ---------- Fiche détail + réservation ---------- */
function openDetail(id) {
  const trip = findTrip(id);
  if (!trip) return;
  currentDetailId = id;
  const left = seatsLeft(trip);
  detailSeats = Math.max(1, Math.min(passengers, left || 1));
  renderDetail();
  document.getElementById('detail-sheet').hidden = false;
  document.getElementById('sheet-backdrop').hidden = false;
  document.body.style.overflow = 'hidden';
}
function renderDetail() {
  const trip = findTrip(currentDetailId);
  if (!trip) return;
  const left = seatsLeft(trip);
  const booked = myBookingFor(trip.id);
  const total = trip.price * detailSeats;
  const msg = 'Bonjour ' + trip.driver + ' ! Je suis intéressé par votre trajet Yaaden ' +
    trip.from + ' → ' + trip.to + ' du ' + shortDate(trip.date) + ' à ' + trip.time + '.';
  const v = driverVerification(trip);
  let html = '<h2 id="detail-title">' + esc(trip.from) + ' → ' + esc(trip.to) + '</h2>' +
    '<p class="detail-route"><b>' + esc(prettyDate(trip.date)) + '</b> · départ à <b>' + esc(trip.time) + '</b></p>' +
    verifyLineHTML(v) +
    '<div class="detail-driver">' + avatarHTML(trip.driver) +
      '<div class="driver-info"><div class="driver-name">' + esc(trip.driver) + '</div>' +
      '<div class="driver-sub"><svg class="ic"><use href="#i-star"/></svg>' + trip.rating.toFixed(1) +
      ' · ' + trip.trips + ' trajets</div><div class="driver-sub">' + esc(trip.car) + '</div></div>' +
      '<a class="btn btn-wa btn-small" href="' + waLink(trip.phone, msg) + '" target="_blank" rel="noopener"><svg class="ic"><use href="#i-wa"/></svg> WhatsApp</a>' +
    '</div>' +
    '<div class="detail-grid">' +
      '<div class="detail-cell"><div class="lbl">Prix par place</div><div class="val">' + esc(fmtGNF(trip.price)) + '</div></div>' +
      '<div class="detail-cell"><div class="lbl">Places restantes</div><div class="val">' + left + ' / ' + trip.seats + '</div></div>' +
      '<div class="detail-cell"><div class="lbl">Rendez-vous</div><div class="val" style="font-size:.92rem">' + esc(trip.meeting || 'À convenir') + '</div></div>' +
      '<div class="detail-cell"><div class="lbl">Paiement</div><div class="val" style="font-size:.92rem">Espèces ou Orange Money</div></div>' +
      '<div class="detail-cell wide"><div class="lbl">Plaque d\u2019immatriculation</div><div class="val plate-val">' + esc(v.plate || 'Non précisée') + '</div></div>' +
    '</div>' +
    '<div class="trip-meta" style="margin:0 0 16px">' + optionPills(trip) + '</div>';
  if (trip.desc) html += '<p class="detail-desc">' + esc(trip.desc) + '</p>';
  if (trip.mine) {
    html += '<div class="booked-ok"><svg class="ic"><use href="#i-car"/></svg>C\u2019est votre trajet publié.</div>';
  } else if (booked) {
    html += '<div class="booked-ok"><svg class="ic"><use href="#i-check"/></svg>Vous avez réservé ' + booked.seats +
      ' place' + (booked.seats > 1 ? 's' : '') + ' sur ce trajet.</div>' +
      arrivalStatusHTML(trip) +
      '<div class="sheet-actions"><button type="button" class="btn btn-danger" id="detail-cancel-booking">Annuler ma réservation</button></div>';
  } else if (left === 0) {
    html += '<div class="booked-ok" style="background:#FFF1F1;color:var(--danger)">Ce trajet est complet.</div>';
  } else {
    html += '<div class="booking-box"><h3>Réserver mes places</h3>' +
      '<div class="booking-row"><span>Nombre de places</span>' +
      '<div class="stepper"><button type="button" class="step-btn" data-detail-step="-1">−</button>' +
      '<span class="step-val" id="detail-seats-val">' + detailSeats + '</span>' +
      '<button type="button" class="step-btn" data-detail-step="1">+</button></div></div>' +
      '<div class="total-line"><span>Total à payer au conducteur</span><span>' + esc(fmtGNF(total)) + '</span></div></div>' +
      '<div class="sheet-actions"><button type="button" class="btn btn-primary btn-big" id="detail-book">' +
      '<svg class="ic"><use href="#i-check"/></svg> Confirmer la réservation</button>' +
      '<p class="form-note" style="margin:0"><svg class="ic"><use href="#i-money"/></svg> Aucun paiement en ligne pour le moment : payez en espèces ou via Orange Money, directement au conducteur.</p></div>';
  }
  document.getElementById('detail-body').innerHTML = html;
}
function closeDetail() {
  document.getElementById('detail-sheet').hidden = true;
  document.getElementById('sheet-backdrop').hidden = true;
  document.body.style.overflow = '';
  currentDetailId = null;
}
function confirmBooking() {
  const trip = findTrip(currentDetailId);
  if (!trip) return;
  if (seatsLeft(trip) < detailSeats) { toast('Plus assez de places sur ce trajet.'); return; }
  bookings.push({ id:'b-' + Date.now(), tripId: trip.id, seats: detailSeats, at: new Date().toISOString() });
  saveJSON(LS_BOOKINGS, bookings);
  closeDetail();
  refreshResults();
  renderMyTrips();
  toast('Réservation confirmée : ' + detailSeats + ' place' + (detailSeats > 1 ? 's' : '') + ' — ' + trip.from + ' → ' + trip.to + ' !');
}

/* ---------- Assistante Yaa : aide instantanée + WhatsApp ---------- */
let chatHistory = loadJSON(LS_CHAT, []);
let chatOpen = false;
let yaaTimer = null;

function norm(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
const YAA_FALLBACK = 'Je n\u2019ai pas la réponse pour le moment. Touchez le bouton vert ci-dessous pour parler à une personne sur WhatsApp.';
const YAA_KB = [
  { keys:['bonjour','salut','hello','coucou','bonsoir'], answer:'Bonjour ! Je suis Yaa, l\u2019assistante Yaaden. Posez-moi votre question : réservation, paiement, publication d\u2019un trajet… Je réponds tout de suite.' },
  { keys:['merci'], answer:'Avec plaisir ! Bon voyage avec Yaaden.' },
  { keys:['reserver','reservation','booker','prendre une place','prendre place','je veux aller'], answer:'Pour réserver : cherchez votre trajet, touchez sa carte, choisissez le nombre de places puis « Confirmer la réservation ». Vous retrouvez tout dans « Mes trajets », et vous pouvez écrire au conducteur sur WhatsApp.' },
  { keys:['publier','publie','proposer un trajet','offrir une place','jai une voiture','j ai une voiture'], answer:'Pour publier un trajet : touchez « Publier » en bas de l\u2019écran, choisissez Entre villes ou En ville, puis indiquez départ, arrivée, date, heure, places et prix. C\u2019est gratuit et vos passagers vous paient directement.' },
  { keys:['payer','paiement','paye','orange money','especes','cash','argent'], answer:'Le paiement se fait directement avec le conducteur, au moment du trajet : en espèces ou via Orange Money. Yaaden ne prend aucune commission pour le moment.' },
  { keys:['annuler','annulation','supprimer ma reservation','supprimer reservation'], answer:'Pour annuler : allez dans « Mes trajets », puis touchez « Annuler » à côté de votre réservation. Pensez à prévenir le conducteur sur WhatsApp.' },
  { keys:['prix','tarif','cout','combien','cher'], answer:'Les prix sont fixés par les conducteurs. En ville à Conakry : 20 000 à 60 000 GNF par place. Entre villes, par exemple Conakry → Kindia dès 140 000 GNF.' },
  { keys:['en ville','conakry','quartier','heures de pointe','pointe','kipe','bambeto','kaloum','cosa','matoto','ratoma'], answer:'Oui, Yaaden couvre aussi Conakry ! Choisissez « En ville · Conakry » dans la recherche pour trouver des places entre quartiers : Kipé, Cosa, Bambéto, Kaloum… C\u2019est idéal aux heures de pointe, de 7h à 9h et de 17h à 19h.' },
  { keys:['entre villes','long trajet','voyage','kindia','labe','kankan','mamou','boke','voyager'], answer:'Pour les longs trajets, choisissez « Entre villes » : Conakry → Kindia, Labé, Kankan, Mamou, Boké et plus. Les conducteurs partent avec des places libres — réservez la vôtre.' },
  { keys:['contacter','joindre','parler au conducteur','numero','telephone conducteur','whatsapp conducteur'], answer:'Pour joindre un conducteur : ouvrez la fiche de son trajet et touchez le bouton WhatsApp. Vous pouvez lui écrire avant même de réserver.' },
  { keys:['securite','sur','confiance','dangereux','risque','arnaque'], answer:'Regardez le badge « Vérifié » sur la carte du trajet : il veut dire que la pièce d\u2019identité et le permis du conducteur ont été contrôlés par l\u2019équipe Yaaden. Vérifiez aussi sa note, son nombre de trajets et sa plaque, et échangez sur WhatsApp avant le départ. En cas de problème, écrivez à l\u2019équipe Yaaden sur WhatsApp avec le bouton vert ci-dessous.' },
  { keys:['verifi','verifier','identite','piece','permis','badge'], answer:'Pour devenir conducteur vérifié : allez dans « Profil », section « Vérification conducteur », puis envoyez la photo de votre pièce d\u2019identité et un selfie. L\u2019équipe Yaaden contrôle vos documents sous 24 h et vos trajets affichent ensuite le badge « Vérifié ». Côté passager, vous pouvez aussi filtrer la recherche sur « Conducteurs vérifiés ».' },
  { keys:['arrive','arrivee','ou est','pres de moi','a cote','geolocalisation','position','pret'], answer:'Touchez « Voitures près de moi » sur l\u2019accueil : Yaaden utilise votre position pour montrer les départs proches de vous. Et quand vous avez réservé, le conducteur signale « J\u2019arrive » puis « Je suis arrivé » : vous le voyez dans « Mes trajets ». Vous pouvez aussi lui écrire sur WhatsApp pour savoir où il en est.' },
  { keys:['profil','compte','inscrire','inscription','creer un compte','donnees'], answer:'Pas de compte à créer : remplissez simplement votre profil dans l\u2019onglet « Profil » (nom, téléphone WhatsApp, véhicule). Vos données restent sur votre téléphone.' },
  { keys:['gratuit','commission','frais'], answer:'Yaaden est gratuit pour le moment : aucune commission sur vos trajets, le paiement va directement au conducteur.' },
  { keys:['bagage','valise','sac'], answer:'Regardez les options sur la carte du trajet : si « Bagages acceptés » est affiché, le conducteur a de la place pour vos bagages.' },
  { keys:['humain','personne','equipe','assistance','aide','quelquun'], answer:'Bien sûr : touchez le bouton vert « Parler à une personne sur WhatsApp » ci-dessous, l\u2019équipe Yaaden vous répond rapidement.' },
  { keys:['yaaden','cest quoi','comment ca marche','marche'], answer:'Yaaden, c\u2019est le covoiturage en Guinée : des conducteurs qui partent déjà dans votre direction partagent leurs places libres. Cherchez, réservez, payez au conducteur en espèces ou Orange Money.' }
];
function yaaAnswer(q) {
  const n = norm(q);
  let best = null, bestScore = 0;
  YAA_KB.forEach(function (entry) {
    let score = 0;
    entry.keys.forEach(function (k) { if (n.indexOf(k) !== -1) score++; });
    if (score > bestScore) { bestScore = score; best = entry; }
  });
  return best ? best.answer : YAA_FALLBACK;
}
const YAA_CHIPS = ['Comment réserver ?', 'Comment payer ?', 'Publier un trajet', 'Conducteurs vérifiés', 'Voitures près de moi', 'Parler à une personne'];
function yaaWelcome() {
  return 'Bonjour ! Je suis Yaa. Une question sur un trajet ou un paiement ? Je réponds tout de suite.';
}
function chatEl(id) { return document.getElementById(id); }
function saveChat() { saveJSON(LS_CHAT, chatHistory.slice(-30)); }
function renderChatMsg(role, text) {
  const box = chatEl('chat-messages');
  const div = document.createElement('div');
  div.className = 'msg ' + (role === 'user' ? 'msg-user' : 'msg-bot');
  div.textContent = text;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}
function openChat() {
  chatOpen = true;
  chatEl('chat-panel').hidden = false;
  chatEl('chat-greeting').hidden = true;
  chatEl('chat-fab-dot').hidden = true;
  try { localStorage.setItem(LS_CHAT_SEEN, '1'); } catch (e) {}
  if (!chatHistory.length) {
    chatHistory.push({ role:'bot', text: yaaWelcome() });
    saveChat();
  }
  const box = chatEl('chat-messages');
  box.innerHTML = '';
  chatHistory.forEach(function (m) { renderChatMsg(m.role, m.text); });
}
function closeChat() {
  chatOpen = false;
  chatEl('chat-panel').hidden = true;
}
function toggleChat() { chatOpen ? closeChat() : openChat(); }
function yaaReply(q) {
  const box = chatEl('chat-messages');
  const t = document.createElement('div');
  t.className = 'msg msg-bot typing';
  t.innerHTML = '<i></i><i></i><i></i>';
  box.appendChild(t);
  box.scrollTop = box.scrollHeight;
  clearTimeout(yaaTimer);
  yaaTimer = setTimeout(function () {
    t.remove();
    const a = yaaAnswer(q);
    chatHistory.push({ role:'bot', text: a });
    saveChat();
    renderChatMsg('bot', a);
  }, 800);
}
function sendChat(text) {
  const q = (text || '').trim();
  if (!q) return;
  chatHistory.push({ role:'user', text: q });
  saveChat();
  renderChatMsg('user', q);
  yaaReply(q);
}
function renderChatChips() {
  chatEl('chat-chips').innerHTML = YAA_CHIPS.map(function (c) {
    return '<button type="button" class="chat-chip" data-chip="' + esc(c) + '">' + esc(c) + '</button>';
  }).join('');
}
/* Petite bulle d'invitation quelques secondes après la première visite. */
function scheduleGreeting() {
  let seen = null;
  try { seen = localStorage.getItem(LS_CHAT_SEEN); } catch (e) {}
  if (seen) return;
  setTimeout(function () {
    if (!chatOpen) chatEl('chat-greeting').hidden = false;
  }, 5000);
}

/* ---------- Navigation ---------- */
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(function (s) { s.classList.remove('active'); });
  document.querySelectorAll('.nav-btn').forEach(function (b) { b.classList.toggle('active', b.dataset.screen === name); });
  document.getElementById('screen-' + name).classList.add('active');
  if (name === 'trips') renderMyTrips();
  window.scrollTo({ top: 0, behavior:'smooth' });
}

/* ---------- Profil ---------- */
function fillProfileForm() {
  const avatar = document.getElementById('profile-avatar');
  if (profile && profile.name) {
    avatar.textContent = initials(profile.name);
    avatar.style.background = 'linear-gradient(135deg,' + avatarColor(profile.name) + ',' + avatarColor(profile.name + 'x') + ')';
    document.getElementById('prof-name').value = profile.name || '';
    document.getElementById('prof-phone').value = profile.phone || '';
    document.getElementById('prof-car').value = profile.car || '';
  } else {
    avatar.textContent = '?';
  }
}

/* ---------- Vérification conducteur : documents + WhatsApp ---------- */
function renderVerifyStatus() {
  const box = document.getElementById('verify-status');
  const form = document.getElementById('verify-form');
  if (!verification) {
    box.innerHTML = '';
    form.hidden = false;
    return;
  }
  form.hidden = true;
  if (verification.status === 'verified') {
    box.innerHTML = '<div class="verify-status-box ok"><svg class="ic"><use href="#i-shield"/></svg><div><strong>Identité vérifiée</strong><span>Vos trajets affichent le badge « Vérifié ». Plaque : ' + esc(verification.plate || '—') + '</span></div></div>';
  } else {
    box.innerHTML = '<div class="verify-status-box pending"><svg class="ic"><use href="#i-clock"/></svg><div><strong>Demande envoyée — vérification en cours</strong><span>L\u2019équipe Yaaden contrôle vos documents sous 24 h. Plaque : ' + esc(verification.plate || '—') + '</span></div></div>' +
      '<button type="button" class="btn btn-outline btn-small" id="verify-edit" style="margin-top:10px">Modifier ma demande</button>';
    const edit = document.getElementById('verify-edit');
    if (edit) edit.addEventListener('click', function () { form.hidden = false; box.innerHTML = ''; });
  }
}
/* Réduit une photo (max 900 px, JPEG) pour la garder dans le téléphone. */
function fileToDataURL(file, cb) {
  const reader = new FileReader();
  reader.onload = function () {
    const img = new Image();
    img.onload = function () {
      const max = 900, scale = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      try { cb(c.toDataURL('image/jpeg', 0.75)); } catch (e) { cb(null); }
    };
    img.onerror = function () { cb(null); };
    img.src = reader.result;
  };
  reader.onerror = function () { cb(null); };
  reader.readAsDataURL(file);
}
function previewFile(input, previewId) {
  const f = input.files && input.files[0];
  const box = document.getElementById(previewId);
  if (!f) { box.innerHTML = ''; return; }
  fileToDataURL(f, function (data) {
    box.innerHTML = data ? '<img src="' + data + '" alt="Aperçu">' : '';
    input._data = data || null;
  });
}

/* ---------- Initialisation ---------- */
function fillCitySelect(select, selected, list) {
  const places = list || CITIES;
  select.innerHTML = places.map(function (c) {
    return '<option value="' + c + '"' + (c === selected ? ' selected' : '') + '>' + c + '</option>';
  }).join('');
}
let __initDone = false;
function init() {
  if (__initDone) return; /* ne jamais brancher les écouteurs deux fois */
  __initDone = true;
  fillCitySelect(document.getElementById('from'), 'Conakry', CITIES);
  fillCitySelect(document.getElementById('to'), 'Kindia', CITIES);
  fillCitySelect(document.getElementById('pub-from'), 'Conakry', CITIES);
  fillCitySelect(document.getElementById('pub-to'), 'Kindia', CITIES);
  document.getElementById('date').value = dateFromOffset(1);
  document.getElementById('date').min = dateFromOffset(0);
  document.getElementById('pub-date').value = dateFromOffset(1);
  document.getElementById('pub-date').min = dateFromOffset(0);
  renderPopularChips();
  renderSearchResults(upcomingTrips(searchType), typeTitle(searchType));
  renderMyTrips();
  fillProfileForm();
  renderVerifyStatus();

  /* Bascule Entre villes / En ville (recherche + publication) */
  document.querySelectorAll('[data-search-type]').forEach(function (b) {
    b.addEventListener('click', function () { setSearchType(b.dataset.searchType); });
  });
  document.querySelectorAll('[data-pub-type]').forEach(function (b) {
    b.addEventListener('click', function () { setPubType(b.dataset.pubType); });
  });

  /* Navigation basse */
  document.querySelectorAll('.nav-btn').forEach(function (b) {
    b.addEventListener('click', function () { showScreen(b.dataset.screen); });
  });

  /* Recherche */
  document.getElementById('search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    if (document.getElementById('from').value === document.getElementById('to').value) {
      toast('Le départ et l\u2019arrivée doivent être différents.');
      return;
    }
    runSearch();
  });
  document.getElementById('swap-btn').addEventListener('click', function () {
    const f = document.getElementById('from'), t = document.getElementById('to');
    const v = f.value; f.value = t.value; t.value = v;
  });
  document.getElementById('show-all-btn').addEventListener('click', showAll);
  document.getElementById('geo-btn').addEventListener('click', toggleGeo);
  document.getElementById('verified-only').addEventListener('change', function (e) {
    verifiedOnly = e.target.checked;
    refreshResults();
  });
  document.querySelectorAll('.step-btn[data-step]').forEach(function (b) {
    b.addEventListener('click', function () {
      passengers = Math.max(1, Math.min(6, passengers + Number(b.dataset.step)));
      document.getElementById('passengers-val').textContent = passengers;
    });
  });
  document.getElementById('popular-chips').addEventListener('click', function (e) {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    document.getElementById('from').value = chip.dataset.from;
    document.getElementById('to').value = chip.dataset.to;
    document.getElementById('date').value = '';
    runSearch();
  });

  /* Clic sur une carte trajet (délégation) */
  document.addEventListener('click', function (e) {
    const arrival = e.target.closest('[data-arrival]');
    if (arrival) {
      setTripStatus(arrival.dataset.arrivalTrip, arrival.dataset.arrival);
      renderMyTrips();
      refreshResults();
      toast(arrival.dataset.arrival === 'arrived' ? 'Vos passagers sont prévenus : vous êtes arrivé.' : 'Vos passagers sont prévenus : vous arrivez.');
      return;
    }
    const arrivalClear = e.target.closest('[data-arrival-clear]');
    if (arrivalClear) {
      setTripStatus(arrivalClear.dataset.arrivalClear, null);
      renderMyTrips();
      refreshResults();
      toast('Signal annulé.');
      return;
    }
    const card = e.target.closest('[data-trip]');
    if (card) { openDetail(card.dataset.trip); return; }
    const cancelB = e.target.closest('[data-cancel-booking]');
    if (cancelB) {
      bookings = bookings.filter(function (b) { return b.id !== cancelB.dataset.cancelBooking; });
      saveJSON(LS_BOOKINGS, bookings);
      renderMyTrips();
      refreshResults();
      toast('Réservation annulée.');
      return;
    }
    const cancelT = e.target.closest('[data-cancel-trip]');
    if (cancelT) {
      const id = cancelT.dataset.cancelTrip;
      myTrips = myTrips.filter(function (t) { return t.id !== id; });
      bookings = bookings.filter(function (b) { return b.tripId !== id; });
      saveJSON(LS_TRIPS, myTrips);
      saveJSON(LS_BOOKINGS, bookings);
      renderMyTrips();
      refreshResults();
      toast('Trajet supprimé.');
    }
  });

  /* Onglets Mes trajets */
  document.querySelectorAll('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      currentTab = tab.dataset.tab;
      renderMyTrips();
    });
  });

  /* Publication */
  document.querySelectorAll('.step-btn[data-pub-step]').forEach(function (b) {
    b.addEventListener('click', function () {
      pubSeats = Math.max(1, Math.min(8, pubSeats + Number(b.dataset.pubStep)));
      document.getElementById('pub-seats-val').textContent = pubSeats;
    });
  });
  document.getElementById('publish-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const from = document.getElementById('pub-from').value;
    const to = document.getElementById('pub-to').value;
    if (from === to) { toast('Le départ et l\u2019arrivée doivent être différents.'); return; }
    const name = (profile && profile.name) ? profile.name : 'Vous';
    const trip = {
      id:'mine-' + Date.now(),
      type: pubType,
      from: from, to: to,
      date: document.getElementById('pub-date').value,
      time: document.getElementById('pub-time').value,
      price: Number(document.getElementById('pub-price').value),
      seats: pubSeats,
      driver: name,
      rating: 5.0, trips: 0,
      car: (profile && profile.car) ? profile.car : 'Véhicule non précisé',
      phone: (profile && profile.phone) ? profile.phone : '',
      options: ['clim','bagages','musique'].filter(function (o) { return document.getElementById('opt-' + o).checked; }),
      meeting: document.getElementById('pub-meeting').value.trim(),
      desc: document.getElementById('pub-desc').value.trim()
    };
    myTrips.push(trip);
    saveJSON(LS_TRIPS, myTrips);
    document.getElementById('publish-form').reset();
    document.getElementById('pub-date').value = dateFromOffset(1);
    document.getElementById('pub-time').value = '08:00';
    pubSeats = 3;
    document.getElementById('pub-seats-val').textContent = '3';
    refreshResults();
    renderMyTrips();
    currentTab = 'published';
    document.querySelectorAll('.tab').forEach(function (t) { t.classList.toggle('active', t.dataset.tab === 'published'); });
    showScreen('trips');
    toast('Votre trajet ' + from + ' → ' + to + ' est publié !');
  });

  /* Profil */
  document.getElementById('profile-form').addEventListener('submit', function (e) {
    e.preventDefault();
    profile = {
      name: document.getElementById('prof-name').value.trim(),
      phone: document.getElementById('prof-phone').value.trim(),
      car: document.getElementById('prof-car').value.trim()
    };
    saveJSON(LS_PROFILE, profile);
    fillProfileForm();
    toast('Profil enregistré !');
  });

  /* Vérification conducteur */
  document.getElementById('verify-id').addEventListener('change', function (e) { previewFile(e.target, 'verify-id-preview'); });
  document.getElementById('verify-selfie').addEventListener('change', function (e) { previewFile(e.target, 'verify-selfie-preview'); });
  document.getElementById('verify-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const plate = document.getElementById('verify-plate').value.trim();
    const idInput = document.getElementById('verify-id');
    const selfieInput = document.getElementById('verify-selfie');
    if (!plate) { toast('Indiquez votre plaque d\u2019immatriculation.'); return; }
    if (!idInput._data) { toast('Ajoutez la photo de votre pièce d\u2019identité.'); return; }
    if (!selfieInput._data) { toast('Ajoutez un selfie (photo de vous, face visible).'); return; }
    verification = { status:'pending', plate: plate, idDoc: idInput._data, selfie: selfieInput._data, at: new Date().toISOString() };
    saveJSON(LS_VERIFY, verification);
    renderVerifyStatus();
    refreshResults();
    renderMyTrips();
    const name = (profile && profile.name) ? profile.name : 'Bonjour';
    window.open(waLink(SUPPORT_WA, name + ', conducteur Yaaden. Je viens d\u2019envoyer ma demande de vérification (plaque ' + plate + '). Voici mes documents :'), '_blank');
    toast('Demande envoyée ! Envoyez vos photos à l\u2019équipe sur WhatsApp.');
  });

  /* Feuille détail */
  document.getElementById('detail-close').addEventListener('click', closeDetail);
  document.getElementById('sheet-backdrop').addEventListener('click', closeDetail);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeDetail(); closeChat(); } });
  document.getElementById('detail-body').addEventListener('click', function (e) {
    const step = e.target.closest('[data-detail-step]');
    if (step) {
      const trip = findTrip(currentDetailId);
      detailSeats = Math.max(1, Math.min(seatsLeft(trip), detailSeats + Number(step.dataset.detailStep)));
      renderDetail();
      return;
    }
    if (e.target.closest('#detail-book')) { confirmBooking(); return; }
    if (e.target.closest('#detail-cancel-booking')) {
      bookings = bookings.filter(function (b) { return b.tripId !== currentDetailId; });
      saveJSON(LS_BOOKINGS, bookings);
      closeDetail();
      renderMyTrips();
      refreshResults();
      toast('Réservation annulée.');
    }
  });

  /* Appel aux conducteurs (bannière de l'accueil) */
  document.getElementById('driver-cta-btn').addEventListener('click', function () { showScreen('publish'); });

  /* Assistante Yaa */
  renderChatChips();
  chatEl('chat-wa').href = waLink(SUPPORT_WA, SUPPORT_WA_MSG);
  chatEl('chat-fab').addEventListener('click', toggleChat);
  chatEl('chat-close').addEventListener('click', closeChat);
  chatEl('chat-greeting-close').addEventListener('click', function (e) {
    e.stopPropagation();
    chatEl('chat-greeting').hidden = true;
  });
  chatEl('chat-greeting').addEventListener('click', openChat);
  chatEl('chat-chips').addEventListener('click', function (e) {
    const chip = e.target.closest('.chat-chip');
    if (chip) sendChat(chip.dataset.chip);
  });
  chatEl('chat-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const input = chatEl('chat-input');
    sendChat(input.value);
    input.value = '';
    input.focus();
  });
  scheduleGreeting();

  /* Service worker (hors-ligne) */
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function () { /* silencieux */ });
  }
}

document.addEventListener('DOMContentLoaded', init);
