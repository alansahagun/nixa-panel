/* =========================================================
   nixa BEAUTY · tienda v6 · "El tocador abierto"
   Un solo archivo de comportamiento. Orden:
   1) config  2) datos  3) utilidades  4) marca  5) vitrina
   6) ficha   7) bolsa  8) ayudante    9) movimiento  10) arranque
   ========================================================= */
(() => {
'use strict';

/* ---------- 1. CONFIG ---------- */
const SB_URL = "https://jjtlkneoxmgcyrifckdf.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqdGxrbmVveG1nY3lyaWZja2RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzNjQ0ODcsImV4cCI6MjEwMzk0MDQ4N30.Ty2qZduVwcIfWuVAzb-judCXVIIpyBq2_D3bE2GsY7g";

// ⚠️ PENDIENTE: número real de WhatsApp de nixa (52 + 10 dígitos). Hoy es un número de prueba.
const WA = "523300000000";

const ENVIO_GRATIS = 599;          // umbral tentativo de envío gratis en MXN
const MSI_DESDE    = 300;

const IMG = "https://jjtlkneoxmgcyrifckdf.supabase.co/storage/v1/object/public/panel/img";
const OBJ = `${IMG}/obj`;

/* ---------- 2. DATOS DE PRESENTACIÓN ---------- */
// Cada pieza vive sobre una placa de color, como objeto recortado.
const PIEZAS = {
  KIT1:{obj:"kit",            placa:"arena", ancho:"86%", giro:0, dy:"-4%", grande:true, foto:`${IMG}/kit-abanico.jpg`},
  SIS1:{obj:"abanico-brochas",placa:"rosa",  ancho:"58%", giro:0, dy:"-10%",   foto:`${IMG}/sistema-flatlay.jpg`},
  ESP4:{obj:"esponja",        placa:"hueso", ancho:"44%", giro:16, dy:"-8%",  foto:`${IMG}/esponja-terracota.jpg`},
  LAV1:{obj:"brocha-polvo",   placa:"cafe",  ancho:"19%", giro:-12, dy:"-10%", foto:`${IMG}/brocha-pote.jpg`},
  RIZ1:{obj:"rizador",        placa:"noche", ancho:"62%", giro:6, dy:"-8%",  foto:`${IMG}/swatches-terracota.jpg`}
};
const objHTML = (nombre, alt = "", extra = "") =>
  `<figure class="obj" ${extra}><img class="sombra" src="${OBJ}/${nombre}-sombra.webp" alt=""><img src="${OBJ}/${nombre}.webp" alt="${esc(alt)}" loading="lazy"></figure>`;

const ORDEN = ["KIT1","SIS1","ESP4","LAV1","RIZ1"];
const NUM   = {KIT1:"01",SIS1:"02",ESP4:"03",LAV1:"04",RIZ1:"05"};

const COPY = {
  KIT1:{sello:"Empieza por aquí", selloOro:true,
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
const PROMESA = "Antes de enviar un set, probamos cada pieza con las manos. Si en sus primeros noventa días algo falla, nos escribes por WhatsApp con una foto y te mandamos el reemplazo. Sin ticket, sin formulario.";

// [número, nombre, zona, para qué sirve]; ZONA: qué parte del rostro se ilumina en el dibujo
const ZONA = {"01":"rostro","02":"rostro","03":"mejillas","04":"parpado","05":"pomulo","06":"parpado","07":"cuenca","08":"ojeras","09":"pestanas","10":"cejas"};
const DIEZ = [
  ["01","Polvo","Rostro","La grande y esponjosa. Fija el maquillaje con un velo de polvo, sin cargar."],
  ["02","Base","Rostro","Plana y densa. Difumina la base en círculos hasta que no se note dónde empieza."],
  ["03","Rubor","Mejillas","Redonda y suave. Toma poco producto y lo lleva de la mejilla hacia la sien."],
  ["04","Difuminar","Párpado","Pequeña y mullida. Borra los bordes de la sombra para que todo se vea como uno."],
  ["05","Contorno","Pómulo","Angulada. Marca debajo del pómulo y difumina hacia arriba."],
  ["06","Sombra","Párpado","La pala. Deposita el color en el párpado móvil, con presión ligera."],
  ["07","Cuenca","Ojo","Lápiz cónico. Define la cuenca del ojo con un tono más oscuro."],
  ["08","Corrector","Ojeras","Chica y plana. Coloca corrector en ojeras, nariz y comisuras."],
  ["09","Delinear","Pestañas","Fina y angulada. Delinea pegado a las pestañas, con sombra o gel."],
  ["10","Cejas y pestañas","Cejas","El cepillo en espiral. Peina cejas y separa pestañas después del rímel."]
];
// la silueta de cada cabeza (mismo dibujo que el sprite) y el ancho de su virola
const CABEZAS = {
  "01":["M29 113 C16 96, 15 62, 30 44 C35 38, 45 38, 50 44 C65 62, 64 96, 51 113 Z",22],
  "02":["M28 113 C27 96, 28 76, 30 62 Q40 58 50 62 C52 76, 53 96, 52 113 Z",24],
  "03":["M31 113 C22 98, 22 72, 33 58 C37 53, 43 53, 47 58 C58 72, 58 98, 49 113 Z",18],
  "04":["M32 113 C27 100, 29 78, 36 68 C38 65, 42 65, 44 68 C51 78, 53 100, 48 113 Z",16],
  "05":["M29 113 C27 98, 27 84, 30 74 L52 58 C54 76, 54 98, 51 113 Z",22],
  "06":["M32 113 C31 100, 32 84, 34 74 Q40 71 46 74 C48 84, 49 100, 48 113 Z",16],
  "07":["M33 113 C32 100, 34 84, 40 66 C46 84, 48 100, 47 113 Z",14],
  "08":["M33 113 C32 102, 33 88, 36 80 C38 77, 42 77, 44 80 C47 88, 48 102, 47 113 Z",14],
  "09":["M35 113 C34 104, 35 96, 36 90 L46 82 C46 96, 46 104, 45 113 Z",10],
  "10":["M38.6 113 C38.6 100, 38.6 80, 38.6 64 L41.4 64 C41.4 80, 41.4 100, 41.4 113 Z",14]
};
const CINTA = ["Cada brocha sabe su lugar","Garantía de 90 días, sin ticket","Armado a mano en Guadalajara","Envío el mismo día en la ciudad","Te contesta una persona"];

/* ---------- 3. UTILIDADES ---------- */
const $  = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const money = n => "$" + Number(n||0).toLocaleString("es-MX",{maximumFractionDigits:0});
function esc(s){ return (s ?? "").toString().replace(/[<>&"']/g, c => ({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;","'":"&#39;"}[c])); }
const sinMovimiento = matchMedia("(prefers-reduced-motion: reduce)").matches;
const conRaton = matchMedia("(pointer:fine)").matches;
const palomita = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10.5l4.5 4.5L17 5.5"/></svg>';

const guarda = {
  leer(){ try { return JSON.parse(localStorage.getItem("nixa.bolsa") || "{}"); } catch { return {}; } },
  escribir(v){ try { localStorage.setItem("nixa.bolsa", JSON.stringify(v)); } catch {} }
};

let PROD = [];
let bolsa = guarda.leer();
let sb = null;
try { sb = window.supabase?.createClient(SB_URL, SB_KEY); } catch {}

/* ---------- 4. MARCA (sprites svg) ---------- */
const spritesListos = Promise.all([`${IMG}/marca-v4.svg`,`${IMG}/brochas-v4.svg`].map(u => fetch(u).then(r => r.ok ? r.text() : "").catch(() => "")))
  .then(ts => { const s = $("#sprite"); s.innerHTML = ts.join(""); s.hidden = false;
                s.style.cssText = "position:absolute;width:0;height:0;overflow:hidden"; });

$("#cinta").innerHTML = [...CINTA, ...CINTA].map(t =>
  `<span>${esc(t)}<svg viewBox="0 0 100 100" aria-hidden="true"><use href="#abanico"/></svg></span>`).join("");

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

/* ---------- 5. LA VITRINA ---------- */
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
  return `<article class="placa placa-p placa--${z.placa}" data-sku="${esc(p.sku)}" ${z.grande ? 'data-grande' : ''}>
    <div class="placa__cab">
      <span class="placa__no num">N° ${NUM[p.sku]}</span>
      ${c.sello ? `<span class="sello">${esc(c.sello)}</span>` : ""}
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
  let data = null, error = null;
  try {
    if (!sb) throw new Error("sin cliente");
    ({data, error} = await sb.from("productos").select("*").eq("activo", true).order("precio",{ascending:false}));
  } catch (e) { error = e; }
  lista.setAttribute("aria-busy","false");

  if (error || !data || !data.length){
    lista.innerHTML = `<p class="vacio">No pudimos cargar la colección en este momento.
      <br><a class="link" style="margin-top:14px" href="https://wa.me/${WA}" target="_blank" rel="noopener">Escríbenos por WhatsApp</a></p>`;
    return;
  }
  PROD = data;
  const pos = s => { const i = ORDEN.indexOf(s); return i < 0 ? 99 : i; };
  const ord = [...PROD].sort((a,b) => pos(a.sku) - pos(b.sku));
  lista.innerHTML = ord.map(placa).join("");

  $$(".mas[data-sku]").forEach(b => b.onclick = () => agrega(b.dataset.sku, b));
  $$("[data-ficha]").forEach(b => b.onclick = () => abreFicha(b.dataset.ficha));
  inclinaPlacas();

  const kit = PROD.find(p => p.sku === "KIT1");
  if (kit){
    $("#precioKit").textContent = money(kit.precio);
    $("#precioHero").textContent = money(kit.precio);
    const pf = $("#precioFinal"); if (pf) pf.textContent = money(kit.precio);
  }
  revela(lista);
  if (window.gsap && !sinMovimiento){
    gsap.from(".placa-p", {y:40, opacity:0, duration:1, ease:"power3.out", stagger:.08, scrollTrigger:{trigger:lista, start:"top 82%", once:true}});
  }
}

/* las placas se inclinan apenas hacia el cursor; la pieza flota encima */
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

/* ---------- 6. FICHA ---------- */
function abreFicha(sku){
  const p = PROD.find(x => x.sku === sku); if (!p) return;
  const c = COPY[sku] || {incluye:[], cuidado:""};
  const z = PIEZAS[sku] || PIEZAS.KIT1;
  const {tit, sub} = titulo(p);
  const waTxt = encodeURIComponent(`Hola nixa, tengo una duda sobre ${p.nombre}.`);

  $("#cuerpoModal").innerHTML = `
  <div class="f-grid">
    <div class="f-escena">
      <div class="placa placa--${z.placa}">
        ${objHTML(z.obj, tit, `style="--ancho:${z.ancho};--giro:${z.giro}deg"`)}
        <span class="fig placa__fig">Fig. ${NUM[sku] || "01"} · ${esc(tit)}</span>
      </div>
    </div>
    <div class="f-info">
      <span class="ced ced--linea">${esc(c.sello || sub || "nixa BEAUTY")}</span>
      <h2 id="tituloModal">${esc(tit)}</h2>
      <div class="f-precio">
        <span class="v">${money(p.precio)}</span>
        <span class="ced">MXN · Envío gratis desde ${money(ENVIO_GRATIS)}</span>
      </div>
      <p class="f-desc">${esc(descDe(p))}</p>
      <div class="f-acciones">
        <button class="btn" type="button" id="agregaFicha">Agregar a la bolsa
          <svg class="flecha" viewBox="0 0 13 9" aria-hidden="true"><path d="M0 4.5h11M8 1l3.5 3.5L8 8"/></svg></button>
        <a class="btn btn--linea" href="https://wa.me/${WA}?text=${waTxt}" target="_blank" rel="noopener">Preguntar por WhatsApp</a>
      </div>
      <ul class="confia">
        <li>${palomita}<span><b>Envío gratis</b> desde ${money(ENVIO_GRATIS)}. En Guadalajara, el mismo día.</span></li>
        <li>${palomita}<span><b>90 días de garantía.</b> Si falla, te mandamos el reemplazo sin ticket.</span></li>
        <li>${palomita}<span><b>Aquí no se cobra nada.</b> Pago y entrega se confirman por WhatsApp.</span></li>
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
      <h4>La promesa nixa</h4><p>${esc(PROMESA)}</p></div>
    ${(sku==="KIT1"||sku==="SIS1") ? `<div class="diez"><h4>Las diez brochas</h4><ol>${
      DIEZ.map(([n,b,zz]) => `<li><span class="n">${n}</span><b>${esc(b)}</b><small>${esc(zz)}</small></li>`).join("")
    }</ol></div>` : ""}
  </div>`;

  $("#agregaFicha").onclick = () => agrega(sku, $("#agregaFicha"));
  abreCapa($("#modal"));
  $("#modal").scrollTop = 0;
  $("#cerrarModal").focus({preventScroll:true});
}
const cierraFicha = () => cierraCapa($("#modal"));
/* ---------- 7. BOLSA ---------- */
function agrega(sku, boton){
  bolsa[sku] = (bolsa[sku] || 0) + 1;
  guarda.escribir(bolsa);
  pinta();
  if (boton && !sinMovimiento && window.gsap){
    gsap.fromTo($("#nBolsa"), {scale:1.5}, {scale:1, duration:.45, ease:"back.out(3)"});
  }
  abreBolsa();
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
    const f = {a:`${OBJ}/${(PIEZAS[sku]||PIEZAS.KIT1).obj}.webp`};
    return `<div class="item" style="--i:${Object.keys(bolsa).indexOf(sku)}">
      <span class="item__mini"><img src="${esc(f.a)}" alt="" loading="lazy"></span>
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
  $("#datos").hidden = t === 0;

  // barra de envío gratis: el motivador más honesto que hay
  const barra = $("#envioBarra");
  if (t > 0){
    barra.hidden = false;
    const falta = ENVIO_GRATIS - t;
    $("#envioTexto").innerHTML = falta > 0
      ? `Te faltan <b>${money(falta)}</b> para el envío gratis.`
      : `<b>Ya tienes envío gratis.</b> Lo armamos hoy mismo.`;
    $("#envioRiel").style.width = Math.min(100, (t/ENVIO_GRATIS)*100) + "%";
  } else barra.hidden = true;

  $$("[data-quita]").forEach(b => b.onclick = () => { delete bolsa[b.dataset.quita]; guarda.escribir(bolsa); pinta(); });
  $$("[data-mas]").forEach(b => b.onclick = () => { bolsa[b.dataset.mas]++; guarda.escribir(bolsa); pinta(); });
  $$("[data-menos]").forEach(b => b.onclick = () => {
    const k = b.dataset.menos; bolsa[k]--; if (bolsa[k] < 1) delete bolsa[k];
    guarda.escribir(bolsa); pinta();
  });
}

/* capas: bolsa, ficha y ayudante comparten el manejo de foco y scroll */
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

/* validación amable: marca el campo, no regaña con un alert */
function valida(){
  let ok = true;
  const nom = $("#nom").value.trim();
  const tel = $("#tel").value.replace(/\D/g,"");
  const dir = $("#dir").value.trim();
  $("#cNom").classList.toggle("mal", !nom); if (!nom) ok = false;
  $("#cTel").classList.toggle("mal", tel.length !== 10); if (tel.length !== 10) ok = false;
  $("#cDir").classList.toggle("mal", dir.length < 8); if (dir.length < 8) ok = false;
  return ok ? {nom, tel, dir} : null;
}

async function enviaPedido(){
  const msj = $("#msjPedido");
  const items = Object.entries(bolsa);
  if (!items.length){ msj.className = "msj mal"; msj.textContent = "Tu bolsa está vacía."; return; }

  const d = valida();
  if (!d){
    msj.className = "msj mal";
    msj.textContent = "Revisa los datos marcados para poder mandarte el pedido.";
    $(".campo.mal input, .campo.mal textarea")?.focus();
    return;
  }

  msj.className = "msj"; msj.textContent = "Preparando tu pedido…";
  $("#pedir").disabled = true;

  let total = 0;
  const lineas = items.map(([sku,q]) => {
    const p = PROD.find(x => x.sku === sku);
    total += p.precio * q;
    return `${q} × ${p.nombre} — ${money(p.precio*q)}`;
  });

  // el pedido se registra en nuestro sistema antes de abrir WhatsApp
  try {
    await sb.from("pedidos").insert({
      canal:"Tienda Nixa", comprador:d.nom,
      sku:items.map(i => i[0]).join("+"),
      cantidad:items.reduce((a,b) => a + b[1], 0),
      total, estado:"nuevo",
      datos:{telefono:d.tel, direccion:d.dir, items:Object.fromEntries(items),
             envio_gratis: total >= ENVIO_GRATIS}
    });
  } catch {}

  const envio = total >= ENVIO_GRATIS ? "Envío gratis" : "Envío por confirmar";
  const txt = encodeURIComponent(
    `Hola nixa, quiero este pedido:\n\n${lineas.join("\n")}\n\nTotal: ${money(total)} (${envio})\n\n` +
    `Nombre: ${d.nom}\nWhatsApp: ${d.tel}\nDirección: ${d.dir}`);
  const url = `https://wa.me/${WA}?text=${txt}`;
  const win = window.open(url, "_blank");
  if (!win) location.href = url;

  $("#pedir").disabled = false;
  msj.className = "msj";
  msj.textContent = "Listo. Se abrió WhatsApp con tu pedido; ahí confirmamos pago y entrega.";
}
/* ---------- 8. AYUDANTE ---------- */
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
  const waTxt = encodeURIComponent(p ? `Hola nixa, me recomendaron ${p.nombre} y tengo una duda.` : "Hola nixa, ayúdenme a elegir.");
  if (!p){
    c.innerHTML = `<div class="reco"><h3 id="tituloAyuda">Casi.</h3>
      <p class="razon">Todavía no carga la colección. Escríbenos y te decimos en el momento.</p>
      <div style="margin-top:20px"><a class="btn btn--ancho" href="https://wa.me/${WA}?text=${waTxt}" target="_blank" rel="noopener">Preguntarnos por WhatsApp</a></div>
      <button class="link" type="button" id="otraVez" style="margin-top:18px">Empezar de nuevo</button></div>`;
  } else {
    const {tit, sub} = titulo(p);
    const f = {a:`${OBJ}/${(PIEZAS[sku]||PIEZAS.KIT1).obj}.webp`};
    c.innerHTML = `<div class="reco">
      <span class="ced">Nosotros te diríamos</span>
      <h3 id="tituloAyuda">Empieza por aquí.</h3>
      <div class="reco__prod">
        <span class="lam"><img src="${esc(f.a)}" alt="" loading="lazy"></span>
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
const abreAyuda  = () => { resp = []; pintaAyuda(); abreCapa($("#ayuda"), "abierta"); };
const cierraAyuda = () => cierraCapa($("#ayuda"), "abierta");

/* ---------- 9. MOVIMIENTO ---------- */
// Regla: todo entra una vez y se queda. Nada se mueve mientras lees.
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

/* ----- el ritual: una sola brocha que se transforma ----- */
let pasoActual = -1;
function pintaRitual(){
  $("#pasos").innerHTML = DIEZ.map(([n,b,z,q], i) => `<article class="paso${i===0?" activo":""}" data-i="${i}">
      <span class="paso__zona">${esc(z)}</span>
      <h3><small>Brocha ${n} de 10</small>${esc(b)}</h3>
      <p>${esc(q)}</p>
      ${i === 9 ? `<div class="paso__cta"><button class="btn btn--claro" type="button" data-agrega="KIT1">Las diez, en el Kit N°1 · <span id="precioFinal">$298</span></button></div>` : ""}
    </article>`).join("");
  $("#ritualNav").innerHTML = DIEZ.map(([n,b], i) => `<button type="button" data-i="${i}" class="${i===0?"activo":""}"><b class="num">${n}</b><span>${esc(b)}</span><i></i></button>`).join("");
  $("#ritualRostro").innerHTML = rostro(ZONA["01"]);
  $$("[data-agrega]").forEach(b => b.onclick = () => agrega(b.dataset.agrega, b));
  // pelos de la brocha viva: trazos fijos que la cabeza recorta
  const pelos = []; let seed = 7;
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  for (let i = 0; i < 34; i++){
    const t = (i + .5) / 34, xb = 40 + (t - .5) * 22, xt = 40 + (t - .5) * 40;
    const claro = rnd() < .55, op = (rnd() * .34 + .28) * (claro ? 1 : .45);
    pelos.push(`<path d="M${xb.toFixed(1)} 113 Q${((xb+xt)/2 + rnd()*2 - 1).toFixed(1)} 80 ${xt.toFixed(1)} 36" stroke="${claro ? "#EAD5C8" : "#2A1417"}" stroke-opacity="${op.toFixed(2)}" stroke-width="${(rnd()*.4+.55).toFixed(2)}"/>`);
  }
  $("#bvPelos").innerHTML = pelos.join("");
  // el cepillo en espiral del paso 10
  const cerdas = [];
  for (let i = 0; i < 30; i++){ const y = 68 + i * 1.5, L = 6.5 + 2.2 * Math.sin(i * .55) + (i > 3 ? 0 : -1.5 * (4 - i));
    cerdas.push(`<path d="M40 ${y.toFixed(1)} L${(40+L).toFixed(1)} ${(y-1.2).toFixed(1)}" stroke-opacity="${(.5 + .25*(i%3===0)).toFixed(2)}"/><path d="M40 ${y.toFixed(1)} L${(40-L).toFixed(1)} ${(y-1.2).toFixed(1)}" stroke-opacity="${(.5 + .25*(i%3===0)).toFixed(2)}"/>`); }
  $("#bvCepillo").innerHTML = cerdas.join("");
  irAPaso(0, true);
}
function irAPaso(i, sinAnim){
  i = Math.max(0, Math.min(9, i));
  if (i === pasoActual) return;
  const antes = pasoActual; pasoActual = i;
  const n = DIEZ[i][0], [d, virola] = CABEZAS[n];
  $$(".paso").forEach(p => p.classList.toggle("activo", +p.dataset.i === i));
  $$("#ritualNav button").forEach(b => { const k = +b.dataset.i; b.classList.toggle("activo", k === i); b.classList.toggle("hecho", k < i); });
  $("#ritualNum").textContent = n;
  $("#ritualRostro").innerHTML = rostro(ZONA[n]);
  const fx = 40 - virola/2, dur = sinAnim ? 0 : .9;
  if (window.gsap && window.MorphSVGPlugin){
    gsap.to("#bvCabeza", {duration:dur, ease:"power2.inOut", morphSVG:{shape:d, shapeIndex:"auto"}});
  } else { $("#bvCabeza").setAttribute("d", d); }
  if (window.gsap){
    gsap.to("#bvVirola", {duration:dur, ease:"power2.inOut", attr:{x:fx, width:virola}});
    gsap.to("#bvAro1, #bvAro2", {duration:dur, ease:"power2.inOut", attr:{x:fx, width:virola}});
    gsap.to("#bvMango", {duration:dur, ease:"power2.inOut", morphSVG:`M${fx+1} 134 L${fx+virola-1} 134 L46 226 Q40 236 34 226 Z`});
    gsap.to("#bvCepillo", {duration:dur*.6, opacity: n === "10" ? 1 : 0, delay: n === "10" ? dur*.4 : 0});
    gsap.to("#bvPelos", {duration:dur*.5, opacity: n === "10" ? 0 : 1});
    if (!sinAnim){ gsap.fromTo("#brochaViva", {rotation: antes < i ? -2 : 2, transformOrigin:"50% 95%"}, {rotation:0, duration:1.1, ease:"elastic.out(1,.6)"}); }
  }
}

function animaciones(){
  if (sinMovimiento || !window.gsap) return;
  gsap.registerPlugin(ScrollTrigger);
  if (window.MorphSVGPlugin) gsap.registerPlugin(MorphSVGPlugin);

  // scroll suave (Lenis), atado al reloj de GSAP
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

  // 1) entrada: el telón se abre, las piezas del tocador caen a su lugar, el titular sube por líneas
  const telon = $("#telonEntrada"), yaVisto = (() => { try { return sessionStorage.getItem("nixa.telon"); } catch { return null; } })();
  const tl = gsap.timeline({defaults:{ease:"power3.out"}});
  if (telon && !yaVisto){
    try { sessionStorage.setItem("nixa.telon", "1"); } catch {}
    tl.to(telon.querySelector("svg"), {opacity:1, duration:.5, ease:"power1.inOut"})
      .to(telon.querySelector("svg"), {scale:1.15, opacity:0, duration:.55, ease:"power2.in"}, "+=.25")
      .to(telon, {yPercent:-100, duration:.9, ease:"power4.inOut"}, "-=.3")
      .set(telon, {display:"none"});
  } else if (telon){ telon.style.display = "none"; }
  const objs = $$(".escena .obj");
  tl.from(objs, {y:90, opacity:0, rotation:(i, el) => +el.dataset.giro + 10, duration:1.4, stagger:.1, ease:"power4.out"}, telon && !yaVisto ? "-=.55" : 0)
    .from(".escena .sello-giro", {scale:.6, opacity:0, duration:1, ease:"back.out(1.6)"}, "-=1");
  document.fonts.ready.then(() => {
    try {
      if (typeof SplitText !== "undefined"){
        const s = new SplitText("#heroTitulo", {type:"lines", linesClass:"linea-int"});
        s.lines.forEach(l => { const m = document.createElement("span"); m.className = "linea-mask"; l.parentNode.insertBefore(m, l); m.appendChild(l); });
        tl.from(".linea-int", {yPercent:110, duration:1.1, ease:"power3.out", stagger:.1}, telon && !yaVisto ? 1.4 : .15);
      }
    } catch {}
  });

  // 2) las piezas flotan despacio y siguen al cursor según su profundidad
  objs.forEach((o, i) => {
    gsap.to(o, {y:"+=" + (8 + i*3), rotation:"+=" + (i%2 ? 1.5 : -1.5), duration:3.2 + i*.6, yoyo:true, repeat:-1, ease:"sine.inOut", delay:i*.4});
  });
  if (conRaton){
    const esc = $("#escena");
    const qs = objs.map(o => ({x:gsap.quickTo(o, "x", {duration:1.2, ease:"power3"}), y:gsap.quickTo(o, "y", {duration:1.2, ease:"power3"}), p:+o.dataset.prof}));
    $(".portada").addEventListener("pointermove", e => {
      const r = esc.getBoundingClientRect(); const px = (e.clientX - (r.left + r.width/2)) / r.width, py = (e.clientY - (r.top + r.height/2)) / r.height;
      qs.forEach(q => { q.x(px * 40 * q.p); q.y(py * 26 * q.p); });
    });
    $(".portada").addEventListener("pointerleave", () => qs.forEach(q => { q.x(0); q.y(0); }));
  }
  // al bajar, la escena se queda un poco atrás (profundidad) y el halo sube
  gsap.to("#escena", {yPercent:14, ease:"none", scrollTrigger:{trigger:".portada", start:"top top", end:"bottom top", scrub:.6}});
  gsap.to(".portada__txt", {yPercent:-6, opacity:.2, ease:"none", scrollTrigger:{trigger:".portada", start:"top top", end:"bottom top", scrub:.6}});

  // 3) el ritual: la sección se queda quieta y la brocha cambia diez veces mientras bajas
  const pasosST = ScrollTrigger.create({
    trigger:"#ritualPin", start:"top top", end:() => "+=" + Math.round(innerHeight * 5.5), pin:true, anticipatePin:1, scrub:false,
    onUpdate(st){ irAPaso(Math.min(9, Math.floor(st.progress * 10))); }
  });
  $$("#ritualNav button").forEach(b => b.addEventListener("click", () => {
    const i = +b.dataset.i, y = pasosST.start + (pasosST.end - pasosST.start) * ((i + .5) / 10);
    if (window.__lenis) window.__lenis.scrollTo(y, {duration:1}); else scrollTo(0, y);
  }));

  // 4) el kit: los pins y la lista se señalan entre sí
  const activaPin = k => { $$(".pin").forEach(p => p.classList.toggle("activo", p.dataset.pin === k)); $$("#incluye li").forEach(l => l.classList.toggle("activo", l.dataset.pin === k)); };
  $$(".pin").forEach(p => { p.addEventListener("pointerenter", () => activaPin(p.dataset.pin)); p.addEventListener("click", () => activaPin(p.dataset.pin)); });
  $$("#incluye li").forEach(l => l.addEventListener("pointerenter", () => activaPin(l.dataset.pin)));
  $("#kitEscena").addEventListener("pointerleave", () => activaPin(null));
  $("#mapaCard").innerHTML = rostro("mejillas") + "<b>Mapa del rostro</b>";
  gsap.from(".kit__placa .obj, .kit__placa .mapa-card", {y:50, opacity:0, duration:1.2, stagger:.12, ease:"power3.out", scrollTrigger:{trigger:"#kitEscena", start:"top 78%", once:true}});
  if (conRaton){
    const esc2 = $(".kit__placa"), o1 = $(".obj--kit"), o2 = $(".obj--esp2"), o3 = $("#mapaCard");
    const q = [o1,o2,o3].map((o,i) => ({x:gsap.quickTo(o,"x",{duration:1,ease:"power3"}), y:gsap.quickTo(o,"y",{duration:1,ease:"power3"}), p:[.5,1.2,.8][i]}));
    esc2.addEventListener("pointermove", e => { const r = esc2.getBoundingClientRect(); const px=(e.clientX-(r.left+r.width/2))/r.width, py=(e.clientY-(r.top+r.height/2))/r.height; q.forEach(k => { k.x(px*22*k.p); k.y(py*16*k.p); }); });
    esc2.addEventListener("pointerleave", () => q.forEach(k => { k.x(0); k.y(0); }));
  }

  // 5) botones magnéticos (solo con ratón)
  if (conRaton){
    $$(".btn, .mas").forEach(b => {
      const qx = gsap.quickTo(b, "x", {duration:.5, ease:"power3"}), qy = gsap.quickTo(b, "y", {duration:.5, ease:"power3"});
      b.addEventListener("pointermove", e => { const r = b.getBoundingClientRect(); qx((e.clientX - (r.left + r.width/2)) * .18); qy((e.clientY - (r.top + r.height/2)) * .28); });
      b.addEventListener("pointerleave", () => { qx(0); qy(0); });
    });
  }

  // 6) las cifras cuentan hacia arriba cuando entran
  $$("[data-cuenta]").forEach(el => {
    const meta = parseInt(el.dataset.cuenta, 10), obj = {v:0};
    gsap.to(obj, {v:meta, duration:1.4, ease:"power2.out", scrollTrigger:{trigger:el, start:"top 85%", once:true}, onUpdate(){ el.textContent = Math.round(obj.v); }});
  });
}

/* ---------- 10. ARRANQUE ---------- */
const abreMenu = () => { $("#menu").classList.add("abierto"); $("#btnMenu").setAttribute("aria-expanded","true"); document.body.style.overflow = "hidden"; };
const cierraMenu = () => { $("#menu").classList.remove("abierto"); $("#btnMenu").setAttribute("aria-expanded","false"); document.body.style.overflow = ""; };
$("#btnMenu").onclick = abreMenu;
$$("[data-cierra-menu], #menu a").forEach(a => a.addEventListener("click", cierraMenu));

$("#btnBolsa").onclick = abreBolsa;
$("#cerrarBolsa").onclick = cierraBolsa;
$("#telon").onclick = cierraBolsa;
$("#pedir").onclick = enviaPedido;
$("#cerrarModal").onclick = cierraFicha;
$("#verKit").onclick = () => abreFicha("KIT1");
$("#agregaKit").onclick = () => agrega("KIT1", $("#agregaKit"));
$("#btnAyuda").onclick = abreAyuda;
$("#btnAyudaTop").onclick = abreAyuda;
$("#btnAyudaPie").onclick = abreAyuda;
$$("[data-abre-ayuda]").forEach(b => b.addEventListener("click", () => { cierraMenu(); abreAyuda(); }));
$("#cerrarAyuda").onclick = cierraAyuda;
$("#ayuda").onclick = e => { if (e.target.id === "ayuda") cierraAyuda(); };

// preguntas: la respuesta se despliega con suavidad
$$(".preg details").forEach(d => {
  const resp = d.querySelector(".resp");
  d.querySelector("summary").addEventListener("click", e => {
    if (sinMovimiento || !window.gsap) return;
    e.preventDefault();
    if (d.open){
      gsap.to(resp, {height:0, opacity:0, duration:.45, ease:"power2.inOut", onComplete(){ d.open = false; gsap.set(resp, {clearProps:"height,opacity"}); }});
    } else {
      d.open = true;
      gsap.from(resp, {height:0, opacity:0, duration:.6, ease:"power3.out", onComplete(){ gsap.set(resp, {clearProps:"height,opacity"}); }});
    }
  });
});

["nom","tel","dir"].forEach(id => { const el = $("#"+id); el.addEventListener("input", () => el.closest(".campo").classList.remove("mal")); });

document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  if ($("#ayuda").classList.contains("abierta")) return cierraAyuda();
  if ($("#bolsa").classList.contains("abierta")) return cierraBolsa();
  if ($("#modal").classList.contains("abierto")) return cierraFicha();
  if ($("#menu").classList.contains("abierto")) cierraMenu();
});

