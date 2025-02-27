// Dados iniciais de itens de menu
let menuItems = [];
let orders = [];
let filteredOrders = [];

// Função para verificar autenticação
function checkAuthentication() {
    const isLoggedIn = localStorage.getItem('isRestaurantLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        // Redirecionar para a página de login se não estiver autenticado
        window.location.href = 'restaurant-login.html';
        return false;
    }
    
    return true;
}

// Função para alternar entre seções
function showSection(sectionId) {
    // Esconder todas as seções
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Mostrar a seção selecionada
    document.getElementById(sectionId).style.display = 'block';
}

// Funções de Gerenciamento de Itens de Menu
function renderMenuItems() {
    const menuTbody = document.getElementById('menu-tbody');
    menuTbody.innerHTML = '';
    
    menuItems.forEach(item => {
        // Truncate description to 20 characters
        const truncatedDescription = item.description.length > 20 
            ? item.description.substring(0, 20) + '...' 
            : item.description;

        const row = `
            <tr>
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td>${truncatedDescription}</td>
                <td>R$ ${item.price.toFixed(2)}</td>
                <td>
                    <button class="btn btn-edit" onclick="openMenuItemEditModal(${item.id})">Editar</button>
                    <button class="btn btn-delete" onclick="openMenuItemDeleteModal(${item.id})">Excluir</button>
                </td>
            </tr>
        `;
        menuTbody.innerHTML += row;
    });
}

function openMenuItemCreateModal() {
    document.getElementById('menu-item-create-modal').style.display = 'block';
}

function createMenuItem() {
    const name = document.getElementById('menu-item-create-name').value;
    const category = document.getElementById('menu-item-create-category').value;
    const description = document.getElementById('menu-item-create-description').value;
    const price = parseFloat(document.getElementById('menu-item-create-price').value);
    
    if (!name || !category || !description || isNaN(price)) {
        alert('Por favor, preencha todos os campos corretamente');
        return;
    }
    
    const newMenuItem = {
        id: menuItems.length ? Math.max(...menuItems.map(m => m.id)) + 1 : 1,
        name,
        category,
        description,
        price,
        image: 'caminho/para/imagem-padrao.jpg' // Substituir com upload de imagem real
    };
    
    menuItems.push(newMenuItem);
    renderMenuItems();
    closeModal('menu-item-create-modal');
    
    // Salvar no localStorage
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
}

function openMenuItemEditModal(itemId) {
    const item = menuItems.find(m => m.id === itemId);
    
    document.getElementById('menu-item-edit-id').value = item.id;
    document.getElementById('menu-item-edit-name').value = item.name;
    document.getElementById('menu-item-edit-description').value = item.description;
    document.getElementById('menu-item-edit-category').value = item.category;
    document.getElementById('menu-item-edit-price').value = item.price;
    
    document.getElementById('menu-item-edit-modal').style.display = 'block';
}

function updateMenuItem() {
    const id = parseInt(document.getElementById('menu-item-edit-id').value);
    const name = document.getElementById('menu-item-edit-name').value;
    const description = document.getElementById('menu-item-edit-description').value;
    const category = document.getElementById('menu-item-edit-category').value;
    const price = parseFloat(document.getElementById('menu-item-edit-price').value);
    
    if (!name || !category || !description || isNaN(price)) {
        alert('Por favor, preencha todos os campos corretamente');
        return;
    }
    
    const itemIndex = menuItems.findIndex(m => m.id === id);
    menuItems[itemIndex] = { 
        ...menuItems[itemIndex], 
        name, 
        description,
        category, 
        price 
    };
    
    renderMenuItems();
    closeModal('menu-item-edit-modal');
    
    // Salvar no localStorage
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
}

function openMenuItemDeleteModal(itemId) {
    document.getElementById('menu-item-delete-id').value = itemId;
    document.getElementById('menu-item-delete-modal').style.display = 'block';
}

