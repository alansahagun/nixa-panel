/* ============================================================
   LA PUERTA DEL PANEL — 8-sep-2026.
   Antes esto era publico: cualquiera que supiera la direccion
   veia caja, ventas, inventario y las cuentas entre los dos.
   Se entra con usuario (alan / majo) y contrasena.

   La cerradura de verdad NO es esta pantalla, son los permisos
   por correo en la base: si alguien se saltara esta pagina, la
   base igual no le entregaria nada. Esto es la comodidad.

   Vive aparte del index a proposito. El index pesa 110 KB y la
   unica via para subirlo obliga a mandar el archivo entero, asi
   que tocar la entrada aqui cuesta 5 KB en vez de 110.
   ============================================================ */
const EQUIPO = {
  alan: { correo: 'alansahagunnavarro@gmail.com', nombre: 'Alan' },
  majo: { correo: 'majodiezmtz@gmail.com',        nombre: 'Majo' }
};

/* El abanico BUENO, el de los vectores de Majo. El #abanico que trae el panel
   es un dibujo viejo hecho a mano que a este tamano sale como una mancha negra.
   Se inyecta una vez como <symbol> y se usa dos veces con <use>. */
const AB_D = "<g transform='translate(-551.9 -516.8)'><path fill-rule='nonzero' fill='currentColor' fill-opacity='1' d='M 1403.757812 754.300781 C 1354.855469 850.824219 1299.40625 959.132812 1251.625 1051.433594 C 1214.871094 1124.027344 1175.464844 1200.855469 1133.453125 1272.148438 C 1120.40625 1294.648438 1109.59375 1312.792969 1099.417969 1329.238281 L 1099.207031 1329.578125 L 1098.835938 1329.457031 C 1097.636719 1329.054688 1096.425781 1328.675781 1095.199219 1328.296875 L 1094.65625 1328.125 L 1094.886719 1327.605469 C 1126.035156 1258.964844 1161.363281 1188.582031 1199.898438 1118.4375 C 1225.375 1072.816406 1264.660156 1000.984375 1280.363281 972.214844 C 1312.933594 912.910156 1361.773438 824.746094 1381.253906 789.589844 L 1401.816406 752.710938 L 1403.976562 753.863281 Z M 1073.167969 1322.480469 L 1072.765625 1322.390625 C 1071.585938 1322.121094 1070.40625 1321.871094 1069.207031 1321.628906 L 1068.65625 1321.519531 L 1068.828125 1320.988281 C 1075.355469 1300.277344 1082.832031 1277.796875 1092.347656 1250.21875 C 1121.21875 1164.890625 1156.113281 1077.566406 1189.378906 995.425781 C 1227.457031 899.046875 1274.585938 781.601562 1307.425781 700.054688 L 1324.679688 657.46875 L 1326.976562 658.359375 L 1326.808594 658.820312 C 1286.722656 769.226562 1241 893.597656 1201.375 1000.035156 C 1166.390625 1097.066406 1123.804688 1211.222656 1073.335938 1322.109375 Z M 1047.554688 1317.910156 L 1047.136719 1317.851562 C 1045.945312 1317.679688 1044.757812 1317.519531 1043.566406 1317.371094 L 1043.039062 1317.3125 L 1043.136719 1316.78125 C 1053.734375 1260.535156 1066.9375 1202.054688 1079.632812 1147.246094 C 1089.730469 1103.675781 1102.066406 1057.324219 1114 1012.492188 C 1118.386719 995.988281 1122.9375 978.914062 1127.195312 962.609375 C 1156.523438 849.472656 1193 711.886719 1212.140625 639.9375 L 1224.597656 593.425781 L 1226.984375 594.015625 L 1226.875 594.496094 C 1201.085938 706.589844 1172.425781 827.664062 1144.707031 944.746094 C 1139.320312 967.527344 1133.992188 990.039062 1128.765625 1012.121094 C 1104.144531 1120.546875 1076.855469 1223.296875 1047.6875 1317.5 Z M 1021.597656 1315.25 L 1021.15625 1315.222656 C 1020.007812 1315.140625 1018.835938 1315.070312 1017.679688 1315.003906 L 1017.179688 1314.972656 L 1017.207031 1314.472656 C 1021.058594 1255.414062 1027.253906 1194.019531 1033.363281 1136.472656 C 1038.230469 1090.761719 1044.996094 1041.917969 1051.535156 994.6875 C 1053.925781 977.40625 1056.402344 959.542969 1058.683594 942.476562 C 1073.355469 831.242188 1091.820312 696.59375 1104.722656 603.230469 L 1111.582031 554.289062 L 1114.019531 554.609375 L 1113.96875 555.089844 C 1101.523438 673.941406 1087.25 802.394531 1073.457031 926.613281 C 1070.976562 948.925781 1068.527344 970.988281 1066.117188 992.660156 C 1054.492188 1106.605469 1039.539062 1214.992188 1021.675781 1314.8125 Z M 996.847656 1313.890625 L 996.828125 1314.371094 L 996.347656 1314.363281 C 995.816406 1314.351562 995.285156 1314.351562 994.757812 1314.351562 C 994.226562 1314.351562 993.699219 1314.351562 993.167969 1314.363281 L 992.6875 1314.371094 L 992.667969 1313.890625 C 987.078125 1211.832031 985.441406 1101.515625 987.789062 986.011719 C 988.039062 964.390625 988.300781 942.386719 988.550781 920.125 C 990 793.925781 991.5 663.4375 993.636719 542.765625 L 993.648438 542.273438 L 995.867188 542.273438 L 995.875 542.765625 C 998.015625 663.4375 999.515625 793.925781 1000.964844 920.125 C 1001.214844 942.386719 1001.472656 964.390625 1001.722656 986.011719 C 1004.074219 1101.515625 1002.433594 1211.832031 996.847656 1313.890625 M 971.835938 1315.003906 C 970.675781 1315.070312 969.507812 1315.140625 968.355469 1315.222656 L 967.917969 1315.25 L 967.835938 1314.8125 C 949.972656 1214.992188 935.019531 1106.605469 923.394531 992.660156 C 920.984375 970.988281 918.535156 948.925781 916.058594 926.613281 C 902.261719 802.394531 887.988281 673.941406 875.542969 555.089844 L 875.492188 554.609375 L 877.933594 554.289062 L 884.789062 603.230469 C 897.695312 696.59375 916.15625 831.242188 930.832031 942.476562 C 933.109375 959.542969 935.589844 977.40625 937.980469 994.6875 C 944.515625 1041.917969 951.285156 1090.761719 956.152344 1136.472656 C 962.261719 1194.019531 968.457031 1255.414062 972.304688 1314.472656 L 972.335938 1314.972656 Z M 945.945312 1317.371094 C 944.757812 1317.519531 943.566406 1317.679688 942.378906 1317.851562 L 941.957031 1317.910156 L 941.828125 1317.5 C 912.660156 1223.296875 885.371094 1120.546875 860.75 1012.121094 C 855.523438 990.039062 850.195312 967.527344 844.804688 944.746094 C 817.085938 827.664062 788.429688 706.589844 762.636719 594.496094 L 762.527344 594.015625 L 764.917969 593.425781 L 777.371094 639.9375 C 796.515625 711.886719 832.992188 849.472656 862.320312 962.609375 C 866.578125 978.914062 871.125 995.988281 875.515625 1012.492188 C 887.449219 1057.324219 899.785156 1103.675781 909.878906 1147.246094 C 922.574219 1202.054688 935.78125 1260.535156 946.375 1316.78125 L 946.476562 1317.3125 Z M 920.304688 1321.628906 C 919.105469 1321.871094 917.925781 1322.121094 916.746094 1322.390625 L 916.347656 1322.480469 L 916.179688 1322.109375 C 865.707031 1211.222656 823.125 1097.066406 788.136719 1000.035156 C 748.511719 893.597656 702.792969 769.226562 662.707031 658.820312 L 662.539062 658.359375 L 664.835938 657.46875 L 682.089844 700.054688 C 714.925781 781.601562 762.058594 899.046875 800.132812 995.425781 C 833.398438 1077.566406 868.296875 1164.890625 897.164062 1250.21875 C 906.679688 1277.796875 914.160156 1300.277344 920.6875 1320.988281 L 920.855469 1321.519531 Z M 894.316406 1328.296875 C 893.085938 1328.675781 891.878906 1329.054688 890.679688 1329.457031 L 890.308594 1329.578125 L 890.097656 1329.238281 C 879.921875 1312.792969 869.105469 1294.648438 856.0625 1272.148438 C 814.046875 1200.855469 774.644531 1124.027344 737.886719 1051.433594 C 690.105469 959.132812 634.65625 850.824219 585.757812 754.300781 L 585.539062 753.863281 L 587.695312 752.710938 L 608.257812 789.589844 C 627.742188 824.746094 676.582031 912.910156 709.148438 972.214844 C 724.851562 1000.984375 764.136719 1072.816406 789.617188 1118.4375 C 828.152344 1188.582031 863.476562 1258.964844 894.625 1327.605469 L 894.855469 1328.125 Z M 1427.398438 747.8125 C 1400.308594 693.585938 1359.246094 648.414062 1306.792969 612.316406 C 1212.980469 547.742188 1103.515625 516.316406 994.757812 516.855469 C 886 516.316406 776.53125 547.742188 682.71875 612.316406 C 630.269531 648.414062 589.207031 693.585938 562.117188 747.8125 C 542.914062 786.25 552.929688 819.167969 573.953125 852.3125 C 675.691406 1012.75 772.554688 1170.078125 859.46875 1340.671875 C 863.617188 1366.832031 854.730469 1409.996094 880.75 1432.066406 C 911.601562 1458.226562 953.511719 1472.960938 994.757812 1472.582031 C 1036 1472.960938 1077.914062 1458.226562 1108.761719 1432.066406 C 1134.78125 1409.996094 1125.894531 1366.832031 1130.042969 1340.671875 C 1216.960938 1170.078125 1313.820312 1012.75 1415.5625 852.3125 C 1436.582031 819.167969 1446.601562 786.25 1427.398438 747.8125 ' /> </g>";
const OJO_VER = "<svg width='17' height='17' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.7' stroke-linecap='round'><path d='M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z'/><circle cx='12' cy='12' r='2.6'/></svg>";
const OJO_NO  = "<svg width='17' height='17' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.7' stroke-linecap='round'><path d='M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z'/><circle cx='12' cy='12' r='2.6'/><path d='M4 20 20 4'/></svg>";
const PT_CSS  = `.pt-env{min-height:100dvh;display:grid;place-items:center;padding:28px 20px;position:relative;overflow:hidden}
.pt-fondo{position:absolute;right:-16%;bottom:-40%;width:min(78vw,880px);color:var(--cocoa);opacity:.055;pointer-events:none}
@media(max-width:640px){.pt-fondo{right:-40%;bottom:-10%;width:132vw;opacity:.04}}
.pt-caja{position:relative;width:100%;max-width:414px;background:var(--campo);border:1px solid var(--borde);border-radius:var(--r);box-shadow:var(--sombra2);padding:42px 38px 30px}
@media(max-width:420px){.pt-caja{padding:34px 24px 26px}}
.pt-ab{width:31px;height:33px;color:var(--cocoa);display:block}
.pt-ceja{font:500 10.5px/1 var(--sans);letter-spacing:.3em;text-transform:uppercase;color:var(--rosa);margin:19px 0 0}
.pt-caja h1{font:600 31px/1.08 var(--serif);font-variation-settings:'opsz' 40;color:var(--cocoa);margin:6px 0 0;letter-spacing:-.015em}
.pt-sub{font:400 14px/1.5 var(--sans);color:var(--cocoa2);margin:9px 0 27px}
.pt-campo{margin-bottom:15px;position:relative}
.pt-campo label{display:block;font:500 10.5px/1 var(--sans);letter-spacing:.16em;text-transform:uppercase;color:var(--cocoa2);margin:0 0 7px}
.pt-campo input{width:100%;height:48px;padding:0 14px;border:1px solid var(--borde);border-radius:var(--r3);background:var(--campo);font:400 15.5px/1 var(--sans);color:var(--cocoa);transition:border-color .18s var(--ease),box-shadow .18s var(--ease)}
.pt-campo input::placeholder{color:var(--cocoa2);opacity:.34}
.pt-campo input:focus{outline:0;border-color:var(--cocoa);box-shadow:0 0 0 3px rgba(207,165,155,.3)}
.pt-campo.mal input{border-color:var(--vino);box-shadow:0 0 0 3px rgba(106,44,47,.12)}
.pt-campo input[type=password]{padding-right:46px;letter-spacing:.14em}
.pt-ojo{position:absolute;right:6px;bottom:6px;width:36px;height:36px;display:grid;place-items:center;border:0;background:none;color:var(--cocoa2);opacity:.6;cursor:pointer;border-radius:8px;transition:opacity .18s,background .18s}
.pt-ojo:hover{opacity:1;background:var(--nude3)}
.pt-ojo:focus-visible{outline:2px solid var(--cocoa);outline-offset:1px;opacity:1}
.pt-entrar{width:100%;height:48px;margin-top:10px;border:0;border-radius:var(--r3);background:var(--cocoa);color:var(--crema);font:600 14.5px/1 var(--sans);cursor:pointer;transition:background .18s var(--ease),transform .1s var(--ease)}
.pt-entrar:hover{background:var(--vino)}
.pt-entrar:active{transform:translateY(1px)}
.pt-entrar:focus-visible{outline:2px solid var(--cocoa);outline-offset:2px}
.pt-entrar[disabled]{opacity:.5;cursor:default;transform:none}
.pt-aviso{font:400 13px/1.45 var(--sans);color:var(--vino);margin:12px 0 0;min-height:1.2em}
.pt-pie{font:400 12.5px/1.5 var(--sans);color:var(--cocoa2);opacity:.85;margin:23px 0 0;padding-top:17px;border-top:1px solid var(--linea)}
@media(prefers-reduced-motion:reduce){.pt-caja *,.pt-entrar{transition:none!important}}`;

