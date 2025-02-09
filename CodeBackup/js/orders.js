document.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    function renderCart() {
        const cartContainer = document.getElementById('cart-items');
        const totalElement = document.getElementById('cart-total');
        
        if (cart.length === 0) {
            cartContainer.innerHTML = '<p>Carrinho vazio</p>';
            totalElement.innerHTML = '';
            document.getElementById('checkout-button').style.display = 'none';
            return;
        }
        
        cartContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <span>${item.name} - R$ ${item.price.toFixed(2)} x ${item.quantity}</span>
                <button onclick="removeFromCart(${item.id})">Remover</button>
            </div>
        `).join('');
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalElement.innerHTML = `<strong>Total: R$ ${total.toFixed(2)}</strong>`;
        document.getElementById('checkout-button').style.display = 'block';
    }
    
    window.removeFromCart = (itemId) => {
        const itemIndex = cart.findIndex(item => item.id === itemId);
        
        if (itemIndex !== -1) {
            if (cart[itemIndex].quantity > 1) {
                cart[itemIndex].quantity -= 1;
            } else {
                cart.splice(itemIndex, 1);
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        }
    }
    window.showOrderForm = () => {
        document.getElementById('order-form').style.display = 'block';
        document.getElementById('checkout-button').style.display = 'none';
    }
    
    window.createOrder = () => {
        const customerName = document.getElementById('customer-name').value;
        if (!customerName) {
            alert('Por favor, informe seu nome');
            return;
        }
        
        const order = {
            id: Date.now(),
            customerName,
            items: cart,
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            date: new Date().toISOString(),
            status: 'Pendente'
        };
        
        // Salvar pedido
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Limpar carrinho
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        
        alert('Pedido realizado com sucesso!');
        window.location.href = 'index.html';
    }
    
    renderCart();
});