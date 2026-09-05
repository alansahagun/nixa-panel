/* =========================================================
   nixa BEAUTY · tienda
   Un solo archivo de comportamiento. Orden:
   1) config  2) datos  3) utilidades  4) marca  5) catálogo
   6) ficha   7) bolsa  8) ayudante    9) movimiento
   ========================================================= */
(() => {
'use strict';

/* ---------- 1. CONFIG ---------- */
const SB_URL = "https://jjtlkneoxmgcyrifckdf.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqdGxrbmVveG1nY3lyaWZja2RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzNjQ0ODcsImV4cCI6MjEwMzk0MDQ4N30.Ty2qZduVwcIfWuVAzb-judCXVIIpyBq2_D3bE2GsY7g";

// ⚠️ PENDIENTE: WhatsApp de prueba. Poner aquí el número real de nixa
// (52 + 10 dígitos, sin espacios ni +). Es la única línea que hay que cambiar.
const WA = "523300000000";

const ENVIO_GRATIS = 599;          // umbral de envío gratis en MXN
const MSI_DESDE    = 300;          // desde cuánto tiene sentido ofrecer meses

const IMG = "https://jjtlkneoxmgcyrifckdf.supabase.co/storage/v1/object/public/panel/img";

/* ---------- 2. DATOS DE PRESENTACIÓN ---------- */
// Dos fotos por pieza: la segunda se ve al pasar el cursor.
const FOTOS = {
  KIT1:{a:`${IMG}/brochas-marmol-blanco.jpg`, b:`${IMG}/kit-rollo.jpg`,        pos:"50% 50%", alt:"Brochas del Kit N°1 sobre mármol blanco"},
  ESP4:{a:`${IMG}/esponja-rosa.jpg`,          b:`${IMG}/aplicando-esponja.jpg`,pos:"50% 60%", alt:"Esponja de maquillaje sobre un pedestal rosa"},
  LAV1:{a:`${IMG}/brocha-sola.jpg`,           b:`${IMG}/brochas-calidas.jpg`,  pos:"50% 40%", alt:"Brocha limpia, lista para lavarse"},
  RIZ1:{a:`${IMG}/ojos-cerrados.jpg`,         b:`${IMG}/rostro-beige.jpg`,     pos:"50% 35%", alt:"Pestañas y párpado, ojos cerrados"},
  SIS1:{a:`${IMG}/abanico-brochas.jpg`,       b:`${IMG}/hero-brochas-marmol.jpg`,pos:"40% 50%",alt:"Abanico de brochas de maquillaje"}
};
const FOTO_FICHA = {
  KIT1:{src:`${IMG}/hero-brochas-marmol.jpg`, pos:"62% 42%"},
  SIS1:{src:`${IMG}/kit-rollo.jpg`,           pos:"50% 50%"}
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
const DIEZ = [["01","Polvo","Rostro"],["02","Base","Rostro"],["03","Rubor","Mejillas"],["04","Difuminar","Párpado"],["05","Contorno","Pómulo"],["06","Sombra","Párpado"],["07","Cuenca","Ojo"],["08","Corrector","Ojeras"],["09","Delinear","Pestañas"],["10","Cejas y pestañas","Cejas"]];

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

/* ---------- 4. MARCA (sprite svg) ---------- */
fetch("img/marca.svg")
  .then(r => r.ok ? r.text() : Promise.reject())
  .then(t => { $("#sprite").innerHTML = t; $("#sprite").hidden = false;
               $("#sprite").style.cssText = "position:absolute;width:0;height:0;overflow:hidden"; })
  .catch(() => {});

/* ---------- 5. CATÁLOGO ---------- */
function esqueleto(n = 5){
  return Array.from({length:n}, () =>
    `<div class="esq" aria-hidden="true"><div class="esq__lam"></div><div class="esq__l"></div><div class="esq__l"></div></div>`
  ).join("");
}

function ahorroSistema(){
  const sis = PROD.find(p => p.sku === "SIS1");
  if (!sis) return "";
  const sueltas = PROD.filter(p => p.sku !== "SIS1").reduce((a,p) => a + Number(p.precio), 0);
  return sueltas > sis.precio
    ? `Sale ${money(sueltas - sis.precio)} menos que comprar las piezas por separado.`
    : "";
}
const titulo = p => { const [tit, ...r] = p.nombre.split(" · "); return {tit, sub:r.join(" · ")}; };
const descDe = p => (COPY[p.sku]?.desc || "").replace("{AHORRO}", ahorroSistema()).trim();

function tarjeta(p, i){
  const c = COPY[p.sku] || {};
  const f = FOTOS[p.sku] || FOTOS.KIT1;
  const {tit, sub} = titulo(p);
  return `<article class="tar rev" id="tar-${esc(p.sku)}">
  <button class="tar__lam" type="button" data-ficha="${esc(p.sku)}" aria-label="Ver ${esc(tit)}">
    ${c.sello ? `<span class="sello${c.selloOro?"":" sello--claro"}">${esc(c.sello)}</span>` : ""}
    <img class="a" src="${esc(f.a)}" alt="${esc(f.alt||tit)}" loading="lazy" style="object-position:${esc(f.pos)}">
    <img class="b" src="${esc(f.b)}" alt="" loading="lazy" aria-hidden="true">
  </button>
  <div class="tar__cuerpo">
    <span class="ced tar__no num">N° ${NUM[p.sku] || String(i+1).padStart(2,"0")}</span>
    <h3><button type="button" data-ficha="${esc(p.sku)}">${esc(tit)}</button></h3>
    ${sub ? `<p class="tar__sub">${esc(sub)}</p>` : ""}
    <div class="tar__pie">
      <span class="precio">${money(p.precio)} <span>MXN</span></span>
      <button class="mas" type="button" data-sku="${esc(p.sku)}" aria-label="Agregar ${esc(tit)} a la bolsa">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.5v13M1.5 8h13"/></svg>
      </button>
    </div>
  </div>
</article>`;
}

async function cargar(){
  const cont = $("#prods");
  cont.innerHTML = esqueleto();
  let data = null, error = null;
  try {
    if (!sb) throw new Error("sin cliente");
    ({data, error} = await sb.from("productos").select("*").eq("activo", true).order("precio",{ascending:false}));
  } catch (e) { error = e; }

  cont.setAttribute("aria-busy","false");

  if (error || !data || !data.length){
    cont.innerHTML = `<p class="vacio">No pudimos cargar la colección en este momento.
      <br><a class="link" style="margin-top:14px" href="https://wa.me/${WA}" target="_blank" rel="noopener">Escríbenos por WhatsApp</a></p>`;
    return;
  }

  PROD = data;
  const pos = s => { const i = ORDEN.indexOf(s); return i < 0 ? 99 : i; };
  cont.innerHTML = [...PROD].sort((a,b) => pos(a.sku) - pos(b.sku)).map(tarjeta).join("");

  $$(".mas[data-sku]").forEach(b => b.onclick = () => agrega(b.dataset.sku, b));
  $$("[data-ficha]").forEach(b => b.onclick = () => abreFicha(b.dataset.ficha));

  const kit = PROD.find(p => p.sku === "KIT1");
  if (kit){
    $("#precioKit").textContent = money(kit.precio);
    const ph = $("#precioHero");
    if (ph) ph.innerHTML = `${money(kit.precio)} <span>MXN</span>`;
  }
  revela(cont);
}

/* ---------- 6. FICHA ---------- */
function abreFicha(sku){
  const p = PROD.find(x => x.sku === sku); if (!p) return;
  const c = COPY[sku] || {incluye:[], cuidado:""};
  const {tit, sub} = titulo(p);
  const f = FOTO_FICHA[sku] || {src:(FOTOS[sku]||FOTOS.KIT1).a, pos:(FOTOS[sku]||FOTOS.KIT1).pos};
  const waTxt = encodeURIComponent(`Hola nixa, tengo una duda sobre ${p.nombre}.`);

  $("#cuerpoModal").innerHTML = `
  <div class="f-grid">
    <div class="f-escena">
      <figure class="f-escena__foto">
        <img src="${esc(f.src)}" alt="${esc(tit)}" style="object-position:${esc(f.pos)}">
      </figure>
      <span class="ced f-escena__ced">Fig. ${NUM[sku] || "01"} · ${esc(tit)}</span>
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
    <div><figure class="foto"><img src="${IMG}/brocha-sola.jpg" alt="" loading="lazy" style="object-position:50% 30%"></figure>
      <h4>Cómo se cuida</h4><p>${esc(c.cuidado||"")}</p></div>
    <div><figure class="foto"><img src="${IMG}/brochas-calidas.jpg" alt="" loading="lazy" style="object-position:50% 40%"></figure>
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
    return `<div class="item">
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
}
function cierraCapa(el, clase = "abierto"){
  el.classList.remove(clase);
  el.setAttribute("aria-hidden","true");
  if (!$(".bolsa.abierta") && !$(".modal.abierto") && !$(".hoja-tel.abierta")) document.body.style.overflow = "";
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
      <div class="opcs">${q.o.map(([v,t]) => `<button class="opc" type="button" data-v="${v}">${t}</button>`).join("")}</div>
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
// Respaldo sin GSAP (o con movimiento reducido): IntersectionObserver.
let io = null;
if (!sinMovimiento && "IntersectionObserver" in window){
  io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting){ e.target.classList.add("visto"); io.unobserve(e.target); }
  }), {rootMargin:"0px 0px -8% 0px", threshold:.06});
}
function revela(raiz){
  (raiz || document).querySelectorAll(".rev:not(.visto)").forEach(el => {
    if (io) io.observe(el); else el.classList.add("visto");
  });
}
if (sinMovimiento) document.documentElement.classList.add("sin-anim");