document.title = 'Panel NIXA';

function ptEstilos() {
  if (document.getElementById('pt-css')) return;
  const s = document.createElement('style');
  s.id = 'pt-css'; s.textContent = PT_CSS;
  document.head.appendChild(s);
}

function pantallaEntrada(aviso) {
  ptEstilos();
  document.body.innerHTML =
    '<svg width="0" height="0" style="position:absolute" aria-hidden="true">'
  + '<symbol id="pt-ab" viewBox="0 0 885.8 955.7">' + AB_D + '</symbol></svg>'
  + '<div class="pt-env">'
  + '<svg class="pt-fondo" viewBox="0 0 885.8 955.7" aria-hidden="true"><use href="#pt-ab"/></svg>'
  + '<main class="pt-caja">'
  + '<svg class="pt-ab" viewBox="0 0 885.8 955.7" role="img" aria-label="NIXA"><use href="#pt-ab"/></svg>'
  + '<p class="pt-ceja">NIXA</p>'
  + '<h1>Panel</h1>'
  + '<p class="pt-sub">El día del negocio, en un solo lugar.</p>'
  + '<form id="pt-form" novalidate>'
  + '<div class="pt-campo" id="pt-cu"><label for="pt-u">Usuario</label>'
  + '<input id="pt-u" name="username" autocomplete="username" autocapitalize="none" spellcheck="false" placeholder="alan o majo"></div>'
  + '<div class="pt-campo" id="pt-cp"><label for="pt-p">Contraseña</label>'
  + '<input id="pt-p" name="password" type="password" autocomplete="current-password" placeholder="••••••">'
  + '<button class="pt-ojo" id="pt-ojo" type="button" aria-label="Ver la contraseña" aria-pressed="false">' + OJO_VER + '</button></div>'
  + '<button class="pt-entrar" id="pt-entrar" type="submit">Entrar</button>'
  + '<p class="pt-aviso" id="pt-aviso" role="status" aria-live="polite">' + (aviso || '') + '</p>'
  + '</form>'
  + '<p class="pt-pie">¿Olvidaste la contraseña? Pídesela a Jarvis en el grupo.</p>'
  + '</main></div>';

  const f = document.getElementById('pt-form');
  const cu = document.getElementById('pt-cu'), cp = document.getElementById('pt-cp');
  const u = document.getElementById('pt-u'), p = document.getElementById('pt-p');
  const m = document.getElementById('pt-aviso'), b = document.getElementById('pt-entrar');
  const ojo = document.getElementById('pt-ojo');

  u.focus();
  const limpia = () => { cu.classList.remove('mal'); cp.classList.remove('mal'); m.textContent = ''; };
  u.oninput = limpia; p.oninput = limpia;

  ojo.onclick = () => {
    const oculta = p.type === 'password';
    p.type = oculta ? 'text' : 'password';
    ojo.innerHTML = oculta ? OJO_NO : OJO_VER;
    ojo.setAttribute('aria-label', oculta ? 'Ocultar la contraseña' : 'Ver la contraseña');
    ojo.setAttribute('aria-pressed', String(oculta));
    p.focus();
  };

  f.onsubmit = async (e) => {
    e.preventDefault();
    limpia();
    const usuario = (u.value || '').trim().toLowerCase();
    const quien = EQUIPO[usuario];
    if (!quien) { cu.classList.add('mal'); m.textContent = 'Ese usuario no existe. Son alan o majo.'; u.focus(); return; }
    if (!p.value) { cp.classList.add('mal'); m.textContent = 'Falta la contraseña.'; p.focus(); return; }
    b.disabled = true; b.textContent = 'Entrando…';
    let error = null;
    try { error = (await sb.auth.signInWithPassword({ email: quien.correo, password: p.value })).error; }
    catch (err) { error = { message: 'sin conexion' }; }
    if (error) {
      b.disabled = false; b.textContent = 'Entrar';
      cp.classList.add('mal');
      m.textContent = /conexi/.test(error.message || '')
        ? 'No hay conexión. Revisa tu internet y vuelve a intentar.'
        : 'Contraseña incorrecta.';
      p.select();
      return;
    }
    location.reload();
  };
}

