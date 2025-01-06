// Dados iniciais de usuários e itens de menu
let users = [];
let menuItens= [];


// Funções de Gerenciamento de Usuários
function renderUsers() {
    const usersTbody = document.getElementById('users-tbody');
    usersTbody.innerHTML = '';
    
    users.forEach(user => {
        // Mask password with asterisks
        const maskedPassword = '*'.repeat(user.password.length);
        
        
        const row = `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${maskedPassword}</td>
                <td>
                    <button class="btn btn-edit" onclick="openUserEditModal(${user.id})">Editar</button>
                    <button class="btn btn-delete" onclick="openUserDeleteModal(${user.id})">Excluir</button>
                </td>
            </tr>
        `;
        usersTbody.innerHTML += row;
    });
}


function openUserCreateModal() {
    document.getElementById('user-create-name').value = '';
    document.getElementById('user-create-email').value = '';
    document.getElementById('user-create-password').value = '';
    document.getElementById('user-create-modal').style.display = 'block';
}

function createUser() {
    const name = document.getElementById('user-create-name').value;
    const email = document.getElementById('user-create-email').value;
    const password = document.getElementById('user-create-password').value;
    
    if (!name || !email || !password) {
        alert('Por favor, preencha todos os campos');
        return;
    }
    
    // Verificar se email já existe
    const emailExists = users.some(u => u.email === email);
    if (emailExists) {
        alert('Este email já está cadastrado');
        return;
    }
    
    const newUser = {
        id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
        name,
        email,
        password
    };
    
    users.push(newUser);
    renderUsers();
    closeModal('user-create-modal');
    
    // Salvar no localStorage
    localStorage.setItem('users', JSON.stringify(users));
}

function openUserEditModal(userId) {
    const user = users.find(u => u.id === userId);
    
    document.getElementById('user-edit-id').value = user.id;
    document.getElementById('user-edit-name').value = user.name;
    document.getElementById('user-edit-email').value = user.email;
    document.getElementById('user-edit-password').value = user.password; // Show full password
    
    document.getElementById('user-edit-modal').style.display = 'block';
}

function updateUser() {
    const id = parseInt(document.getElementById('user-edit-id').value);
    const name = document.getElementById('user-edit-name').value;
    const email = document.getElementById('user-edit-email').value;
    const password = document.getElementById('user-edit-password').value;
    
    if (!name || !email || !password) {
        alert('Por favor, preencha todos os campos');
        return;
    }
    
    // Verificar se email já existe em outro usuário
    const emailExists = users.some(u => u.email === email && u.id !== id);
    if (emailExists) {
        alert('Este email já está cadastrado por outro usuário');
        return;
    }
    
    const userIndex = users.findIndex(u => u.id === id);
    users[userIndex] = { id, name, email, password };
    
    renderUsers();
    closeModal('user-edit-modal');
    
    // Salvar no localStorage
    localStorage.setItem('users', JSON.stringify(users));
}

function openUserDeleteModal(userId) {
    document.getElementById('user-delete-id').value = userId;
    document.getElementById('user-delete-modal').style.display = 'block';
}

function deleteUser() {
    const id = parseInt(document.getElementById('user-delete-id').value);
    users = users.filter(u => u.id !== id);
    
    renderUsers();
    closeModal('user-delete-modal');
    
    // Salvar no localStorage
    localStorage.setItem('users', JSON.stringify(users));
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
    
    if (!name || !category ||!description || isNaN(price)) {
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
    
    if (!name || !category ||!description || isNaN(price)) {
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

// Função utilitária para fechar modais
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Recuperar usuários do localStorage
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
        users = JSON.parse(storedUsers);
    } else {
        // Usuário padrão se não houver dados salvos
        users = [
            { id: 1, name: 'Admin', email: 'admin@adm.com', password: 'senha123' }
        ];
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Recuperar itens de menu do localStorage
    const storedMenuItems = localStorage.getItem('menuItems');
    if (storedMenuItems) {
        menuItems = JSON.parse(storedMenuItems);
    } else {
        // Itens de menu padrão se não houver dados salvos
        menuItems = [
            { 
                id: 1, 
                name: 'Hambúrguer Clássico', 
                category: 'Hambúrgueres', 
                description: "Hambúrguer artesanal com blend especial",
                price: 25.99, 
                image: 'caminho/para/imagem.jpg' 
            },
            { 
                id: 2, 
                name: 'Refrigerante', 
                category: 'Bebidas', 
                description: "Hambúrguer artesanal com blend especial",
                price: 5.50, 
                image: 'caminho/para/imagem.jpg' 
            }
        ];
        localStorage.setItem('menuItems', JSON.stringify(menuItems));
    }

    renderUsers();
    renderMenuItems();

});
function logout() {
    // Remove login state from localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    
    // Redirect to login page
    window.location.href = 'login.html';
}

// Modify the DOMContentLoaded event listener to add logout functionality
document.addEventListener('DOMContentLoaded', () => {
    // ... existing initialization code ...

    // Add logout event listener to the Logout link
    const logoutLink = document.querySelector('nav ul li:last-child a');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
});