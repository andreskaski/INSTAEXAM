document.addEventListener("DOMContentLoaded", () => {
    const preguntasContainer = document.getElementById("preguntas");
    const examCurso = document.getElementById("examCurso");
    const examTema = document.getElementById("examTema");

    const examData = JSON.parse(localStorage.getItem("examen"));
    const { curso, tema, preguntas } = examData;

    examCurso.textContent = curso;
    examTema.textContent = tema;

    // Renderizar preguntas
    const renderQuestions = () => {
        preguntasContainer.innerHTML = ""; // Limpiar contenedor

        preguntas.forEach((pregunta, index) => {
            const questionDiv = document.createElement("div");
            questionDiv.classList.add("question");

            const questionTitle = document.createElement("h3");
            questionTitle.textContent = `Pregunta ${index + 1}: ${pregunta.tipo}`;
            questionDiv.appendChild(questionTitle);

            const questionText = document.createElement("p");
            questionText.textContent = pregunta.pregunta;
            questionDiv.appendChild(questionText);

            // Opciones si es de opción múltiple
            if (pregunta.opciones) {
                const optionsList = document.createElement("ul");
                pregunta.opciones.forEach((opcion, i) => {
                    const optionItem = document.createElement("li");
                    optionItem.textContent = `${String.fromCharCode(97 + i)}) ${opcion}`;
                    optionsList.appendChild(optionItem);
                });
                questionDiv.appendChild(optionsList);
            }

            // Botón de regenerar pregunta
            const regenerateBtn = document.createElement("button");
            regenerateBtn.textContent = "Regenerar";
            regenerateBtn.classList.add("regenerate-btn");
            regenerateBtn.addEventListener("click", async () => {
                const nuevaPregunta = await regenerateQuestion(index);
                if (nuevaPregunta) {
                    preguntas[index] = nuevaPregunta;
                    renderQuestions();
                }
            });
            questionDiv.appendChild(regenerateBtn);

            preguntasContainer.appendChild(questionDiv);
        });
    };

    // Función para regenerar pregunta
    const regenerateQuestion = async (index) => {
        try {
            const response = await fetch("/regenerate_question", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ index, curso, tema }),
            });
            const data = await response.json();
            return data.pregunta;
        } catch (error) {
            console.error("Error al regenerar la pregunta:", error);
        }
    };

    // Botón de impresión
    const printButton = document.getElementById("printButton");
    printButton.addEventListener("click", () => window.print());

    renderQuestions();
});