function animaciones(){
  if (sinMovimiento || !window.gsap) return;
  gsap.registerPlugin(ScrollTrigger);
  const conSplit = typeof SplitText !== "undefined";

  // el titular se revela por líneas: es el gesto que más "cuesta" percibir
  if (conSplit){
    document.fonts.ready.then(() => {
      try {
        const s = new SplitText("#heroTitulo", {type:"lines", linesClass:"linea-int"});
        s.lines.forEach(l => {
          const m = document.createElement("span");
          m.className = "linea-mask"; l.parentNode.insertBefore(m, l); m.appendChild(l);
        });
        gsap.from(".linea-int", {yPercent:112, duration:1, ease:"power3.out", stagger:.09, delay:.1});
      } catch {}
    });
  }

  // el halo se aleja despacio: es el único movimiento de color de la página
  gsap.to(".hero__halo", {yPercent:-14, scale:1.08, ease:"none",
    scrollTrigger:{trigger:".hero", start:"top top", end:"bottom top", scrub:.8}});
  gsap.to("#heroFoto", {yPercent:6, ease:"none",
    scrollTrigger:{trigger:".hero", start:"top top", end:"bottom top", scrub:.6}});

  // las cifras cuentan hacia arriba cuando entran
  gsap.utils.toArray(".cifras__n").forEach(el => {
    const meta = parseInt(el.firstChild.textContent, 10);
    if (!meta) return;
    const obj = {v:0};
    gsap.to(obj, {v:meta, duration:1.1, ease:"power2.out",
      scrollTrigger:{trigger:el, start:"top 86%", once:true},
      onUpdate(){ el.firstChild.textContent = Math.round(obj.v); }});
  });
}

