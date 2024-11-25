document.addEventListener("DOMContentLoaded", () => {
    const loadingIndicator = document.getElementById("loadingIndicator");
    const examContainer = document.getElementById("examContainer");

    // Obtén los datos JSON de la URL actual si fueron enviados como query params
    const urlParams = new URLSearchParams(window.location.search);
    const examData = urlParams.get("data");

    if (examData) {
        try {
            const exam = JSON.parse(decodeURIComponent(examData));
            loadingIndicator.style.display = "none"; // Oculta el indicador de carga
            examContainer.style.display = "block"; // Muestra el contenedor

            // Renderiza las preguntas dinámicamente
            const questionsSection = document.querySelector(".questions");
            questionsSection.innerHTML = ""; // Limpia cualquier contenido previo

            exam.preguntas.forEach((pregunta, index) => {
                const questionCard = document.createElement("div");
                questionCard.classList.add("question-card");

                const questionType = document.createElement("h3");
                questionType.textContent = `${pregunta.tipo}:`;

                const questionText = document.createElement("p");
                questionText.textContent = `${index + 1}. ${pregunta.pregunta}`;

                questionCard.appendChild(questionType);
                questionCard.appendChild(questionText);

                // Si hay opciones (preguntas de opción múltiple)
                if (pregunta.opciones) {
                    const optionsList = document.createElement("ul");
                    pregunta.opciones.forEach((opcion) => {
                        const optionItem = document.createElement("li");
                        optionItem.textContent = opcion;
                        optionsList.appendChild(optionItem);
                    });
                    questionCard.appendChild(optionsList);
                } else {
                    // Si es una pregunta abierta, añade un textarea
                    const answerArea = document.createElement("textarea");
                    answerArea.rows = 3;
                    answerArea.placeholder = "Escribe tu respuesta aquí";
                    questionCard.appendChild(answerArea);
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

    // Botón de volver a generar
    const generateAgain = document.getElementById("generateAgain");
    if (generateAgain) {
        generateAgain.addEventListener("click", () => {
            window.location.href = "/dashboard";
        });
    }
});
