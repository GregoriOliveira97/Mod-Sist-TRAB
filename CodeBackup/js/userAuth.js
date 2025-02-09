
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('userLoginForm');
    const registerForm = document.getElementById('userRegisterForm');
    
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
                window.location.href = '/html/cardapioTest.html';
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
            window.location.href = '/menu.html';
        });
    }
});

// Utility functions
function checkUserAuth() {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        window.location.href = '/user-login.html';
        return false;
    }
    return true;
}

function userLogout() {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('currentCustomer');
    window.location.href = '/user-login.html';
}