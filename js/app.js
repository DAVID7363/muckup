// ===== CARRITO (se guarda en localStorage) =====
const CLAVE = 'carritoSuperVerde';
const leer = () => JSON.parse(localStorage.getItem(CLAVE) || '[]');
const guardar = (c) => { localStorage.setItem(CLAVE, JSON.stringify(c)); contador(); };

function contador() {
  const n = leer().reduce((suma, p) => suma + p.cant, 0);
  document.querySelectorAll('.contador').forEach((e) => (e.textContent = n));
}

// ===== BOTONES "AGREGAR" =====
document.querySelectorAll('.btn-agregar').forEach((btn) => {
  btn.addEventListener('click', () => {
    const carrito = leer();
    const nombre = btn.dataset.nombre;
    const precio = parseFloat(btn.dataset.precio);
    const existente = carrito.find((p) => p.nombre === nombre);
    if (existente) existente.cant++;
    else carrito.push({ nombre, precio, cant: 1 });
    guardar(carrito);

    // el botón cambia de texto y color un momento
    btn.textContent = ' Agregado';
    btn.classList.add('agregado');
    setTimeout(() => {
      btn.textContent = ' Agregar';
      btn.classList.remove('agregado');
    }, 1200);
  });
});

// ===== MOSTRAR CARRITO =====
const cuerpo = document.getElementById('cuerpo-carrito');
function mostrarCarrito() {
  if (!cuerpo) return;
  const carrito = leer();
  cuerpo.innerHTML = '';
  let total = 0;
  carrito.forEach((p, i) => {
    const sub = p.precio * p.cant;
    total += sub;
    const fila = document.createElement('tr');
    fila.innerHTML = `<td>${p.nombre}</td><td>$${p.precio.toFixed(2)}</td><td>${p.cant}</td>
      <td>$${sub.toFixed(2)}</td><td><button class="btn" data-i="${i}">Quitar</button></td>`;
    cuerpo.appendChild(fila);
  });
  if (!carrito.length) cuerpo.innerHTML = '<tr><td colspan="5">Tu carrito está vacío.</td></tr>';
  document.getElementById('total').textContent = '$' + total.toFixed(2);
}
if (cuerpo) {
  cuerpo.addEventListener('click', (e) => {
    if (e.target.dataset.i === undefined) return;
    const carrito = leer();
    carrito.splice(e.target.dataset.i, 1);
    guardar(carrito);
    mostrarCarrito();
  });
  mostrarCarrito();
}

// ===== PAGO SIMULADO =====
const formPago = document.getElementById('form-pago');
if (formPago) {
  formPago.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!leer().length) { alert('Agrega productos antes de pagar.'); return; }
    alert('¡Pago simulado exitoso! Gracias por tu compra.');
    guardar([]);
    formPago.reset();
    mostrarCarrito();
  });
}

// ===== IMAGEN DE REEMPLAZO si todavía no existe la foto =====
document.querySelectorAll('img').forEach((img) => {
  const poner = () => {
    img.onerror = null;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="#c8e6c9"/><text x="50%" y="50%" text-anchor="middle" font-size="28" fill="#1b5e20" font-family="Arial">${img.alt}</text></svg>`;
    img.src = 'data:image/svg+xml,' + encodeURIComponent(svg);
  };
  img.onerror = poner;
  if (img.complete && img.naturalWidth === 0) poner();
});

contador();
