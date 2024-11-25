document.addEventListener("DOMContentLoaded", () => {
    const loadingIndicator = document.getElementById("loadingIndicator");
    const examContainer = document.getElementById("examContainer");

    // Obtén los datos del servidor a través de localStorage
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
                const questionContainer = document.createElement("div");
                questionContainer.classList.add("question-container");

                // Añade el número y texto de la pregunta
                const questionNumber = document.createElement("h3");
                questionNumber.textContent = `Pregunta ${index + 1}: ${pregunta.tipo}`;
                const questionDetails = document.createElement("p");
                questionDetails.textContent = pregunta.pregunta;

                questionContainer.appendChild(questionNumber);
                questionContainer.appendChild(questionDetails);

                // Si hay opciones (pregunta de opción múltiple)
                if (pregunta.opciones) {
                    const optionsList = document.createElement("ul");
                    pregunta.opciones.forEach((opcion, idx) => {
                        const optionItem = document.createElement("li");
                        optionItem.textContent = `${String.fromCharCode(97 + idx)}) ${opcion}`;
                        optionsList.appendChild(optionItem);
                    });
                    questionContainer.appendChild(optionsList);
                }

                // Añadir botón para regenerar una pregunta específica
                const regenerateButton = document.createElement("button");
                regenerateButton.textContent = "Regenerar esta pregunta";
                regenerateButton.classList.add("regenerate-question");
                regenerateButton.addEventListener("click", () => regenerateQuestion(index, exam.curso, exam.tema));
                
                questionContainer.appendChild(regenerateButton);
                
                questionsSection.appendChild(questionContainer);
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

// Función para regenerar una pregunta específica
async function regenerateQuestion(index, curso, tema) {
    try {
        const response = await fetch('/regenerate_question', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ index, curso, tema }),
        });

        if (!response.ok) {
            throw new Error('Error al regenerar la pregunta');
        }

        const data = await response.json();
        const examData = JSON.parse(localStorage.getItem("examenPreguntas"));

        // Reemplaza la pregunta en el índice especificado
        examData.preguntas[index] = data.pregunta;

        // Actualiza el localStorage y recarga la página para reflejar los cambios
        localStorage.setItem("examenPreguntas", JSON.stringify(examData));
        window.location.reload();
    } catch (error) {
        console.error("Error al regenerar la pregunta:", error);
    }
}
