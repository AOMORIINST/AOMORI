const whatsapp = "5493444580780";  // Argentina: 549 + código de área + número.
const instagram = "aomori.performance"; // Usuario de AOMORI, con o sin @.

const telefono = whatsapp.replace(/\D/g, "");
const usuario = instagram.trim().replace(/^@/, "");

function enlaceWhatsApp(mensaje) {
  if (!telefono) return "";

  const url = new URL(`https://wa.me/${telefono}`);
  url.searchParams.set("text", mensaje);
  return url.href;
}

function conectar(enlace, destino) {
  if (!destino) {
    enlace.removeAttribute("href");
    enlace.setAttribute("aria-disabled", "true");
    enlace.title = "Contacto pendiente de configurar";
    return;
  }

  enlace.removeAttribute("aria-disabled");
  enlace.removeAttribute("title");
  enlace.href = destino;
  enlace.target = "_blank";
  enlace.rel = "noopener noreferrer";
}

// Contactos principales
const destinos = {
  equipo: enlaceWhatsApp(
    "¡Hola, AOMORI! Quiero shorts personalizados para mi equipo. " +
    "¿Podemos hablar del diseño, la cantidad y los tiempos de confección?"
  ),

  general: enlaceWhatsApp(
    "¡Hola, AOMORI! Vi los short en la web. " +
    "Quisiera Cotizar un Short Personalizado"
  ),

  instagram: usuario
    ? `https://www.instagram.com/${encodeURIComponent(usuario)}/`
    : ""
};

document.querySelectorAll("[data-contacto]").forEach(enlace => {
  conectar(enlace, destinos[enlace.dataset.contacto]);
});

// La ficha toma los nombres, las fotos y las descripciones del HTML.
// Para agregar otro modelo, copiá un artículo de la galería y editá sus datos.
const tarjetas = Array.from(document.querySelectorAll("[data-producto]"));
const ficha = document.querySelector("#ficha");
const foto = document.querySelector("#ficha-imagen");
const nombre = document.querySelector("#ficha-nombre");
const descripcion = document.querySelector("#ficha-descripcion");
const consulta = document.querySelector("#consultar-modelo");
const movimientoReducido = window.matchMedia("(prefers-reduced-motion: reduce)");

let indiceActual = 0;
let tarjetaDeOrigen = null;

function mostrarModelo(indice) {
  indiceActual = (indice + tarjetas.length) % tarjetas.length;

  const tarjeta = tarjetas[indiceActual];
  const articulo = tarjeta.closest("article");
  const miniatura = tarjeta.querySelector("img");
  const nombreModelo = tarjeta.querySelector("h3").textContent.trim();

  foto.src = tarjeta.href;
  foto.alt = miniatura.alt;
  nombre.textContent = nombreModelo;
  descripcion.textContent = articulo
    .querySelector(".descripcion-modelo")
    .textContent.trim();

  conectar(
    consulta,
    enlaceWhatsApp(
      `¡Hola, AOMORI! Me gustó el short ${nombreModelo}. ` +
      "¿Qué talles tenés disponibles? ¿Se puede pedir por encargo?"
    )
  );
}

function cambiarModelo(paso) {
  mostrarModelo(indiceActual + paso);

  if (!movimientoReducido.matches && typeof foto.animate === "function") {
    foto.getAnimations().forEach(animacion => animacion.cancel());

    foto.animate(
      [
        { opacity: 0.45, transform: `translateX(${paso * 8}px)` },
        { opacity: 1, transform: "translateX(0)" }
      ],
      { duration: 220, easing: "ease-out" }
    );
  }
}

tarjetas.forEach((tarjeta, indice) => {
  // Si el navegador no admite el diálogo, el enlace abre la foto.
  if (typeof ficha.showModal !== "function") return;

  tarjeta.setAttribute("aria-haspopup", "dialog");
  tarjeta.setAttribute("aria-controls", "ficha");

  tarjeta.addEventListener("click", evento => {
    if (evento.ctrlKey || evento.metaKey || evento.shiftKey || evento.altKey) {
      return;
    }

    evento.preventDefault();
    tarjetaDeOrigen = tarjeta;
    mostrarModelo(indice);
    ficha.showModal();
    document.body.classList.add("ficha-abierta");
  });
});

document.querySelector("#cerrar-ficha").addEventListener("click", () => {
  ficha.close();
});

document.querySelector("#modelo-anterior").addEventListener("click", () => {
  cambiarModelo(-1);
});

document.querySelector("#modelo-siguiente").addEventListener("click", () => {
  cambiarModelo(1);
});

// En computadora también podés recorrer modelos con las flechas.
// El diálogo nativo admite Escape para cerrar.
ficha.addEventListener("keydown", evento => {
  if (evento.key === "ArrowLeft") {
    evento.preventDefault();
    cambiarModelo(-1);
  }

  if (evento.key === "ArrowRight") {
    evento.preventDefault();
    cambiarModelo(1);
  }
});

// Cerrar al tocar fuera de la ficha.
ficha.addEventListener("click", evento => {
  if (evento.target !== ficha) return;

  const limites = ficha.getBoundingClientRect();
  const fuera =
    evento.clientX < limites.left ||
    evento.clientX > limites.right ||
    evento.clientY < limites.top ||
    evento.clientY > limites.bottom;

  if (fuera) ficha.close();
});

ficha.addEventListener("close", () => {
  document.body.classList.remove("ficha-abierta");
  tarjetaDeOrigen?.focus({ preventScroll: true });
});