document.addEventListener("DOMContentLoaded", () => {
    const loadingIndicator = document.getElementById("loadingIndicator");
    const examContainer = document.getElementById("examContainer");

    // Obtén los datos JSON del localStorage
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

                const questionType = document.createElement("h3");
                questionType.textContent = `${pregunta.tipo}:`;

                const questionText = document.createElement("p");
                questionText.textContent = `${index + 1}. ${pregunta.pregunta}`;

                questionCard.appendChild(questionType);
                questionCard.appendChild(questionText);

                // Si hay opciones (preguntas de opción múltiple)
                if (pregunta.opciones) {
                    const optionsList = document.createElement("ul");
                    pregunta.opciones.forEach((opcion, idx) => {
                        const optionItem = document.createElement("li");
                        optionItem.textContent = `${String.fromCharCode(97 + idx)}) ${opcion}`; // a), b), c)...
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

    // Botón de volver a generar
    const generateAgain = document.getElementById("generateAgain");
    if (generateAgain) {
        generateAgain.addEventListener("click", () => {
            window.location.href = "/dashboard";
        });
    }
});
