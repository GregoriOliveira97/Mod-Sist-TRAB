document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('adminLoginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get input values
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Retrieve users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Find user with matching credentials
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Set login state
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // Redirect to dashboard
            window.location.href = '/html/dashboardAntiga.html';
        } else {
            alert('Credenciais inválidas. Tente novamente.');
        }
    });
});

// Logout function (can be used on dashboard)
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = '/CodeBAckup/html/login.html';
}

// Authentication check function (can be used on dashboard)
function checkAuthentication() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
        return false;
    }
    
    return true;
}
