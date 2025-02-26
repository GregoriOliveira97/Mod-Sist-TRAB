document.addEventListener('DOMContentLoaded', () => {

    if (!localStorage.getItem('restaurantUsers')) {
        // Cria um usuário restaurante padrão
        const defaultRestaurant = [{
            id: 1,
            name: "Restaurante",
            email: "restaurant@login.com",
            password: "restaurant123"
        }];

        localStorage.setItem('restaurantUsers', JSON.stringify(defaultRestaurant));
    }
    const loginForm = document.getElementById('restaurantLoginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get input values
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Retrieve restaurant users from localStorage
        const restaurantUsers = JSON.parse(localStorage.getItem('restaurantUsers')) || [];
        
        // Find user with matching credentials
        const user = restaurantUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Set login state
            localStorage.setItem('isRestaurantLoggedIn', 'true');
            localStorage.setItem('currentRestaurantUser', JSON.stringify(user));
            
            // Redirect to restaurant dashboard
            window.location.href = './restaurant-dashboard.html';
        } else {
            alert('Credenciais inválidas. Tente novamente.');
        }
    });
});

// Logout function
function restaurantLogout() {
    localStorage.removeItem('isRestaurantLoggedIn');
    localStorage.removeItem('currentRestaurantUser');
    window.location.href = '/html/landingPage.html';
}

// Authentication check function
function checkRestaurantAuthentication() {
    const isLoggedIn = localStorage.getItem('isRestaurantLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        // Redirect to login if not authenticated
        window.location.href = 'restaurant-login.html';
        return false;
    }
    
    return true;
}