/* ============================================================
   LA PUERTA — usuario y contraseña (8-sep-2026).
   Antes esto era público: cualquiera que supiera la dirección
   veía caja, ventas, inventario y las cuentas entre los dos.
   Se entra con usuario (alan / majo) y contraseña.
   OJO: la cerradura de verdad está en la base, con permisos por
   correo. Esta pantalla es la comodidad; si alguien se saltara
   esta página, la base igual no le entregaría nada.
   El usuario corto se traduce aquí al correo de la cuenta.
   ============================================================ */
const EQUIPO = {
  alan: { correo: 'alansahagunnavarro@gmail.com', nombre: 'Alan' },
  majo: { correo: 'majodiezmtz@gmail.com',        nombre: 'Majo' }
};

function pantallaEntrada(aviso) {
  // Se conserva el bloque de <defs> de la marca antes de vaciar el cuerpo:
  // si se borra, el <use href="#abanico"> de abajo se queda sin dibujo.
  const marca = document.querySelector('svg[width="0"]');
  document.body.innerHTML = '';
  if (marca) document.body.appendChild(marca);
  document.body.insertAdjacentHTML('beforeend',
    '<div style="min-height:100dvh;display:grid;place-items:center;padding:40px 24px">'
  + '<div style="width:100%;max-width:30ch;text-align:center">'
  + '<svg viewBox="0 0 100 100" style="width:44px;height:44px;color:var(--cocoa);margin-bottom:18px" aria-hidden="true"><use href="#abanico"/></svg>'
  + '<h1 style="font:600 clamp(25px,6.2vw,31px)/1.12 var(--serif);font-variation-settings:\'SOFT\' 70,\'WONK\' 1;color:var(--cocoa);margin:0">El Orquestador</h1>'
  + '<p style="font:400 14.5px/1.5 var(--sans);color:var(--cocoa2);margin:9px 0 22px">Entra con tu usuario.</p>'
  + '<form id="fEntrar" style="display:grid;gap:10px">'
  + '<input id="cUsuario" required autocomplete="username" autocapitalize="none" spellcheck="false" placeholder="usuario" '
  + 'style="min-height:48px;padding:0 15px;border:1px solid var(--linea,#E4D8CF);border-radius:10px;background:#fff;'
  + 'font:400 16px/1.2 var(--sans);color:var(--cocoa);text-align:center">'
  + '<input id="cClave" type="password" required autocomplete="current-password" placeholder="contraseña" '
  + 'style="min-height:48px;padding:0 15px;border:1px solid var(--linea,#E4D8CF);border-radius:10px;background:#fff;'
  + 'font:400 16px/1.2 var(--sans);color:var(--cocoa);text-align:center">'
  + '<button type="submit" id="bEntrar" style="min-height:48px;border:0;border-radius:10px;background:var(--cocoa);'
  + 'color:var(--crema);font:600 14.5px/1.2 var(--sans);cursor:pointer">Entrar</button>'
  + '</form>'
  + '<p id="mEntrar" style="font:400 13.5px/1.5 var(--sans);color:var(--cocoa2);margin:15px 0 0;min-height:1.5em">'
  + (aviso || '') + '</p>'
  + '</div></div>');

  const f = document.getElementById('fEntrar');
  const m = document.getElementById('mEntrar');
  const b = document.getElementById('bEntrar');
  document.getElementById('cUsuario').focus();
  f.onsubmit = async (e) => {
    e.preventDefault();
    const u = (document.getElementById('cUsuario').value || '').trim().toLowerCase();
    const clave = document.getElementById('cClave').value;
    const p = EQUIPO[u];
    if (!p) { m.textContent = 'Ese usuario no existe. Son Alan o Majo.'; return; }
    b.disabled = true; b.textContent = 'Entrando…'; m.textContent = '';
    const { error } = await sb.auth.signInWithPassword({ email: p.correo, password: clave });
    if (error) {
      b.disabled = false; b.textContent = 'Entrar';
      m.textContent = 'Contraseña incorrecta.';
      return;
    }
    location.reload();
  };
}

// Un botón discreto para salir, para cuando se comparte la computadora.
function ponSalir() {
  if (document.getElementById('bSalir')) return;
  const b = document.createElement('button');
  b.id = 'bSalir'; b.type = 'button'; b.textContent = 'Salir';
  b.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:60;min-height:34px;padding:0 14px;'
    + 'border:1px solid var(--linea,#E4D8CF);border-radius:999px;background:var(--crema,#fff);'
    + 'color:var(--cocoa2);font:500 12.5px/1.2 var(--sans);cursor:pointer;opacity:.75';
  b.onclick = async () => { try { await sb.auth.signOut(); } catch (e) {} location.reload(); };
  document.body.appendChild(b);
}

async function puerta() {
  let sesion = null;
  try { sesion = (await sb.auth.getSession()).data.session; } catch (e) {}
  const correo = ((sesion && sesion.user && sesion.user.email) || '').toLowerCase();
  const quien = Object.keys(EQUIPO).map(k => EQUIPO[k]).filter(p => p.correo === correo)[0];
  if (!quien) {
    if (correo) { try { await sb.auth.signOut(); } catch (e) {} }
    return pantallaEntrada(correo ? 'Esa cuenta no es del equipo de NIXA.' : '');
  }
  guardaQuien(quien.nombre);
  arranca(quien.nombre);
  ponSalir();
}
puerta();
