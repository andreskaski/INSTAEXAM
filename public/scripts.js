document.addEventListener("DOMContentLoaded", () => {
    const loadingIndicator = document.getElementById("loadingIndicator");
    const examContainer = document.getElementById("examContainer");

    // Obtén los datos del servidor a través de localStorage o fetch
    const examData = localStorage.getItem("examenPreguntas");

    if (examData) {
        try {
            const exam = JSON.parse(examData);
            loadingIndicator.style.display = "none"; // Oculta el indicador de carga
            examContainer.style.display = "block"; // Muestra el contenedor

            // Rellena los datos del encabezado
            document.getElementById("examCurso").textContent = exam.curso;
            document.getElementById("examTema").textContent = exam.tema;

            // Renderiza las preguntas dinámicamente
            const questionsSection = document.querySelector(".questions");
            questionsSection.innerHTML = ""; // Limpia cualquier contenido previo

            exam.preguntas.forEach((pregunta, index) => {
                const questionCard = document.createElement("div");
                questionCard.classList.add("question-card");

                // Añade el número y texto de la pregunta
                const questionText = document.createElement("h3");
                questionText.textContent = `Pregunta ${index + 1}: ${pregunta.tipo}`;
                const questionDetails = document.createElement("p");
                questionDetails.textContent = pregunta.pregunta;

                questionCard.appendChild(questionText);
                questionCard.appendChild(questionDetails);

                // Si hay opciones (pregunta de opción múltiple)
                if (pregunta.opciones) {
                    const optionsList = document.createElement("ul");
                    pregunta.opciones.forEach((opcion, idx) => {
                        const optionItem = document.createElement("li");
                        optionItem.textContent = `${String.fromCharCode(97 + idx)}) ${opcion}`;
                        optionsList.appendChild(optionItem);
                    });
                    questionCard.appendChild(optionsList);
                }

                questionsSection.appendChild(questionCard);
            });
        } catch (error) {
            console.error("Error al procesar los datos del examen:", error);
        }
    } else {
        console.error("No se encontraron datos para generar el examen.");
    }

    // Botón de imprimir
    const printButton = document.getElementById("printButton");
    if (printButton) {
        printButton.addEventListener("click", () => window.print());
    }

    // Botón de volver al dashboard
    const generateAgain = document.getElementById("generateAgain");
    if (generateAgain) {
        generateAgain.addEventListener("click", () => {
            window.location.href = "/dashboard";
        });
    }
});