function deleteMenuItem() {
    const id = parseInt(document.getElementById('menu-item-delete-id').value);
    menuItems = menuItems.filter(m => m.id !== id);
    
    renderMenuItems();
    closeModal('menu-item-delete-modal');
    
    // Salvar no localStorage
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
}

// Funções de Gerenciamento de Pedidos
function renderOrders() {
    const ordersTbody = document.getElementById('orders-tbody');
    ordersTbody.innerHTML = '';
    
    filteredOrders.forEach(order => {
        // Formatar data
        const orderDate = new Date(order.date);
        const formattedDate = `${orderDate.toLocaleDateString()} ${orderDate.toLocaleTimeString()}`;
        
        // Truncar lista de itens
        const itemsList = order.items.map(item => item.name).join(', ');
        const truncatedItems = itemsList.length > 30 
            ? itemsList.substring(0, 30) + '...' 
            : itemsList;
        
        // Definir classe de status para estilização
        let statusClass = '';
        switch(order.status) {
            case 'Pendente':
                statusClass = 'status-pending';
                break;
            case 'Enviado':
                statusClass = 'status-sent';
                break;
            case 'Entregue':
                statusClass = 'status-delivered';
                break;
            case 'Cancelado':
                statusClass = 'status-canceled';
                break;
        }
        
        const row = `
            <tr>
                <td>#${order.id}</td>
                <td>${order.customerName}</td>
                <td>${formattedDate}</td>
                <td>${truncatedItems}</td>
                <td>R$ ${order.total.toFixed(2)}</td>
                <td><span class="order-status ${statusClass}">${order.status}</span></td>
                <td>
                    <button class="btn btn-view" onclick="openOrderDetailsModal(${order.id})">Ver</button>
                    <button class="btn btn-edit" onclick="openUpdateStatusModal(${order.id})">Status</button>
                </td>
            </tr>
        `;
        ordersTbody.innerHTML += row;
    });
}

