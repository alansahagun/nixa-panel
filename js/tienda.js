/* =========================================================
   NIXA BEAUTY · tienda v7 · "El abanico"
   1) config  2) datos  3) utilidades  4) marca  5) abanico
   6) vitrina 7) ficha  8) bolsa y caja  9) ayudante
   10) movimiento  11) arranque
   ========================================================= */
(() => {
'use strict';

/* ---------- 1. CONFIG ---------- */
const SB_URL = "https://jjtlkneoxmgcyrifckdf.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqdGxrbmVveG1nY3lyaWZja2RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzNjQ0ODcsImV4cCI6MjEwMzk0MDQ4N30.Ty2qZduVwcIfWuVAzb-judCXVIIpyBq2_D3bE2GsY7g";

// ⚠️ PENDIENTE: número real de WhatsApp de NIXA. WhatsApp es soporte, no caja.
const WA = "523300000000";

// se sobreescriben con la tabla config del panel
let ENVIO = {gratis_desde:599, gdl:69, nacional:129};

const IMG = `${SB_URL}/storage/v1/object/public/panel/img`;
const OBJ = `${IMG}/obj`;
const FN_PAGO = `${SB_URL}/functions/v1/crear-pago`;

/* ---------- 2. DATOS ---------- */
const PIEZAS = {
  KIT1:{obj:"kit",            placa:"arena", ancho:"86%", giro:0,   dy:"-4%",  grande:true, foto:`${IMG}/kit-abanico.jpg`},
  SIS1:{obj:"abanico-brochas",placa:"rosa",  ancho:"58%", giro:0,   dy:"-10%", foto:`${IMG}/sistema-flatlay.jpg`},
  ESP4:{obj:"esponja",        placa:"hueso", ancho:"44%", giro:16,  dy:"-8%",  foto:`${IMG}/esponja-terracota.jpg`},
  LAV1:{obj:"brocha-polvo",   placa:"cafe",  ancho:"19%", giro:-12, dy:"-10%", foto:`${IMG}/brocha-pote.jpg`},
  RIZ1:{obj:"rizador",        placa:"noche", ancho:"62%", giro:6,   dy:"-8%",  foto:`${IMG}/swatches-terracota.jpg`}
};
const ORDEN = ["KIT1","SIS1","ESP4","LAV1","RIZ1"];
const NUM   = {KIT1:"01",SIS1:"02",ESP4:"03",LAV1:"04",RIZ1:"05"};

const COPY = {
  KIT1:{sello:"Empieza por aquí",
    desc:"Diez brochas numeradas, del polvo a las cejas, en un estuche rígido con dos esponjas de maquillaje y el mapa del rostro. Es la rutina completa: la piel primero, la mirada después, y ninguna brocha que se quede en el cajón.",
    incluye:["Diez brochas numeradas, del 01 al 10","Estuche rígido con cierre","Dos esponjas de maquillaje","El mapa del rostro impreso"],
    cuidado:"Agua tibia y jabón neutro, una vez a la semana. Se secan acostadas, con la cabeza fuera de la mesa, y quedan como el primer día."},
  SIS1:{sello:"Todo junto",
    desc:"La rutina completa: el kit de diez brochas, las esponjas de maquillaje, el tapete para lavarlas y el rizador. Es lo que regalamos nosotros cuando queremos quedar bien. {AHORRO}",
    incluye:["Kit N°1: diez brochas, estuche y dos esponjas","Esponjas de maquillaje, pack de 4","Tapete lavador de brochas","Rizador de pestañas"],
    cuidado:"Cada pieza trae su cuidado escrito. En resumen: agua tibia, jabón neutro y paciencia."},
  ESP4:{sello:"",
    desc:"Cuatro esponjas de maquillaje que se usan húmedas: crecen con el agua, no se beben la base y la dejan pareja, sin marcas ni rayas. Nosotros las cambiamos cada tres meses; por eso van de a cuatro, para que te duren el año.",
    incluye:["Cuatro esponjas de maquillaje","Se usan húmedas; crecen con el agua","Punta fina para ojeras y nariz; base plana para mejillas"],
    cuidado:"Se lavan con jabón neutro después de cada uso y se cambian cada tres meses. Por eso van de a cuatro."},
  LAV1:{sello:"",
    desc:"Tapete lavador de brochas, de silicón, que se pega al lavabo con ventosas. Es con el que lavamos las nuestras: agua tibia, jabón neutro, dos pasadas por los relieves, y la fibra suelta el rubor y la base sin maltratarse.",
    incluye:["Tapete de silicón con relieves de tres texturas","Ventosas que lo fijan al lavabo"],
    cuidado:"Se enjuaga y se deja secar. No se deforma ni guarda olor."},
  RIZ1:{sello:"Para conocernos",
    desc:"Rizador de pestañas de acero con almohadilla suave, y trae repuestos. Abre la mirada sin pellizcar: lo probamos en cada pedido antes de cerrarlo. Si quieres algo chico para conocernos, es este.",
    incluye:["Rizador de pestañas de acero","Almohadilla suave","Repuestos de almohadilla"],
    cuidado:"La almohadilla se cambia cuando se marca. Los repuestos vienen en la caja."}
};
const PROMESA = "Antes de enviar un set, probamos cada pieza con las manos. Si en sus primeros noventa días algo falla, nos escribes con una foto y te mandamos el reemplazo. Sin ticket, sin formulario.";

const ZONA = {"01":"rostro","02":"rostro","03":"mejillas","04":"parpado","05":"pomulo","06":"parpado","07":"cuenca","08":"ojeras","09":"pestanas","10":"cejas"};
const BROCHAS = [
  {n:"01",nom:"Polvo",         zona:"Rostro",   desc:"La grande y esponjosa. Sella el maquillaje con un velo de polvo, sin apelmazar ni apagar la piel.", tip:"sacude el exceso en el dorso de la mano antes de tocar la cara."},
  {n:"02",nom:"Base",          zona:"Rostro",   desc:"Plana y densa. Reparte la base en círculos hasta que no se vea dónde empieza ni dónde termina.", tip:"empieza por el centro de la cara y estira hacia afuera."},
  {n:"03",nom:"Rubor",         zona:"Mejillas", desc:"Redonda y suave. Toma poco producto y lo lleva de la mejilla hacia la sien, en diagonal.", tip:"sonríe para encontrar la manzana de la mejilla y suelta ahí."},
  {n:"04",nom:"Difuminar",     zona:"Párpado",  desc:"Pequeña y mullida. Borra los bordes de la sombra para que todo se lea como un solo tono.", tip:"muévela en ochos, sin producto nuevo, solo para fundir."},
  {n:"05",nom:"Contorno",      zona:"Pómulo",   desc:"Angulada. Marca el hueco debajo del pómulo y difumina hacia arriba, nunca hacia la boca.", tip:"si se ve la línea, te faltó difuminar, no te sobró producto."},
  {n:"06",nom:"Sombra",        zona:"Párpado",  desc:"La pala. Deposita el color en el párpado móvil con presión ligera y sin arrastrar.", tip:"toca y levanta; arrastrar es lo que borra el color."},
  {n:"07",nom:"Cuenca",        zona:"Ojo",      desc:"Lápiz cónico. Define la cuenca del ojo con un tono más oscuro y le da profundidad a la mirada.", tip:"mira al frente en el espejo para ver dónde cae tu pliegue real."},
  {n:"08",nom:"Corrector",     zona:"Ojeras",   desc:"Chica y plana. Coloca el corrector en ojeras, aletas de la nariz y comisuras, y lo asienta.", tip:"menos producto y más golpecitos: la ojera se marca por exceso."},
  {n:"09",nom:"Delinear",      zona:"Pestañas", desc:"Fina y angulada. Delinea pegado a la línea de las pestañas, con sombra o con gel.", tip:"apoya el meñique en la mejilla para que no te tiemble el pulso."},
  {n:"10",nom:"Cejas y pestañas",corto:"Cejas",zona:"Cejas",  desc:"El cepillo en espiral. Peina la ceja hacia arriba y separa las pestañas después del rímel.", tip:"péinala antes de rellenar: a veces ya no hace falta rellenar."}
];

const FAQ = [
  {c:"Pagos", q:"¿Cómo pago?", r:"Aquí mismo, en la página. Aceptamos tarjeta de crédito y débito, meses sin intereses, transferencia y pago en OXXO. El cobro lo procesa Mercado Pago en su pantalla segura: nosotros nunca vemos ni guardamos los datos de tu tarjeta."},
  {c:"Pagos", q:"¿Puedo pagar en efectivo al recibir?", r:"En Guadalajara sí, si nos lo pides por WhatsApp antes de cerrar el pedido. Fuera de la ciudad no, porque la paquetería no cobra por nosotros."},
  {c:"Pagos", q:"¿Dan factura?", r:"Sí. Escríbenos con tus datos fiscales el mismo día de la compra y te la mandamos por correo."},
  {c:"Envíos", q:"¿Cuánto tarda en llegar?", r:"En Guadalajara y su zona metropolitana, el mismo día si pides antes de las dos de la tarde. Al resto del país, de dos a cuatro días hábiles por paquetería, con guía para que lo rastrees."},
  {c:"Envíos", q:"¿Cuánto cuesta el envío?", r:"Gratis a partir de $599. Debajo de eso, $69 en Guadalajara y $129 al resto del país. El costo aparece antes de pagar, nunca después."},
  {c:"Envíos", q:"¿Puedo recoger?", r:"Todavía no tenemos local. Entregamos en mano en Guadalajara sin costo si tu pedido pasa de $599 y nos queda de paso; eso lo acordamos por WhatsApp."},
  {c:"Garantía", q:"¿Cómo funciona la garantía?", r:"Noventa días desde que te llega. Si una brocha suelta pelo, se afloja o raya, nos mandas una foto por WhatsApp y te enviamos el reemplazo. Sin ticket y sin devolver la vieja."},
  {c:"Garantía", q:"¿Y si no me gusta?", r:"Tienes treinta días para decirnos. Si la pieza está sin usar y en su caja, te devolvemos tu dinero completo. Si ya la usaste y no te convenció, cuéntanos por qué: casi siempre es que te tocaba otra pieza y eso lo arreglamos con un cambio."},
  {c:"Cuidado", q:"¿Cómo lavo las brochas?", r:"Agua tibia y jabón neutro, una vez a la semana. Dos pasadas por el tapete, enjuagas hasta que el agua salga clara y las secas acostadas con la cabeza fuera de la mesa. Así no se deforman ni le entra agua al mango."},
  {c:"Cuidado", q:"¿Cada cuánto se cambian?", r:"Una brocha bien lavada dura años. Las esponjas no: se cambian cada tres meses, por eso van de a cuatro."},
  {c:"Elegir", q:"¿Cuál me conviene si empiezo de cero?", r:"El Kit N°1. Trae las diez que de verdad se usan, con el número y la zona en el mango, y el mapa del rostro. Si quieres algo chico para conocernos, el rizador."},
  {c:"Elegir", q:"¿Son veganas?", r:"Sí. Todas las cerdas son sintéticas. Además de que nadie sale lastimado, la fibra sintética se lleva mejor con productos en crema y suelta menos pelo."}
];

const CINTA = ["Cada brocha sabe su lugar","Garantía de 90 días, sin ticket","Armado a mano en Guadalajara","Envío el mismo día en la ciudad","Pago seguro en la página"];

/* ---------- 3. UTILIDADES ---------- */
const $  = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const money = n => "$" + Number(n||0).toLocaleString("es-MX",{maximumFractionDigits:0});
function esc(s){ return (s ?? "").toString().replace(/[<>&"']/g, c => ({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;","'":"&#39;"}[c])); }
const sinMovimiento = matchMedia("(prefers-reduced-motion: reduce)").matches;
const conRaton = matchMedia("(pointer:fine)").matches;
const palomita = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10.5l4.5 4.5L17 5.5"/></svg>';

const guarda = {
  leer(k,d){ try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  escribir(k,v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};

let PROD = [];
let bolsa = guarda.leer("nixa.bolsa", {});
let hist  = guarda.leer("nixa.hist", []);
let sb = null;
try { sb = window.supabase?.createClient(SB_URL, SB_KEY); } catch {}

/* ---------- 4. MARCA ---------- */
Promise.all([`${IMG}/marca-v7.svg`,`${IMG}/brochas-v4.svg`].map(u => fetch(u).then(r => r.ok ? r.text() : "").catch(() => "")))
  .then(ts => { const s = $("#sprite"); s.innerHTML = ts.join("");
                s.hidden = false; s.style.cssText = "position:absolute;width:0;height:0;overflow:hidden"; });

$("#cinta").innerHTML = [...CINTA, ...CINTA].map(t =>
  `<span>${esc(t)}<svg viewBox="0 0 885.8 955.7" aria-hidden="true"><use href="#abanico"/></svg></span>`).join("");

/* el mapa del rostro: un dibujo, una zona encendida */
function rostro(zona, clase = "rostro-svg"){
  const on = z => z === zona ? "z on" : "z";
  return `<svg class="${clase}" viewBox="0 0 120 150" aria-hidden="true">
    <ellipse class="${on("rostro")}" cx="60" cy="72" rx="36" ry="46"/>
    <circle class="${on("mejillas")}" cx="38" cy="86" r="10"/><circle class="${on("mejillas")}" cx="82" cy="86" r="10"/>
    <ellipse class="${on("pomulo")}" cx="36" cy="82" rx="12" ry="5" transform="rotate(-28 36 82)"/><ellipse class="${on("pomulo")}" cx="84" cy="82" rx="12" ry="5" transform="rotate(28 84 82)"/>
    <ellipse class="${on("parpado")}" cx="44" cy="61" rx="10" ry="4"/><ellipse class="${on("parpado")}" cx="76" cy="61" rx="10" ry="4"/>
    <path class="${on("cuenca")}" d="M33 58 Q44 50 55 58 Q44 55 33 58Z"/><path class="${on("cuenca")}" d="M65 58 Q76 50 87 58 Q76 55 65 58Z"/>
    <path class="${on("ojeras")}" d="M34 68 Q44 76 54 68 Q44 72 34 68Z"/><path class="${on("ojeras")}" d="M66 68 Q76 76 86 68 Q76 72 66 68Z"/>
    <path class="${on("pestanas")}" d="M34 64 Q44 59 54 64 Q44 62 34 64Z"/><path class="${on("pestanas")}" d="M66 64 Q76 59 86 64 Q76 62 66 64Z"/>
    <path class="${on("cejas")}" d="M31 52 Q44 45 56 51 Q44 49 31 52Z"/><path class="${on("cejas")}" d="M64 51 Q76 45 89 52 Q76 49 64 51Z"/>
    <path class="l" d="M60 26 C82 26 96 46 96 72 C96 96 80 118 60 118 C40 118 24 96 24 72 C24 46 38 26 60 26Z"/>
    <path class="l" d="M46 118 L46 132 M74 118 L74 132 M30 146 Q60 132 90 146"/>
    <path class="l" d="M32 52 Q44 46 55 51 M65 51 Q76 46 88 52"/>
    <path class="l pest" d="M35 64 Q44 58 53 64 M67 64 Q76 58 85 64"/>
    <path class="l" d="M35 64 Q44 70 53 64 M67 64 Q76 70 85 64"/>
    <path class="l" d="M60 66 L58 86 Q60 90 64 88"/>
    <path class="l" d="M50 102 Q60 98 70 102 Q60 108 50 102Z"/>
  </svg>`;
}
const objHTML = (nombre, alt = "", extra = "") =>
  `<figure class="obj" ${extra}><span class="obj__flota"><span class="obj__in"><img class="sombra" src="${OBJ}/${nombre}-sombra.webp" alt=""><img src="${OBJ}/${nombre}.webp" alt="${esc(alt)}" loading="lazy"></span></span></figure>`;

/* =========================================================
   5. EL ABANICO
   Diez brochas en abanico. La activa se endereza y sube.
   Se maneja con clic, arrastre, flechas y el riel de números.
   Nada de pinear el scroll: la sección mide lo que mide.
   ========================================================= */
const APERTURA = 8.6;     // grados entre brocha y brocha
const MEDIO = 4.5;        // el abanico se queda centrado, como el isotipo
let abaI = 0, abaAbierto = false;

function pintaAbanico(){
  $("#abaFan").innerHTML = BROCHAS.map((b,i) =>
    `<button class="aba__b" type="button" data-i="${i}" tabindex="-1" aria-label="Brocha ${b.n}, ${esc(b.nom)}">
       <svg viewBox="0 0 80 240" aria-hidden="true"><use href="#b${b.n}"/></svg></button>`).join("");
  $("#abaRiel").innerHTML = BROCHAS.map((b,i) =>
    `<button type="button" role="tab" data-i="${i}" class="${i===0?"activo":""}" aria-selected="${i===0}">
       <i></i><b class="num">${b.n}</b><span>${esc(b.corto || b.nom)}</span></button>`).join("");

  $$(".aba__b").forEach(b => b.addEventListener("click", () => irABrocha(+b.dataset.i)));
  $$("#abaRiel button").forEach(b => b.addEventListener("click", () => irABrocha(+b.dataset.i)));
  $("#abaAnt").onclick = () => irABrocha(abaI - 1);
  $("#abaSig").onclick = () => irABrocha(abaI + 1);
  $("#abaAlKit").onclick = () => document.querySelector("#kit").scrollIntoView({behavior:sinMovimiento?"auto":"smooth", block:"start"});

  if (window.gsap) gsap.set(".aba__b", {xPercent:-50, transformOrigin:"50% 100%"});
  colocaAbanico(true);
  pintaFichaBrocha(true);

  // teclado
  $("#abaEsc").addEventListener("keydown", e => {
    if (e.key === "ArrowLeft"){ e.preventDefault(); irABrocha(abaI - 1); }
    if (e.key === "ArrowRight"){ e.preventDefault(); irABrocha(abaI + 1); }
  });
  arrastraAbanico();
  // red de seguridad: el abanico nunca se queda cerrado
  setTimeout(() => abreAbanico(), 2600);
  ["pointerdown","keydown"].forEach(ev => $("#abaEsc").addEventListener(ev, abreAbanico, {once:true}));
  if (sinMovimiento) abreAbanico();
}

/* El abanico no gira: conserva su forma. La brocha activa sube y se aclara. */
function poseDe(i){
  const ad = Math.abs(i - abaI), lim = Math.min(ad, 4);
  return {
    rotation: (i - MEDIO) * APERTURA,
    y:        ad ? 14 + lim * 5 : -14,
    scale:    ad ? 1 - lim * .035 : 1.07,
    opacity:  ad ? .72 - lim * .07 : 1
  };
}
function colocaAbanico(inmediato){
  const cerrado = !abaAbierto;
  $$(".aba__b").forEach((el,i) => {
    const ad = Math.abs(i - abaI);
    const abierta = poseDe(i);
    const est = cerrado
      ? {rotation:(i - MEDIO) * 1.4, y:44, scale:.92, opacity:0}
      : abierta;
    el.style.zIndex = 20 - ad;
    el.setAttribute("aria-current", ad === 0 ? "true" : "false");
    if (!window.gsap || sinMovimiento || inmediato && cerrado){
      el.style.transform = `translateX(-50%) rotate(${est.rotation}deg) translateY(${est.y}px) scale(${est.scale})`;
      el.style.opacity = est.opacity;
      return;
    }
    gsap.to(el, {...est, duration: inmediato ? 0 : .85, ease:"power3.out", overwrite:"auto"});
  });
}

function abreAbanico(){
  if (abaAbierto) return;
  abaAbierto = true;
  if (!window.gsap || sinMovimiento){ colocaAbanico(true); return; }
  $$(".aba__b").forEach((el,i) => {
    gsap.to(el, {...poseDe(i), duration:1.15, ease:"power3.out", delay: Math.abs(i - MEDIO) * .05});
  });
}

function pintaFichaBrocha(inmediato){
  const b = BROCHAS[abaI];
  $("#abaNum").textContent = b.n;
  $("#abaZona").textContent = b.zona;
  $("#abaNombre").textContent = b.nom;
  $("#abaDesc").textContent = b.desc;
  $("#abaTip").textContent = b.tip;
  $("#abaRostro").innerHTML = rostro(ZONA[b.n]);
  if (!inmediato && window.gsap && !sinMovimiento){
    gsap.fromTo("#abaZona, #abaNombre, #abaDesc, #abaTip",
      {y:14, opacity:0}, {y:0, opacity:1, duration:.6, ease:"power3.out", stagger:.05, overwrite:true});
    gsap.fromTo("#abaNum", {y:12}, {y:0, duration:.5, ease:"power2.out", overwrite:true});
  }
}

function irABrocha(i){
  i = Math.max(0, Math.min(BROCHAS.length - 1, i));
  if (i === abaI) return;
  abaI = i;
  $$("#abaRiel button").forEach(b => {
    const on = +b.dataset.i === i;
    b.classList.toggle("activo", on); b.setAttribute("aria-selected", on);
  });
  colocaAbanico(false);
  pintaFichaBrocha(false);
}

/* arrastrar el abanico como se abre un abanico de verdad */
function arrastraAbanico(){
  const esc = $("#abaEsc");
  let x0 = null, base = 0, movido = false;
  esc.addEventListener("pointerdown", e => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    x0 = e.clientX; base = abaI; movido = false;
    esc.setPointerCapture?.(e.pointerId);
  });
  esc.addEventListener("pointermove", e => {
    if (x0 === null) return;
    const dx = e.clientX - x0;
    if (Math.abs(dx) > 6) movido = true;
    const paso = Math.round(-dx / 46);
    const destino = Math.max(0, Math.min(BROCHAS.length - 1, base + paso));
    if (destino !== abaI) irABrocha(destino);
  });
  const suelta = e => { if (x0 !== null){ x0 = null; try{ esc.releasePointerCapture?.(e.pointerId); }catch{} } };
  esc.addEventListener("pointerup", suelta);
  esc.addEventListener("pointercancel", suelta);
  // que un arrastre no cuente como clic en una brocha
  esc.addEventListener("click", e => { if (movido){ e.stopPropagation(); e.preventDefault(); movido = false; } }, true);
}

/* ---------- 6. LA VITRINA ---------- */
function esqueleto(n = 5){
  return Array.from({length:n}, () => `<div class="esq" aria-hidden="true"><div class="esq__l" style="height:44px;width:60%"></div><div class="esq__l"></div></div>`).join("");
}
function ahorroSistema(){
  const sis = PROD.find(p => p.sku === "SIS1");
  if (!sis) return "";
  const sueltas = PROD.filter(p => p.sku !== "SIS1").reduce((a,p) => a + Number(p.precio), 0);
  return sueltas > sis.precio ? `Sale ${money(sueltas - sis.precio)} menos que comprar las piezas por separado.` : "";
}
const titulo = p => { const [tit, ...r] = p.nombre.split(" · "); return {tit, sub:r.join(" · ")}; };
const descDe = p => (COPY[p.sku]?.desc || "").replace("{AHORRO}", ahorroSistema()).trim();

function placa(p){
  const c = COPY[p.sku] || {}; const z = PIEZAS[p.sku] || PIEZAS.KIT1; const {tit, sub} = titulo(p);
  const sello = p.nuevo ? `<span class="sello sello--nuevo">Nuevo</span>` : (c.sello ? `<span class="sello">${esc(c.sello)}</span>` : "");
  return `<article class="placa placa-p placa--${z.placa}" data-sku="${esc(p.sku)}" ${z.grande ? 'data-grande' : ''}>
    <div class="placa__cab">
      <span class="placa__no num">N° ${NUM[p.sku] || "—"}</span>${sello}
    </div>
    <button class="placa__esc" type="button" data-ficha="${esc(p.sku)}" aria-label="Ver ${esc(tit)}">
      ${objHTML(z.obj, tit, `style="--ancho:${z.ancho};--giro:${z.giro}deg;--dy:${z.dy||"0%"}"`)}
    </button>
    <div class="placa__txt">
      <div>
        <h3><button type="button" data-ficha="${esc(p.sku)}">${esc(tit)}</button></h3>
        ${sub ? `<p class="sub">${esc(sub)}</p>` : ""}
        <span class="precio">${money(p.precio)}<span>MXN</span></span>
      </div>
      <button class="mas" type="button" data-sku="${esc(p.sku)}" aria-label="Agregar ${esc(tit)} a la bolsa">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.5v13M1.5 8h13"/></svg></button>
    </div>
  </article>`;
}

async function cargar(){
  const lista = $("#placas");
  lista.innerHTML = esqueleto();
  let data = null, error = null, cfg = null;
  try {
    if (!sb) throw new Error("sin cliente");
    const r = await Promise.all([
      sb.from("productos").select("*").eq("activo", true).order("precio",{ascending:false}),
      sb.from("config").select("clave,valor").in("clave",["envio_gratis_desde","envio_gdl","envio_nacional"])
    ]);
    data = r[0].data; error = r[0].error; cfg = r[1].data;
  } catch (e) { error = e; }

  if (cfg) cfg.forEach(({clave,valor}) => {
    const n = Number(valor);
    if (!Number.isFinite(n)) return;
    if (clave === "envio_gratis_desde") ENVIO.gratis_desde = n;
    if (clave === "envio_gdl") ENVIO.gdl = n;
    if (clave === "envio_nacional") ENVIO.nacional = n;
  });

  lista.setAttribute("aria-busy","false");
  if (error || !data || !data.length){
    lista.innerHTML = `<p class="vacio">No pudimos cargar la colección en este momento.
      <br><a class="link" style="margin-top:14px" href="https://wa.me/${WA}" target="_blank" rel="noopener">Escríbenos por WhatsApp</a></p>`;
    return;
  }
  PROD = data;
  const pos = s => { const i = ORDEN.indexOf(s); return i < 0 ? 99 : i; };
  lista.innerHTML = [...PROD].sort((a,b) => pos(a.sku) - pos(b.sku)).map(placa).join("");

  $$(".mas[data-sku]").forEach(b => b.onclick = () => agrega(b.dataset.sku, b));
  $$("[data-ficha]").forEach(b => b.onclick = () => abreFicha(b.dataset.ficha));
  inclinaPlacas();

  const kit = PROD.find(p => p.sku === "KIT1");
  if (kit){
    ["#precioKit","#precioHero","#precioBarra"].forEach(s => { const el = $(s); if (el) el.textContent = money(kit.precio); });
  }
  pintaOtraVez();
  pinta();
  revela(lista);
  if (window.gsap && !sinMovimiento){
    gsap.from(".placa-p", {y:40, opacity:0, duration:1, ease:"power3.out", stagger:.08, scrollTrigger:{trigger:lista, start:"top 82%", once:true}});
  }
}

/* recompra rápida para quien ya nos compró */
function pintaOtraVez(){
  const caja = $("#otraVez");
  const skus = hist.filter(s => PROD.some(p => p.sku === s)).slice(0, 3);
  if (!skus.length){ caja.hidden = true; return; }
  caja.hidden = false;
  $("#otraVezFila").innerHTML = skus.map(sku => {
    const p = PROD.find(x => x.sku === sku); const {tit} = titulo(p);
    const z = PIEZAS[sku] || PIEZAS.KIT1;
    return `<div class="ov">
      <span class="ov__lam"><img src="${OBJ}/${z.obj}.webp" alt="" loading="lazy"></span>
      <div><b>${esc(tit)}</b><small>${money(p.precio)} · lo pediste antes</small></div>
      <button class="mas" type="button" data-sku="${esc(sku)}" aria-label="Volver a pedir ${esc(tit)}">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.5v13M1.5 8h13"/></svg></button>
    </div>`;
  }).join("");
  $$("#otraVezFila .mas").forEach(b => b.onclick = () => agrega(b.dataset.sku, b));
  $("#olvidaHist").onclick = () => { hist = []; guarda.escribir("nixa.hist", hist); caja.hidden = true; };
}

function inclinaPlacas(){
  if (!conRaton || sinMovimiento || !window.gsap) return;
  $$(".placa-p").forEach(pl => {
    const obj = pl.querySelector(".obj");
    const rx = gsap.quickTo(pl, "rotationX", {duration:.7, ease:"power3"}), ry = gsap.quickTo(pl, "rotationY", {duration:.7, ease:"power3"});
    const ox = gsap.quickTo(obj, "x", {duration:.9, ease:"power3"}), oy = gsap.quickTo(obj, "y", {duration:.9, ease:"power3"});
    gsap.set(pl, {transformPerspective:1100});
    pl.addEventListener("pointermove", e => {
      const r = pl.getBoundingClientRect(); const px = (e.clientX - r.left)/r.width - .5, py = (e.clientY - r.top)/r.height - .5;
      rx(-py * 5); ry(px * 6); ox(px * 16); oy(py * 12);
    });
    pl.addEventListener("pointerleave", () => { rx(0); ry(0); ox(0); oy(0); });
  });
}

/* ---------- 7. FICHA ---------- */
function abreFicha(sku){
  const p = PROD.find(x => x.sku === sku); if (!p) return;
  const c = COPY[sku] || {incluye:[], cuidado:""};
  const z = PIEZAS[sku] || PIEZAS.KIT1;
  const {tit, sub} = titulo(p);
  const waTxt = encodeURIComponent(`Hola NIXA, tengo una duda sobre ${p.nombre}.`);

  $("#cuerpoModal").innerHTML = `
  <div class="f-grid">
    <div class="f-escena">
      <div class="placa placa--${z.placa}">
        ${objHTML(z.obj, tit, `style="--ancho:${z.ancho};--giro:${z.giro}deg"`)}
        <span class="fig placa__fig">Fig. ${NUM[sku] || "01"} · ${esc(tit)}</span>
      </div>
    </div>
    <div class="f-info">
      <span class="ced ced--linea">${esc(c.sello || sub || "NIXA BEAUTY")}</span>
      <h2 id="tituloModal">${esc(tit)}</h2>
      <div class="f-precio">
        <span class="v">${money(p.precio)}</span>
        <span class="ced">MXN · Envío gratis desde ${money(ENVIO.gratis_desde)}</span>
      </div>
      <p class="f-desc">${esc(descDe(p))}</p>
      <div class="f-acciones">
        <button class="btn" type="button" id="agregaFicha">Agregar a la bolsa
          <svg class="flecha" viewBox="0 0 13 9" aria-hidden="true"><path d="M0 4.5h11M8 1l3.5 3.5L8 8"/></svg></button>
        <a class="btn btn--linea" href="https://wa.me/${WA}?text=${waTxt}" target="_blank" rel="noopener">Preguntar por WhatsApp</a>
      </div>
      <ul class="confia">
        <li>${palomita}<span><b>Envío gratis</b> desde ${money(ENVIO.gratis_desde)}. En Guadalajara, el mismo día.</span></li>
        <li>${palomita}<span><b>90 días de garantía.</b> Si falla, te mandamos el reemplazo sin ticket.</span></li>
        <li>${palomita}<span><b>Pago seguro.</b> Tarjeta, meses sin intereses, OXXO o transferencia.</span></li>
      </ul>
    </div>
  </div>
  <div class="f-bloques">
    <div><figure class="foto"><img src="${esc(z.foto)}" alt="" loading="lazy"></figure>
      <h4>Qué incluye</h4>
      <ul>${(c.incluye||[]).map(i => `<li>${palomita}${esc(i)}</li>`).join("")}</ul></div>
    <div><figure class="foto"><img src="${IMG}/brocha-polvo.jpg" alt="" loading="lazy" style="object-position:50% 50%"></figure>
      <h4>Cómo se cuida</h4><p>${esc(c.cuidado||"")}</p></div>
    <div><figure class="foto"><img src="${IMG}/manos-brocha.jpg" alt="" loading="lazy" style="object-position:50% 40%"></figure>
      <h4>La promesa NIXA</h4><p>${esc(PROMESA)}</p></div>
    ${(sku==="KIT1"||sku==="SIS1") ? `<div class="diez"><h4>Las diez brochas</h4><ol>${
      BROCHAS.map(b => `<li><span class="n">${b.n}</span><b>${esc(b.nom)}</b><small>${esc(b.zona)}</small></li>`).join("")
    }</ol></div>` : ""}
  </div>`;

  $("#agregaFicha").onclick = () => agrega(sku, $("#agregaFicha"));
  abreCapa($("#modal"));
  $("#modal").scrollTop = 0;
  $("#cerrarModal").focus({preventScroll:true});
}
const cierraFicha = () => cierraCapa($("#modal"));

/* ---------- 8. BOLSA Y CAJA ---------- */
let paso = 1;

function agrega(sku, boton){
  bolsa[sku] = (bolsa[sku] || 0) + 1;
  guarda.escribir("nixa.bolsa", bolsa);
  pinta();
  if (boton && !sinMovimiento && window.gsap) gsap.fromTo($("#nBolsa"), {scale:1.5}, {scale:1, duration:.45, ease:"back.out(3)"});
  vePaso(1);
  abreBolsa();
}

const subtotal = () => Object.entries(bolsa).reduce((a,[sku,q]) => {
  const p = PROD.find(x => x.sku === sku); return a + (p ? p.precio * q : 0); }, 0);

function costoEnvio(){
  const t = subtotal();
  if (!t) return {costo:0, etiqueta:"", nota:""};
  if (t >= ENVIO.gratis_desde) return {costo:0, etiqueta:"Envío gratis", nota:"Por pasar de " + money(ENVIO.gratis_desde)};
  const cp = ($("#cp")?.value || "").replace(/\D/g,"");
  const gdl = /^(44|45)/.test(cp);
  return gdl
    ? {costo:ENVIO.gdl, etiqueta:"Guadalajara, mismo día", nota:"Si pides antes de las 2 de la tarde"}
    : {costo:ENVIO.nacional, etiqueta:"Todo México, 2 a 4 días", nota:"Por paquetería, con guía para rastrear"};
}

function pinta(){
  const n = Object.values(bolsa).reduce((a,b) => a+b, 0);
  const chip = $("#nBolsa");
  chip.textContent = n;
  chip.dataset.lleno = n > 0 ? "1" : "0";

  let t = 0;
  const filas = Object.entries(bolsa).map(([sku,q]) => {
    const p = PROD.find(x => x.sku === sku); if (!p) return "";
    t += p.precio * q;
    const {tit, sub} = titulo(p);
    const o = (PIEZAS[sku]||PIEZAS.KIT1).obj;
    return `<div class="item" style="--i:${Object.keys(bolsa).indexOf(sku)}">
      <span class="item__mini"><img src="${OBJ}/${o}.webp" alt="" loading="lazy"></span>
      <div>
        <p class="item__nom">${esc(tit)}${sub?`<small>${esc(sub)}</small>`:""}</p>
        <span class="cant">
          <button type="button" data-menos="${esc(sku)}" aria-label="Quitar uno de ${esc(tit)}">−</button>
          <span>${q}</span>
          <button type="button" data-mas="${esc(sku)}" aria-label="Agregar uno de ${esc(tit)}">+</button>
        </span>
      </div>
      <div class="item__der">
        <p class="item__imp">${money(p.precio*q)}</p>
        <button class="item__x" type="button" data-quita="${esc(sku)}">Quitar</button>
      </div>
    </div>`;
  }).join("");

  $("#items").innerHTML = filas ||
    `<p class="vacio" style="text-align:left;padding:26px 0 6px">Tu bolsa está vacía.
     Si no sabes por dónde empezar, el Kit N°1 es buen lugar.</p>`;
  $("#total").textContent = money(t);
  $("#aPaso2").disabled = t === 0;
  $("#aPaso2").style.opacity = t === 0 ? .45 : 1;

  const barra = $("#envioBarra");
  if (t > 0){
    barra.hidden = false;
    const falta = ENVIO.gratis_desde - t;
    $("#envioTexto").innerHTML = falta > 0
      ? `Te faltan <b>${money(falta)}</b> para el envío gratis.`
      : `<b>Ya tienes envío gratis.</b> Lo armamos hoy mismo.`;
    $("#envioRiel").style.width = Math.min(100, (t/ENVIO.gratis_desde)*100) + "%";
  } else barra.hidden = true;

  $$("[data-quita]").forEach(b => b.onclick = () => { delete bolsa[b.dataset.quita]; guarda.escribir("nixa.bolsa", bolsa); pinta(); });
  $$("[data-mas]").forEach(b => b.onclick = () => { bolsa[b.dataset.mas]++; guarda.escribir("nixa.bolsa", bolsa); pinta(); });
  $$("[data-menos]").forEach(b => b.onclick = () => {
    const k = b.dataset.menos; bolsa[k]--; if (bolsa[k] < 1) delete bolsa[k];
    guarda.escribir("nixa.bolsa", bolsa); pinta();
  });
  if (paso >= 2) pintaEnvio();
  if (paso === 3) pintaResumen();
}

function vePaso(p){
  paso = p;
  $$(".caja__paso").forEach(s => s.hidden = +s.dataset.paso !== p);
  $$("#cajaPasos li").forEach(li => {
    const k = +li.dataset.p;
    li.classList.toggle("activo", k === p);
    li.classList.toggle("hecho", k < p);
  });
  $("#tituloBolsa").textContent = p === 1 ? "Tu bolsa" : p === 2 ? "Tu entrega" : "Tu pago";
  $("#cajaCed").textContent = p === 1 ? "Lo que llevas" : p === 2 ? "A dónde lo mandamos" : "Último paso";
  const cuerpo = $(".bolsa__cuerpo"); if (cuerpo) cuerpo.scrollTop = 0;
  if (p >= 2) pintaEnvio();
  if (p === 3) pintaResumen();
}

function pintaEnvio(){
  const e = costoEnvio();
  if (!e.etiqueta){ $("#envioOp").innerHTML = ""; return; }
  $("#envioOp").innerHTML = `<span class="envio-op__t">Envío</span>
    <div class="eo ${e.costo ? "" : "gratis"}">
      <div><b>${esc(e.etiqueta)}</b><small>${esc(e.nota)}</small></div>
      <span class="v">${e.costo ? money(e.costo) : "Gratis"}</span>
    </div>`;
}

function pintaResumen(){
  const t = subtotal(), e = costoEnvio(), tot = t + e.costo;
  const lineas = Object.entries(bolsa).map(([sku,q]) => {
    const p = PROD.find(x => x.sku === sku); if (!p) return "";
    return `<div class="resumen__r"><span>${q} × ${esc(titulo(p).tit)}</span><b>${money(p.precio*q)}</b></div>`;
  }).join("");
  $("#resumen").innerHTML = lineas +
    `<div class="resumen__r"><span>${esc(e.etiqueta || "Envío")}</span><b>${e.costo ? money(e.costo) : "Gratis"}</b></div>
     <div class="resumen__r resumen__r--tot"><span>Total</span><b>${money(tot)}</b></div>
     <div class="resumen__dir"><b>${esc($("#nom").value.trim())}</b>${esc($("#dir").value.trim())}${
        $("#cp").value ? " · CP " + esc($("#cp").value.trim()) : ""}<br>${esc($("#tel").value.trim())}</div>`;
  $("#pagarTotal").textContent = money(tot);
}

/* capas */
let devuelveFoco = null;
function abreCapa(el, clase = "abierto"){
  devuelveFoco = document.activeElement;
  el.classList.add(clase);
  el.setAttribute("aria-hidden","false");
  document.body.style.overflow = "hidden";
  if (window.__lenis) window.__lenis.stop();
}
function cierraCapa(el, clase = "abierto"){
  el.classList.remove(clase);
  el.setAttribute("aria-hidden","true");
  if (!$(".bolsa.abierta") && !$(".modal.abierto") && !$(".hoja-tel.abierta")){ document.body.style.overflow = ""; if (window.__lenis) window.__lenis.start(); }
  if (devuelveFoco) { try { devuelveFoco.focus({preventScroll:true}); } catch {} }
}
function abreBolsa(){
  pinta();
  $("#telon").classList.add("abierto");
  abreCapa($("#bolsa"), "abierta");
  $("#cerrarBolsa").focus({preventScroll:true});
}
function cierraBolsa(){
  $("#telon").classList.remove("abierto");
  cierraCapa($("#bolsa"), "abierta");
}

/* validación amable */
function valida(){
  let ok = true;
  const v = id => $("#"+id).value.trim();
  const marca = (campo, mal) => { $(campo).classList.toggle("mal", mal); if (mal) ok = false; };
  marca("#cNom", !v("nom"));
  marca("#cTel", v("tel").replace(/\D/g,"").length !== 10);
  marca("#cCp",  v("cp").replace(/\D/g,"").length !== 5);
  marca("#cMail", !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v("mail")));
  marca("#cDir", v("dir").length < 8);
  return ok ? {nom:v("nom"), tel:v("tel").replace(/\D/g,""), cp:v("cp").replace(/\D/g,""), mail:v("mail"), dir:v("dir")} : null;
}

async function pagar(){
  const msj = $("#msjPedido");
  const items = Object.entries(bolsa);
  if (!items.length){ msj.className = "msj mal"; msj.textContent = "Tu bolsa está vacía."; return; }
  const d = valida();
  if (!d){ vePaso(2); msj.textContent = ""; $(".campo.mal input, .campo.mal textarea")?.focus(); return; }

  const e = costoEnvio();
  const lineas = items.map(([sku,q]) => {
    const p = PROD.find(x => x.sku === sku);
    return {sku, titulo:p.nombre, precio:Number(p.precio), cantidad:q};
  });
  const total = subtotal() + e.costo;

  $("#pagar").disabled = true;
  msj.className = "msj"; msj.textContent = "Preparando tu pago…";

  // 1. queda registrado antes de mandarte a pagar
  let pedidoId = null;
  try {
    const {data} = await sb.from("pedidos").insert({
      canal:"Tienda NIXA", comprador:d.nom,
      sku:items.map(i => i[0]).join("+"),
      cantidad:items.reduce((a,b) => a + b[1], 0),
      total, estado:"pendiente_pago",
      datos:{telefono:d.tel, correo:d.mail, direccion:d.dir, cp:d.cp,
             envio:{costo:e.costo, etiqueta:e.etiqueta}, items:Object.fromEntries(items)}
    }).select("id").single();
    pedidoId = data?.id ?? null;
    hist = [...new Set([...items.map(i => i[0]), ...hist])].slice(0, 6);
    guarda.escribir("nixa.hist", hist);
  } catch {}

  // 2. Mercado Pago arma la pantalla de cobro
  try {
    const r = await fetch(FN_PAGO, {
      method:"POST",
      headers:{"Content-Type":"application/json", apikey:SB_KEY, Authorization:`Bearer ${SB_KEY}`},
      body: JSON.stringify({pedido_id:pedidoId, items:lineas, envio:e.costo,
        comprador:{nombre:d.nom, correo:d.mail, telefono:d.tel, cp:d.cp, direccion:d.dir},
        origen: location.origin + location.pathname})
    });
    const j = await r.json().catch(() => ({}));
    if (j.init_point){
      guarda.escribir("nixa.pendiente", {id:pedidoId, total});
      location.href = j.init_point;
      return;
    }
    throw new Error(j.error || "sin respuesta");
  } catch (err) {
    $("#pagar").disabled = false;
    msj.className = "msj mal";
    msj.innerHTML = `No pudimos abrir el pago en línea en este momento. Tu pedido quedó apartado${pedidoId ? " con el folio " + pedidoId : ""}.
      <a class="link" style="margin-top:10px" href="https://wa.me/${WA}?text=${encodeURIComponent(
        `Hola NIXA, quiero cerrar mi pedido${pedidoId ? " (folio " + pedidoId + ")" : ""} de ${money(total)}. No me abrió el pago en la página.`)}"
        target="_blank" rel="noopener">Ciérralo por WhatsApp</a>`;
  }
}

/* vuelta de Mercado Pago */
function revisaVuelta(){
  const q = new URLSearchParams(location.search);
  const estado = q.get("pago");
  if (!estado) return;
  const pend = guarda.leer("nixa.pendiente", null);
  if (estado === "exito"){
    bolsa = {}; guarda.escribir("nixa.bolsa", bolsa);
    try { localStorage.removeItem("nixa.pendiente"); } catch {}
    abreCapa($("#ayuda"), "abierta");
    $("#pasoAyuda").textContent = "Listo";
    $("#cuerpoAyuda").innerHTML = `<div class="reco">
      <h3 id="tituloAyuda">Gracias. Ya es tuyo.</h3>
      <p class="razon">Tu pago se registró${pend?.id ? " con el folio " + pend.id : ""}. Te llega el comprobante por correo y te escribimos por WhatsApp en cuanto salga el paquete.</p>
      <div style="margin-top:20px"><button class="btn btn--ancho" type="button" id="otraVez">Seguir viendo</button></div></div>`;
    $("#otraVez").onclick = () => { cierraAyuda(); limpiaUrl(); };
  } else {
    abreCapa($("#ayuda"), "abierta");
    $("#pasoAyuda").textContent = "El pago no se completó";
    $("#cuerpoAyuda").innerHTML = `<div class="reco">
      <h3 id="tituloAyuda">No se completó el pago.</h3>
      <p class="razon">Tu bolsa sigue como la dejaste, no se cobró nada. Puedes intentar otra vez o escribirnos y lo cerramos contigo.</p>
      <div style="display:grid;gap:11px;margin-top:22px">
        <button class="btn btn--ancho" type="button" id="otraVez">Intentar de nuevo</button>
        <a class="btn btn--linea btn--ancho" href="https://wa.me/${WA}" target="_blank" rel="noopener">Escribirnos</a>
      </div></div>`;
    $("#otraVez").onclick = () => { cierraAyuda(); limpiaUrl(); vePaso(3); abreBolsa(); };
  }
  pinta();
}
const limpiaUrl = () => history.replaceState({}, "", location.pathname);

/* ---------- 9. AYUDANTE ---------- */
const PREG = [
  {q:"¿Empiezas de cero o ya tienes brochas?", nota:"Con esto sabemos si te conviene el kit o una pieza suelta.",
   o:[["cero","Empiezo de cero"],["tengo","Ya tengo brochas"],["chico","Quiero algo chico para probar"]]},
  {q:"¿Te maquillas diario o para salir?", nota:"Si es regalo, piensa en quien lo va a usar.",
   o:[["diario","Diario, o casi"],["salir","Para salir"]]},
  {q:"¿Es para ti o de regalo?", nota:"",
   o:[["mi","Para mí"],["regalo","De regalo"],["todo","Lo quiero todo"]]}
];
let resp = [];

function recomienda([inicio, uso, quien]){
  if (quien === "regalo") return {sku:"SIS1", razon:"Para regalar, la rutina completa: no falta nada, del polvo a las pestañas, y sale más barato que las piezas por separado."};
  if (quien === "todo")   return {sku:"SIS1", razon:"Si lo quieres todo, junto sale más barato. Es lo que regalamos nosotros cuando queremos quedar bien."};
  if (inicio === "chico") return {sku:"RIZ1", razon:"Para probar sin gastar mucho, el rizador: abre la mirada sin pellizcar. Si te gusta cómo hacemos las cosas, después vienes por el kit."};
  if (inicio === "cero")  return {sku:"KIT1", razon: uso === "diario"
    ? "Empiezas de cero y te maquillas diario: con el Kit N°1 tienes las diez que se usan, de la base a las cejas, y ninguna que sobre."
    : "Empiezas de cero: el Kit N°1 trae las diez que se usan, con el número y el oficio en el mango para no adivinar."};
  if (uso === "diario")   return {sku:"ESP4", razon:"Ya tienes brochas y te maquillas diario: lo que se gasta son las esponjas. Cuatro te duran el año y la base queda sin marcas."};
  return {sku:"LAV1", razon:"Ya tienes brochas; lo que las acaba es lavarlas mal. Con el tapete sueltan el producto sin maltratarse y te duran años."};
}

function pintaAyuda(){
  const c = $("#cuerpoAyuda"), i = resp.length;
  if (i < PREG.length){
    const q = PREG[i];
    $("#pasoAyuda").textContent = `Pregunta ${i+1} de ${PREG.length}`;
    c.innerHTML = `<h3 id="tituloAyuda">${q.q}</h3>
      ${q.nota ? `<p class="nota">${q.nota}</p>` : ""}
      <div class="opcs">${q.o.map(([v,t],k) => `<button class="opc" type="button" data-v="${v}" style="--i:${k}">${t}</button>`).join("")}</div>
      ${i ? '<button class="link" type="button" id="atras" style="margin-top:18px">Pregunta anterior</button>' : ""}`;
    c.querySelectorAll(".opc").forEach(b => b.onclick = () => { resp.push(b.dataset.v); pintaAyuda(); });
    const a = $("#atras"); if (a) a.onclick = () => { resp.pop(); pintaAyuda(); };
    c.querySelector(".opc")?.focus({preventScroll:true});
    return;
  }
  const {sku, razon} = recomienda(resp);
  const p = PROD.find(x => x.sku === sku);
  $("#pasoAyuda").textContent = "Nuestra recomendación";
  const waTxt = encodeURIComponent(p ? `Hola NIXA, me recomendaron ${p.nombre} y tengo una duda.` : "Hola NIXA, ayúdenme a elegir.");
  if (!p){
    c.innerHTML = `<div class="reco"><h3 id="tituloAyuda">Casi.</h3>
      <p class="razon">Todavía no carga la colección. Escríbenos y te decimos en el momento.</p>
      <div style="margin-top:20px"><a class="btn btn--ancho" href="https://wa.me/${WA}?text=${waTxt}" target="_blank" rel="noopener">Preguntarnos por WhatsApp</a></div>
      <button class="link" type="button" id="otraVez" style="margin-top:18px">Empezar de nuevo</button></div>`;
  } else {
    const {tit, sub} = titulo(p);
    const o = (PIEZAS[sku]||PIEZAS.KIT1).obj;
    c.innerHTML = `<div class="reco">
      <span class="ced">Nosotros te diríamos</span>
      <h3 id="tituloAyuda">Empieza por aquí.</h3>
      <div class="reco__prod">
        <span class="lam"><img src="${OBJ}/${o}.webp" alt="" loading="lazy"></span>
        <b>${esc(tit)}${sub?`<small>${esc(sub)}</small>`:""}</b>
        <span class="precio">${money(p.precio)}</span>
      </div>
      <p class="razon">${esc(razon)}</p>
      <div style="display:grid;gap:11px;margin-top:22px">
        <button class="btn btn--ancho" type="button" id="agregaReco">Agregarlo a la bolsa</button>
        <a class="btn btn--linea btn--ancho" href="https://wa.me/${WA}?text=${waTxt}" target="_blank" rel="noopener">Preguntarnos por WhatsApp</a>
      </div>
      <button class="link" type="button" id="otraVez" style="margin-top:18px">Volver a empezar</button></div>`;
    $("#agregaReco").onclick = () => { cierraAyuda(); agrega(sku); };
  }
  $("#otraVez").onclick = () => { resp = []; pintaAyuda(); };
}
const abreAyuda   = () => { resp = []; pintaAyuda(); abreCapa($("#ayuda"), "abierta"); };
const cierraAyuda = () => cierraCapa($("#ayuda"), "abierta");

/* ---------- preguntas ---------- */
function pintaFaq(){
  const cats = ["Todo", ...new Set(FAQ.map(f => f.c))];
  $("#faqFiltros").innerHTML = cats.map((c,i) =>
    `<button type="button" role="tab" data-c="${esc(c)}" class="${i===0?"activo":""}" aria-selected="${i===0}">${esc(c)}</button>`).join("");
  $("#preg").innerHTML = FAQ.map((f,i) =>
    `<details data-c="${esc(f.c)}"><summary><span class="qn num">${String(i+1).padStart(2,"0")}</span><span>${esc(f.q)}</span>
      <i><svg viewBox="0 0 14 14"><path d="M7 1v12M1 7h12"/></svg></i></summary>
      <p class="resp">${esc(f.r)}</p></details>`).join("");
  $$("#faqFiltros button").forEach(b => b.onclick = () => {
    const c = b.dataset.c;
    $$("#faqFiltros button").forEach(x => { const on = x === b; x.classList.toggle("activo", on); x.setAttribute("aria-selected", on); });
    $$("#preg details").forEach(d => { d.hidden = c !== "Todo" && d.dataset.c !== c; if (d.hidden) d.open = false; });
  });
  $$(".preg details").forEach(d => {
    const r = d.querySelector(".resp");
    d.querySelector("summary").addEventListener("click", e => {
      if (sinMovimiento || !window.gsap) return;
      e.preventDefault();
      if (d.open){
        gsap.to(r, {height:0, opacity:0, duration:.42, ease:"power2.inOut", onComplete(){ d.open = false; gsap.set(r, {clearProps:"height,opacity"}); }});
      } else {
        d.open = true;
        gsap.from(r, {height:0, opacity:0, duration:.55, ease:"power3.out", onComplete(){ gsap.set(r, {clearProps:"height,opacity"}); }});
      }
    });
  });
}

/* ---------- 10. MOVIMIENTO ---------- */
let io = null;
function revela(raiz){
  const els = (raiz || document).querySelectorAll(".rev:not(.visto), .rev-marca:not(.visto), .sep:not(.visto)");
  if (sinMovimiento){ els.forEach(e => e.classList.add("visto")); return; }
  io = io || new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting){ e.target.classList.add("visto"); io.unobserve(e.target); }
  }), {rootMargin:"0px 0px -10% 0px", threshold:.08});
  els.forEach(el => io.observe(el));
}
function titulosPorLineas(){
  if (sinMovimiento || !window.gsap || typeof SplitText === "undefined") return;
  $$("h2.rev").forEach(h => {
    try {
      const s = new SplitText(h, {type:"lines", linesClass:"linea-int"});
      s.lines.forEach(l => { const m = document.createElement("span"); m.className = "linea-mask"; l.parentNode.insertBefore(m, l); m.appendChild(l); });
      h.classList.add("lineas");
      gsap.from(s.lines, {yPercent:110, duration:1, ease:"power3.out", stagger:.09, scrollTrigger:{trigger:h, start:"top 88%", once:true}});
    } catch {}
  });
}
if (sinMovimiento) document.documentElement.classList.add("sin-anim");

