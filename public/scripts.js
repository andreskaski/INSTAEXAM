document.addEventListener("DOMContentLoaded", () => {
    const loadingIndicator = document.getElementById("loadingIndicator");
    const examContainer = document.getElementById("examContainer");

    // Obtén los datos JSON del localStorage
    const examData = localStorage.getItem("examenPreguntas");
    const examCurso = localStorage.getItem("examenCurso");
    const examTema = localStorage.getItem("examenTema");

    if (examData && examCurso && examTema) {
        try {
            const exam = JSON.parse(examData);
            loadingIndicator.style.display = "none"; // Oculta el indicador de carga
            examContainer.style.display = "block"; // Muestra el contenedor

            // Rellena los datos del encabezado
            document.getElementById("examCurso").textContent = examCurso;
            document.getElementById("examTema").textContent = examTema;

            // Renderiza las preguntas dinámicamente
            const questionsSection = document.querySelector(".questions");
            questionsSection.innerHTML = ""; // Limpia cualquier contenido previo

            exam.forEach((pregunta, index) => {
                const questionCard = document.createElement("div");
                questionCard.classList.add("question-card");

                const questionTitle = document.createElement("h3");
                questionTitle.textContent = `Pregunta ${index + 1}:`;

                const questionText = document.createElement("p");
                questionText.textContent = pregunta.pregunta;

                const regenerateButton = document.createElement("button");
                regenerateButton.textContent = "Regenerar Pregunta";
                regenerateButton.addEventListener("click", async () => {
                    const newQuestion = await regenerateQuestion(index);
                    if (newQuestion) {
                        exam[index] = newQuestion; // Sustituye la pregunta
                        localStorage.setItem("examenPreguntas", JSON.stringify(exam));
                        renderQuestions(); // Vuelve a renderizar
                    }
                });

                questionCard.appendChild(questionTitle);
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

                questionCard.appendChild(regenerateButton);
                questionsSection.appendChild(questionCard);
            });

            // Función para regenerar preguntas específicas
            async function regenerateQuestion(index) {
                try {
                    const response = await fetch("/regenerate_question", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            curso: examCurso,
                            tema: examTema,
                            index,
                        }),
                    });

                    const data = await response.json();
                    return data.pregunta; // Devuelve la nueva pregunta generada
                } catch (error) {
                    console.error("Error al regenerar la pregunta:", error);
                    return null;
                }
            }

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
