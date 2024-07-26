const productNameInput = document.getElementById("product-name");
const productPriceInput = document.getElementById("product-price");
const form = document.querySelector("form");

function isValidPrice(price) {
  return !isNaN(parseFloat(price)) && isFinite(price);
}

function submitForm(event) {
  event.preventDefault();

  const productName = productNameInput.value.trim();
  const productPrice = productPriceInput.value.trim();

  if (productName === "" || !isValidPrice(productPrice)) {
    alert("Por favor, preencha todos os campos corretamente.");
    return;
  }

  const newProduct = {
    name: productName,
    price: parseFloat(productPrice)
  };

  fetch("http://localhost:3000/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newProduct)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Erro ao cadastrar o produto.");
      }
      return response.json();
    })
    .then(data => {
      console.log("Produto cadastrado:", data);
      // Limpar os campos do formulário após o cadastro bem-sucedido
      productNameInput.value = "";
      productPriceInput.value = "";
    })
    .catch(error => {
      console.error("Erro:", error.message);
      alert(
        "Ocorreu um erro ao cadastrar o produto. Por favor, tente novamente."
      );
    });
}

form.addEventListener("submit", submitForm);