function animaciones(){
  if (sinMovimiento || !window.gsap) return;
  gsap.registerPlugin(ScrollTrigger);

  if (window.Lenis){
    const lenis = new Lenis({lerp:.1, wheelMultiplier:1, smoothWheel:true});
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach(a => a.addEventListener("click", e => {
      const id = a.getAttribute("href"); if (id.length < 2) return;
      const el = document.querySelector(id); if (!el) return;
      e.preventDefault(); lenis.scrollTo(el, {offset:-70, duration:1.2});
    }));
  }

  /* entrada. Cada capa anima su propia propiedad:
     .obj__in = entrada, .obj__flota = flotar, .obj = ratón. */
  const telon = $("#telonEntrada");
  const yaVisto = (() => { try { return sessionStorage.getItem("nixa.telon"); } catch { return null; } })();
  const tl = gsap.timeline({defaults:{ease:"power3.out"}});
  if (telon && !yaVisto){
    try { sessionStorage.setItem("nixa.telon", "1"); } catch {}
    tl.to(telon.querySelector("svg"), {opacity:1, duration:.5, ease:"power1.inOut"})
      .to(telon.querySelector("svg"), {scale:1.15, opacity:0, duration:.55, ease:"power2.in"}, "+=.25")
      .to(telon, {yPercent:-100, duration:.9, ease:"power4.inOut"}, "-=.3")
      .set(telon, {display:"none"});
  } else if (telon){ telon.style.display = "none"; }

  const objs = $$(".escena .obj");
  tl.from(objs.map(o => o.querySelector(".obj__in")),
    {y:90, opacity:0, rotation:(i, el) => +el.closest(".obj").dataset.giro + 10, duration:1.4, stagger:.1, ease:"power4.out"},
    telon && !yaVisto ? "-=.55" : 0)
    .from(".escena .sello-giro", {scale:.6, opacity:0, duration:1, ease:"back.out(1.6)"}, "-=1");

  document.fonts.ready.then(() => {
    try {
      if (typeof SplitText !== "undefined"){
        const s = new SplitText("#heroTitulo", {type:"lines", linesClass:"linea-int"});
        s.lines.forEach(l => { const m = document.createElement("span"); m.className = "linea-mask"; l.parentNode.insertBefore(m, l); m.appendChild(l); });
        tl.from(".portada .linea-int", {yPercent:110, duration:1.1, ease:"power3.out", stagger:.1}, telon && !yaVisto ? 1.4 : .15);
      }
    } catch {}
  });

  // flotar: vive en .obj__flota, nunca choca con el ratón
  $$(".obj").forEach((o,i) => {
    const f = o.querySelector(".obj__flota"); if (!f) return;
    gsap.to(f, {y: 8 + (i%4)*4, rotation: (i%2 ? 1.4 : -1.4), duration: 3.2 + (i%5)*.55,
      yoyo:true, repeat:-1, ease:"sine.inOut", delay: i*.35});
  });

  // ratón: vive en .obj, solo x/y, y siempre vuelve a cero
  if (conRaton){
    const escena = $("#escena");
    const qs = objs.map(o => ({
      x:gsap.quickTo(o, "x", {duration:1.2, ease:"power3"}),
      y:gsap.quickTo(o, "y", {duration:1.2, ease:"power3"}), p:+o.dataset.prof || 1
    }));
    const centro = () => qs.forEach(q => { q.x(0); q.y(0); });
    $(".portada").addEventListener("pointermove", e => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      const r = escena.getBoundingClientRect();
      const px = (e.clientX - (r.left + r.width/2)) / r.width, py = (e.clientY - (r.top + r.height/2)) / r.height;
      qs.forEach(q => { q.x(px * 40 * q.p); q.y(py * 26 * q.p); });
    });
    $(".portada").addEventListener("pointerleave", centro);
    // si el ratón se va de la ventana o pierdes el foco, las piezas regresan solas
    document.addEventListener("mouseleave", centro);
    addEventListener("blur", centro);
    document.addEventListener("visibilitychange", () => { if (document.hidden) centro(); });
  }

  gsap.to("#escena", {yPercent:12, ease:"none", scrollTrigger:{trigger:".portada", start:"top top", end:"bottom top", scrub:.6}});
  gsap.to(".portada__txt", {yPercent:-6, opacity:.2, ease:"none", scrollTrigger:{trigger:".portada", start:"top top", end:"bottom top", scrub:.6}});

  // el abanico se abre solo cuando lo ves, una vez
  ScrollTrigger.create({trigger:"#abanico", start:"top 70%", once:true, onEnter:abreAbanico});

  // kit: pins y lista se señalan entre sí
  const activaPin = k => {
    $$(".pin").forEach(p => p.classList.toggle("activo", p.dataset.pin === k));
    $$("#incluye li").forEach(l => l.classList.toggle("activo", l.dataset.pin === k));
  };
  $$(".pin").forEach(p => { p.addEventListener("pointerenter", () => activaPin(p.dataset.pin)); p.addEventListener("click", () => activaPin(p.dataset.pin)); });
  $$("#incluye li").forEach(l => l.addEventListener("pointerenter", () => activaPin(l.dataset.pin)));
  $("#kitEscena").addEventListener("pointerleave", () => activaPin(null));
  $("#mapaCard").innerHTML = rostro("mejillas") + "<b>Mapa del rostro</b>";
  gsap.from(".kit__placa .obj, .kit__placa .mapa-card", {y:50, opacity:0, duration:1.2, stagger:.12, ease:"power3.out", scrollTrigger:{trigger:"#kitEscena", start:"top 78%", once:true}});

  if (conRaton){
    const esc2 = $(".kit__placa"), tres = [$(".obj--kit"), $(".obj--esp2"), $("#mapaCard")].filter(Boolean);
    const q = tres.map((o,i) => ({x:gsap.quickTo(o,"x",{duration:1,ease:"power3"}), y:gsap.quickTo(o,"y",{duration:1,ease:"power3"}), p:[.5,1.2,.8][i]}));
    esc2.addEventListener("pointermove", e => { const r = esc2.getBoundingClientRect();
      const px=(e.clientX-(r.left+r.width/2))/r.width, py=(e.clientY-(r.top+r.height/2))/r.height;
      q.forEach(k => { k.x(px*22*k.p); k.y(py*16*k.p); }); });
    esc2.addEventListener("pointerleave", () => q.forEach(k => { k.x(0); k.y(0); }));

    $$(".btn, .mas").forEach(b => {
      const qx = gsap.quickTo(b, "x", {duration:.5, ease:"power3"}), qy = gsap.quickTo(b, "y", {duration:.5, ease:"power3"});
      b.addEventListener("pointermove", e => { const r = b.getBoundingClientRect(); qx((e.clientX - (r.left + r.width/2)) * .18); qy((e.clientY - (r.top + r.height/2)) * .28); });
      b.addEventListener("pointerleave", () => { qx(0); qy(0); });
    });
  }

  /* El certificado se inclina como una tarjeta que traes en la mano. La perspectiva
     ya estaba puesta en .cert y no la usaba nadie.
     REGLA DE ORO: el giro vive en .cert__hoja, NO en .cert — .cert ya usa transform
     para su entrada, y dos animaciones nunca escriben la misma propiedad del mismo
     elemento (ese fue el bug de la portada). */
  const cert = $(".cert"), hoja = $(".cert__hoja");
  if (conRaton && cert && hoja){
    const rx = gsap.quickTo(hoja, "rotationX", {duration:.9, ease:"power3"}),
          ry = gsap.quickTo(hoja, "rotationY", {duration:.9, ease:"power3"});
    cert.addEventListener("pointermove", e => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      const r = cert.getBoundingClientRect();
      ry(((e.clientX - (r.left + r.width/2)) / r.width) * 9);
      rx(((e.clientY - (r.top + r.height/2)) / r.height) * -6);
    });
    const plano = () => { rx(0); ry(0); };
    cert.addEventListener("pointerleave", plano);
    document.addEventListener("mouseleave", plano);
    addEventListener("blur", plano);
    document.addEventListener("visibilitychange", () => { if (document.hidden) plano(); });
  }

  $$("[data-cuenta]").forEach(el => {
    // odometro: siempre la misma cantidad de digitos, para que lo de al lado no brinque
    const meta = parseInt(el.dataset.cuenta, 10), digitos = String(meta).length, obj = {v:0};
    const pinta = n => String(n).padStart(digitos, "0");
    el.textContent = pinta(0);
    gsap.to(obj, {v:meta, duration:1.4, ease:"power2.out", scrollTrigger:{trigger:el, start:"top 85%", once:true}, onUpdate(){ el.textContent = pinta(Math.round(obj.v)); }, onComplete(){ el.textContent = String(meta); }});
  });
}

