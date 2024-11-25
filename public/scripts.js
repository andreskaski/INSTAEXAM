document.addEventListener("DOMContentLoaded", () => {
    const loadingIndicator = document.getElementById("loadingIndicator");
    const examContainer = document.getElementById("examContainer");

    // Fetch data del servidor al cargar la página
    fetch("/generar_examen", { method: "POST" })
        .then((response) => response.json())
        .then((exam) => {
            loadingIndicator.style.display = "none"; // Oculta el indicador de carga
            examContainer.style.display = "block"; // Muestra el contenedor

            // Rellena los datos del encabezado
            document.getElementById("examCurso").textContent = exam.curso;
            document.getElementById("examTema").textContent = exam.tema;

            // Renderiza las preguntas dinámicamente
            const questionsSection = document.querySelector(".questions");
            questionsSection.innerHTML = ""; // Limpia cualquier contenido previo

            exam.preguntas.forEach((pregunta, index) => {
                const questionContainer = document.createElement("div");
                questionContainer.className = "question-container";

                // Número y texto de la pregunta
                const questionNumber = document.createElement("h3");
                questionNumber.textContent = `Pregunta ${index + 1}:`;
                const questionText = document.createElement("p");
                questionText.textContent = pregunta.pregunta;

                questionContainer.appendChild(questionNumber);
                questionContainer.appendChild(questionText);

                // Opciones para preguntas de opción múltiple
                if (pregunta.opciones) {
                    const optionsList = document.createElement("ul");
                    pregunta.opciones.forEach((opcion, idx) => {
                        const optionItem = document.createElement("li");
                        optionItem.textContent = `${String.fromCharCode(97 + idx)}) ${opcion}`;
                        optionsList.appendChild(optionItem);
                    });
                    questionContainer.appendChild(optionsList);
                }

                questionsSection.appendChild(questionContainer);
            });
        })
        .catch((error) => {
            console.error("Error al cargar el examen:", error);
        });

    // Botón de imprimir
    const printButton = document.getElementById("printButton");
    if (printButton) {
        printButton.addEventListener("click", () => window.print());
    }

    // Botón para volver al dashboard
    const generateAgain = document.getElementById("generateAgain");
    if (generateAgain) {
        generateAgain.addEventListener("click", () => {
            window.location.href = "/dashboard";
        });
    }
});
