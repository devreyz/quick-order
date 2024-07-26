let products = {};

async function loadProducts() {
  try {
    const response = await fetch("http://localhost:3000/products");
    const data = await response.json();
    products = data.reduce((acc, product) => {
      acc[product.name] = { price: product.price, quantity: 0 };
      return acc;
    }, {});
    renderProducts();
  } catch (error) {
    console.error("Erro ao carregar os produtos:", error);
  }
}

function renderProducts() {
  const productsContainer = document.getElementById("products");
  productsContainer.innerHTML = "";

  for (const [name, product] of Object.entries(products)) {
    const productCard = document.createElement("div");
    productCard.className =
      "bg-white h-24 p-4 rounded shadow-md relative overflow-hidden select-none border-2 transition-[border] duration-300 ";
    productCard.onclick = e => {
      createRipple(e, productCard);
      addProduct(name, product.price);
    };

    const productName = document.createElement("h2");
    productName.className = "text-2xl font-semibold mb-2 text-gray-800";
    productName.innerText = name;

    const productPrice = document.createElement("p");
    productPrice.className = "text-gray-500 text-3xl";
    productPrice.innerText = `R$ ${product.price.toFixed(2)}`;

    const productQuantity = document.createElement("span");
    productQuantity.id = `quantity-${name}`;
    productQuantity.className =
      "text-3xl text-gray-700 absolute -top-14 -right-14 rounded-full flex items-end pl-4 pb-3 justify-start bg-orange-500 size-28 font-extrabold text-white hidden";
    productQuantity.innerText = "0";

    productCard.appendChild(productName);
    productCard.appendChild(productPrice);
    productCard.appendChild(productQuantity);
    productsContainer.appendChild(productCard);
  }
}

function createRipple(event, element) {
  const ripple = document.createElement("div");
  ripple.className = "ripple bg-orange-300/50";
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = `${size * 2}px`;
  ripple.style.left = `${event.clientX - rect.left - size}px`;
  ripple.style.top = `${event.clientY - rect.top - size}px`;
  element.appendChild(ripple);
  element.classList.add("border-orange-500");

  ripple.addEventListener("animationend", () => {
    ripple.remove();
    element.classList.remove("border-orange-500");
  });
}

function addProduct(name, price) {
  products[name].quantity += 1;
  const productQuantity = document.getElementById(`quantity-${name}`);
  productQuantity.innerText = `${products[name].quantity}`;
  productQuantity.classList.toggle("hidden", products[name].quantity === 0);
  updateTotal();
  calculateChange();
}

function updateTotal() {
  let total = 0;
  for (const key in products) {
    total += products[key].quantity * products[key].price;
  }
  document.getElementById("total").innerText = total.toFixed(2);
}

function calculateChange() {
  const total = parseFloat(document.getElementById("total").innerText);
  const received = parseFloat(
    Number(document.getElementById("amount-received-display").textContent)
  );
  const change = received - total;
  document.getElementById("change").innerText =
    change >= 0 ? change.toFixed(2) : "0.00";
}

function reset() {
  for (const key in products) {
    products[key].quantity = 0;
    const productQuantity = document.getElementById(`quantity-${key}`);
    productQuantity.innerText = `${products[key].quantity}`;
    productQuantity.classList.toggle("hidden", products[key].quantity === 0);
  }
  document.getElementById("total").innerText = "0.00";
  document.getElementById("amount-received-display").textContent = "";
  document.getElementById("change").innerText = "0.00";
}

const numericButtons = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "0",
  "C",
  "."
];

function createNumericKeyboard() {
  const keyboardContainer = document.getElementById("numeric-keyboard");
  keyboardContainer.innerHTML = "";

  numericButtons.forEach(symbol => {
    const button = document.createElement("button");
    button.className =
      "bg-gray-300 text-black rounded p-2 text-xl focus:outline-none size-12 relative overflow-hidden";
    button.innerText = symbol;
    button.onclick = e => {
      handleKeyboardInput(symbol);
      createRipple(e, button);
    };
    keyboardContainer.appendChild(button);
  });
}

function handleKeyboardInput(symbol) {
  const inputField = document.getElementById("amount-received-display");
  if (symbol === "C") {
    inputField.textContent = "";
  } else if (symbol === "←") {
    inputField.textContent = inputField.textContent.slice(0, -1);
  } else if (symbol === ".") {
    inputField.textContent +=
      inputField.textContent.indexOf(".") === -1 &&
      inputField.textContent !== ""
        ? "."
        : "";
  } else {
    inputField.textContent += symbol;
  }
  calculateChange();
}

window.onload = () => {
  loadProducts();
  createNumericKeyboard();
  const pos = {
    sx: 0,
    sy: 0,
    cx: 0,
    cy: 0
  };
  document.getElementById("fixed-bar").ontouchstart = event => {
    pos.sx = event.touches[0].clientX;
    pos.sy = event.touches[0].clientY;
    pos.cx = event.touches[0].clientX;
    pos.cy = event.touches[0].clientY;
  };
  document.getElementById("fixed-bar").ontouchmove = event => {
    pos.cx = event.touches[0].clientX;
    pos.cy = event.touches[0].clientY;
  };
  document.getElementById("fixed-bar").ontouchend = event => {
    if (Math.abs(pos.sx - pos.cx) > 100) reset();
  };
};



