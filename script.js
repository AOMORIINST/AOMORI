const whatsapp = "5493444580780";  // Argentina: 549 + código de área + número.
const instagram = "aomori.performance"; // Usuario de AOMORI, con o sin @.

const telefono = whatsapp.replace(/\D/g, "");
const usuario = instagram.trim().replace(/^@/, "");
const movimientoReducido = window.matchMedia("(prefers-reduced-motion: reduce)");

function urlWhatsApp(mensaje) {
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

// Cada consulta abre WhatsApp con un mensaje acorde a la sección.
const destinos = {
  general: urlWhatsApp(
    "¡Hola, AOMORI! Vi sus shorts de Muay Thai. " +
    "¿Qué modelos y talles tienen disponibles para envío?"
  ),

  equipo: urlWhatsApp(
    "¡Hola, AOMORI! Quiero consultar por shorts personalizados para mi equipo.\n" +
    "Nombre del equipo: \n" +
    "Cantidad aproximada: \n" +
    "Fecha y localidad: "
  ),

  talle: urlWhatsApp(
    "¡Hola, AOMORI! Necesito ayuda para elegir mi talle.\n" +
    "Modelo que me gustó: \n" +
    "Contorno de cintura: \n" +
    "Contorno de cadera: \n" +
    "Largo de un short que uso: "
  ),

  instagram: usuario
    ? `https://www.instagram.com/${encodeURIComponent(usuario)}/`
    : ""
};

document.querySelectorAll("[data-contacto]").forEach(enlace => {
  conectar(enlace, destinos[enlace.dataset.contacto]);
});

// Las secciones se animan una sola vez al entrar en pantalla.
if ("IntersectionObserver" in window && !movimientoReducido.matches) {
  const observador = new IntersectionObserver(entradas => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("visible");
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll(".revelar").forEach(elemento => {
    observador.observe(elemento);
  });
}

// Ficha ampliada de producto.
const tarjetas = Array.from(document.querySelectorAll("[data-producto]"));
const ficha = document.querySelector("#ficha");
const foto = document.querySelector("#ficha-imagen");
const nombre = document.querySelector("#ficha-nombre");
const descripcion = document.querySelector("#ficha-descripcion");
const consulta = document.querySelector("#consultar-modelo");

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
    urlWhatsApp(
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
      { duration: 200, easing: "ease-out" }
    );
  }
}

tarjetas.forEach((tarjeta, indice) => {
  // En navegadores sin diálogo nativo, el enlace abre la imagen.
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

document.querySelector("#anterior").addEventListener("click", () => {
  cambiarModelo(-1);
});

document.querySelector("#siguiente").addEventListener("click", () => {
  cambiarModelo(1);
});

// También se puede navegar con las flechas del teclado y cerrar con Escape.
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

// Cierra al tocar el fondo exterior.
ficha.addEventListener("click", evento => {
  if (evento.target !== ficha) return;

  const rect = ficha.getBoundingClientRect();
  const fuera =
    evento.clientX < rect.left ||
    evento.clientX > rect.right ||
    evento.clientY < rect.top ||
    evento.clientY > rect.bottom;

  if (fuera) ficha.close();
});

ficha.addEventListener("close", () => {
  document.body.classList.remove("ficha-abierta");
  tarjetaDeOrigen?.focus({ preventScroll: true });
});
