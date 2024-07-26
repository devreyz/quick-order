

        // Função para carregar e exibir a lista de produtos
        function loadProducts() {
            fetch('http://localhost:3000/products')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro ao carregar a lista de produtos.');
                    }
                    return response.json();
                })
                .then(products => {
                    const productList = document.getElementById('product-list');
                    productList.innerHTML = '';

                    products.forEach(product => {
                        const listItem = document.createElement('li');
                        listItem.className = 'bg-white p-4 rounded shadow-md flex justify-between items-center';
                        
                        const productName = document.createElement('span');
                        productName.className = 'text-lg font-semibold';
                        productName.textContent = product.name;
                        
                        const productPrice = document.createElement('span');
                        productPrice.className = 'text-lg';
                        productPrice.textContent = `R$ ${product.price.toFixed(2)}`;
                        
                        const deleteButton = document.createElement('button');
                        deleteButton.className = 'bg-red-500 text-white px-4 py-2 rounded';
                        deleteButton.textContent = 'Excluir';
                        deleteButton.onclick = () => deleteProduct(product.id);

                        listItem.appendChild(productName);
                        listItem.appendChild(productPrice);
                        listItem.appendChild(deleteButton);
                        productList.appendChild(listItem);
                    });
                })
                .catch(error => {
                    console.error('Erro:', error.message);
                    alert('Ocorreu um erro ao carregar a lista de produtos. Por favor, tente novamente.');
                });
        }

        // Função para excluir um produto
        function deleteProduct(productId) {
            if (!confirm('Tem certeza que deseja excluir este produto?')) {
                return;
            }

            fetch(`http://localhost:3000/products/${productId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao excluir o produto.');
                }
                return response.json();
            })
            .then(() => {
                loadProducts(); // Recarregar a lista de produtos após a exclusão
            })
            .catch(error => {
                console.error('Erro:', error.message);
                alert('Ocorreu um erro ao excluir o produto. Por favor, tente novamente.');
            });
        }

        // Carregar a lista de produtos ao carregar a página
        window.onload = loadProducts;
    