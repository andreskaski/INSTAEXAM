document.getElementById('registerForm').onsubmit = async function (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const response = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    alert(result.message || result.error);
};

document.getElementById('loginForm').onsubmit = async function (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    if (result.token) {
        localStorage.setItem('token', result.token);
        alert('Inicio de sesión exitoso');
        window.location.href = '/dashboard.html'; // Redirige a la página principal
    } else {
        alert(result.error);
    }
};
