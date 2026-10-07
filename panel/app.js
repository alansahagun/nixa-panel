// Si el CDN de supabase no cargó (red caída, wifi de café, bloqueo), avisamos
// con la cara de la marca en vez de dejar la página en blanco sin explicación.
if (typeof supabase === 'undefined') {
  document.body.innerHTML = '<div style="min-height:100dvh;display:grid;place-items:center;padding:40px 24px;text-align:center">'
    + '<div style="max-width:34ch">'
    + '<p style="display:inline-block;font:600 12.5px/1.4 var(--sans);color:var(--cocoa2);background:var(--nude3);padding:4px 11px;border-radius:999px;margin:0 0 14px">Sin conexión</p>'
    + '<h1 style="font:600 clamp(28px,7vw,36px)/1.1 var(--serif);font-variation-settings:\'SOFT\' 70,\'WONK\' 1;color:var(--cocoa);margin:0">No se pudo cargar el panel.</h1>'
    + '<p style="font:400 15px/1.5 var(--sans);color:var(--cocoa2);margin:12px 0 0">Revisa tu internet y vuelve a abrir. Los datos están a salvo; esto es solo la pantalla.</p>'
    + '<button onclick="location.reload()" style="margin-top:22px;min-height:44px;padding:0 22px;border:0;border-radius:10px;background:var(--cocoa);color:var(--crema);font:600 14px/1.2 var(--sans);cursor:pointer">Reintentar</button>'
    + '</div></div>';
  throw new Error('supabase-js no cargó');
}
const URL_SB = "https://jjtlkneoxmgcyrifckdf.supabase.co";
const KEY_SB = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqdGxrbmVveG1nY3lyaWZja2RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzNjQ0ODcsImV4cCI6MjEwMzk0MDQ4N30.Ty2qZduVwcIfWuVAzb-judCXVIIpyBq2_D3bE2GsY7g";
const sb = supabase.createClient(URL_SB, KEY_SB, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const el = h => { const d = document.createElement('div'); d.innerHTML = h.trim(); return d.firstChild; };
const esc = s => (s ?? '').toString().replace(/[<>&"]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]));
const money = n => '$' + Number(n || 0).toLocaleString('es-MX', { maximumFractionDigits: 0 });
// Para dinero entre socios los centavos sí importan: $874.50 no es $875.
const moneyC = n => { const v = Math.round(Number(n || 0) * 100) / 100; return '$' + v.toLocaleString('es-MX', { minimumFractionDigits: Number.isInteger(v) ? 0 : 2, maximumFractionDigits: 2 }); };
const usd = n => 'US$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const urlSegura = u => /^https?:\/\//i.test(String(u || '').trim()) ? String(u).trim() : '';
const idx = i => String(i + 1).padStart(2, '0');
const plural = (n, uno, varios) => n === 1 ? uno : varios;
const TZ = 'America/Mexico_City';
const hoyISO = () => new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year:'numeric', month:'2-digit', day:'2-digit' }).format(new Date());
const diasDesde = iso => { if (!iso) return 0; const h = new Date(hoyISO() + 'T12:00:00'); const d = new Date(String(iso).slice(0, 10) + 'T12:00:00'); return Math.round((h - d) / 864e5); };
const fechaCorta = iso => { if (!iso) return ''; const h = hoyISO(); if (iso === h) return 'hoy'; const d = new Date(iso + 'T12:00:00'); const m = new Date(h + 'T12:00:00'); if ((d - m) / 864e5 === 1) return 'mañana'; return d.toLocaleDateString('es-MX', { weekday:'short', day:'numeric', month:'short' }).replace(/\./g, ''); };
const fechaLarga = iso => iso ? new Date(String(iso).slice(0, 10) + 'T12:00:00').toLocaleDateString('es-MX', { day:'numeric', month:'long' }) : '';
const fechaDia = ts => new Date(ts).toLocaleDateString('es-MX', { timeZone: TZ, day:'2-digit' });
const fechaMes = ts => new Date(ts).toLocaleDateString('es-MX', { timeZone: TZ, month:'short' }).replace(/\./g, '');
const horaSola = ts => new Date(ts).toLocaleTimeString('es-MX', { timeZone: TZ, hour:'2-digit', minute:'2-digit', hour12:false });
const PERSONAS = ['Majo', 'Alan', 'Jarvis'];
const META_ML = 10;
let productos = [], YO = null, tareasCache = [], filtroTar = 'todas', filtroEnv = 'activos', filtroSop = 'pendientes';
// Lo que ya se cargó, para que "Qué mejorar" calcule sobre datos reales sin volver a pedirlos.
const D = { tareas: [], inv: [], ventas: [], compras: [], saldo: null, socios: null, mensajes: [], pedidos: [], provs: [], listo: {} };
// Supuestos de importación; viven en la tabla config para poder cambiarlos sin tocar código.
const CONF = { tipo_cambio: 17.7, importacion_impuesto: 0.335, importacion_flete_usd_kg: 7, importacion_peso_kit_kg: 0.45 };
async function cargarConfig() {
  const { data } = await sb.from('config').select('clave,valor').in('clave', Object.keys(CONF));
  (data || []).forEach(({ clave, valor }) => { const n = parseFloat(valor); if (Number.isFinite(n) && n >= 0) CONF[clave] = n; });
  const o = $('#cpImp').options[0]; o.value = CONF.importacion_impuesto; o.textContent = `Por paquetería (DHL, FedEx): ${+(CONF.importacion_impuesto * 100).toFixed(1)}%`;
}
const nombreDe = sku => (productos.find(p => p.sku === sku) || {}).nombre || sku || '';
const nombreCorto = sku => nombreDe(sku).split(' · ')[0];
const nombreResto = sku => nombreDe(sku).split(' · ').slice(1).join(' · ');
const abanico = '<svg class="ilu" viewBox="0 0 100 100" aria-hidden="true"><use href="#abanico"/></svg>';
const paloma = '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#paloma"/></svg>';
const icono = k => `<svg class="ic" aria-hidden="true"><use href="#i-${k}"/></svg>`;
const vacio = (b, s) => `<div class="vacio"><b>${b}</b>${s ? `<span>${s}</span>` : ''}</div>`;

function toast(t) { const x = $('#toast'); $('#toastTxt').textContent = t; x.classList.add('on'); clearTimeout(x._t); x._t = setTimeout(() => x.classList.remove('on'), 2400); }
const msg = (sel, texto, cls = '') => { const m = $(sel); m.className = 'msg ' + cls; m.textContent = texto; };
const anota = texto => sb.from('bitacora').insert({ autor: YO, texto, origen: 'panel' });

/* ================= cambiar de persona · ahora es cerrar sesión de verdad =================
   Antes cualquiera con el panel abierto podía "ponerse" el nombre del otro sin
   contraseña (solo quedaba guardado en el aparato). Quién eres ahora lo dice
   únicamente con quién iniciaste sesión en Supabase (ve puerta.js); para que
   entre otra persona, tiene que cerrar esta sesión y entrar con su propia
   cuenta y su propia contraseña. */
$$('.cambiaYo').forEach(b => b.onclick = async () => {
  cierraIndice();
  b.disabled = true;
  try { await sb.auth.signOut(); } catch (e) {}
  location.reload();
});

function saludo() {
  const h = Number(new Intl.DateTimeFormat('en-US', { timeZone: TZ, hour: 'numeric', hour12: false }).format(new Date()));
  return h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches';
}
function arranca(n) {
  YO = n;
  $('#app').classList.remove('hide');
  $$('.nombreYo').forEach(x => x.textContent = YO);
  $('#hola').innerHTML = `${saludo()}, <em>${esc(YO)}.</em>`;
  const f = new Date().toLocaleDateString('es-MX', { timeZone: TZ, weekday:'long', day:'numeric', month:'long' });
  $('#fechaHoy').textContent = f.charAt(0).toUpperCase() + f.slice(1);
  limpiaCaja();
  buildNav();
  Promise.all([cargarConfig(), cargarProductos()]).then(cargarTodo);
}

/* ================= navegación ================= */
// clave, nombre, nota corta (para el índice), en la barra inferior (móvil)
const VISTAS = [
  ['hoy', 'Hoy', 'Pendientes y cifras del día', true],
  ['caja', 'Caja', 'Gastos, pagos entre socios y cuentas', true],
  ['ven', 'Ventas', 'La meta de diez y cada venta', true],
  ['inv', 'Piezas', 'Inventario, catálogo y compras', false],
  ['env', 'Envíos', 'Pedidos y su estado', false],
  ['sop', 'Soporte', 'Mensajes por atender', false],
  ['mej', 'Mejorar', 'Hallazgos sobre los datos', false],
  ['bit', 'Bitácora', 'Todo lo que pasó', false],
  ['margen', 'Margen', 'Precio y margen por kit', false],
  ['prov', 'Proveedores', 'Cotizaciones, muestras y costo puesto', true],
];
const NOMBRE_LARGO = { inv: 'Inventario y compras', mej: 'Qué mejorar', margen: 'Calculadora de margen' };
const CARGA = { hoy: () => { cargarTareas(); cargarProveedores(); }, caja: () => cargarCaja(), ven: () => cargarVentas(), inv: () => { cargarInv(); cargarCompras(); }, env: () => cargarPedidos(), sop: () => cargarMensajes(), mej: () => cargarTodo(), bit: () => cargarBitacora(), margen: () => pintaMargen(), prov: () => cargarProveedores() };
const LEGADO = { com: 'inv' };
let vista = 'hoy';
function buildNav() {
  if ($('#navDesk').children.length) return;
  VISTAS.forEach(([k, txt, nota, enBarra], i) => {
    const d = el(`<button type="button" data-k="${k}">${icono(k)}<span>${NOMBRE_LARGO[k] || txt}</span><span class="n">${idx(i)}</span></button>`); d.onclick = () => irA(k); $('#navDesk').appendChild(d);
    if (enBarra) { const b = el(`<button type="button" data-k="${k}"><span class="n">${idx(i)}</span><span class="ic-wrap">${icono(k)}</span><span class="t">${txt}</span></button>`); b.onclick = () => irA(k); $('#navTabs').appendChild(b); }
    const a = el(`<a href="#${k}" data-k="${k}"><span class="n">${idx(i)}</span><span class="ico">${icono(k)}</span><span>${NOMBRE_LARGO[k] || txt}<small>${nota}</small></span></a>`); a.onclick = e => { e.preventDefault(); cierraIndice(); irA(k); }; $('#indiceLista').appendChild(a);
  });
  const mas = el(`<button type="button" data-k="mas"><span class="n">…</span><span class="ic-wrap">${icono('mas')}</span><span class="t">Más</span></button>`); mas.onclick = abreIndice; $('#navTabs').appendChild(mas);
  const h = location.hash.replace('#', '');
  irA((LEGADO[h] || h) in CARGA ? (LEGADO[h] || h) : 'hoy');
}
function irA(k) {
  vista = k;
  const i = VISTAS.findIndex(v => v[0] === k), enBarra = VISTAS[i][3];
  $$('#navDesk button, #indiceLista a').forEach(b => b.classList.toggle('on', b.dataset.k === k));
  $$('#navTabs button').forEach(b => {
    const esMas = b.dataset.k === 'mas';
    b.classList.toggle('on', esMas ? !enBarra : b.dataset.k === k);
    if (esMas) { b.querySelector('.n').textContent = enBarra ? '…' : idx(i); b.querySelector('.t').textContent = enBarra ? 'Más' : VISTAS[i][1]; b.querySelector('use').setAttribute('href', enBarra ? '#i-mas' : '#i-' + k); }
  });
  $('#secTop').textContent = idx(i);
  VISTAS.forEach(([kk]) => $('#v-' + kk).classList.toggle('hide', kk !== k));
  window.scrollTo({ top: 0 });
  if (k !== 'hoy') history.replaceState(null, '', '#' + k); else history.replaceState(null, '', location.pathname);
  CARGA[k]?.();
}
const abreIndice = () => { $('#indice').classList.add('on'); document.body.style.overflow = 'hidden'; };
const cierraIndice = () => { $('#indice').classList.remove('on'); if (!$('#lightbox').classList.contains('on')) document.body.style.overflow = ''; };
$('#cerrarIndice').onclick = cierraIndice;

/* ---- visor de fotos: soporte y bitácora abren aquí, no en otra pestaña ---- */
function abreLightbox(src) { if (!src) return; $('#lightboxImg').src = src; $('#lightbox').classList.add('on'); document.body.style.overflow = 'hidden'; }
function cierraLightbox() { if (!$('#lightbox').classList.contains('on')) return; $('#lightbox').classList.remove('on'); $('#lightboxImg').src = ''; if (!$('#indice').classList.contains('on')) document.body.style.overflow = ''; }
$('#cerrarLightbox').onclick = cierraLightbox;
$('#lightbox').addEventListener('click', e => { if (e.target.id === 'lightbox') cierraLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { cierraLightbox(); cierraIndice(); } });

/* ================= datos ================= */
async function cargarProductos() {
  const { data } = await sb.from('productos').select('*').eq('activo', true).order('precio', { ascending: false });
  productos = data || [];
  ['#csku', '#vsku'].forEach(sel => { const s = $(sel); s.innerHTML = ''; productos.forEach(p => s.appendChild(el(`<option value="${esc(p.sku)}">${esc(p.nombre)}</option>`))); });
  const cont = $('#listProd'); cont.innerHTML = '';
  if (!productos.length) cont.appendChild(el(vacio('Sin productos activos.', 'El catálogo se llena desde la base.')));
  productos.forEach((p, i) => {
    const mg = p.precio - (p.costo || 0), pct = p.precio ? Math.round(mg / p.precio * 100) : 0;
    cont.appendChild(el(`<div class="prod"><span class="n">${idx(i)}</span><div><div class="t">${esc(nombreCorto(p.sku))}</div><div class="s">${nombreResto(p.sku) ? esc(nombreResto(p.sku)) + ' · ' : ''}${esc(p.sku)} · costo ${money(p.costo)}</div></div>
      <div class="der"><div class="imp">${money(p.precio)}</div><div class="mg ${pct < 50 ? 'bajo' : ''}">margen ${money(mg)} · ${pct}%</div></div></div>`));
  });
  llenaParaProv();
  calcVenta();
}
function cargarTodo() { return Promise.all([cargarTareas(), cargarCaja(), cargarInv(), cargarCompras(), cargarVentas(), cargarPedidos(), cargarMensajes(), cargarBitacora(), cargarProveedores()]).then(pintaMejoras); }
// Cada carga avisa; "Qué mejorar" se recalcula una sola vez aunque lleguen varias seguidas.
let _tm; const recalcula = () => { clearTimeout(_tm); _tm = setTimeout(pintaMejoras, 120); };

/* ---- tareas ---- */
function filaTarea(t, { conPersona = true } = {}) {
  const hecha = t.estado === 'hecha', espera = t.estado === 'espera', hoy = hoyISO();
  const tarde = t.fecha && t.fecha < hoy && !hecha && !espera, esHoy = t.fecha === hoy && !hecha && !espera;
  const r = el(`<div class="tarea ${hecha ? 'hecha' : ''}">
    <button class="chk" type="button" aria-label="${hecha ? 'reabrir' : 'marcar hecha'}" aria-pressed="${hecha}">${paloma}</button>
    <div class="cuerpo"><div class="tit">${esc(t.titulo)}</div>
      <div class="meta">${conPersona ? `<span class="quien ${esc((t.responsable || '').toLowerCase())}">${esc(t.responsable)}</span>` : ''}
      ${espera ? '<span class="cuando espera">en espera</span>' : ''}
      ${t.fecha && !espera ? `<span class="cuando ${tarde ? 'tarde' : esHoy ? 'hoy' : ''}">${tarde ? 'venció · ' : ''}${fechaCorta(t.fecha)}</span>` : ''}
      ${t.detalle ? `<button class="ver" type="button">ver detalle</button>` : ''}
      ${hecha ? '' : `<button class="ver esp" type="button">${espera ? 'reactivar' : 'poner en espera'}</button>`}</div>
      ${t.detalle ? `<div class="det hide">${esc(t.detalle)}</div>` : ''}
    </div></div>`);
  r.querySelector('.chk').onclick = async () => {
    const ok = !hecha;
    await sb.from('tareas').update({ estado: ok ? 'hecha' : 'pendiente', cerrado: ok ? new Date().toISOString() : null }).eq('id', t.id);
    await anota(ok ? `Cerró la tarea ${t.id}: ${t.titulo}` : `Reabrió la tarea ${t.id}: ${t.titulo}`);
    toast(ok ? 'Tarea cerrada' : 'Tarea reabierta'); cargarTareas(); cargarBitacora();
  };
  const bEsp = r.querySelector('button.esp');
  if (bEsp) bEsp.onclick = async () => {
    const nuevo = espera ? 'pendiente' : 'espera';
    const { error } = await sb.from('tareas').update({ estado: nuevo }).eq('id', t.id);
    if (error) return toast('No se pudo cambiar, intenta de nuevo');
    await anota(espera ? `Reactivó la tarea ${t.id}: ${t.titulo}` : `Puso en espera la tarea ${t.id}: ${t.titulo}`);
    toast(espera ? 'Tarea reactivada' : 'Tarea en espera'); cargarTareas(); cargarBitacora();
  };
  const b = r.querySelector('button.ver:not(.esp)');
  if (b) { const abre = () => { const d = r.querySelector('.det'); d.classList.toggle('hide'); b.textContent = d.classList.contains('hide') ? 'ver detalle' : 'ocultar'; }; b.onclick = abre; r.querySelector('.tit').onclick = abre; r.querySelector('.tit').style.cursor = 'pointer'; }
  return r;
}
async function cargarTareas() {
  const { data } = await sb.from('tareas').select('*').order('fecha', { ascending: true, nullsFirst: false }).order('prioridad').order('id');
  tareasCache = D.tareas = data || [];
  const hoy = hoyISO();
  // "En espera" = depende de algo que no está en nuestras manos (que llegue el producto).
  // No cuenta como pendiente del día ni como vencida.
  const pend = tareasCache.filter(t => t.estado !== 'hecha' && t.estado !== 'espera');
  const enEspera = tareasCache.filter(t => t.estado === 'espera');
  const paraHoy = pend.filter(t => t.fecha && t.fecha <= hoy);
  const atraso = paraHoy.filter(t => t.fecha < hoy).length;
  $('#kHoy').textContent = paraHoy.length;
  $('#kHoyTxt').textContent = paraHoy.length === 1 ? 'pendiente para hoy' : 'pendientes para hoy';
  $('#kHoyNota').textContent = atraso ? `${atraso} ${plural(atraso, 'vencida', 'vencidas')}` : (paraHoy.length ? 'nada vencido' : 'día limpio');
  $('#kpiHoy').classList.toggle('alerta', atraso > 0);

  const mias = pend.filter(t => t.responsable === YO);
  const equipo = pend.filter(t => t.responsable !== YO && t.responsable !== 'Jarvis');
  const pinta = (cont, lista, conPersona, b, s) => { cont.innerHTML = ''; if (!lista.length) return cont.appendChild(el(vacio(b, s))); lista.slice(0, 12).forEach(t => cont.appendChild(filaTarea(t, { conPersona }))); };
  pinta($('#listMias'), mias, false, 'Nada a tu nombre.', 'Sospechoso, pero disfrútalo.');
  pinta($('#listEquipo'), equipo, true, 'El equipo no debe nada.', 'Por ahora.');
  $('#nMias').textContent = mias.length ? `${mias.length} ${plural(mias.length, 'pendiente', 'pendientes')}` : '';
  $('#nEquipo').textContent = equipo.length ? `${equipo.length} ${plural(equipo.length, 'pendiente', 'pendientes')}` : '';

  const chips = $('#chipsTar'); chips.innerHTML = '';
  [['todas', `Pendientes (${pend.length})`], ...PERSONAS.map(p => [p, `${p} (${pend.filter(t => t.responsable === p).length})`]), ['espera', `En espera (${enEspera.length})`], ['hechas', 'Hechas']].forEach(([k, txt]) => {
    const c = el(`<button class="chip ${filtroTar === k ? 'on' : ''}" type="button">${txt}</button>`); c.onclick = () => { filtroTar = k; cargarTareas(); }; chips.appendChild(c);
  });
  const lista = filtroTar === 'hechas' ? tareasCache.filter(t => t.estado === 'hecha').sort((a, b) => (b.cerrado || '').localeCompare(a.cerrado || '')) : filtroTar === 'espera' ? enEspera : filtroTar === 'todas' ? pend : pend.filter(t => t.responsable === filtroTar);
  const cont = $('#listTareas'); cont.innerHTML = '';
  if (!lista.length) cont.appendChild(el(filtroTar === 'hechas' ? vacio('Nada cerrado todavía.', 'Las palomitas se ganan.') : filtroTar === 'espera' ? vacio('Nada en espera.', 'Aquí van las tareas que dependen de algo de afuera, como que llegue el producto.') : vacio('Nada por aquí.', 'Ni una tarea con ese nombre.')));
  lista.slice(0, 80).forEach(t => cont.appendChild(filaTarea(t, { conPersona: filtroTar === 'todas' || filtroTar === 'hechas' || filtroTar === 'espera' })));
  const tarde = pend.filter(t => t.fecha && t.fecha < hoy).length;
  $('#tarResumen').textContent = (tarde ? `${tarde} con atraso · ${pend.length} pendientes` : `${pend.length} ${plural(pend.length, 'pendiente', 'pendientes')}`) + (enEspera.length ? ` · ${enEspera.length} en espera` : '');
  recalcula();
}
$('#btnTarea').onclick = async () => {
  const titulo = $('#nt').value.trim(); if (!titulo) return;
  const responsable = $('#ntr').value, fecha = $('#ntf').value || null;
  await sb.from('tareas').insert({ titulo, responsable, fecha, detalle: $('#ntd').value.trim() || null });
  await anota(`Tarea nueva para ${responsable}${fecha ? ' (' + fecha + ')' : ''}: ${titulo}`);
  $('#nt').value = ''; $('#ntf').value = ''; $('#ntd').value = ''; toast('Tarea agregada'); cargarTareas(); cargarBitacora();
};
$('#btnNotaRapida').onclick = async () => {
  const texto = $('#notaRapida').value.trim(); if (!texto) return;
  await anota(texto);
  $('#notaRapida').value = ''; toast('Guardado en la bitácora'); cargarBitacora();
};

/* ---- caja ----
   El error que esto evita (6-oct-2026): Majo quiso anotar que ya le había pagado a Alan
   su mitad de Claude y lo guardó como "Aportación", porque "Aportación / Gasto / Reembolso"
   es jerga. Ahora se elige lo que pasó en palabras de la vida real, antes de guardar se lee
   en una frase cómo quedan las cuentas, y si el monto es justo lo que alguien debe se le
   pregunta si en realidad es un pago a su socio. Cada movimiento se puede corregir o borrar. */
const TIPOS_CAJA = {
  gasto:      { b: 'Pagué algo del negocio', s: 'Salió de tu bolsa. Se parte a la mitad.', concepto: 'Qué se pagó', ph: 'Claude, dominio, muestras…', quien: 'Quién pagó', corto: 'un gasto' },
  reembolso:  { b: 'Le pagué a mi socio', s: 'Le pasaste al otro su parte de algo.', concepto: 'Por qué', ph: 'Mitad de Claude de octubre', quien: 'Quién le pagó al otro', corto: 'un pago entre socios' },
  aportacion: { b: 'Metí dinero a la caja', s: 'Queda guardado para usarse después en el negocio.', concepto: 'Para qué', ph: 'Fondo para el primer pedido', quien: 'Quién lo puso', corto: 'una aportación' },
  venta:      { b: 'Entró dinero de una venta', s: 'Un cobro fuera de las plataformas.', concepto: 'Qué se vendió', ph: 'Dos kits a una amiga', quien: 'Quién lo cobró', corto: 'una venta' },
};
const otroDe = q => q === 'Alan' ? 'Majo' : 'Alan';
// Cuánto mueve un movimiento el balance (positivo = Majo le debe a Alan). Igual que la vista caja_socios.
function efectoCaja(tipo, quien, m) {
  m = Number(m || 0);
  if (tipo === 'gasto' || tipo === 'aportacion') return quien === 'Alan' ? m / 2 : -m / 2;
  if (tipo === 'reembolso') return quien === 'Alan' ? m : -m;
  return 0;
}
const textoBalance = bal => Math.abs(bal) < 1 ? 'quedan a mano' : bal > 0 ? `Majo le debe ${moneyC(bal)} a Alan` : `Alan le debe ${moneyC(-bal)} a Majo`;
function fraseCaja(k) {
  const m = moneyC(k.monto), c = k.concepto ? `: ${k.concepto}` : '';
  return { gasto: `${k.quien} pagó ${m}${c}`, reembolso: `${k.quien} le pagó ${m} a ${otroDe(k.quien)}${c}`, aportacion: `${k.quien} metió ${m} a la caja${c}`, venta: `entraron ${m} de una venta, los cobró ${k.quien}${c}` }[k.tipo] || `${k.tipo} de ${m}${c}`;
}
let kTipo = 'gasto', kEditando = null;
function pintaOpcionesCaja() {
  const cont = $('#kOpciones');
  if (!cont.children.length) Object.entries(TIPOS_CAJA).forEach(([k, t]) => {
    const b = el(`<button class="opcion" type="button" role="radio" data-tipo="${k}" aria-checked="false"><b>${t.b}</b><small>${t.s}</small></button>`);
    b.onclick = () => eligeTipo(k);
    cont.appendChild(b);
  });
  $$('#kOpciones .opcion').forEach(b => { const on = b.dataset.tipo === kTipo; b.setAttribute('aria-checked', String(on)); b.tabIndex = on ? 0 : -1; });
}
function eligeTipo(k) {
  kTipo = k; const t = TIPOS_CAJA[k];
  pintaOpcionesCaja();
  $('#kConceptoLbl').textContent = t.concepto; $('#kconcepto').placeholder = t.ph; $('#kQuienLbl').textContent = t.quien;
  previoCaja();
}
// flechas del teclado dentro del grupo de opciones, como un radio de verdad
$('#kOpciones').addEventListener('keydown', e => {
  const ks = Object.keys(TIPOS_CAJA), i = ks.indexOf(kTipo);
  const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
  if (!d) return; e.preventDefault();
  eligeTipo(ks[(i + d + ks.length) % ks.length]); $(`#kOpciones [data-tipo="${kTipo}"]`).focus();
});
function previoCaja() {
  const p = $('#kprev'), m = Math.round(parseFloat($('#kmonto').value || 0) * 100) / 100;
  if (!(m > 0)) { p.innerHTML = ''; return; }
  const quien = $('#kquien').value, otro = otroDe(quien), concepto = $('#kconcepto').value.trim(), que = concepto ? `: ${esc(concepto)}` : '';
  const frase = {
    gasto: `${quien} pagó <b>${moneyC(m)}</b> de su bolsa${que}. A cada quien le tocan ${moneyC(m / 2)}.`,
    reembolso: `${quien} le pasa <b>${moneyC(m)}</b> a ${otro}${que}.`,
    aportacion: `${quien} mete <b>${moneyC(m)}</b> a la caja común${que}.`,
    venta: `Entran <b>${moneyC(m)}</b> de una venta${que}. Los cobra ${quien}; no cambia las cuentas entre ustedes.`,
  }[kTipo];
  const balAhora = Number(D.socios?.balance_alan || 0) - (kEditando ? efectoCaja(kEditando.tipo, kEditando.quien, kEditando.monto) : 0);
  const balDespues = balAhora + efectoCaja(kTipo, quien, m);
  let html = `${frase}<br>Después de esto, <b>${textoBalance(balDespues)}</b>.`;
  const deudor = balAhora > 0 ? 'Majo' : 'Alan', debe = Math.abs(balAhora);
  const pareceSaldar = debe >= 1 && quien === deudor && Math.abs(m - debe) <= Math.max(2, debe * 0.02);
  const pareceTexto = /\b(mitad|mi parte|su parte|tu parte|le pagu|pago a|reembols|devolv|a mano)/i.test(concepto);
  if (kTipo !== 'reembolso' && kTipo !== 'venta' && (pareceSaldar || pareceTexto)) {
    html += `<span class="ojo">Ojo: ${pareceSaldar ? `${quien} le debe justo ${moneyC(debe)} a ${otro}.` : 'Parece un pago entre ustedes.'} Si es para pasarle a ${otro} su parte, esto no es ${TIPOS_CAJA[kTipo].corto}.<br><button class="link" type="button" id="kCambia">Es un pago a ${otro}: cambiar a «Le pagué a mi socio»</button></span>`;
  }
  p.innerHTML = html;
  const b = $('#kCambia'); if (b) b.onclick = () => eligeTipo('reembolso');
}
['#kmonto', '#kconcepto', '#kquien'].forEach(s => $(s).addEventListener('input', previoCaja));
function limpiaCaja() {
  kEditando = null;
  ['#kmonto', '#kconcepto', '#kcomp'].forEach(s => $(s).value = '');
  $('#kfecha').value = hoyISO(); $('#kquien').value = YO === 'Majo' ? 'Majo' : 'Alan';
  $('#kEditando').classList.add('hide'); $('#btnCaja').textContent = 'Guardar movimiento';
  msg('#kmsg', ''); eligeTipo('gasto');
}
$('#kCancelar').onclick = limpiaCaja;
function corrigeCaja(k) {
  kEditando = k;
  $('#kmonto').value = k.monto; $('#kconcepto').value = k.concepto || ''; $('#kcomp').value = k.comprobante || '';
  $('#kfecha').value = k.fecha || hoyISO(); $('#kquien').value = k.quien;
  $('#kEditandoTxt').textContent = `Corrigiendo: ${fraseCaja(k)}`; $('#kEditando').classList.remove('hide');
  $('#btnCaja').textContent = 'Guardar corrección';
  eligeTipo(k.tipo);
  $('#kOpciones').closest('.bloque').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
async function cargarCaja() {
  const [{ data: s }, { data: soc }] = await Promise.all([
    sb.from('caja_saldo').select('*').maybeSingle(),
    sb.from('caja_socios').select('*').maybeSingle(),
  ]);
  D.saldo = s || { saldo: 0, puso_alan: 0, puso_majo: 0, gastado: 0 };
  D.socios = soc || { balance_alan: 0, puesto_alan: 0, puesto_majo: 0, total_puesto: 0 };
  // Lo que cada quien PUSO = lo que aportó a la caja + lo que pagó de su bolsa.
  // Casi todo se paga de la bolsa, así que el efectivo de la caja no es la cifra que importa.
  const a = Number(soc?.puesto_alan || 0), m = Number(soc?.puesto_majo || 0), tot = a + m;
  $('#cSaldo').innerHTML = `${money(tot)}<small>entre los dos</small>`;
  $('#cGasto').textContent = money(s?.gastado); $('#cAlan').textContent = money(a); $('#cMajo').textContent = money(m);
  $('#kCaja').textContent = money(tot);
  $('#reparto .alan').style.width = tot ? (a / tot * 100) + '%' : '0';
  $('#reparto .majo').style.width = tot ? (m / tot * 100) + '%' : '0';
  // Reconciliación 50/50: balance_alan > 0 → Majo le debe a Alan; < 0 → Alan le debe a Majo.
  const bal = Number(soc?.balance_alan || 0), otro = otroDe(YO);
  const tit = $('#cuentasTit'), txt = $('#cuentasTxt'), acc = $('#cuentasAcc'); acc.innerHTML = '';
  if (Math.abs(bal) < 1) {
    tit.innerHTML = 'Van parejos, <em>50/50.</em>';
    txt.textContent = tot ? `Todo lo que se ha gastado ya está repartido a la mitad.${Math.abs(bal) >= 0.01 ? ` Quedan ${moneyC(Math.abs(bal))} de redondeo a favor de ${bal > 0 ? 'Alan' : 'Majo'}.` : ''}` : 'Nadie ha puesto nada todavía, así que nadie le debe nada a nadie.';
  } else {
    const debeAlan = bal < 0, monto = moneyC(Math.abs(bal)), deudor = debeAlan ? 'Alan' : 'Majo';
    const yoDebo = YO === deudor;
    tit.innerHTML = yoDebo ? `Le debes a ${otro} <em>${monto}.</em>` : `${otro} te debe <em>${monto}.</em>`;
    txt.textContent = `Todo gasto se parte a la mitad sin importar quién lo pagó. Para quedar a mano, ${deudor} le pasa ${monto} a ${otroDe(deudor)} y lo anota como «Le pagué a mi socio».`;
    const b = el(`<button class="link" type="button">Anotar ese pago</button>`);
    b.onclick = () => { limpiaCaja(); eligeTipo('reembolso'); $('#kquien').value = deudor; $('#kmonto').value = Math.abs(bal).toFixed(2); $('#kconcepto').value = 'Su parte, para quedar a mano'; previoCaja(); $('#kOpciones').closest('.bloque').scrollIntoView({ behavior: 'smooth', block: 'start' }); $('#kcomp').focus({ preventScroll: true }); };
    acc.appendChild(b);
  }
  if (kTipo) previoCaja();
  const { data } = await sb.from('caja').select('*').order('fecha', { ascending: false }).order('id', { ascending: false }).limit(40);
  const cont = $('#listCaja'); cont.innerHTML = '';
  recalcula();
  if (!data?.length) return cont.appendChild(el(vacio('La caja está en ceros.', 'Cuando alguien pague algo del negocio o le pase su parte al otro, queda anotado aquí: qué, cuánto y quién.')));
  const etiqueta = { gasto: k => `Pagó ${k.quien}`, reembolso: k => `${k.quien} le pagó a ${otroDe(k.quien)}`, aportacion: k => `${k.quien} metió a la caja`, venta: k => `Venta · cobró ${k.quien}` };
  data.forEach((k, i) => {
    const signo = k.tipo === 'gasto' ? '−' : k.tipo === 'reembolso' ? '' : '+';
    const cls = k.tipo === 'gasto' ? 'sale' : k.tipo === 'reembolso' ? 'neutro' : 'entra';
    const r = el(`<div class="fila abre" role="button" tabindex="0" aria-expanded="false"><span class="n">${idx(i)}</span><div><div class="t">${esc(k.concepto)}</div>
      <div class="s">${fechaCorta(k.fecha)} · ${etiqueta[k.tipo] ? esc(etiqueta[k.tipo](k)) : esc(k.tipo)}${k.comprobante ? ' · ' + esc(k.comprobante) : ''}${k.editado ? ' · corregido' : ''}</div></div>
      <div class="imp ${cls}">${signo}${moneyC(k.monto)}</div>
      <div class="acc hide"><button class="link" type="button" data-a="corregir">Corregir</button><button class="link peligro" type="button" data-a="borrar">Borrar</button></div></div>`);
    const acc2 = r.querySelector('.acc');
    const abre = () => { acc2.classList.toggle('hide'); r.setAttribute('aria-expanded', String(!acc2.classList.contains('hide'))); };
    r.onclick = e => { if (!e.target.closest('button')) abre(); };
    r.onkeydown = e => { if ((e.key === 'Enter' || e.key === ' ') && e.target === r) { e.preventDefault(); abre(); } };
    r.querySelector('[data-a=corregir]').onclick = () => corrigeCaja(k);
    const bb = r.querySelector('[data-a=borrar]');
    bb.onclick = async () => {
      if (!confirm(`¿Borrar este movimiento?\n\n${fraseCaja(k)}\n\nQueda anotado en la bitácora quién lo borró.`)) return;
      bb.disabled = true;
      const { error } = await sb.from('caja').delete().eq('id', k.id);
      if (error) { bb.disabled = false; return toast('No se pudo borrar, intenta de nuevo'); }
      await anota(`Caja · borró el movimiento ${k.id} del ${fechaLarga(k.fecha)}: ${fraseCaja(k)}`);
      if (kEditando?.id === k.id) limpiaCaja();
      toast('Movimiento borrado'); cargarCaja(); cargarBitacora();
    };
    cont.appendChild(r);
  });
}
$('#btnCaja').onclick = async () => {
  const monto = Math.round(parseFloat($('#kmonto').value || 0) * 100) / 100, concepto = $('#kconcepto').value.trim();
  if (!(monto > 0) || !concepto) return msg('#kmsg', 'Falta el concepto o el monto.', 'err');
  const fila = { tipo: kTipo, quien: $('#kquien').value, concepto, monto, fecha: $('#kfecha').value || hoyISO(), comprobante: $('#kcomp').value.trim() || null };
  const b = $('#btnCaja'); b.disabled = true;
  let error;
  if (kEditando) {
    ({ error } = await sb.from('caja').update({ ...fila, editado: new Date().toISOString() }).eq('id', kEditando.id));
    if (!error) await anota(`Caja · corrigió el movimiento ${kEditando.id}. Antes: ${fraseCaja(kEditando)}. Ahora: ${fraseCaja(fila)}.`);
  } else {
    ({ error } = await sb.from('caja').insert({ ...fila, capturo: YO }));
    if (!error) await anota(`Caja · ${fraseCaja(fila)}`);
  }
  b.disabled = false;
  if (error) return msg('#kmsg', 'No se guardó: ' + error.message, 'err');
  toast(kEditando ? 'Movimiento corregido' : 'Movimiento guardado');
  limpiaCaja(); cargarCaja(); cargarBitacora();
};

/* ---- inventario ---- */
// Los ± se anotan en la bitácora una sola vez por ráfaga de toques, con el cambio neto.
const _ajustes = {};
function anotaAjuste(sku, desde, hasta) {
  const a = _ajustes[sku] || (_ajustes[sku] = { desde, t: null });
  clearTimeout(a.t);
  a.t = setTimeout(() => { const d = hasta - a.desde; delete _ajustes[sku]; if (d) { anota(`Inventario · ${nombreCorto(sku)}: de ${a.desde} a ${hasta} (${d > 0 ? '+' : ''}${d})`); cargarBitacora(); } }, 1400);
}
async function cargarInv() {
  const { data } = await sb.from('inventario').select('*').order('sku');
  // Mismo orden que el catálogo (por precio); lo que no esté en el catálogo, al final.
  const pos = sku => { const i = productos.findIndex(p => p.sku === sku); return i < 0 ? 99 : i; };
  D.inv = (data || []).slice().sort((a, b) => pos(a.sku) - pos(b.sku));
  const cont = $('#listInv'); cont.innerHTML = ''; let total = 0;
  D.inv.forEach((i, k) => { total += i.cantidad;
    const aviso = i.cantidad === 0 ? '<span class="aviso">sin existencia</span>' : i.cantidad < 15 ? '<span class="aviso">reponer</span>' : '';
    const r = el(`<div class="pieza"><span class="n">${idx(k)}</span><div><div class="t">${esc(nombreCorto(i.sku))}</div><div class="s">${nombreResto(i.sku) ? esc(nombreResto(i.sku)) + ' · ' : ''}${esc(i.sku)}${aviso ? ' · ' + aviso : ''}</div></div>
      <div class="ctl"><button class="mas menos" type="button" aria-label="una menos"><svg viewBox="0 0 16 16"><path d="M1 8h14"/></svg></button><div class="cant">${i.cantidad}</div><button class="mas" type="button" aria-label="una más"><svg viewBox="0 0 16 16"><path d="M8 1v14M1 8h14"/></svg></button></div></div>`);
    const [menos, mas] = r.querySelectorAll('button');
    const mueve = async d => { const nuevo = Math.max(0, i.cantidad + d); await sb.from('inventario').update({ cantidad: nuevo, actualizado: new Date().toISOString() }).eq('sku', i.sku); anotaAjuste(i.sku, i.cantidad, nuevo); cargarInv(); };
    menos.onclick = () => mueve(-1); mas.onclick = () => mueve(1); cont.appendChild(r); });
  if (!data?.length) cont.appendChild(el(vacio('Sin piezas en casa.', 'El inventario empieza cuando llega la primera caja del proveedor.')));
  $('#kStock').textContent = total; $('#invResumen').textContent = `${total} ${plural(total, 'pieza', 'piezas')} en casa`;
  recalcula();
}
$('#btnCompra').onclick = async () => {
  const cantidad = parseInt($('#ccant').value || 0), costo = parseFloat($('#ccosto').value || 0), sku = $('#csku').value, prov = $('#cprov').value.trim();
  if (!cantidad || !costo) return msg('#cmsg', 'Falta cantidad o costo.', 'err');
  const { error } = await sb.from('compras').insert({ fecha: hoyISO(), proveedor: prov || null, sku, cantidad, costo_unitario: costo, total: +(cantidad * costo).toFixed(2), factura: $('#cfact').value === 'true' });
  if (error) return msg('#cmsg', 'No se guardó: ' + error.message, 'err');
  const { data: inv } = await sb.from('inventario').select('cantidad').eq('sku', sku).maybeSingle();
  if (inv) await sb.from('inventario').update({ cantidad: inv.cantidad + cantidad, actualizado: new Date().toISOString() }).eq('sku', sku);
  else await sb.from('inventario').insert({ sku, cantidad });
  await anota(`Compra: ${cantidad} × ${sku} a ${moneyC(costo)} c/u${prov ? ' en ' + prov : ''} (${moneyC(cantidad * costo)}).`);
  // El costo real de la compra sustituye al supuesto: así Margen y "Qué mejorar" dejan de mentir.
  const prod = productos.find(x => x.sku === sku);
  if ($('#cactualiza').checked && prod && Number(prod.costo) !== costo) {
    const { error: e2 } = await sb.from('productos').update({ costo }).eq('sku', sku);
    if (!e2) await anota(`Catálogo · el costo de ${nombreCorto(sku)} pasó de ${moneyC(prod.costo)} a ${moneyC(costo)} por la compra.`);
  }
  msg('#cmsg', ''); $('#ccant').value = ''; $('#ccosto').value = ''; toast('Compra guardada, inventario actualizado');
  cargarProductos(); cargarCompras(); cargarInv(); cargarBitacora();
};
async function cargarCompras() {
  const [{ data }, { data: todas }] = await Promise.all([
    sb.from('compras').select('*').order('fecha', { ascending: false }).order('id', { ascending: false }).limit(30),
    sb.from('compras').select('total,factura,cantidad,costo_unitario'),
  ]);
  D.compras = todas || [];
  const cont = $('#listCom'); cont.innerHTML = '';
  recalcula();
  if (!data?.length) return cont.appendChild(el(vacio('Ninguna compra todavía.', 'Los proveedores siguen sin saber que existimos.')));
  data.forEach((c, i) => cont.appendChild(el(`<div class="fila"><span class="n">${idx(i)}</span><div><div class="t">${c.cantidad} × ${esc(c.sku ? nombreCorto(c.sku) : (c.descripcion || ''))}</div>
    <div class="s">${fechaCorta(c.fecha)} · ${esc(c.proveedor || 'sin proveedor')} · ${money(c.costo_unitario)} c/u${c.factura ? ' · facturado' : ' · sin factura'}</div></div>
    <div class="imp">${money(c.total ?? c.cantidad * c.costo_unitario)}</div></div>`)));
}

/* ---- ventas ---- */
const COMISION = { 'Mercado Libre': p => p * 0.14 + 38, 'TikTok Shop': p => p * 0.08, 'Amazon': p => p * 0.15 };
function calcVenta() {
  const canal = $('#vcanal').value, precio = parseFloat($('#vprecio').value || 0), cant = parseInt($('#vcant').value || 1);
  const c = $('#vcalc');
  if (!precio) { c.classList.add('vacia'); $('#vcom').textContent = '—'; $('#vneto').textContent = '—'; return; }
  const com = (COMISION[canal] ? COMISION[canal](precio) : 0) * cant;
  c.classList.remove('vacia'); $('#vcom').textContent = money(com); $('#vneto').textContent = money(precio * cant - com);
}
['#vcanal', '#vprecio', '#vcant'].forEach(s => $(s).addEventListener('input', calcVenta));
$('#vsku').addEventListener('change', () => { const p = productos.find(x => x.sku === $('#vsku').value); if (p && !$('#vprecio').value) { $('#vprecio').placeholder = money(p.precio); } });
$('#btnVenta').onclick = async () => {
  const sku = $('#vsku').value, precio = parseFloat($('#vprecio').value || 0), cantidad = parseInt($('#vcant').value || 1), canal = $('#vcanal').value;
  if (!precio) return msg('#vmsg', 'Falta el precio.', 'err');
  const com = COMISION[canal] ? COMISION[canal](precio) * cantidad : 0;
  const envio = canal === 'Mercado Libre' ? 38 * cantidad : 0, comision = com - envio;
  const { error } = await sb.from('ventas').insert({ fecha: hoyISO(), canal, sku, cantidad, precio, comision: +comision.toFixed(2), envio, neto: +(precio * cantidad - com).toFixed(2) });
  if (error) return msg('#vmsg', 'No se guardó: ' + error.message, 'err');
  const { data: inv } = await sb.from('inventario').select('cantidad').eq('sku', sku).maybeSingle();
  if (inv) await sb.from('inventario').update({ cantidad: Math.max(0, inv.cantidad - cantidad), actualizado: new Date().toISOString() }).eq('sku', sku);
  await anota(`Venta: ${cantidad} × ${sku} en ${canal} a ${money(precio)}.`);
  msg('#vmsg', ''); $('#vprecio').value = ''; $('#vcant').value = 1; calcVenta(); toast('Venta guardada');
  cargarVentas(); cargarInv(); cargarBitacora();
};
/* ---- margen: simulador + catálogo por canal, con las mismas comisiones de arriba ---- */
const CANALES_MARGEN = ['Mercado Libre', 'TikTok Shop', 'Amazon', 'En persona'];
let mgCanal = 'Mercado Libre';
function margenCon(costo, precio, canal) {
  const com = COMISION[canal] ? COMISION[canal](precio) : 0;
  const margen = precio - costo - com;
  const pct = precio ? Math.round(margen / precio * 100) : 0;
  return { com, margen, pct };
}
const claseMg = pct => pct < 15 ? 'bajo' : pct < 30 ? 'media' : '';
function calcMargen() {
  const costo = parseFloat($('#mgCosto').value || 0), precio = parseFloat($('#mgPrecio').value || 0);
  const c = $('#mgCalc');
  if (!precio) { c.classList.add('vacia'); $('#mgCom').textContent = '—'; $('#mgNeto').textContent = '—'; return; }
  const { com, margen } = margenCon(costo, precio, mgCanal);
  c.classList.remove('vacia'); $('#mgCom').textContent = money(com); $('#mgNeto').textContent = money(margen);
}
function pintaCatalogoMargen() {
  const cont = $('#listMargen'); cont.innerHTML = '';
  $('#mgNCat').textContent = productos.length ? `${productos.length} ${plural(productos.length, 'activo', 'activos')}` : '';
  if (!productos.length) return cont.appendChild(el(vacio('Sin productos activos.', 'El catálogo se llena desde la base.')));
  productos.forEach((p, i) => {
    const { margen, pct } = margenCon(p.costo || 0, p.precio, mgCanal);
    cont.appendChild(el(`<div class="prod"><span class="n">${idx(i)}</span><div><div class="t">${esc(nombreCorto(p.sku))}</div><div class="s">${nombreResto(p.sku) ? esc(nombreResto(p.sku)) + ' · ' : ''}${esc(p.sku)} · costo ${money(p.costo)}</div></div>
      <div class="der"><div class="imp">${money(p.precio)}</div><div class="mg ${claseMg(pct)}">margen ${money(margen)} · ${pct}%</div></div></div>`));
  });
}
function pintaMargen() {
  const cont = $('#mgCanales');
  if (!cont.children.length) {
    CANALES_MARGEN.forEach(c => {
      const b = el(`<button class="chip ${c === mgCanal ? 'on' : ''}" type="button">${esc(c)}</button>`);
      b.onclick = () => { mgCanal = c; $$('#mgCanales .chip').forEach(x => x.classList.toggle('on', x.textContent === c)); calcMargen(); pintaCatalogoMargen(); };
      cont.appendChild(b);
    });
    ['#mgCosto', '#mgPrecio'].forEach(s => $(s).addEventListener('input', calcMargen));
  }
  calcMargen();
  pintaCatalogoMargen();
}
function pintaMeta(ml, n) {
  const ol = $('#casillas'); ol.innerHTML = '';
  for (let i = 0; i < META_ML; i++) ol.appendChild(el(`<li class="${i < ml ? 'ok' : ''}">${abanico}<span class="n">${idx(i)}</span></li>`));
  $('#mN').textContent = Math.min(ml, META_ML);
  const otras = n - ml;
  $('#metaNota').textContent = ml >= META_ML ? 'Meta cumplida. Ahora sí, esto es un negocio.'
    : ml === 0 ? 'Cero en Mercado Libre. Cada venta llena una casilla.'
    : `${META_ML - ml === 1 ? 'Falta una' : 'Faltan ' + (META_ML - ml)} para cerrar la meta.${otras > 0 ? ` Aparte, ${otras} por otros canales.` : ''}`;
}
async function cargarVentas() {
  const { data } = await sb.from('ventas').select('*').order('fecha', { ascending: false }).order('id', { ascending: false }).limit(40);
  D.ventas = data || [];
  const cont = $('#listVen'); cont.innerHTML = '';
  const n = (data || []).reduce((a, v) => a + (v.cantidad || 1), 0), neto = (data || []).reduce((a, v) => a + Number(v.neto || 0), 0);
  const ml = (data || []).filter(v => v.canal === 'Mercado Libre').reduce((a, v) => a + (v.cantidad || 1), 0);
  $('#kVentas').innerHTML = `${Math.min(ml, META_ML)}<small>/${META_ML}</small>`;
  $('#venResumen').textContent = n ? `${n} ${plural(n, 'pieza vendida', 'piezas vendidas')} · neto ${money(neto)}` : 'Meta viva: diez en Mercado Libre.';
  pintaMeta(ml, n);
  recalcula();
  if (!data?.length) return cont.appendChild(el(vacio('Cero ventas todavía.', 'Técnicamente esto aún no es un negocio, es una conversación.')));
  data.forEach((v, i) => cont.appendChild(el(`<div class="fila"><span class="n">${idx(i)}</span><div><div class="t">${v.cantidad > 1 ? v.cantidad + ' × ' : ''}${esc(nombreCorto(v.sku))}</div>
    <div class="s">${esc(v.canal)} · ${fechaCorta(v.fecha)} · neto ${money(v.neto)}</div></div><div class="imp">${money(v.precio)}</div></div>`)));
}

/* ---- envíos (pedidos) ---- */
const SIGUIENTE = { nuevo: 'preparando', preparando: 'enviado', enviado: 'entregado' };
const ESTADO_TXT = { nuevo: 'Nuevo', preparando: 'Preparando', enviado: 'Enviado', entregado: 'Entregado', cancelado: 'Cancelado' };
async function cargarPedidos() {
  const { data } = await sb.from('pedidos').select('*').order('fecha', { ascending: false }).order('id', { ascending: false }).limit(80);
  D.pedidos = data || [];
  const activos = D.pedidos.filter(p => p.estado !== 'entregado' && p.estado !== 'cancelado');
  ['nuevo', 'preparando', 'enviado', 'entregado'].forEach((e, i) => $('#ruta').children[i].querySelector('.v').textContent = D.pedidos.filter(p => p.estado === e).length);
  const chips = $('#chipsEnv'); chips.innerHTML = '';
  [['activos', `En curso (${activos.length})`], ['todos', `Todos (${D.pedidos.length})`]].forEach(([k, txt]) => {
    const c = el(`<button class="chip ${filtroEnv === k ? 'on' : ''}" type="button">${txt}</button>`); c.onclick = () => { filtroEnv = k; cargarPedidos(); }; chips.appendChild(c);
  });
  $('#envResumen').textContent = activos.length ? `${activos.length} ${plural(activos.length, 'pedido en curso', 'pedidos en curso')}` : 'Los pedidos de la tienda y de los canales, con su estado.';
  const cont = $('#listEnv'); cont.innerHTML = '';
  recalcula();
  const lista = filtroEnv === 'activos' ? activos : D.pedidos;
  if (!lista.length) return cont.appendChild(el(D.pedidos.length
    ? vacio('Nada en curso.', 'Todo lo que se pidió ya se entregó.')
    : vacio('Ningún pedido por ahora.', 'Cuando alguien pida desde la tienda o por un canal, cae aquí con su estado. De esta lista sale cada envío: nuevo, preparando, enviado, entregado.')));
  lista.forEach((p, i) => {
    const d = p.datos || {};
    const items = d.items && typeof d.items === 'object' ? Object.entries(d.items).map(([s, q]) => `${q} × ${nombreCorto(s)}`).join(', ') : `${p.cantidad || 1} × ${(p.sku || '').split('+').map(nombreCorto).join(', ')}`;
    const extra = [d.direccion, d.telefono].filter(Boolean).map(esc).join(' · ');
    const sig = SIGUIENTE[p.estado];
    const r = el(`<div class="pedido ${p.estado === 'entregado' ? 'entregado' : ''}" data-estado="${esc(p.estado)}"><span class="n">${idx(i)}</span><div>
      <div class="cab-p"><div class="t">${esc(p.comprador || 'Sin nombre')}</div><div class="imp">${money(p.total)}</div></div>
      <div class="s">${esc(items)}<br>${esc(p.canal || '')}${p.id_externo ? ' · ' + esc(p.id_externo) : ''} · ${fechaCorta(String(p.fecha || '').slice(0, 10))}${extra ? '<br>' + extra : ''}</div>
      <div class="pasos"><span class="estado">${ESTADO_TXT[p.estado] || esc(p.estado)}</span>${sig ? `<button class="link" type="button" data-a="sig">Pasar a ${ESTADO_TXT[sig].toLowerCase()} →</button>` : ''}${p.estado === 'nuevo' || p.estado === 'preparando' ? '<button class="link suave" type="button" data-a="cancelar">Cancelar</button>' : ''}</div>
    </div></div>`);
    const bc = r.querySelector('[data-a=cancelar]');
    if (bc) bc.onclick = async () => {
      if (!confirm(`¿Cancelar el pedido de ${p.comprador || p.canal || 'sin nombre'} por ${money(p.total)}?\n\nSirve para pedidos de prueba o que el cliente ya no quiso. Queda en la bitácora.`)) return;
      bc.disabled = true;
      const { error } = await sb.from('pedidos').update({ estado: 'cancelado' }).eq('id', p.id);
      if (error) { bc.disabled = false; return toast('No se pudo cancelar, intenta de nuevo'); }
      await anota(`Pedido ${p.id} (${p.comprador || p.canal}): cancelado`);
      toast('Pedido cancelado'); cargarPedidos(); cargarBitacora();
    };
    const b = r.querySelector('[data-a=sig]');
    if (b) b.onclick = async () => {
      await sb.from('pedidos').update({ estado: sig }).eq('id', p.id);
      await anota(`Pedido ${p.id} (${p.comprador || p.canal}): ${p.estado} → ${sig}`);
      toast(`Pedido ${ESTADO_TXT[sig].toLowerCase()}`); cargarPedidos(); cargarBitacora();
    };
    cont.appendChild(r);
  });
}

/* ---- soporte (mensajes de Telegram) ---- */
async function cargarMensajes() {
  const { data } = await sb.from('mensajes').select('*').order('fecha', { ascending: false }).limit(80);
  D.mensajes = data || [];
  const pend = D.mensajes.filter(m => !m.atendido), jarvis = D.mensajes.filter(m => m.necesita_jarvis && !m.atendido);
  const chips = $('#chipsSop'); chips.innerHTML = '';
  [['pendientes', `Sin atender (${pend.length})`], ['jarvis', `Para Jarvis (${jarvis.length})`], ['todos', `Todos (${D.mensajes.length})`]].forEach(([k, txt]) => {
    const c = el(`<button class="chip ${filtroSop === k ? 'on' : ''}" type="button">${txt}</button>`); c.onclick = () => { filtroSop = k; cargarMensajes(); }; chips.appendChild(c);
  });
  $('#sopResumen').textContent = pend.length ? `${pend.length} ${plural(pend.length, 'mensaje sin atender', 'mensajes sin atender')}` : 'Lo que llega por Telegram, hasta que alguien lo atiende.';
  const cont = $('#listSop'); cont.innerHTML = '';
  recalcula();
  const lista = filtroSop === 'pendientes' ? pend : filtroSop === 'jarvis' ? jarvis : D.mensajes;
  if (!lista.length) return cont.appendChild(el(!D.mensajes.length
    ? vacio('Nadie pregunta nada.', 'Los mensajes que lleguen por Telegram se quedan aquí hasta que alguien los atienda.')
    : filtroSop === 'jarvis' ? vacio('Nada para Jarvis.', 'Cuando un mensaje lo necesite, aquí se distingue.')
    : vacio('Todo atendido.', 'Nadie está esperando respuesta.')));
  lista.forEach((m, i) => {
    const r = el(`<div class="msj ${m.atendido ? 'atendido' : ''}"><span class="n">${idx(i)}</span><div>
      <div class="cab-m"><div class="t">${esc(m.autor || 'Sin nombre')}</div><span class="cuando">${fechaDia(m.fecha)} ${fechaMes(m.fecha)} · ${horaSola(m.fecha)}</span></div>
      ${m.foto_url ? `<img src="${esc(m.foto_url)}" alt="" loading="lazy">` : ''}
      ${m.texto ? `<div class="txt">${esc(m.texto)}</div>` : ''}
      <div class="pie-m">${m.necesita_jarvis ? '<span class="flag jarvis">Necesita a Jarvis</span>' : ''}<span class="flag ${m.atendido ? '' : 'pend'}">${m.atendido ? 'Atendido' : 'Sin atender'}</span>${m.atendido ? '' : '<button class="link" type="button" data-accion="atender">Marcar atendido</button>'}<button class="link peligro" type="button" data-accion="borrar">Borrar</button></div>
    </div></div>`);
    const foto = r.querySelector('img');
    if (foto) foto.onclick = () => abreLightbox(m.foto_url);
    const bAtender = r.querySelector('[data-accion=atender]');
    if (bAtender) bAtender.onclick = async () => {
      await sb.from('mensajes').update({ atendido: true }).eq('id', m.id);
      await anota(`Atendió el mensaje ${m.id} de ${m.autor || 'Telegram'}: ${(m.texto || '').slice(0, 80)}`);
      toast('Mensaje atendido'); cargarMensajes(); cargarBitacora();
    };
    const bBorrar = r.querySelector('[data-accion=borrar]');
    if (bBorrar) bBorrar.onclick = async () => {
      if (!confirm('¿Borrar este mensaje? No se puede deshacer.')) return;
      bBorrar.disabled = true;
      try {
        if (m.foto_url) {
          const marca = '/object/public/fotos/', i2 = m.foto_url.indexOf(marca);
          if (i2 >= 0) await sb.storage.from('fotos').remove([decodeURIComponent(m.foto_url.slice(i2 + marca.length))]);
        }
        await sb.from('mensajes').delete().eq('id', m.id);
        await anota(`Borró el mensaje ${m.id} de ${m.autor || 'Telegram'}${m.texto ? ': ' + m.texto.slice(0, 80) : ''}.`);
        toast('Mensaje borrado'); cargarMensajes(); cargarBitacora();
      } catch (e) { bBorrar.disabled = false; toast('No se pudo borrar, intenta de nuevo'); }
    };
    cont.appendChild(r);
  });
}

/* ---- qué mejorar · reglas fijas sobre los datos que ya están cargados ---- */
function reglas() {
  const hoy = hoyISO(), out = [];
  const lista = (arr, f = x => x) => { const n = arr.map(f); return n.length <= 3 ? n.join(n.length === 2 ? ' y ' : ', ').replace(/, ([^,]*)$/, ' y $1') : n.slice(0, 3).join(', ') + ` y ${n.length - 3} más`; };
  const pend = D.tareas.filter(t => t.estado !== 'hecha' && t.estado !== 'espera');

  const venc = pend.filter(t => t.fecha && t.fecha < hoy).sort((a, b) => a.fecha.localeCompare(b.fecha));
  if (venc.length) { const v = venc[0], d = diasDesde(v.fecha); out.push({ crit: true, t: `${venc.length} ${plural(venc.length, 'tarea vencida', 'tareas vencidas')}`, d: `La más vieja es «${v.titulo}» (${v.responsable}), vencía el ${fechaLarga(v.fecha)}: hace ${d} ${plural(d, 'día', 'días')}.`, ir: 'hoy', txt: 'Ver las tareas' }); }

  const sinF = pend.filter(t => !t.fecha && t.responsable !== 'Jarvis');
  if (sinF.length) out.push({ t: `${sinF.length} ${plural(sinF.length, 'tarea sin fecha', 'tareas sin fecha')}`, d: `Sin fecha no vencen, pero tampoco llegan: ${lista(sinF, t => '«' + t.titulo + '»')}.`, ir: 'hoy', txt: 'Ponerles fecha' });

  const cant = sku => { const i = D.inv.find(x => x.sku === sku); return i ? Number(i.cantidad) : 0; };
  const ceros = productos.filter(p => cant(p.sku) === 0), bajos = productos.filter(p => { const c = cant(p.sku); return c > 0 && c < 15; });
  if (ceros.length) out.push({ crit: ceros.length === productos.length, t: ceros.length === productos.length ? 'Todo el catálogo está en cero' : `${ceros.length} ${plural(ceros.length, 'producto sin existencia', 'productos sin existencia')}`, d: `No se puede vender lo que no está en casa: ${lista(ceros, p => nombreCorto(p.sku))}.`, ir: 'inv', txt: 'Ir al inventario' });
  if (bajos.length) out.push({ t: `${bajos.length} ${plural(bajos.length, 'producto por debajo de 15 piezas', 'productos por debajo de 15 piezas')}`, d: `Toca reponer: ${lista(bajos, p => `${nombreCorto(p.sku)} (${cant(p.sku)})`)}.`, ir: 'inv', txt: 'Registrar compra' });

  if (!D.ventas.length) {
    const primero = D.tareas.map(t => t.creado).filter(Boolean).sort()[0];
    const d = primero ? diasDesde(primero) : 0;
    out.push({ t: 'Ninguna venta registrada', d: `${primero ? `Desde que se abrió la primera tarea (${fechaLarga(primero)}) han pasado ${d} ${plural(d, 'día', 'días')} y la` : 'La'} meta de Mercado Libre sigue en 0 de 10.`, ir: 'ven', txt: 'Ver la meta' });
  } else {
    const ult = D.ventas[0], d = diasDesde(ult.fecha);
    if (d >= 3) out.push({ crit: d >= 7, t: `${d} días sin registrar una venta`, d: `La última fue el ${fechaLarga(ult.fecha)}, por ${ult.canal}.`, ir: 'ven', txt: 'Registrar venta' });
  }

  const sinFac = D.compras.filter(c => !c.factura);
  if (sinFac.length) { const suma = sinFac.reduce((a, c) => a + Number(c.total ?? c.cantidad * c.costo_unitario), 0); out.push({ t: `${sinFac.length} ${plural(sinFac.length, 'compra sin factura', 'compras sin factura')}`, d: `Suman ${money(suma)} que no se pueden deducir. Importa para impuestos.`, ir: 'inv', txt: 'Ver las compras' }); }

  const margen = productos.filter(p => p.precio && (p.precio - (p.costo || 0)) / p.precio < .5);
  if (margen.length) out.push({ t: `${margen.length} ${plural(margen.length, 'producto con margen menor al 50%', 'productos con margen menor al 50%')}`, d: lista(margen, p => `${nombreCorto(p.sku)} deja ${Math.round((p.precio - (p.costo || 0)) / p.precio * 100)}%`) + '.', ir: 'inv', txt: 'Ver el catálogo' });

  const saldo = Number(D.saldo?.saldo || 0), bal = Number(D.socios?.balance_alan || 0);
  const hayCaja = Number(D.saldo?.puso_alan || 0) + Number(D.saldo?.puso_majo || 0) > 0;
  // Solo es alarma si de verdad hay una caja que se quedó corta; si todo se pagó de la bolsa, no lo es.
  if (hayCaja && saldo < 0) out.push({ crit: true, t: `La caja está en negativo: ${money(saldo)}`, d: 'Se ha gastado más de lo que se ha aportado a la caja. Falta aportar o registrar el reembolso.', ir: 'caja', txt: 'Ir a la caja' });
  if (Math.abs(bal) >= 1) out.push({ t: 'Las cuentas entre socios no están parejas', d: `${bal > 0 ? `Majo le debe ${moneyC(bal)} a Alan` : `Alan le debe ${moneyC(-bal)} a Majo`}. Cuando se lo pase, se anota en Caja como «Le pagué a mi socio».`, ir: 'caja', txt: 'Ver las cuentas' });

  const sinAt = D.mensajes.filter(m => !m.atendido);
  if (sinAt.length) { const viejo = sinAt[sinAt.length - 1], d = diasDesde(viejo.fecha); out.push({ crit: d >= 1, t: `${sinAt.length} ${plural(sinAt.length, 'mensaje sin atender', 'mensajes sin atender')}`, d: `El más viejo es de ${viejo.autor || 'Telegram'}, ${d === 0 ? 'de hoy' : `de hace ${d} ${plural(d, 'día', 'días')}`}${viejo.necesita_jarvis ? ', y necesita a Jarvis' : ''}.`, ir: 'sop', txt: 'Ir al soporte' }); }

  // Proveedores: lo que frena elegir producto.
  const provs = D.provs.filter(p => p.etapa !== 'descartado');
  const paraKit = provs.filter(p => /KIT1/.test(p.para || ''));
  const conPrecio = paraKit.filter(p => ['cotizando', 'muestra_pedida', 'muestra_en_casa', 'elegido'].includes(p.etapa));
  if (paraKit.length && !conPrecio.length && !paraKit.some(p => p.etapa === 'elegido')) out.push({ t: 'Nadie nos ha cotizado el Kit N°1', d: `Hay ${paraKit.length} ${plural(paraKit.length, 'proveedor', 'proveedores')} en la lista y ninguno ha dado precio por nuestro kit. Cuando alguien conteste, muévelo a «Cotizando» y anota el precio.`, ir: 'prov', txt: 'Ir a proveedores' });
  provs.filter(p => p.etapa === 'muestra_pedida' && p.muestra_pedida && diasDesde(p.muestra_pedida) > 14).forEach(p => { const d = diasDesde(p.muestra_pedida); out.push({ crit: d > 25, t: `La muestra de ${p.nombre} lleva ${d} días sin llegar`, d: `Se pidió el ${fechaLarga(p.muestra_pedida)}. Pide la guía de rastreo; si no hay, que la reenvíen.`, ir: 'prov', txt: 'Ver proveedores' }); });
  provs.filter(p => p.etapa === 'muestra_en_casa' && p.prueba_pelos == null).forEach(p => out.push({ t: `Falta la prueba de pelo de ${p.nombre}`, d: 'La muestra ya está en casa. Lavar cada brocha cinco veces, dejarla secar, pasar los dedos 20 veces y jalar suave con pinza. Anotar cuántos pelos suelta por brocha.', ir: 'prov', txt: 'Anotar la prueba' }));
  const kit = productos.find(p => p.sku === 'KIT1');
  const costosKit = paraKit.map(p => ({ p, c: costoProv(p) })).filter(x => x.c.v != null);
  if (kit && costosKit.length) {
    const reales = costosKit.filter(x => !x.c.estimado), base = reales.length ? reales : costosKit;
    const min = base.reduce((a, x) => x.c.v < a.c.v ? x : a);
    if (Number(kit.costo || 0) < min.c.v * 0.8) {
      const pct = kit.precio ? Math.round((kit.precio - min.c.v) / kit.precio * 100) : 0;
      out.push({ crit: !!reales.length, t: `El costo del Kit N°1 en el sistema (${money(kit.costo)}) no lo respalda ${reales.length ? 'ninguna cotización' : 'ningún proveedor'}`, d: `Lo más barato que tenemos ${reales.length ? 'cotizado' : 'estimado'} es ${min.p.nombre}: ${money(min.c.v)} por kit ya en Guadalajara. A ${money(kit.precio)}, eso deja ${pct}% antes de comisiones. El margen que ves en el catálogo es más alto de lo real.`, ir: 'prov', txt: 'Ver proveedores' });
    }
  }

  const parados = D.pedidos.filter(p => p.estado !== 'entregado' && p.estado !== 'cancelado' && diasDesde(p.fecha) > 2);
  if (parados.length) { const v = parados.sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)))[0]; out.push({ crit: true, t: `${parados.length} ${plural(parados.length, 'pedido parado', 'pedidos parados')} más de dos días`, d: `El de ${v.comprador || v.canal} entró hace ${diasDesde(v.fecha)} días y sigue en «${ESTADO_TXT[v.estado] || v.estado}». Si fue una prueba o ya no lo quieren, cancélalo desde Envíos.`, ir: 'env', txt: 'Ver los envíos' }); }

  return out.sort((a, b) => (b.crit ? 1 : 0) - (a.crit ? 1 : 0));
}
function pintaMejoras() {
  const out = reglas(), cont = $('#listMej'); cont.innerHTML = '';
  const hora = new Date().toLocaleTimeString('es-MX', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false });
  const crit = out.filter(h => h.crit).length;
  $('#mejResumen').textContent = out.length ? `${out.length} ${plural(out.length, 'hallazgo', 'hallazgos')}${crit ? ` · ${crit} ${plural(crit, 'urgente', 'urgentes')}` : ''} · calculado a las ${hora}` : `Nada que señalar · calculado a las ${hora}`;
  if (!out.length) return cont.appendChild(el(vacio('Al corriente.', 'Ninguna regla saltó: sin vencidas, sin ceros, sin cuentas chuecas, sin nadie esperando. Aprovéchalo, dura poco.')));
  out.forEach((h, i) => {
    const r = el(`<div class="hallazgo ${h.crit ? 'crit' : ''}"><span class="ico">${icono(h.crit ? 'alerta' : 'mej')}</span><div><b>${esc(h.t)}</b><small>${esc(h.d)}</small>
      <div class="pie-h">${h.crit ? '<span class="tag">Urgente</span>' : ''}<button class="link suave" type="button">${esc(h.txt)} →</button></div></div></div>`);
    r.querySelector('.link').onclick = () => irA(h.ir);
    cont.appendChild(r);
  });
}

