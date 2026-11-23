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
/* WhatsApp d'assistance Yaaden (équipe Digifind à Conakry). */
const SUPPORT_WA = '224620685645';
const SUPPORT_WA_MSG = 'Bonjour, j\u2019ai besoin d\u2019aide sur Yaaden.';
const AVATAR_COLORS = ['#00B894','#3DDC97','#4D9DE0','#8B7CF6','#E86AA8','#2BB3A3','#1B6FA8','#5B4DBC'];

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
/* Re-rend la liste de recherche selon la dernière recherche ou le type courant. */
function refreshResults() {
  if (lastSearch) {
    renderResults(upcomingTrips(lastSearch.type).filter(function (t) {
      return t.from === lastSearch.from && t.to === lastSearch.to && (!lastSearch.date || t.date === lastSearch.date);
    }), lastSearch.from + ' → ' + lastSearch.to);
  } else {
    renderResults(upcomingTrips(searchType), typeTitle(searchType));
  }
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
  renderResults(list, from + ' → ' + to);
  document.getElementById('results').scrollIntoView({ behavior:'smooth', block:'start' });
}
function showAll() {
  lastSearch = null;
  renderResults(upcomingTrips(searchType), typeTitle(searchType));
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
  renderResults(upcomingTrips(type), typeTitle(type));
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
      return '<div>' + tripCardHTML(t) +
        '<div class="my-trip-actions">' +
          '<span class="booking-badge" style="align-self:center">' + reserved + ' place' + (reserved > 1 ? 's' : '') + ' réservée' + (reserved > 1 ? 's' : '') + '</span>' +
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
  let html = '<h2 id="detail-title">' + esc(trip.from) + ' → ' + esc(trip.to) + '</h2>' +
    '<p class="detail-route"><b>' + esc(prettyDate(trip.date)) + '</b> · départ à <b>' + esc(trip.time) + '</b></p>' +
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
    '</div>' +
    '<div class="trip-meta" style="margin:0 0 16px">' + optionPills(trip) + '</div>';
  if (trip.desc) html += '<p class="detail-desc">' + esc(trip.desc) + '</p>';
  if (trip.mine) {
    html += '<div class="booked-ok"><svg class="ic"><use href="#i-car"/></svg>C\u2019est votre trajet publié.</div>';
  } else if (booked) {
    html += '<div class="booked-ok"><svg class="ic"><use href="#i-check"/></svg>Vous avez réservé ' + booked.seats +
      ' place' + (booked.seats > 1 ? 's' : '') + ' sur ce trajet.</div>' +
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
  { keys:['securite','sur','confiance','dangereux','risque','arnaque'], answer:'Chaque conducteur affiche sa note et son nombre de trajets. Vérifiez-les, regardez le véhicule indiqué et échangez sur WhatsApp avant le départ. En cas de problème, écrivez à l\u2019équipe Yaaden sur WhatsApp avec le bouton vert ci-dessous.' },
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
const YAA_CHIPS = ['Comment réserver ?', 'Comment payer ?', 'Publier un trajet', 'Trajets en ville à Conakry', 'Parler à une personne'];
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
  renderResults(upcomingTrips(searchType), typeTitle(searchType));
  renderMyTrips();
  fillProfileForm();

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
