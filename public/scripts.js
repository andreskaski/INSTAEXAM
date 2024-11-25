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
    const examContainer = document.getElementById("examContainer"); // Contenedor del examen generado

    // Mostrar el indicador de carga mientras se procesa el examen
    if (form && loadingIndicator) {
        form.addEventListener("submit", (e) => {
            e.preventDefault(); // Evita el envío estándar del formulario
            loadingIndicator.style.display = "block"; // Muestra el indicador de carga
            form.querySelector("button").disabled = true; // Desactiva el botón de envío

            // Simula el proceso de generación del examen antes de redirigir
            setTimeout(() => {
                window.location.href = "/generar_examen"; // Redirige a la página del examen generado
            }, 1500); // Simula un retraso de 1.5 segundos
        });
    }

    // Mostrar el examen y ocultar el indicador de carga en la página de resultados
    if (loadingIndicator && examContainer) {
        loadingIndicator.style.display = "block";
        setTimeout(() => {
            loadingIndicator.style.display = "none";
            examContainer.style.display = "block"; // Muestra el contenedor del examen
        }, 1500); // Simula un retraso para cargar el examen
    }

    // Funcionalidad para imprimir el examen
    const printButton = document.getElementById("printButton");
    if (printButton) {
        printButton.addEventListener("click", () => {
            window.print();
        });
    }

    // Funcionalidad para volver a generar el examen
    const generateAgain = document.getElementById("generateAgain");
    if (generateAgain) {
        generateAgain.addEventListener("click", () => {
            window.location.href = "/dashboard";
        });
    }
});

