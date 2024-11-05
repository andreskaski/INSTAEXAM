// dashboard.js
async function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/index.html'; // Redirige si no hay token
    }
    // Otras validaciones de token si es necesario
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/index.html';
}

checkAuth();
