// profile.js
document.addEventListener('DOMContentLoaded', () => {
    // Verifica se o usuário está logado
    if (!checkUserAuth()) {
        return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentCustomer'));
    const profileForm = document.getElementById('profileForm');
    const ordersList = document.getElementById('ordersList');

    // Preenche o formulário com os dados atuais
    if (profileForm) {
        profileForm.name.value = currentUser.name;
        profileForm.email.value = currentUser.email;
        profileForm.phone.value = currentUser.phone;
        profileForm.street.value = currentUser.address.street;
        profileForm.number.value = currentUser.address.number;
        profileForm.complement.value = currentUser.address.complement || '';
        profileForm.neighborhood.value = currentUser.address.neighborhood;
        profileForm.city.value = currentUser.address.city;
        profileForm.state.value = currentUser.address.state;

        // Manipula a atualização do perfil
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const users = JSON.parse(localStorage.getItem('userCustomers')) || [];
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            
            // Atualiza os dados do usuário
            const updatedUser = {
                ...currentUser,
                name: profileForm.name.value,
                phone: profileForm.phone.value,
                address: {
                    street: profileForm.street.value,
                    number: profileForm.number.value,
                    complement: profileForm.complement.value,
                    neighborhood: profileForm.neighborhood.value,
                    city: profileForm.city.value,
                    state: profileForm.state.value
                }
            };
            
            users[userIndex] = updatedUser;
            localStorage.setItem('userCustomers', JSON.stringify(users));
            localStorage.setItem('currentCustomer', JSON.stringify(updatedUser));
            
            alert('Perfil atualizado com sucesso!');
        });
    }

    // Renderiza o histórico de pedidos
    if (ordersList && currentUser.orders) {
        if (currentUser.orders.length === 0) {
            ordersList.innerHTML = '<p>Você ainda não fez nenhum pedido.</p>';
        } else {
            ordersList.innerHTML = currentUser.orders.map(order => `
                <div class="order-card">
                    <div class="order-header">
                        <h4>Pedido #${order.id}</h4>
                        <span class="order-date">${new Date(order.date).toLocaleDateString()}</span>
                    </div>
                    <div class="order-items">
                        ${order.items.map(item => `
                            <div class="order-item">
                                <span>${item.quantity}x ${item.name}</span>
                                <span>R$ ${item.price.toFixed(2)}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="order-total">
                        <strong>Total: R$ ${order.total.toFixed(2)}</strong>
                    </div>
                    <div class="order-status">
                        Status: ${order.status}
                    </div>
                </div>
            `).join('');
        }
    }
});