/* ---------- 10. ARRANQUE ---------- */
$("#btnMenu").onclick = () => {
  const m = $("#menu"), abierto = m.classList.toggle("abierto");
  $("#btnMenu").setAttribute("aria-expanded", abierto);
  document.body.style.overflow = abierto ? "hidden" : "";
};
$$("#menu a").forEach(a => a.onclick = () => {
  $("#menu").classList.remove("abierto");
  $("#btnMenu").setAttribute("aria-expanded","false");
  document.body.style.overflow = "";
});

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
$("#cerrarAyuda").onclick = cierraAyuda;
$("#ayuda").onclick = e => { if (e.target.id === "ayuda") cierraAyuda(); };

// limpia el error del campo en cuanto la persona lo corrige
["nom","tel","dir"].forEach(id => {
  const el = $("#"+id);
  el.addEventListener("input", () => el.closest(".campo").classList.remove("mal"));
});

document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  if ($("#ayuda").classList.contains("abierta")) return cierraAyuda();
  if ($("#bolsa").classList.contains("abierta")) return cierraBolsa();
  if ($("#modal").classList.contains("abierto")) return cierraFicha();
  if ($("#menu").classList.contains("abierta")) $("#btnMenu").click();
});

// WhatsApp fuera de la bolsa
const waLink = (t) => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`;
$("#waGarantia").href = waLink("Hola nixa, tengo una duda sobre la garantía.");
$("#waKit").href      = waLink("Hola nixa, tengo una duda sobre el Kit N°1.");
$("#waPie").href      = `https://wa.me/${WA}`;

// cabecera pegada + botón flotante
let tic = false;
function alScroll(){
  const y = scrollY;
  $("#top").classList.toggle("pegada", y > 24);
  $("#btnAyuda").classList.toggle("visible", y > innerHeight * .8);
  tic = false;
}
addEventListener("scroll", () => { if (!tic){ requestAnimationFrame(alScroll); tic = true; } }, {passive:true});

alScroll();
revela();
animaciones();
pinta();
cargar();

})();
