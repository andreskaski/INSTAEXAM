document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("examForm"); // Formulario de generación de exámenes
    const loadingIndicator = document.getElementById("loadingIndicator"); // Indicador de carga
    const examContainer = document.getElementById("examContainer"); // Contenedor del examen generado

    // Enviar los datos y recibir las preguntas generadas
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            loadingIndicator.style.display = "block"; // Mostrar indicador de carga

            const formData = new FormData(form);
            const response = await fetch('/generar_examen', {
                method: 'POST',
                body: JSON.stringify(Object.fromEntries(formData.entries())),
                headers: { 'Content-Type': 'application/json' },
            });

            const result = await response.json();
            loadingIndicator.style.display = "none"; // Ocultar el indicador de carga
            displayExam(result); // Muestra las preguntas generadas en la página
        });
    }

    // Mostrar las preguntas generadas
    const displayExam = (data) => {
        const examContainer = document.getElementById("examContainer");
        const questionsContainer = document.querySelector(".questions");

        questionsContainer.innerHTML = ""; // Limpia las preguntas anteriores
        data.preguntas.forEach((pregunta, index) => {
            const questionCard = document.createElement("div");
            questionCard.classList.add("question-card");

            if (pregunta.tipo === "Opción múltiple") {
                questionCard.innerHTML = `
                    <h3>Pregunta ${index + 1}:</h3>
                    <p>${pregunta.pregunta}</p>
                    <ul>
                        ${pregunta.opciones.map(op => `<li>${op}</li>`).join("")}
                    </ul>
                `;
            } else {
                questionCard.innerHTML = `
                    <h3>Pregunta ${index + 1}:</h3>
                    <p>${pregunta.pregunta}</p>
                    <textarea rows="3" placeholder="Escribe tu respuesta aquí"></textarea>
                `;
            }

            questionsContainer.appendChild(questionCard);
        });

        examContainer.style.display = "block"; // Mostrar contenedor del examen
    };
});


