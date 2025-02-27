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

    // Função para renderizar os pedidos
    function renderOrders() {
        if (!ordersList) return;
        
        // Obter o usuário atual do localStorage para ter os dados mais recentes
        const updatedUser = JSON.parse(localStorage.getItem('currentCustomer'));
        
        if (!updatedUser.orders || updatedUser.orders.length === 0) {
            ordersList.innerHTML = '<p>Você ainda não fez nenhum pedido.</p>';
        } else {
            ordersList.innerHTML = updatedUser.orders.map(order => `
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
                        Status: <span class="status-${order.status.toLowerCase()}">${order.status}</span>
                    </div>
                </div>
            `).join('');
        }
    }

    // Renderiza o histórico de pedidos inicialmente
    renderOrders();
    
    // Verifica periodicamente por atualizações no status dos pedidos
    setInterval(() => {
        const newUserData = JSON.parse(localStorage.getItem('currentCustomer'));
        
        // Se o usuário tem pedidos, verifica se houve mudanças
        if (newUserData && newUserData.orders && currentUser.orders) {
            // Verifica se existem diferenças de status entre os pedidos
            const statusChanged = newUserData.orders.some((order, index) => {
                // Verifica se há pedidos correspondentes para comparar
                return index < currentUser.orders.length && 
                       order.status !== currentUser.orders[index].status;
            });
            
            // Se houve mudança no status, atualiza a renderização e os dados locais
            if (statusChanged) {
                Object.assign(currentUser, newUserData);
                renderOrders();
            }
        }
    }, 2000); // Verifica a cada 2 segundos
});