// WhatsApp fuera de la bolsa
const waLink = (t) => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`;
$("#waGarantia").href = waLink("Hola nixa, tengo una duda sobre la garantía.");
$("#waKit").href      = waLink("Hola nixa, tengo una duda sobre el Kit N°1.");
$("#waFaq").href      = waLink("Hola nixa, tengo una pregunta antes de comprar.");
["#waPie","#waMenu","#waBarra"].forEach(s => { const a = $(s); if (a) a.href = `https://wa.me/${WA}`; });

// cabecera: transparente sobre la portada, oscura sobre las secciones de noche, con línea de avance
let tic = false;
function alScroll(){
  const y = scrollY;
  const portada = $(".portada").offsetHeight;
  document.body.classList.toggle("arriba", y < portada - 90);
  $("#top").classList.toggle("pegada", y > 24);
  const alto = document.documentElement.scrollHeight - innerHeight;
  $("#progreso").style.transform = `scaleX(${alto > 0 ? Math.min(1, y / alto) : 0})`;
  $("#btnAyuda").classList.toggle("visible", y > innerHeight * .8);
  $("#barraMov").classList.toggle("visible", y > innerHeight * .9);
  const h = $("#top").offsetHeight + 38;
  const oscuro = $$(".ritual,.noche,.pie").some(s => { const r = s.getBoundingClientRect(); return r.top <= h && r.bottom >= h; });
  $("#top").classList.toggle("noche", oscuro);
  tic = false;
}
addEventListener("scroll", () => { if (!tic){ requestAnimationFrame(alScroll); tic = true; } }, {passive:true});

pintaRitual();
alScroll();
revela();
animaciones();
document.fonts.ready.then(titulosPorLineas);
pinta();
cargar();

})();
