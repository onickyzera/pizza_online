let selectedPizza = null;
let selectedPrice = 0;
let total = 0;
const orderItems = [];
const cartItems = document.getElementById('cart-items');
const totalPriceEl = document.getElementById('total-price');
const errorMessageEl = document.getElementById('error-message'); // Referência ao elemento da mensagem de erro

// Ao clicar em adicionar pizza
document.querySelectorAll('.add-pizza').forEach(button => {
    button.addEventListener('click', (event) => {
        selectedPizza = event.target.getAttribute('data-pizza');
        selectedPrice = parseFloat(event.target.getAttribute('data-price'));

        // Limpar a mensagem de erro ao selecionar uma pizza
        errorMessageEl.style.display = 'none';

        // Remover a classe 'selected' de todas as pizzas e aplicar na pizza atual
        document.querySelectorAll('.pizza-item').forEach(item => {
            item.classList.remove('selected');
        });
        event.target.closest('.pizza-item').classList.add('selected');
    });
});

// Adicionar ao carrinho
document.getElementById('add-to-cart').addEventListener('click', () => {
    const sizeSelect = document.getElementById('size');
    const size = sizeSelect.value;
    const selectedOption = sizeSelect.options[sizeSelect.selectedIndex];
    const price = parseFloat(selectedOption.getAttribute('data-price')); // Certifique-se de que estamos pegando o valor do preço corretamente
    const quantity = parseInt(document.getElementById('quantity').value);

    if (!selectedPizza) {
        errorMessageEl.textContent = 'Por favor, selecione uma pizza.';
        errorMessageEl.style.display = 'block';
    } else if (!size) {
        errorMessageEl.textContent = 'Por favor, selecione o tamanho da pizza.';
        errorMessageEl.style.display = 'block';
    } else if (quantity <= 0 || isNaN(quantity)) {
        errorMessageEl.textContent = 'Por favor, insira uma quantidade válida.';
        errorMessageEl.style.display = 'block';
    } else {
        // Certifique-se de que o preço está sendo corretamente capturado
        if (!isNaN(price)) {
            const totalPrice = price * quantity;
            total += totalPrice;

            const listItem = document.createElement('li');
            listItem.textContent = `${quantity}x Pizza ${selectedPizza} (${size}) - R$${totalPrice.toFixed(2)}`;
            cartItems.appendChild(listItem);

            totalPriceEl.textContent = total.toFixed(2);

            // Adicionar item ao array de pedidos
            orderItems.push({
                pizza: selectedPizza,
                size: size,
                quantity: quantity,
                price: totalPrice.toFixed(2)
            });

            // Limpar campos e mensagens de erro
            document.getElementById('size').value = '';
            document.getElementById('quantity').value = 1;
            errorMessageEl.style.display = 'none';

            // Remover a seleção visual da pizza após adicionar ao pedido
            document.querySelectorAll('.pizza-item').forEach(item => {
                item.classList.remove('selected');
            });
            selectedPizza = null;
        } else {
            errorMessageEl.textContent = 'Erro ao calcular o preço. Por favor, tente novamente.';
            errorMessageEl.style.display = 'block';
        }
    }
});


// Finalizar pedido e redirecionar para o WhatsApp
document.getElementById('place-order').addEventListener('click', () => {
    if (total > 0) {
        // Criar a mensagem para o WhatsApp
        let message = 'Olá, gostaria de fazer o seguinte pedido:\n';
        orderItems.forEach(item => {
            message += `${item.quantity}x Pizza ${item.pizza} (${item.size}) - R$${item.price}\n`;
        });
        message += `Total: R$${total.toFixed(2)}`;

        // Codificar a mensagem para URL
        const whatsappUrl = `https://wa.me/55999571707?text=${encodeURIComponent(message)}`;

        // Redirecionar para o WhatsApp
        window.location.href = whatsappUrl;
    } else {
        errorMessageEl.textContent = 'Adicione itens ao pedido antes de finalizar.';
        errorMessageEl.style.display = 'block';
    }
});
