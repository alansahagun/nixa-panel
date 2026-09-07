/* =========================================================
   nixa BEAUTY · tienda v4 · "El tocador"
   Un solo archivo de comportamiento. Orden:
   1) config  2) datos  3) utilidades  4) marca  5) catálogo
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

/* ---------- 2. DATOS DE PRESENTACIÓN ---------- */
// Dos fotos por pieza: la primera en el escenario/tarjeta, la segunda en la ficha.
const FOTOS = {
  KIT1:{a:`${IMG}/kit-brochas.jpg`,      b:`${IMG}/kit-abanico.jpg`,       pos:"50% 42%", alt:"Las brochas del Kit N°1 en su estuche"},
  SIS1:{a:`${IMG}/sistema-abanico.jpg`,  b:`${IMG}/sistema-flatlay.jpg`,   pos:"50% 50%", alt:"Brochas y abanico del Sistema completo"},
  ESP4:{a:`${IMG}/esponjas-beige.jpg`,   b:`${IMG}/esponja-terracota.jpg`, pos:"50% 55%", alt:"Esponjas de maquillaje sobre fondo beige"},
  LAV1:{a:`${IMG}/brocha-polvo.jpg`,     b:`${IMG}/brocha-pote.jpg`,       pos:"50% 50%", alt:"Una brocha limpia, lista para lavarse"},
  RIZ1:{a:`${IMG}/rizador.jpg`,          b:`${IMG}/swatches-terracota.jpg`,pos:"50% 60%", alt:"Rizador de pestañas sobre una superficie que refleja"}
};
const FOTO_FICHA = {
  KIT1:{src:`${IMG}/kit-abanico.jpg`,   pos:"50% 50%"},
  SIS1:{src:`${IMG}/sistema-flatlay.jpg`,pos:"50% 45%"}
};
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
const CINTA = ["Cada brocha sabe su lugar","Garantía de 90 días, sin ticket","Armado a mano en Guadalajara","Envío el mismo día en la ciudad","Te contesta una persona"];

/* ---------- 3. UTILIDADES ---------- */
const $  = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const money = n => "$" + Number(n||0).toLocaleString("es-MX",{maximumFractionDigits:0});
const esc = s => (s ?? "").toString().replace(/[<>&"']/g, c => ({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;","'":"&#39;"}[c]));
const sinMovimiento = matchMedia("(prefers-reduced-motion: reduce)").matches;
const palomita = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10.5l4.5 4.5L17 5.5"/></svg>';

// guardado suave de la bolsa: si el navegador no deja, seguimos sin drama
const guarda = {
  leer(){ try { return JSON.parse(localStorage.getItem("nixa.bolsa") || "{}"); } catch { return {}; } },
  escribir(v){ try { localStorage.setItem("nixa.bolsa", JSON.stringify(v)); } catch {} }
};

let PROD = [];
let bolsa = guarda.leer();
let sb = null;
try { sb = window.supabase?.createClient(SB_URL, SB_KEY); } catch {}

/* ---------- 4. MARCA (sprites svg) ---------- */
Promise.all([`${IMG}/marca-v4.svg`,`${IMG}/brochas-v4.svg`].map(u => fetch(u).then(r => r.ok ? r.text() : "").catch(() => "")))
  .then(ts => { const s = $("#sprite"); s.innerHTML = ts.join(""); s.hidden = false;
                s.style.cssText = "position:absolute;width:0;height:0;overflow:hidden"; });

// la cinta: se repite dos veces para que el bucle sea continuo
$("#cinta").innerHTML = [...CINTA, ...CINTA].map(t =>
  `<span>${esc(t)}<svg viewBox="0 0 100 100" aria-hidden="true"><use href="#abanico"/></svg></span>`).join("");