/* ---------- 11. ARRANQUE ---------- */
const abreMenu   = () => { $("#menu").classList.add("abierto"); $("#btnMenu").setAttribute("aria-expanded","true"); document.body.style.overflow = "hidden"; };
const cierraMenu = () => { $("#menu").classList.remove("abierto"); $("#btnMenu").setAttribute("aria-expanded","false"); document.body.style.overflow = ""; };
$("#btnMenu").onclick = abreMenu;
$$("[data-cierra-menu], #menu a").forEach(a => a.addEventListener("click", cierraMenu));

$("#btnBolsa").onclick = () => { vePaso(1); abreBolsa(); };
$("#cerrarBolsa").onclick = cierraBolsa;
$("#telon").onclick = cierraBolsa;
$("#cerrarModal").onclick = cierraFicha;
$("#verKit").onclick  = () => abreFicha("KIT1");
$("#verKit2").onclick = () => abreFicha("KIT1");
$("#agregaKit").onclick = () => agrega("KIT1", $("#agregaKit"));
$("#barraComprar").onclick = () => agrega("KIT1", $("#barraComprar"));
$("#btnAyuda").onclick = abreAyuda;
$("#btnAyudaTop").onclick = abreAyuda;
$("#btnAyudaPie").onclick = abreAyuda;
$$("[data-abre-ayuda]").forEach(b => b.addEventListener("click", () => { cierraMenu(); abreAyuda(); }));
$("#cerrarAyuda").onclick = cierraAyuda;
$("#ayuda").onclick = e => { if (e.target.id === "ayuda") cierraAyuda(); };