function openOrderDetailsModal(orderId) {
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
        alert('Pedido não encontrado');
        return;
    }
    
    const orderDate = new Date(order.date);
    const formattedDate = `${orderDate.toLocaleDateString()} ${orderDate.toLocaleTimeString()}`;
    
    let itemsHtml = '';
    order.items.forEach(item => {
        itemsHtml += `
            <div class="order-item">
                <div><strong>${item.name}</strong> x ${item.quantity}</div>
                <div>R$ ${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `;
    });
    
    let discountHtml = '';
    if (order.discount > 0) {
        discountHtml = `
            <div class="order-summary-row">
                <div>Desconto:</div>
                <div>-R$ ${order.discount.toFixed(2)}</div>
            </div>
        `;
    }
    
    const detailsHtml = `
        <div class="order-details">
            <div class="order-header">
                <h4>Pedido #${order.id}</h4>
                <div class="order-meta">
                    <div><strong>Data:</strong> ${formattedDate}</div>
                    <div><strong>Cliente:</strong> ${order.customerName}</div>
                    <div><strong>Status:</strong> <span class="order-status">${order.status}</span></div>
                </div>
            </div>
            
            <div class="order-items">
                <h4>Itens do Pedido</h4>
                ${itemsHtml}
            </div>
            
            <div class="order-summary">
                <div class="order-summary-row">
                    <div>Subtotal:</div>
                    <div>R$ ${order.subtotal.toFixed(2)}</div>
                </div>
                ${discountHtml}
                <div class="order-summary-row total">
                    <div>Total:</div>
                    <div>R$ ${order.total.toFixed(2)}</div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('order-details-content').innerHTML = detailsHtml;
    document.getElementById('order-details-modal').style.display = 'block';
}

function openUpdateStatusModal(orderId) {
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
        alert('Pedido não encontrado');
        return;
    }
    
    document.getElementById('update-order-id').value = orderId;
    document.getElementById('update-order-status').value = order.status;
    document.getElementById('update-status-modal').style.display = 'block';
}

function updateOrderStatus() {
    const orderId = parseInt(document.getElementById('update-order-id').value);
    const newStatus = document.getElementById('update-order-status').value;
    
    // Atualizar na lista de pedidos
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) {
        alert('Pedido não encontrado');
        return;
    }
    
    orders[orderIndex].status = newStatus;
    
    // Atualizar na lista de pedidos do usuário
    const users = JSON.parse(localStorage.getItem('userCustomers')) || [];
    const customerId = orders[orderIndex].customerId;
    
    if (customerId) {
        const userIndex = users.findIndex(u => u.id === customerId);
        
        if (userIndex !== -1 && users[userIndex].orders) {
            const userOrderIndex = users[userIndex].orders.findIndex(o => o.id === orderId);
            
            if (userOrderIndex !== -1) {
                users[userIndex].orders[userOrderIndex].status = newStatus;
                localStorage.setItem('userCustomers', JSON.stringify(users));
                
                // Atualizar também o usuário atual se for o mesmo usuário
                const currentUser = JSON.parse(localStorage.getItem('currentCustomer'));
                if (currentUser && currentUser.id === customerId) {
                    currentUser.orders[userOrderIndex].status = newStatus;
                    localStorage.setItem('currentCustomer', JSON.stringify(currentUser));
                }
            }
        }
    }
    
    // Salvar no localStorage
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Atualizar a visualização
    filterOrdersByStatus();
    closeModal('update-status-modal');
    
    // Mostrar mensagem de sucesso
    alert('Status do pedido atualizado com sucesso!');
}

function filterOrdersByStatus() {
    const statusFilter = document.getElementById('order-status-filter').value;
    
    if (statusFilter === 'all') {
        filteredOrders = [...orders];
    } else {
        filteredOrders = orders.filter(order => order.status === statusFilter);
    }
    
    renderOrders();
}

// Função utilitária para fechar modais
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Função para fazer logout
function logout() {
    localStorage.removeItem('isRestaurantLoggedIn');
    localStorage.removeItem('currentRestaurantUser');
    window.location.href = 'restaurant-login.html';
}

// Função para toggle sidebar em dispositivos móveis
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticação
    if (!checkAuthentication()) {
        return;
    }

    // Recuperar itens de menu do localStorage
    const storedMenuItems = localStorage.getItem('menuItems');
    if (storedMenuItems) {
        menuItems = JSON.parse(storedMenuItems);
    } else {
        // Itens de menu padrão se não houver dados salvos
        menuItems = [
            {
                id: '1',
                name: 'X-Burguer',
                category: 'Lanches',
                price: 12.90,
                description: 'Hambúrguer com queijo, alface e tomate',
                image: '/images/xburguer.jpg'
            },
            {
                id: '2',
                name: 'Coca-Cola',
                category: 'Bebidas',
                price: 5.00,
                description: 'Refrigerante 350ml',
                image: '/images/coca.jpg'
            },
            {
                id: '3',
                name: 'Batata Frita',
                category: 'Acompanhamentos',
                price: 8.90,
                description: 'Porção de batata frita crocante',
                image: '/images/batata.jpg'
            },
            {
                id: '4',
                name: 'Milk Shake',
                category: 'Bebidas',
                price: 13.90,
                description: 'Milk shake de chocolate 400ml',
                image: '/images/milkshake.jpg'
            }
        ];
        localStorage.setItem('menuItems', JSON.stringify(menuItems));
    }

    // Recuperar pedidos do localStorage
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
        orders = JSON.parse(storedOrders);
        filteredOrders = [...orders]; // Inicializar com todos os pedidos
    }

    // Renderizar dados iniciais
    renderMenuItems();
    renderOrders();

    // Configurar o evento de logout
    const logoutLink = document.querySelector('nav ul li:last-child a');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    // Mostrar a seção de cardápio por padrão
    showSection('menu-section');
});