document.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let appliedCoupon = null;
    
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
        
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        let discount = 0;
        
        if (appliedCoupon) {
            if (appliedCoupon.type === 'percentage') {
                discount = (subtotal * appliedCoupon.discount) / 100;
            } else {
                discount = appliedCoupon.discount;
            }
        }
        
        const total = subtotal - discount;
        
        totalElement.innerHTML = `
            <div>Subtotal: R$ ${subtotal.toFixed(2)}</div>
            ${appliedCoupon ? `<div>Desconto: - R$ ${discount.toFixed(2)}</div>` : ''}
            <strong>Total: R$ ${total.toFixed(2)}</strong>
        `;
        
        document.getElementById('checkout-button').style.display = 'block';
    }
    
    window.applyCoupon = () => {
        const couponCode = document.getElementById('coupon-code').value.trim();
        const messageElement = document.getElementById('coupon-message');
        
        // Reset message styling
        messageElement.className = '';
        
        // Get coupons from localStorage
        const coupons = JSON.parse(localStorage.getItem('coupons')) || [];
        const coupon = coupons.find(c => c.code === couponCode);
        
        if (!coupon) {
            messageElement.textContent = 'Cupom inválido';
            messageElement.className = 'error';
            return;
        }
        
        // Check if coupon is expired
        if (new Date(coupon.expiryDate) < new Date()) {
            messageElement.textContent = 'Este cupom está expirado';
            messageElement.className = 'error';
            return;
        }
        
        // Check minimum order value
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (subtotal < coupon.minValue) {
            messageElement.textContent = `Valor mínimo para este cupom é R$ ${coupon.minValue.toFixed(2)}`;
            messageElement.className = 'error';
            return;
        }
        
        appliedCoupon = coupon;
        messageElement.textContent = 'Cupom aplicado com sucesso!';
        messageElement.className = 'success';
        renderCart();
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
            
            // Reset coupon if cart becomes empty
            if (cart.length === 0) {
                appliedCoupon = null;
            }
            
            renderCart();
        }
    }
    
    window.createOrder = () => {
        const currentUser = JSON.parse(localStorage.getItem('currentCustomer'));
        if (!currentUser) {
            alert('Por favor, faça login para finalizar o pedido');
            window.location.href = 'login.html';
            return;
        }
        
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        let discount = 0;
        
        if (appliedCoupon) {
            if (appliedCoupon.type === 'percentage') {
                discount = (subtotal * appliedCoupon.discount) / 100;
            } else {
                discount = appliedCoupon.discount;
            }
        }
        
        const order = {
            id: Date.now(),
            customerId: currentUser.id,
            customerName: currentUser.name,
            items: cart,
            subtotal: subtotal,
            discount: discount,
            total: subtotal - discount,
            appliedCoupon: appliedCoupon,
            date: new Date().toISOString(),
            status: 'Pendente'
        };
        
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        const users = JSON.parse(localStorage.getItem('userCustomers')) || [];
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (!users[userIndex].orders) {
            users[userIndex].orders = [];
        }
        users[userIndex].orders.push(order);
        
        localStorage.setItem('userCustomers', JSON.stringify(users));
        localStorage.setItem('currentCustomer', JSON.stringify(users[userIndex]));
        
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        appliedCoupon = null;
        
        alert('Pedido realizado com sucesso!');
        window.location.href = 'profile.html';
    }
    
    window.showOrderForm = () => {
        document.getElementById('order-form').style.display = 'block';
        document.getElementById('checkout-button').style.display = 'none';
    }
    
    renderCart();
});