/* ---------- 5. CATÁLOGO: índice + escenario ---------- */
function esqueleto(n = 5){
  return Array.from({length:n}, () =>
    `<div class="esq" aria-hidden="true"><div class="esq__l" style="height:44px;width:60%"></div><div class="esq__l"></div></div>`
  ).join("");
}
function ahorroSistema(){
  const sis = PROD.find(p => p.sku === "SIS1");
  if (!sis) return "";
  const sueltas = PROD.filter(p => p.sku !== "SIS1").reduce((a,p) => a + Number(p.precio), 0);
  return sueltas > sis.precio ? `Sale ${money(sueltas - sis.precio)} menos que comprar las piezas por separado.` : "";
}
const titulo = p => { const [tit, ...r] = p.nombre.split(" · "); return {tit, sub:r.join(" · ")}; };
const descDe = p => (COPY[p.sku]?.desc || "").replace("{AHORRO}", ahorroSistema()).trim();

function fila(p){
  const c = COPY[p.sku] || {}; const {tit, sub} = titulo(p);
  return `<article class="fila" data-sku="${esc(p.sku)}" tabindex="0" aria-label="${esc(tit)}">
    <span class="fila__no num">N° ${NUM[p.sku]}</span>
    <div>
      ${c.sello ? `<span class="sello${c.selloOro?"":" sello--claro"}">${esc(c.sello)}</span>` : ""}
      <h3><button type="button" data-ficha="${esc(p.sku)}">${esc(tit)}</button></h3>
      ${sub ? `<p class="sub">${esc(sub)}</p>` : ""}
    </div>
    <span class="precio">${money(p.precio)}<span>MXN</span></span>
    <button class="mas" type="button" data-sku="${esc(p.sku)}" aria-label="Agregar ${esc(tit)} a la bolsa">
      <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.5v13M1.5 8h13"/></svg></button>
  </article>`;
}
function tarj(p){
  const c = COPY[p.sku] || {}; const f = FOTOS[p.sku] || FOTOS.KIT1; const {tit, sub} = titulo(p);
  return `<article class="tarj" id="tar-${esc(p.sku)}">
    <button class="marco tarj__marco" type="button" data-ficha="${esc(p.sku)}" aria-label="Ver ${esc(tit)}">
      <img src="${esc(f.a)}" alt="${esc(f.alt||tit)}" loading="lazy" style="object-position:${esc(f.pos)}">
      ${c.sello ? `<span class="sello">${esc(c.sello)}</span>` : ""}
    </button>
    <span class="ced num">N° ${NUM[p.sku]}</span>
    <h3><button type="button" data-ficha="${esc(p.sku)}">${esc(tit)}</button></h3>
    ${sub ? `<p class="sub">${esc(sub)}</p>` : ""}
    <div class="tarj__pie">
      <span class="precio">${money(p.precio)}<span>MXN</span></span>
      <button class="mas" type="button" data-sku="${esc(p.sku)}" aria-label="Agregar ${esc(tit)} a la bolsa">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.5v13M1.5 8h13"/></svg></button>
    </div>
  </article>`;
}

function activa(sku){
  $$(".fila").forEach(f => f.classList.toggle("activa", f.dataset.sku === sku));
  $$("#escenario img").forEach(i => i.classList.toggle("activa", i.dataset.sku === sku));
  $("#escenarioNum").textContent = NUM[sku] || "01";
  const p = PROD.find(x => x.sku === sku);
  if (p) $("#escenarioCed").textContent = `Fig. ${NUM[sku]} · ${titulo(p).tit}`;
}

async function cargar(){
  const lista = $("#prods");
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

  lista.innerHTML = ord.map(fila).join("");
  $("#tarjs").innerHTML = ord.map(tarj).join("");
  $("#escenario").innerHTML = ord.map(p => {
    const f = FOTOS[p.sku] || FOTOS.KIT1;
    return `<img src="${esc(f.a)}" alt="" data-sku="${esc(p.sku)}" loading="lazy" style="object-position:${esc(f.pos)}">`;
  }).join("");

  $$(".mas[data-sku]").forEach(b => b.onclick = () => agrega(b.dataset.sku, b));
  $$("[data-ficha]").forEach(b => b.onclick = () => abreFicha(b.dataset.ficha));
  $$(".fila").forEach(f => {
    const on = () => activa(f.dataset.sku);
    f.addEventListener("mouseenter", on);
    f.addEventListener("focusin", on);
    f.addEventListener("click", e => { if (!e.target.closest("button")) abreFicha(f.dataset.sku); });
    f.addEventListener("keydown", e => { if (e.key === "Enter" && !e.target.closest("button")) abreFicha(f.dataset.sku); });
  });
  activa(ord[0].sku);

  const kit = PROD.find(p => p.sku === "KIT1");
  if (kit){
    $("#precioKit").textContent = money(kit.precio);
    $("#precioHero").textContent = money(kit.precio);
    $("#precioEtiqueta").innerHTML = `${money(kit.precio)}<span>MXN</span>`;
    const pf = $("#precioFinal"); if (pf) pf.innerHTML = `${money(kit.precio)}<span>MXN</span>`;
  }
  revela(lista);
}