$("#aPaso2").onclick  = () => { if (subtotal() > 0) vePaso(2); };
$("#aPaso1").onclick  = () => vePaso(1);
$("#aPaso3").onclick  = () => { if (valida()) vePaso(3); else $(".campo.mal input, .campo.mal textarea")?.focus(); };
$("#aPaso2b").onclick = () => vePaso(2);
$("#pagar").onclick   = pagar;

["nom","tel","dir","cp","mail"].forEach(id => {
  const el = $("#"+id);
  el.addEventListener("input", () => { el.closest(".campo").classList.remove("mal"); if (id === "cp") pintaEnvio(); });
});

document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  if ($("#ayuda").classList.contains("abierta")) return cierraAyuda();
  if ($("#bolsa").classList.contains("abierta")) return cierraBolsa();
  if ($("#modal").classList.contains("abierto")) return cierraFicha();
  if ($("#menu").classList.contains("abierto")) cierraMenu();
});

// WhatsApp: dudas, soporte y seguimiento. La caja está en la página.
const waLink = t => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`;
$("#waGarantia").href = waLink("Hola NIXA, tengo una duda sobre la garantía.");
$("#waFaq").href      = waLink("Hola NIXA, tengo una pregunta antes de comprar.");
["#waPie","#waMenu","#waBarra"].forEach(s => { const a = $(s); if (a) a.href = `https://wa.me/${WA}`; });
$("#certFolio").textContent = "NX-" + String(new Date().getFullYear()).slice(2) + "-" + String(Math.floor(Math.random()*900+100));

