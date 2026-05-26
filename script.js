const productos = [
  {
    nombre: "Real Madrid 24/25",
    categoria: "real",
    imagenes: ["real-madrid-24-25.jpg", "real.webp"],
    precioBase: 19.99,
    precioExtra: 19.99,
  },
  {
    nombre: "Barcelona 24/25",
    categoria: "barca",
    imagenes: ["barca.jpeg", "barca.jpeg"],
    precioBase: 35,
    precioExtra: 40
  },
  {
    nombre: "Argentina 24/25",
    categoria: "seleccion",
    imagenes: ["argentina-24-25.jpeg", "argentina-24-25.jpeg"],
    precioBase: 22,
    precioExtra: 22
  }
];

let posiciones = {};
let startX = 0;

// PRECIO
function obtenerPrecio(p, talla) {
  const normales = ["S","M","L","XL","XXL"];
  return normales.includes(talla) ? p.precioBase : p.precioExtra;
}

// MOSTRAR PRODUCTOS
function mostrarProductos(lista) {
  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = "";

  lista.forEach((p, i) => {

    const imgs = p.imagenes.map(img => `<img src="${img}" onclick="abrirModal('${img}')">`).join("");

    const dots = p.imagenes.map((_,d) =>
  `<span id="dot-${i}-${d}" onclick="irASlide(${i}, ${d})"></span>`
).join("");

    contenedor.innerHTML += `
      <div class="card">

        <div class="carousel"
          ontouchstart="touchStart(event)"
          ontouchend="touchEnd(event, ${i})">

          <div class="carousel-track" id="track-${i}">
            ${imgs}
          </div>

        </div>

        <div class="dots">
          ${dots}
        </div>

        <h3>${p.nombre}</h3>

        <p class="precio" id="precio-${i}">
          Desde $${Math.min(p.precioBase, p.precioExtra)}
        </p>

        <select id="talla-${i}" onchange="actualizarPrecio(${i})">
          <option value="">Selecciona talla</option>
          <option>S</option><option>M</option><option>L</option>
          <option>XL</option><option>XXL</option>
          <option>3XL</option><option>4XL</option>
        </select>

        <a href="#" class="btn" onclick="comprar(${i})">
          Comprar ahora
        </a>

      </div>
    `;

    actualizarDots(i);
  });
}

// CARRUSEL
function moverCarrusel(i, dir) {
  const track = document.getElementById(`track-${i}`);
  const total = productos[i].imagenes.length;

  if (!posiciones[i]) posiciones[i] = 0;

  posiciones[i] += dir;

  if (posiciones[i] < 0) posiciones[i] = total - 1;
  if (posiciones[i] >= total) posiciones[i] = 0;

  track.style.transform = `translateX(-${posiciones[i] * 100}%)`;

  actualizarDots(i);
}

// SWIPE
function touchStart(e) {
  startX = e.touches[0].clientX;
}

function touchEnd(e, i) {
  let endX = e.changedTouches[0].clientX;

  if (startX - endX > 50) moverCarrusel(i, 1);
  if (startX - endX < -50) moverCarrusel(i, -1);
}

// DOTS
function actualizarDots(i) {
  const total = productos[i].imagenes.length;

  for (let d = 0; d < total; d++) {
    const dot = document.getElementById(`dot-${i}-${d}`);
    if (!dot) continue;

    dot.classList.remove("active");

    if (d === (posiciones[i] || 0)) {
      dot.classList.add("active");
    }
  }
}

// PRECIO
function actualizarPrecio(i) {
  const talla = document.getElementById(`talla-${i}`).value;
  const p = productos[i];

  if (!talla) {
    document.getElementById(`precio-${i}`).innerText = `Desde $${p.precioBase}`;
    return;
  }

  document.getElementById(`precio-${i}`).innerText =
  `Desde $${obtenerPrecio(p, talla)}`;
}

// COMPRAR
function comprar(i) {
  const p = productos[i];
  const talla = document.getElementById(`talla-${i}`).value;

  if (!talla) return alert("Selecciona talla");

  const precio = obtenerPrecio(p, talla);

  const msg = `Hola 👋 quiero ${p.nombre} talla ${talla} por $${precio}`;

  navigator.clipboard.writeText(msg);

  const toast = document.getElementById("toast");
  toast.innerText = "TU CHEMI FC dice: Mensaje copiado";
  toast.classList.add("show");

  setTimeout(() => {
    window.open("https://www.instagram.com/tuchemifcsv");
    toast.classList.remove("show");
  }, 1500);
}

// FILTRO
function filtrar(cat) {
  if (cat === "todos") return mostrarProductos(productos);
  mostrarProductos(productos.filter(p => p.categoria === cat));
}

function irASlide(i, slide) {
  const track = document.getElementById(`track-${i}`);
  posiciones[i] = slide;

  track.style.transform = `translateX(-${slide * 100}%)`;

  actualizarDots(i);
}

function abrirModal(src) {
  const modal = document.getElementById("modal");
  const img = document.getElementById("modal-img");

  img.src = src;
  modal.classList.add("show");
}

function cerrarModal() {
  document.getElementById("modal").classList.remove("show");
}

// INICIO
mostrarProductos(productos);