// Registro de usuario
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

// Inicio de sesión
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

// Indicador de carga para la generación de exámenes
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("examForm"); // Formulario de generación de exámenes
    const loadingIndicator = document.getElementById("loadingIndicator"); // Indicador de carga

    if (form) {
        form.addEventListener("submit", (e) => {
            // Muestra el indicador de carga
            loadingIndicator.style.display = "block";

            // Desactiva el botón para evitar múltiples envíos
            e.target.querySelector("button").disabled = true;
        });
    }

    // Funcionalidad para la página del examen generado
    const printButton = document.getElementById("printButton");
    const generateAgain = document.getElementById("generateAgain");

    // Imprime el examen
    if (printButton) {
        printButton.addEventListener("click", () => {
            window.print();
        });
    }

    // Redirige al usuario para volver a generar el examen
    if (generateAgain) {
        generateAgain.addEventListener("click", () => {
            window.location.href = "/dashboard";
        });
    }
});

