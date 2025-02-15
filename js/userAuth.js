// userAuth.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('userLoginForm');
    const registerForm = document.getElementById('userRegisterForm');
    
    // Adiciona lógica da navbar
    const nav = document.querySelector('.nav-list');
    if (nav) {  // Verifica se a navbar existe na página atual
        const profileLi = document.createElement('li');
        profileLi.className = 'nav-item';
        profileLi.id = 'profile-item';
        
        const profileLink = document.createElement('a');
        profileLink.className = 'nav-link';
        profileLink.href = './profile.html';
        profileLink.textContent = 'Meu Perfil';
        
        profileLi.appendChild(profileLink);
        nav.appendChild(profileLi);

        const logoutLi = document.createElement('li');
        logoutLi.className = 'nav-item';
        logoutLi.id = 'logout-item';
        
        const logoutLink = document.createElement('a');
        logoutLink.className = 'nav-link';
        logoutLink.href = '#';
        logoutLink.textContent = 'Sair';
        logoutLink.onclick = (e) => {
            e.preventDefault();
            userLogout();
        };
        
        logoutLi.appendChild(logoutLink);
        nav.appendChild(logoutLi);
        
        // Atualiza visibilidade inicial
        updateLogoutVisibility();
    }
    
    // Login Form Handler
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Retrieve users from localStorage
            const users = JSON.parse(localStorage.getItem('userCustomers')) || [];
            
            // Find user with matching credentials
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Set login state
                localStorage.setItem('userLoggedIn', 'true');
                localStorage.setItem('currentCustomer', JSON.stringify(user));
                
                // Redirect to menu/ordering page
                window.location.href = './cardapiotest.html';
            } else {
                alert('Credenciais inválidas. Tente novamente.');
            }
        });
    }
    
    // Registration Form Handler
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const phone = document.getElementById('phone').value;
            const street = document.getElementById('street').value;
            const number = document.getElementById('number').value;
            const neighborhood = document.getElementById('neighborhood').value;
            const city = document.getElementById('city').value;
            const state = document.getElementById('state').value;
            const complement = document.getElementById('complement').value;
            
            // Validate fields
            if (!name || !email || !password || !phone || !street || !number || !neighborhood || !city || !state) {
                alert('Por favor, preencha todos os campos obrigatórios');
                return;
            }
            
            // Retrieve existing users
            const users = JSON.parse(localStorage.getItem('userCustomers')) || [];
            
            // Check if email already exists
            if (users.some(user => user.email === email)) {
                alert('Este email já está cadastrado');
                return;
            }
            
            // Create new user object
            const newUser = {
                id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
                name,
                email,
                password,
                phone,
                address: {
                    street,
                    number,
                    neighborhood,
                    city,
                    state,
                    complement
                },
                orders: [] // Array to store order history
            };
            
            // Add user to array and save
            users.push(newUser);
            localStorage.setItem('userCustomers', JSON.stringify(users));
            
            // Auto login after registration
            localStorage.setItem('userLoggedIn', 'true');
            localStorage.setItem('currentCustomer', JSON.stringify(newUser));
            
            // Redirect to menu page
            window.location.href = './cardapioTest.html';
        });
    }
});

// Utility functions
function checkUserAuth() {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        window.location.href = './user-login.html';
        return false;
    }
    return true;
}

function userLogout() {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('currentCustomer');
    updateLogoutVisibility(); // Atualiza a visibilidade do botão ao fazer logout
    window.location.href = './landingPageBackup.html';
}

// Função para atualizar a visibilidade do botão de logout
function updateLogoutVisibility() {
    const logoutItem = document.getElementById('logout-item');
    const profileItem = document.getElementById('profile-item');
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    
    if (logoutItem) {
        logoutItem.style.display = isLoggedIn ? 'block' : 'none';
    }
    if (profileItem) {
        profileItem.style.display = isLoggedIn ? 'block' : 'none';
    }
}

// Adiciona listener para mudanças no localStorage
window.addEventListener('storage', updateLogoutVisibility);