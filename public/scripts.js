document.addEventListener("DOMContentLoaded", () => {
    const preguntasContainer = document.getElementById("preguntas");
    const examCurso = document.getElementById("examCurso");
    const examTema = document.getElementById("examTema");

    const preguntas = JSON.parse(localStorage.getItem("examenPreguntas"));
    const curso = localStorage.getItem("examenCurso");
    const tema = localStorage.getItem("examenTema");

    examCurso.textContent = curso;
    examTema.textContent = tema;

    function renderQuestions() {
        preguntasContainer.innerHTML = ""; // Limpia las preguntas anteriores

        preguntas.forEach((pregunta, index) => {
            const questionDiv = document.createElement("div");
            questionDiv.className = "question";

            const questionTitle = document.createElement("h3");
            questionTitle.textContent = `Pregunta ${index + 1}:`;

            const questionText = document.createElement("p");
            questionText.textContent = pregunta.pregunta;

            const regenerateButton = document.createElement("button");
            regenerateButton.textContent = "Regenerar";
            regenerateButton.addEventListener("click", async () => {
                const newQuestion = await regenerateQuestion(index);
                if (newQuestion) {
                    preguntas[index] = newQuestion;
                    renderQuestions();
                }
            });

            questionDiv.appendChild(questionTitle);
            questionDiv.appendChild(questionText);
            questionDiv.appendChild(regenerateButton);

            if (pregunta.opciones) {
                const optionsList = document.createElement("ul");
                pregunta.opciones.forEach((opcion, idx) => {
                    const optionItem = document.createElement("li");
                    optionItem.textContent = `${String.fromCharCode(97 + idx)}) ${opcion}`;
                    optionsList.appendChild(optionItem);
                });
                questionDiv.appendChild(optionsList);
            }

            preguntasContainer.appendChild(questionDiv);
        });
    }

    async function regenerateQuestion(index) {
        try {
            const response = await fetch("/regenerate_question", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    index,
                    curso,
                    tema
                }),
            });
            const data = await response.json();
            return data.pregunta;
        } catch (error) {
            console.error("Error al regenerar la pregunta:", error);
        }
    }

    renderQuestions();

    // Botón de imprimir
    const printButton = document.getElementById("printButton");
    printButton.addEventListener("click", () => window.print());
});