let tic = false;
/* alScroll corre en CADA cuadro del scroll. Antes pedía offsetHeight dos veces,
   scrollHeight una y volvía a buscar las secciones oscuras en el DOM, o sea cuatro
   cálculos de layout forzados por cuadro. Ahora todo eso se mide una vez y solo se
   vuelve a medir al cambiar de tamaño la ventana. */
const elTop = $("#top"), elPie = $(".pie"), elProg = $("#progreso"),
      elAyuda = $("#btnAyuda"), elBarra = $("#barraMov"), elPortada = $(".portada");
const oscuras = $$(".noche,.pie");
let altoPortada = 0, altoTop = 84, largoScroll = 1, esNoche = false;
function mide(){
  altoPortada = elPortada.offsetHeight;
  altoTop = elTop.offsetHeight;
  largoScroll = document.documentElement.scrollHeight - innerHeight;
}
mide();
addEventListener("resize", mide, {passive:true});
document.fonts && document.fonts.ready.then(mide);

function alScroll(){
  const y = scrollY;
  document.body.classList.toggle("arriba", y < altoPortada - 90);
  elTop.classList.toggle("pegada", y > 24);
  elProg.style.transform = `scaleX(${largoScroll > 0 ? Math.min(1, y / largoScroll) : 0})`;
  const pie = elPie.getBoundingClientRect();
  elAyuda.classList.toggle("visible", y > innerHeight * .8 && pie.top > innerHeight - 40);
  elBarra.classList.toggle("visible", y > innerHeight * .9);
  /* histéresis: una vez oscura, la cabecera necesita 30px de más para volver a
     aclararse. Sin esto parpadeaba en el borde exacto de la garantía y del pie,
     y cada parpadeo arrastraba medio segundo de transición. */
  const h = altoTop + 38, m = esNoche ? 30 : 0;
  const oscuro = oscuras.some(s => { const r = s.getBoundingClientRect(); return r.top <= h + m && r.bottom >= h - m; });
  // "top--noche", NO "noche": `.noche` es la clase de las secciones oscuras y le
  // metía a la cabecera su padding y su position:relative, rompiéndole el sticky.
  if (oscuro !== esNoche){ esNoche = oscuro; elTop.classList.toggle("top--noche", oscuro); }
  tic = false;
}
addEventListener("scroll", () => { if (!tic){ requestAnimationFrame(alScroll); tic = true; } }, {passive:true});

pintaAbanico();
pintaFaq();
alScroll();
revela();
animaciones();
document.fonts.ready.then(titulosPorLineas);
vePaso(1);
pinta();
cargar().then(() => { mide(); revisaVuelta(); });

})();
