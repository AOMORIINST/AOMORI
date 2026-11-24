// ENLACES DE AOMORI
const contacts = {
  Instagram: "https://www.instagram.com/aomori.performance/", // Formato: https://www.instagram.com/TU_USUARIO/
  WhatsApp: "3444580780"   // Formato: https://wa.me/NUMERO_CON_CODIGO_DE_PAIS
};

// GUÍA DE TALLES
const sizes = [
  ["XS", "34–42 kg"],
  ["S", "42–49 kg"],
  ["M", "49–57 kg"],
  ["L", "57–65 kg"],
  ["XL", "65–72 kg"],
  ["2XL", "72–80 kg"],
  ["3XL", "Desde 80 kg"]
];

// SHORTS DE LA COLECCIÓN
const models = [
  {
    image: "azul",
    name: "Neme Team",
    color: "Azul, celeste y blanco",
    description:
      "El azul intenso enmarca las letras doradas del frente. " +
      "En los laterales, las banderas de Argentina y Tailandia completan el diseño."
  },
  {
    image: "ml",
    name: "Saiyajin",
    color: "Azul y dorado",
    description:
      "Dos mitades de color se encuentran bajo la palabra Saiyajin. " +
      "El emblema sobre la pierna dorada completa el diseño inspirado en Dragon Ball."
  },
  {
    image: "negro",
    name: "Neme Team Noir",
    color: "Negro con letras verdes",
    description:
      "El brillo del negro le da protagonismo al color de las letras. " +
      "Una combinación oscura con el detalle de Aomori en la cintura."
  }
];

// MENÚ MÓVIL
const navigation = document.querySelector("#nav");
const menuButton = document.querySelector(".menubtn");

function setMenu(open) {
  navigation.classList.toggle("open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
}

menuButton.addEventListener("click", () => {
  setMenu(!navigation.classList.contains("open"));
});

navigation.addEventListener("click", () => setMenu(false));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navigation.classList.contains("open")) {
    setMenu(false);
    menuButton.focus();
  }
});

// VENTANA DE DETALLES
const dialog = document.querySelector("#detail");
const detailBody = document.querySelector("#detailbody");

function showDetails(title, description, imagePath = "") {
  detailBody.replaceChildren();

  if (imagePath) {
    const image = document.createElement("img");
    image.className = "detailpic";
    image.src = imagePath;
    image.alt = `Short ${title}`;
    detailBody.append(image);
  }

  const text = document.createElement("div");
  text.className = "detailtext";

  const heading = document.createElement("h3");
  heading.id = "detail-title";
  heading.textContent = title;

  const paragraph = document.createElement("p");
  paragraph.textContent = description;

  text.append(heading, paragraph);
  detailBody.append(text);
  dialog.setAttribute("aria-labelledby", heading.id);

  if (!dialog.open) dialog.showModal();
}

document.querySelector(".close").addEventListener("click", () => {
  dialog.close();
});

// Cierra la ficha cuando se hace clic en el fondo.
dialog.addEventListener("click", (event) => {
  if (event.target !== dialog) return;

  const rect = dialog.getBoundingClientRect();
  const outside =
    event.clientX < rect.left || event.clientX > rect.right ||
    event.clientY < rect.top || event.clientY > rect.bottom;

  if (outside) dialog.close();
});

// BOTONES DE INSTAGRAM Y WHATSAPP
function addContact(name, container, compact) {
  const url = contacts[name];
  const item = document.createElement(url ? "a" : "button");

  if (url) {
    item.href = url;
    item.target = "_blank";
    item.rel = "noopener noreferrer";
  } else {
    item.type = "button";
    item.addEventListener("click", () => {
      showDetails(
        name,
        `El contacto de Aomori por ${name} estará disponible próximamente.`
      );
    });
  }

  item.setAttribute("aria-label", `${name} de Aomori`);
  if (!compact) item.className = "btn channel";

  const iconId = name.toLowerCase();
  item.innerHTML = `<svg aria-hidden="true"><use href="#${iconId}"></use></svg>`;

  if (!compact) item.append(document.createTextNode(name));
  container.append(item);
}

for (const name of Object.keys(contacts)) {
  addContact(name, document.querySelector(".social"), true);
  addContact(name, document.querySelector(".channels"), false);
}

// TABLA DE TALLES
const sizeTable = document.querySelector("#sizes");

for (const [size, weight] of sizes) {
  const row = sizeTable.insertRow();
  const heading = document.createElement("th");
  heading.scope = "row";
  heading.textContent = size;
  row.append(heading);

  const cell = row.insertCell();
  cell.textContent = weight;
}

// TARJETAS DE LA COLECCIÓN
const cards = document.querySelector("#cards");

for (const model of models) {
  const button = document.createElement("button");
  button.className = "product";
  button.type = "button";
  button.setAttribute("aria-label", `Ver ${model.name}`);

  const tile = document.createElement("span");
  tile.className = "tile";

  const photo = document.createElement("img");
  const imagePath = `assets/${model.image}.webp`;
  photo.src = imagePath;
  photo.alt = `Short de Muay Thai ${model.color.toLowerCase()}`;
  photo.loading = "lazy";
  tile.append(photo);

  const info = document.createElement("span");
  info.className = "prodinfo";

  const label = document.createElement("span");
  const name = document.createElement("strong");
  name.textContent = model.name;

  const color = document.createElement("small");
  color.textContent = model.color;
  label.append(name, color);

  const plus = document.createElement("span");
  plus.className = "plus";
  plus.setAttribute("aria-hidden", "true");
  plus.textContent = "+";

  info.append(label, plus);
  button.append(tile, info);

  button.addEventListener("click", () => {
    showDetails(model.name, model.description, imagePath);
  });

  cards.append(button);
}