/* ---- proveedores ----
   La etapa en la que estamos: elegir quién hace el Kit N°1. Cada proveedor avanza por
   etapas (por contactar → en plática → muestra → elegido), guarda su precio en fábrica y
   su costo ya puesto en Guadalajara, y la prueba de pelo de su muestra. La calculadora
   usa los supuestos de la tabla config (tipo de cambio, flete por kg, peso del kit). */
const ETAPAS = [['por_contactar', 'Por contactar'], ['contactado', 'Contactado'], ['cotizando', 'Cotizando'], ['muestra_pedida', 'Muestra pedida'], ['muestra_en_casa', 'Muestra en casa'], ['elegido', 'Elegido'], ['descartado', 'Descartado']];
const ETAPA_TXT = Object.fromEntries(ETAPAS);
const RANGO_ETAPA = Object.fromEntries(ETAPAS.map(([k], i) => [k, k === 'descartado' ? -1 : i]));
const SIG_ETAPA = { por_contactar: 'contactado', contactado: 'cotizando', cotizando: 'muestra_pedida', muestra_pedida: 'muestra_en_casa', muestra_en_casa: 'elegido' };
const BOTON_ETAPA = { contactado: 'Ya le escribimos', cotizando: 'Ya nos dio precio', muestra_pedida: 'Pedimos muestra', muestra_en_casa: 'Llegó la muestra', elegido: 'Elegir este' };
let filtroProv = 'curso', provEditando = null;
// Costo por set ya en Guadalajara: el que se guardó, o uno estimado con los supuestos de config.
function costoProv(p) {
  if (p.costo_puesto != null && Number(p.costo_puesto) > 0) return { v: Number(p.costo_puesto), estimado: false };
  if (p.precio_usd != null && Number(p.precio_usd) > 0) return { v: (Number(p.precio_usd) + CONF.importacion_flete_usd_kg * CONF.importacion_peso_kit_kg) * CONF.tipo_cambio * (1 + CONF.importacion_impuesto), estimado: true };
  return { v: null, estimado: false };
}
const skusDe = para => String(para || '').split(/[^A-Z0-9]+/).filter(x => productos.some(p => p.sku === x));
const nombresPara = para => { const k = skusDe(para); return k.length ? k.map(nombreCorto).join(' y ') : String(para || ''); };
function llenaParaProv() {
  const s = $('#pPara'); if (!s) return;
  const actual = s.value, primera = !s.children.length;
  s.innerHTML = productos.map(p => `<option value="${esc(p.sku)}">${esc(nombreCorto(p.sku))}</option>`).join('') + '<option value="">Varios u otro</option>';
  if (actual) s.value = actual; else if (primera && productos.some(p => p.sku === 'KIT1')) s.value = 'KIT1';
  const e = $('#pEtapa'); if (!e.children.length) e.innerHTML = ETAPAS.map(([k, t]) => `<option value="${k}">${t}</option>`).join('');
}
// "contacto" es texto libre: correos se vuelven mailto y números con WhatsApp se vuelven wa.me
function contactoHTML(c) {
  if (!c) return '';
  return esc(c).replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, m => `<a href="mailto:${m}">${m}</a>`)
    .replace(/(WhatsApp\s*)?(\+?\d[\d\s-]{8,}\d)(\s*\(WhatsApp\))?/gi, (m, a, num, b) => (a || b) ? `<a href="https://wa.me/${num.replace(/\D/g, '')}" target="_blank" rel="noopener">${m}</a>` : m);
}
async function cargarProveedores() {
  const { data } = await sb.from('proveedores').select('*').order('actualizado', { ascending: false });
  D.provs = data || [];
  $('#provs').innerHTML = D.provs.map(x => `<option value="${esc(x.nombre)}">`).join('');
  const sel = $('#cpProv'), v = sel.value;
  sel.innerHTML = '<option value="">Sin proveedor, solo calcular</option>' + D.provs.filter(p => p.etapa !== 'descartado').map(p => `<option value="${p.id}">${esc(p.nombre)}</option>`).join('');
  if (v && D.provs.some(p => String(p.id) === v)) sel.value = v;
  pintaProveedores(); recalcula();
}
function pintaProveedores() {
  const enCurso = ['contactado', 'cotizando'];
  const cuenta = [D.provs.filter(p => p.etapa === 'por_contactar').length, D.provs.filter(p => enCurso.includes(p.etapa)).length, D.provs.filter(p => p.etapa === 'muestra_pedida').length, D.provs.filter(p => p.etapa === 'muestra_en_casa').length, D.provs.filter(p => p.etapa === 'elegido').length];
  cuenta.forEach((n, i) => $('#rutaProv').children[i].querySelector('.v').textContent = n);
  // mosaico de Hoy
  const elegido = D.provs.find(p => p.etapa === 'elegido' && /KIT1/.test(p.para || ''));
  const platica = cuenta[1] + cuenta[2] + cuenta[3];
  $('#kProv').innerHTML = elegido ? `<span style="font-size:.7em">${esc(elegido.nombre.split(' (')[0])}</span><small class="txt">elegido</small>` : `${platica}<small class="txt">en plática</small>`;
  const activos = D.provs.filter(p => p.etapa !== 'descartado');
  $('#provResumen').textContent = elegido ? `Kit N°1: elegido ${elegido.nombre}. ${activos.length - 1} más en la lista.` : `${activos.length} ${plural(activos.length, 'proveedor', 'proveedores')} en la lista · ${platica} en plática · ${cuenta[3]} ${plural(cuenta[3], 'muestra', 'muestras')} en casa.`;
  const chips = $('#chipsProv'); chips.innerHTML = '';
  const kit = activos.filter(p => /KIT1/.test(p.para || ''));
  [['curso', `En la lista (${activos.length})`], ['kit', `Kit N°1 (${kit.length})`], ['descartados', `Descartados (${D.provs.length - activos.length})`], ['todos', `Todos (${D.provs.length})`]].forEach(([k, t]) => {
    const c = el(`<button class="chip ${filtroProv === k ? 'on' : ''}" type="button">${t}</button>`); c.onclick = () => { filtroProv = k; pintaProveedores(); }; chips.appendChild(c);
  });
  const lista = (filtroProv === 'kit' ? kit : filtroProv === 'descartados' ? D.provs.filter(p => p.etapa === 'descartado') : filtroProv === 'todos' ? D.provs.slice() : activos)
    .sort((a, b) => (RANGO_ETAPA[b.etapa] ?? 0) - (RANGO_ETAPA[a.etapa] ?? 0) || (costoProv(a).v ?? 1e9) - (costoProv(b).v ?? 1e9));
  const cont = $('#listProv'); cont.innerHTML = '';
  if (!lista.length) return cont.appendChild(el(vacio(filtroProv === 'descartados' ? 'Nadie descartado.' : 'Sin proveedores todavía.', 'Agrega el primero con el formulario de abajo: nombre, link y cómo contactarlo.')));
  lista.forEach(p => cont.appendChild(filaProv(p)));
}
function filaProv(p) {
  const c = costoProv(p), sku = skusDe(p.para)[0], prod = productos.find(x => x.sku === sku);
  let queda = '—', cls = '';
  if (c.v != null && prod?.precio) { const mg = prod.precio - c.v, pct = Math.round(mg / prod.precio * 100); queda = `${mg < 0 ? '−' : ''}${money(Math.abs(mg))} · ${pct}%<small>${mg < 0 ? `a ${money(prod.precio)} se pierde dinero` : `a ${money(prod.precio)}, antes de comisiones`}</small>`; cls = pct >= 50 ? 'bien' : pct >= 30 ? 'media' : 'bajo'; }
  const sig = SIG_ETAPA[p.etapa];
  const muestra = [];
  if (p.muestra_pedida) muestra.push(`Muestra pedida el ${fechaLarga(p.muestra_pedida)}${!p.muestra_llego ? ` (hace ${diasDesde(p.muestra_pedida)} ${plural(diasDesde(p.muestra_pedida), 'día', 'días')})` : ''}`);
  if (p.muestra_llego) muestra.push(`llegó el ${fechaLarga(p.muestra_llego)}`);
  if (p.prueba_pelos != null) muestra.push(`<span class="pill ${p.prueba_ok ? 'ok' : 'no'}">Prueba de pelo: ${String(p.prueba_pelos).replace('.', ',')} por brocha · ${p.prueba_ok ? 'pasa' : 'no pasa'}</span>`);
  const link = urlSegura(p.link);
  const r = el(`<div class="prov" data-etapa="${esc(p.etapa)}">
    <div class="cab-p"><div><div class="t">${esc(p.nombre)}</div><div class="s">${[p.origen, p.canal, p.para ? 'para ' + nombresPara(p.para) : ''].filter(Boolean).map(esc).join(' · ')}</div></div><span class="etapa">${ETAPA_TXT[p.etapa] || esc(p.etapa)}</span></div>
    <div class="cifras">
      <div><div class="l">Precio</div><div class="v">${p.precio_usd != null ? usd(p.precio_usd) + '<small>por set, en fábrica</small>' : p.precio_ref != null ? moneyC(p.precio_ref) + '<small>MXN, precio de lista</small>' : '—'}</div></div>
      <div><div class="l">Mínimo</div><div class="v">${p.minimo != null ? Number(p.minimo).toLocaleString('es-MX') + '<small>sets</small>' : '—'}</div></div>
      <div><div class="l">Puesto en GDL</div><div class="v">${c.v != null ? money(c.v) + `<small>${c.estimado ? 'estimado' : 'calculado'}</small>` : '—'}</div></div>
      <div><div class="l">Le queda a nixa</div><div class="v ${cls}">${queda}</div></div>
    </div>
    ${muestra.length ? `<div class="linea-m">${muestra.join(' · ')}</div>` : ''}
    ${p.contacto ? `<div class="contacto">${contactoHTML(p.contacto)}</div>` : ''}
    ${p.notas ? `<div class="notas hide">${esc(p.notas)}${p.prueba_nota ? '\n\nPrueba de pelo: ' + esc(p.prueba_nota) : ''}</div>` : ''}
    <div class="prueba hide"><div class="forma">
      <label class="campo"><span>Pelos sueltos por brocha</span><input type="number" inputmode="decimal" step="0.1" min="0" data-f="pelos" placeholder="promedio"></label>
      <label class="campo"><span>Resultado</span><select data-f="ok"><option value="auto">Que lo decida: pasa con 2 o menos</option><option value="si">Pasa</option><option value="no">No pasa</option></select></label>
      <label class="campo ancho"><span>Qué notaste</span><input data-f="nota" placeholder="Férula firme, suave en la piel, sin olor…"></label>
    </div><button class="btn ancho" type="button" data-a="guardaPrueba">Guardar prueba</button></div>
    <div class="acc">
      ${sig ? `<button class="link" type="button" data-a="avanza">${BOTON_ETAPA[sig]} →</button>` : ''}
      ${['muestra_en_casa', 'elegido'].includes(p.etapa) ? `<button class="link" type="button" data-a="prueba">${p.prueba_pelos == null ? 'Anotar prueba de pelo' : 'Cambiar la prueba'}</button>` : ''}
      <button class="link suave" type="button" data-a="calc">Calcular costo</button>
      ${p.notas ? '<button class="link suave" type="button" data-a="notas">Ver notas</button>' : ''}
      <button class="link suave" type="button" data-a="editar">Editar</button>
      ${link ? `<a class="link suave" href="${esc(link)}" target="_blank" rel="noopener">Abrir su página</a>` : ''}
      ${p.etapa !== 'descartado' ? '<button class="link peligro" type="button" data-a="descartar">Descartar</button>' : '<button class="link suave" type="button" data-a="reactivar">Volver a la lista</button>'}
    </div></div>`);
  const on = (a, f) => { const b = r.querySelector(`[data-a=${a}]`); if (b) b.onclick = f; };
  on('avanza', () => cambiaEtapa(p, sig));
  on('descartar', () => { if (confirm(`¿Descartar a ${p.nombre}?\n\nSe queda guardado en «Descartados» por si cambia algo.`)) cambiaEtapa(p, 'descartado'); });
  on('reactivar', () => cambiaEtapa(p, 'por_contactar'));
  on('notas', () => { const n = r.querySelector('.notas'); n.classList.toggle('hide'); r.querySelector('[data-a=notas]').textContent = n.classList.contains('hide') ? 'Ver notas' : 'Ocultar notas'; });
  on('editar', () => editaProv(p));
  on('calc', () => { $('#cpProv').value = String(p.id); llenaCalcDesde(p); $('#bloqueCalc').scrollIntoView({ behavior: 'smooth', block: 'start' }); });
  on('prueba', () => { const f = r.querySelector('.prueba'); f.classList.toggle('hide'); if (!f.classList.contains('hide')) { f.querySelector('[data-f=pelos]').value = p.prueba_pelos ?? ''; f.querySelector('[data-f=nota]').value = p.prueba_nota || ''; f.querySelector('[data-f=pelos]').focus(); } });
  on('guardaPrueba', async () => {
    const f = r.querySelector('.prueba'), pelos = parseFloat(f.querySelector('[data-f=pelos]').value);
    if (!Number.isFinite(pelos) || pelos < 0) return toast('Pon cuántos pelos soltó por brocha, en promedio');
    const sel = f.querySelector('[data-f=ok]').value, ok = sel === 'auto' ? pelos <= 2 : sel === 'si', nota = f.querySelector('[data-f=nota]').value.trim() || null;
    const { error } = await sb.from('proveedores').update({ prueba_pelos: pelos, prueba_ok: ok, prueba_nota: nota, actualizado: new Date().toISOString() }).eq('id', p.id);
    if (error) return toast('No se guardó: ' + error.message);
    await anota(`Prueba de pelo · ${p.nombre}: ${pelos} ${plural(pelos, 'pelo', 'pelos')} por brocha, ${ok ? 'pasa' : 'no pasa'}${nota ? '. ' + nota : ''}`);
    toast('Prueba guardada'); cargarProveedores(); cargarBitacora();
  });
  return r;
}
async function cambiaEtapa(p, nueva) {
  const cambios = { etapa: nueva, actualizado: new Date().toISOString() };
  if (nueva === 'muestra_pedida' && !p.muestra_pedida) cambios.muestra_pedida = hoyISO();
  if (nueva === 'muestra_en_casa' && !p.muestra_llego) cambios.muestra_llego = hoyISO();
  if (nueva === 'elegido' && !confirm(`¿Elegir a ${p.nombre}${p.para ? ' para ' + nombresPara(p.para) : ''}?`)) return;
  const { error } = await sb.from('proveedores').update(cambios).eq('id', p.id);
  if (error) return toast('No se guardó: ' + error.message);
  await anota(`Proveedores · ${p.nombre}: ${ETAPA_TXT[p.etapa] || p.etapa} → ${ETAPA_TXT[nueva]}`);
  toast(`${p.nombre.split(' (')[0]}: ${ETAPA_TXT[nueva].toLowerCase()}`);
  if (nueva === 'elegido') await ofreceCosto({ ...p, ...cambios });
  await cargarProveedores(); cargarBitacora();
  if (nueva === 'cotizando') { editaProv(D.provs.find(x => x.id === p.id) || p); $('#pUsd').focus({ preventScroll: true }); msg('#pmsg', 'Anota el precio que dio y su mínimo; con eso se calcula a cuánto nos sale puesto.'); }
  if (nueva === 'muestra_en_casa') toast('Cuando hagan la prueba de pelo, anótala en su tarjeta');
}
// Al elegir proveedor, su costo puesto se vuelve el costo del producto (si así lo quieren).
async function ofreceCosto(p) {
  const c = costoProv(p), sku = skusDe(p.para)[0], prod = productos.find(x => x.sku === sku);
  if (c.v == null || !prod) return;
  const nuevo = Math.round(c.v * 100) / 100;
  if (Math.abs(nuevo - Number(prod.costo || 0)) < 0.5) return;
  if (!confirm(`¿Usar ${moneyC(nuevo)} como costo del ${nombreCorto(sku)}?\n\nHoy dice ${moneyC(prod.costo)}.${c.estimado ? ' Ojo: es un estimado; cámbialo cuando tengan la cotización final.' : ''}`)) return;
  const { error } = await sb.from('productos').update({ costo: nuevo }).eq('sku', sku);
  if (error) return toast('No se actualizó el costo: ' + error.message);
  await anota(`Catálogo · el costo de ${nombreCorto(sku)} pasó de ${moneyC(prod.costo)} a ${moneyC(nuevo)} (proveedor elegido: ${p.nombre}).`);
  await cargarProductos();
}
/* formulario: agregar o editar */
const CAMPOS_PROV = { pNombre: 'nombre', pEtapa: 'etapa', pPara: 'para', pOrigen: 'origen', pCanal: 'canal', pLink: 'link', pContacto: 'contacto', pUsd: 'precio_usd', pMin: 'minimo', pPuesto: 'costo_puesto', pMPed: 'muestra_pedida', pMLleg: 'muestra_llego', pPelos: 'prueba_pelos', pNotas: 'notas' };
function limpiaProv() {
  provEditando = null;
  Object.keys(CAMPOS_PROV).forEach(id => { const e = $('#' + id); if (e.tagName !== 'SELECT') e.value = ''; });
  $('#pEtapa').value = 'por_contactar'; $('#pPara').value = 'KIT1'; $('#pOrigen').value = 'China'; $('#pCanal').value = 'Alibaba';
  $('#provFormTit').textContent = 'Agregar proveedor'; $('#provFormEti').textContent = 'nuevo';
  $('#btnProv').textContent = 'Guardar proveedor'; $('#btnProvCancelar').classList.add('hide'); msg('#pmsg', '');
}
function editaProv(p) {
  llenaParaProv(); provEditando = p;
  Object.entries(CAMPOS_PROV).forEach(([id, col]) => {
    const e = $('#' + id), v = p[col];
    if (e.tagName === 'SELECT' && v != null && v !== '' && ![...e.options].some(o => o.value === String(v))) e.appendChild(el(`<option value="${esc(v)}">${esc(v)}</option>`));
    e.value = v ?? (e.tagName === 'SELECT' ? e.options[0]?.value : '');
  });
  $('#provFormTit').textContent = p.nombre; $('#provFormEti').textContent = 'editando';
  $('#btnProv').textContent = 'Guardar cambios'; $('#btnProvCancelar').classList.remove('hide'); msg('#pmsg', '');
  $('#bloqueProv').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
$('#btnProvCancelar').onclick = limpiaProv;
$('#btnProv').onclick = async () => {
  const fila = {};
  Object.entries(CAMPOS_PROV).forEach(([id, col]) => { const v = $('#' + id).value.trim(); fila[col] = v === '' ? null : v; });
  if (!fila.nombre) return msg('#pmsg', 'Falta el nombre.', 'err');
  if (fila.link && !urlSegura(fila.link)) return msg('#pmsg', 'El link debe empezar con https://', 'err');
  for (const col of ['precio_usd', 'costo_puesto', 'prueba_pelos']) if (fila[col] != null) { fila[col] = parseFloat(fila[col]); if (!Number.isFinite(fila[col]) || fila[col] < 0) return msg('#pmsg', 'Revisa los números: no pueden ser negativos.', 'err'); }
  if (fila.minimo != null) fila.minimo = parseInt(fila.minimo, 10);
  if (fila.prueba_pelos != null && (!provEditando || provEditando.prueba_pelos !== fila.prueba_pelos)) fila.prueba_ok = fila.prueba_pelos <= 2;
  fila.etapa = fila.etapa || 'por_contactar'; fila.actualizado = new Date().toISOString();
  const b = $('#btnProv'); b.disabled = true;
  const { error } = provEditando ? await sb.from('proveedores').update(fila).eq('id', provEditando.id) : await sb.from('proveedores').insert(fila);
  b.disabled = false;
  if (error) return msg('#pmsg', 'No se guardó: ' + error.message, 'err');
  if (provEditando) {
    const cambio = ['etapa', 'precio_usd', 'minimo', 'costo_puesto'].filter(k => String(provEditando[k] ?? '') !== String(fila[k] ?? '')).map(k => ({ etapa: `etapa ${ETAPA_TXT[fila.etapa]}`, precio_usd: `precio ${fila.precio_usd != null ? usd(fila.precio_usd) : 'sin precio'}`, minimo: `mínimo ${fila.minimo ?? '—'}`, costo_puesto: `puesto ${fila.costo_puesto != null ? moneyC(fila.costo_puesto) : '—'}` }[k]));
    await anota(`Proveedores · ${fila.nombre}: editado${cambio.length ? ' (' + cambio.join(', ') + ')' : ''}`);
  } else await anota(`Proveedores · nuevo: ${fila.nombre}${fila.para ? ' para ' + nombresPara(fila.para) : ''}`);
  toast(provEditando ? 'Proveedor actualizado' : 'Proveedor agregado');
  limpiaProv(); cargarProveedores(); cargarBitacora();
};
/* calculadora: ¿a cuánto nos sale puesto en Guadalajara? */
function llenaCalcDesde(p) {
  if (p?.precio_usd != null) $('#cpFob').value = p.precio_usd;
  if (p?.minimo && !$('#cpSets').dataset.tocado) $('#cpSets').value = Math.max(Number(p.minimo), 100);
  calcProv();
}
function calcProv() {
  if (!$('#cpTc').value) $('#cpTc').value = CONF.tipo_cambio;
  const fob = parseFloat($('#cpFob').value || 0), sets = parseInt($('#cpSets').value || 0, 10), tc = parseFloat($('#cpTc').value || 0), imp = parseFloat($('#cpImp').value);
  const fleteDado = $('#cpFlete').value !== '', flete = fleteDado ? parseFloat($('#cpFlete').value || 0) : sets * CONF.importacion_peso_kit_kg * CONF.importacion_flete_usd_kg;
  const res = $('#cpRes'), canales = $('#cpCanales'), guarda = $('#cpGuardar');
  $('#cpNota').textContent = fleteDado ? '' : `El envío lo estimé en ${usd(flete)}: ${sets || 0} sets × ${CONF.importacion_peso_kit_kg} kg × ${usd(CONF.importacion_flete_usd_kg)} por kg. Si el proveedor te da el precio del envío, ponlo arriba.`;
  canales.innerHTML = '';
  if (!(fob > 0) || !(sets > 0) || !(tc > 0)) { res.classList.add('vacia'); $('#cpUnit').textContent = '—'; $('#cpTot').textContent = '—'; guarda.disabled = true; return null; }
  const total = (fob * sets + flete) * tc * (1 + imp), unit = total / sets;
  res.classList.remove('vacia'); $('#cpUnit').textContent = moneyC(unit); $('#cpTot').textContent = money(total);
  const p = D.provs.find(x => String(x.id) === $('#cpProv').value);
  const prod = productos.find(x => x.sku === (skusDe(p?.para)[0] || 'KIT1'));
  if (prod) {
    canales.appendChild(el(`<div class="sub" style="margin-top:12px"><h3 style="font-size:16px">Si vendemos el ${esc(nombreCorto(prod.sku))} a ${money(prod.precio)}</h3></div>`));
    ['TikTok Shop', 'Mercado Libre', 'En persona'].forEach(cn => {
      const { margen, pct } = margenCon(unit, prod.precio, cn);
      canales.appendChild(el(`<div class="prod"><div><div class="t">${cn}</div><div class="s">${cn === 'En persona' ? 'sin comisión' : 'después de su comisión'}</div></div><div class="der"><div class="mg ${claseMg(pct)}">nos quedan ${money(margen)} · ${pct}%</div></div></div>`));
    });
  }
  guarda.disabled = !p;
  guarda.textContent = p ? `Guardar ${moneyC(unit)} en ${p.nombre.split(' (')[0]}` : 'Elige un proveedor para guardar';
  return { fob, unit, p };
}
['#cpFob', '#cpSets', '#cpFlete', '#cpTc', '#cpImp'].forEach(s => $(s).addEventListener('input', calcProv));
$('#cpSets').addEventListener('input', () => $('#cpSets').dataset.tocado = '1');
$('#cpProv').addEventListener('change', () => { const p = D.provs.find(x => String(x.id) === $('#cpProv').value); if (p) llenaCalcDesde(p); else calcProv(); });
$('#cpGuardar').onclick = async () => {
  const r = calcProv(); if (!r?.p) return;
  const unit = Math.round(r.unit * 100) / 100;
  const { error } = await sb.from('proveedores').update({ precio_usd: r.fob, costo_puesto: unit, actualizado: new Date().toISOString() }).eq('id', r.p.id);
  if (error) return toast('No se guardó: ' + error.message);
  await anota(`Proveedores · ${r.p.nombre}: costo puesto ${moneyC(unit)} por set (fábrica ${usd(r.fob)}, ${$('#cpSets').value} sets, ${$('#cpImp').selectedOptions[0].text.split(':')[0].toLowerCase()}).`);
  toast('Costo guardado en el proveedor'); cargarProveedores(); cargarBitacora();
  if (r.p.etapa === 'elegido') ofreceCosto({ ...r.p, costo_puesto: unit });
};
$('#kProvBtn').onclick = () => irA('prov');

/* ---- bitácora ---- */
$('#btnBit').onclick = async () => {
  const texto = $('#btexto').value.trim(); if (!texto) return;
  await anota(texto);
  $('#btexto').value = ''; toast('Guardado'); cargarBitacora();
};
async function cargarBitacora() {
  const { data } = await sb.from('bitacora').select('*').order('fecha', { ascending: false }).limit(60);
  const cont = $('#listBit'); cont.innerHTML = '';
  if (!data?.length) return cont.appendChild(el(vacio('La bitácora está en blanco.', 'Manda una foto por Telegram y aquí aparece.')));
  let diaPrev = '';
  data.forEach(b => { const dia = fechaDia(b.fecha) + fechaMes(b.fecha), mismo = dia === diaPrev; diaPrev = dia;
    const r = el(`<div class="nota${mismo ? ' mismo' : ''}"><div class="cuando">${mismo ? '' : `<b>${fechaDia(b.fecha)}</b><span>${fechaMes(b.fecha)}</span>`}<i>${horaSola(b.fecha)}</i></div>
    <div>${b.foto_url ? `<img src="${esc(b.foto_url)}" alt="" loading="lazy">` : ''}
    <div class="txt">${esc(b.texto)}</div>
    <div class="firma">${esc(b.autor)}${b.origen && b.origen !== 'panel' ? ` · <span class="tg">${esc(b.origen)}</span>` : ''}</div></div></div>`);
    const foto = r.querySelector('img'); if (foto) foto.onclick = () => abreLightbox(b.foto_url);
    cont.appendChild(r); });
}

/* refresco suave al volver a la pestaña */
document.addEventListener('visibilitychange', () => { if (!document.hidden && YO) irA(vista); });