/* el mapa del rostro: un dibujo, una zona encendida por paso */
function rostro(zona){
  const on = z => z === zona ? "z on" : "z";
  return `<svg class="paso__rostro" viewBox="0 0 120 150" aria-hidden="true">
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

/* los diez pasos del ritual */
function pintaRitual(){
  const track = $("#ritualTrack");
  const pasos = DIEZ.map(([n,b,z,q]) => `<article class="paso">
      <div class="paso__cab"><span class="paso__no num">${n}</span>${rostro(ZONA[n])}</div>
      <div class="paso__escena"><svg class="paso__brocha" viewBox="0 0 80 240" aria-hidden="true"><use href="#b${n}"/></svg></div>
      <div class="paso__txt">
        <span class="paso__zona">${esc(z)}</span>
        <h3>${esc(b)}</h3>
        <p>${esc(q)}</p>
      </div>
    </article>`).join("");
  const fin = `<article class="paso paso--final">
      <div class="paso__cab"><span class="paso__no num">10/10</span></div>
      <div class="paso__escena"><svg viewBox="0 0 100 100" aria-hidden="true"><use href="#abanico"/></svg></div>
      <div class="paso__txt">
        <h3>Las diez, en el Kit N°1.</h3>
        <p>Con estuche, dos esponjas y el mapa del rostro.</p>
        <span class="precio" id="precioFinal">$298<span>MXN</span></span>
        <div style="margin-top:14px"><button class="btn btn--claro" type="button" data-agrega="KIT1">Agregar a la bolsa</button></div>
      </div>
    </article>`;
  track.insertAdjacentHTML("beforeend", pasos + fin);
  $$("[data-agrega]").forEach(b => b.onclick = () => agrega(b.dataset.agrega, b));
}
function abreFicha(sku){
  const p = PROD.find(x => x.sku === sku); if (!p) return;
  const c = COPY[sku] || {incluye:[], cuidado:""};
  const {tit, sub} = titulo(p);
  const f = FOTO_FICHA[sku] || {src:(FOTOS[sku]||FOTOS.KIT1).a, pos:(FOTOS[sku]||FOTOS.KIT1).pos};
  const waTxt = encodeURIComponent(`Hola nixa, tengo una duda sobre ${p.nombre}.`);

  $("#cuerpoModal").innerHTML = `
  <div class="f-grid">
    <div class="f-escena">
      <div class="marco-ext"><i class="reg reg--tl"></i><i class="reg reg--tr"></i><i class="reg reg--bl"></i><i class="reg reg--br"></i>
      <figure class="marco f-escena__foto">
        <img src="${esc(f.src)}" alt="${esc(tit)}" style="object-position:${esc(f.pos)}">
      </figure></div>
      <span class="fig f-escena__ced">Fig. ${NUM[sku] || "01"} · ${esc(tit)}</span>
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
    <div><figure class="foto"><img src="${esc((FOTOS[sku]||FOTOS.KIT1).b)}" alt="" loading="lazy"></figure>
      <h4>Qué incluye</h4>
      <ul>${(c.incluye||[]).map(i => `<li>${palomita}${esc(i)}</li>`).join("")}</ul></div>
    <div><figure class="foto"><img src="${IMG}/brocha-polvo.jpg" alt="" loading="lazy" style="object-position:50% 50%"></figure>
      <h4>Cómo se cuida</h4><p>${esc(c.cuidado||"")}</p></div>
    <div><figure class="foto"><img src="${IMG}/manos-brocha.jpg" alt="" loading="lazy" style="object-position:50% 40%"></figure>
      <h4>La promesa nixa</h4><p>${esc(PROMESA)}</p></div>
    ${(sku==="KIT1"||sku==="SIS1") ? `<div class="diez"><h4>Las diez brochas</h4><ol>${
      DIEZ.map(([n,b,z]) => `<li><span class="n">${n}</span><b>${esc(b)}</b><small>${esc(z)}</small></li>`).join("")
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
    const f = FOTOS[sku] || FOTOS.KIT1;
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
    const f = FOTOS[sku] || FOTOS.KIT1;
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
  const els = (raiz || document).querySelectorAll(".rev:not(.visto), .rev-foto:not(.visto), .rev-marca:not(.visto), .sep:not(.visto)");
  if (sinMovimiento){ els.forEach(e => e.classList.add("visto")); return; }
  io = io || new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting){ e.target.classList.add("visto"); io.unobserve(e.target); }
  }), {rootMargin:"0px 0px -10% 0px", threshold:.08});
  els.forEach(el => io.observe(el));
}
/* los títulos de sección entran línea por línea, una sola vez */
function titulosPorLineas(){
  if (sinMovimiento || !window.gsap || typeof SplitText === "undefined") return;
  $$("h2.rev").forEach(h => {
    try {
      const s = new SplitText(h, {type:"lines", linesClass:"linea-int"});
      s.lines.forEach(l => { const m = document.createElement("span"); m.className = "linea-mask"; l.parentNode.insertBefore(m, l); m.appendChild(l); });
      h.classList.add("lineas");
      gsap.from(s.lines, {yPercent:110, duration:1, ease:"power3.out", stagger:.09,
        scrollTrigger:{trigger:h, start:"top 88%", once:true}});
    } catch {}
  });
}
if (sinMovimiento) document.documentElement.classList.add("sin-anim");

function animaciones(){
  if (sinMovimiento || !window.gsap) return;
  gsap.registerPlugin(ScrollTrigger);

  // scroll suave (Lenis), atado al reloj de GSAP
  if (window.Lenis){
    const lenis = new Lenis({lerp:.1, wheelMultiplier:1, smoothWheel:true});
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    // anclas: que el scroll suave respete los enlaces internos
    $$('a[href^="#"]').forEach(a => a.addEventListener("click", e => {
      const id = a.getAttribute("href"); if (id.length < 2) return;
      const el = document.querySelector(id); if (!el) return;
      e.preventDefault(); lenis.scrollTo(el, {offset:-90, duration:1.2});
    }));
  }

  // 1) el titular se revela por líneas, la foto del arco se asienta
  const conSplit = typeof SplitText !== "undefined";
  document.fonts.ready.then(() => {
    try {
      if (conSplit){
        const s = new SplitText("#heroTitulo", {type:"lines", linesClass:"linea-int"});
        s.lines.forEach(l => { const m = document.createElement("span"); m.className = "linea-mask"; l.parentNode.insertBefore(m, l); m.appendChild(l); });
        gsap.from(".linea-int", {yPercent:110, duration:1.1, ease:"power3.out", stagger:.1, delay:.15});
      }
    } catch {}
    $("#heroMarco").classList.add("asentada");
  });

  // 2) el halo se aleja despacio al bajar: el único movimiento de color
  gsap.to(".hero__halo", {yPercent:-18, ease:"none", scrollTrigger:{trigger:".hero", start:"top top", end:"bottom top", scrub:.8}});
  gsap.to("#heroFoto", {yPercent:7, ease:"none", scrollTrigger:{trigger:".hero", start:"top top", end:"bottom top", scrub:.6}});

  // 3) el ritual corre horizontal mientras bajas (solo en pantallas anchas)
  ScrollTrigger.matchMedia({
    "(min-width: 1000px)": () => {
      const track = $("#ritualTrack"), pin = $("#ritualPin");
      const dist = () => track.scrollWidth - innerWidth;
      const barra = $("#ritualBarra");
      const tw = gsap.to(track, {x:() => -dist(), ease:"none",
        scrollTrigger:{trigger:pin, start:"top top", end:() => "+=" + dist(), pin:true, scrub:1, invalidateOnRefresh:true, anticipatePin:1,
          onUpdate(st){ if (barra) barra.style.setProperty("--p", st.progress.toFixed(3)); }}});
      // cada paso entra desde abajo al asomarse, y se "enfoca" al pasar por el centro
      $$(".paso").forEach(p => {
        gsap.from(p, {y:36, opacity:0, duration:.9, ease:"power3.out",
          scrollTrigger:{trigger:p, containerAnimation:tw, start:"left 92%", once:true}});
        ScrollTrigger.create({trigger:p, containerAnimation:tw, start:"left 62%", end:"right 38%", toggleClass:{targets:p, className:"foco"}});
      });
    }
  });

  // 3b) en móvil, el paso enfocado se detecta con el scroll nativo de la pista
  if (innerWidth < 1000){
    const track = $("#ritualTrack");
    const ioP = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle("foco", e.intersectionRatio > .7)),
      {root:track, threshold:[.7]});
    $$(".paso").forEach(p => ioP.observe(p));
  }

  // 3c) la foto del escenario sigue al cursor, apenas
  const esc = $(".escenario"), cuerpo = $(".indice__cuerpo");
  if (esc && cuerpo && matchMedia("(pointer:fine)").matches){
    const qx = gsap.quickTo(esc, "x", {duration:.9, ease:"power3"}), qy = gsap.quickTo(esc, "y", {duration:.9, ease:"power3"});
    cuerpo.addEventListener("pointermove", e => {
      const r = cuerpo.getBoundingClientRect();
      qx(((e.clientX - r.left) / r.width - .5) * 14); qy(((e.clientY - r.top) / r.height - .5) * 10);
    });
    cuerpo.addEventListener("pointerleave", () => { qx(0); qy(0); });
  }

  // 3d) botones magnéticos (solo con ratón)
  if (matchMedia("(pointer:fine)").matches){
    $$(".btn, .mas").forEach(b => {
      const qx = gsap.quickTo(b, "x", {duration:.5, ease:"power3"}), qy = gsap.quickTo(b, "y", {duration:.5, ease:"power3"});
      b.addEventListener("pointermove", e => {
        const r = b.getBoundingClientRect();
        qx((e.clientX - (r.left + r.width/2)) * .18); qy((e.clientY - (r.top + r.height/2)) * .28);
      });
      b.addEventListener("pointerleave", () => { qx(0); qy(0); });
    });
  }

  // 4) las cifras cuentan hacia arriba cuando entran
  $$("[data-cuenta]").forEach(el => {
    const meta = parseInt(el.dataset.cuenta, 10), obj = {v:0};
    gsap.to(obj, {v:meta, duration:1.4, ease:"power2.out", scrollTrigger:{trigger:el, start:"top 85%", once:true},
      onUpdate(){ el.textContent = Math.round(obj.v); }});
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
$("#agregaHero").onclick = () => agrega("KIT1", $("#agregaHero"));
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

["nom","tel","dir"].forEach(id => {
  const el = $("#"+id);
  el.addEventListener("input", () => el.closest(".campo").classList.remove("mal"));
});

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

// cabecera pegada, botón flotante y barra móvil
let tic = false;
function alScroll(){
  const y = scrollY;
  $("#top").classList.toggle("pegada", y > 24);
  const alto = document.documentElement.scrollHeight - innerHeight;
  $("#progreso").style.transform = `scaleX(${alto > 0 ? Math.min(1, y / alto) : 0})`;
  $("#btnAyuda").classList.toggle("visible", y > innerHeight * .8);
  $("#barraMov").classList.toggle("visible", y > innerHeight * .9);
  // la cabecera se oscurece sobre las secciones de noche
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