/* Pantalla de "pon tu propia contraseña": aparece una sola vez por persona,
   la primera vez que entra despues de que Jarvis les creo su cuenta con la
   contraseña compartida "admin". La marca perfiles.debe_cambiar_password
   es la que decide si toca, y se apaga sola en cuanto la cambian. */
function pantallaNuevaContrasena(quien, userId) {
  ptEstilos();
  document.body.innerHTML =
    '<svg width="0" height="0" style="position:absolute" aria-hidden="true">'
  + '<symbol id="pt-ab" viewBox="0 0 885.8 955.7">' + AB_D + '</symbol></svg>'
  + '<div class="pt-env">'
  + '<svg class="pt-fondo" viewBox="0 0 885.8 955.7" aria-hidden="true"><use href="#pt-ab"/></svg>'
  + '<main class="pt-caja">'
  + '<svg class="pt-ab" viewBox="0 0 885.8 955.7" role="img" aria-label="NIXA"><use href="#pt-ab"/></svg>'
  + '<p class="pt-ceja">NIXA</p>'
  + '<h1>Hola, ' + quien.nombre.split(' ')[0] + '</h1>'
  + '<p class="pt-sub">Tu cuenta todavía tiene la contraseña genérica que te dio Jarvis. Antes de entrar, pon una que solo tú sepas.</p>'
  + '<form id="pt-form" novalidate>'
  + '<div class="pt-campo" id="pt-cp"><label for="pt-p">Nueva contraseña</label>'
  + '<input id="pt-p" name="new-password" type="password" autocomplete="new-password" placeholder="mínimo 6 caracteres">'
  + '<button class="pt-ojo" id="pt-ojo" type="button" aria-label="Ver la contraseña" aria-pressed="false">' + OJO_VER + '</button></div>'
  + '<div class="pt-campo" id="pt-cp2"><label for="pt-p2">Repítela</label>'
  + '<input id="pt-p2" name="new-password-2" type="password" autocomplete="new-password" placeholder="otra vez, igual"></div>'
  + '<button class="pt-entrar" id="pt-entrar" type="submit">Guardar y entrar</button>'
  + '<p class="pt-aviso" id="pt-aviso" role="status" aria-live="polite"></p>'
  + '</form>'
  + '<p class="pt-pie">Solo tú vas a saber esta contraseña; ni Jarvis ni ' + (quien.nombre.split(' ')[0] === 'Alan' ? 'Majo' : 'Alan') + ' la van a ver.</p>'
  + '</main></div>';

  const f = document.getElementById('pt-form');
  const cp = document.getElementById('pt-cp'), cp2 = document.getElementById('pt-cp2');
  const p = document.getElementById('pt-p'), p2 = document.getElementById('pt-p2');
  const m = document.getElementById('pt-aviso'), b = document.getElementById('pt-entrar');
  const ojo = document.getElementById('pt-ojo');

  p.focus();
  const limpia = () => { cp.classList.remove('mal'); cp2.classList.remove('mal'); m.textContent = ''; };
  p.oninput = limpia; p2.oninput = limpia;

  ojo.onclick = () => {
    const oculta = p.type === 'password';
    p.type = p2.type = oculta ? 'text' : 'password';
    ojo.innerHTML = oculta ? OJO_NO : OJO_VER;
    ojo.setAttribute('aria-label', oculta ? 'Ocultar la contraseña' : 'Ver la contraseña');
    ojo.setAttribute('aria-pressed', String(oculta));
    p.focus();
  };

  f.onsubmit = async (e) => {
    e.preventDefault();
    limpia();
    if (p.value.length < 6) { cp.classList.add('mal'); m.textContent = 'Necesita al menos 6 caracteres.'; p.focus(); return; }
    if (p.value !== p2.value) { cp2.classList.add('mal'); m.textContent = 'Las dos contraseñas no son iguales.'; p2.focus(); return; }
    b.disabled = true; b.textContent = 'Guardando…';
    let error = null;
    try { error = (await sb.auth.updateUser({ password: p.value })).error; }
    catch (err) { error = { message: 'sin conexion' }; }
    if (error) {
      b.disabled = false; b.textContent = 'Guardar y entrar';
      cp.classList.add('mal');
      m.textContent = /conexi/.test(error.message || '')
        ? 'No hay conexión. Revisa tu internet y vuelve a intentar.'
        : 'No se pudo guardar: ' + error.message;
      return;
    }
    try { await sb.from('perfiles').update({ debe_cambiar_password: false }).eq('id', userId); } catch (err) {}
    location.reload();
  };
}

async function puerta() {
  let sesion = null;
  try { sesion = (await sb.auth.getSession()).data.session; } catch (e) {}
  const correo = ((sesion && sesion.user && sesion.user.email) || '').toLowerCase();
  const quien = Object.keys(EQUIPO).map(k => EQUIPO[k]).filter(x => x.correo === correo)[0];
  if (!quien) {
    if (correo) { try { await sb.auth.signOut(); } catch (e) {} }
    return pantallaEntrada(correo ? 'Esa cuenta no es del equipo de NIXA.' : '');
  }
  let debeCambiar = false;
  try {
    const r = await sb.from('perfiles').select('debe_cambiar_password').eq('id', sesion.user.id).maybeSingle();
    debeCambiar = !!(r.data && r.data.debe_cambiar_password);
  } catch (e) {}
  if (debeCambiar) return pantallaNuevaContrasena(quien, sesion.user.id);
  arranca(quien.nombre);
}
puerta();
