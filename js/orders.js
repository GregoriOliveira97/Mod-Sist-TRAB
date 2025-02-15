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
        // Check if user is logged in
        const currentUser = JSON.parse(localStorage.getItem('currentCustomer'));
        if (!currentUser) {
            alert('Por favor, faça login para finalizar o pedido');
            window.location.href = 'login.html';
            return;
        }
        
        const order = {
            id: Date.now(),
            customerId: currentUser.id,
            customerName: currentUser.name,
            items: cart,
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            date: new Date().toISOString(),
            status: 'Pendente'
        };
        
        // Save order to orders list
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Update user's orders in userCustomers
        const users = JSON.parse(localStorage.getItem('userCustomers')) || [];
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (!users[userIndex].orders) {
            users[userIndex].orders = [];
        }
        users[userIndex].orders.push(order);
        
        // Update both storage items
        localStorage.setItem('userCustomers', JSON.stringify(users));
        localStorage.setItem('currentCustomer', JSON.stringify(users[userIndex]));
        
        // Clear cart
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        
        alert('Pedido realizado com sucesso!');
        window.location.href = 'profile.html';
    }
    
    renderCart();
});