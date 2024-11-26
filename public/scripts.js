document.addEventListener("DOMContentLoaded", () => {
    const loadingIndicator = document.getElementById("loadingIndicator");
    const examContainer = document.getElementById("examContainer");
    const questionsContainer = document.getElementById("questionsContainer");
    const examCurso = document.getElementById("examCurso");
    const examTema = document.getElementById("examTema");
    const printButton = document.getElementById("printButton");

    const examData = JSON.parse(localStorage.getItem("examenPreguntas")) || {};
    const { curso, tema, preguntas } = examData;

    if (curso && tema && preguntas) {
        examCurso.textContent = curso;
        examTema.textContent = tema;

        preguntas.forEach((pregunta, index) => {
            const questionDiv = document.createElement("div");
            questionDiv.classList.add("question");

            const questionNumber = document.createElement("h2");
            questionNumber.textContent = `Pregunta ${index + 1}`;
            questionDiv.appendChild(questionNumber);

            const questionText = document.createElement("p");
            questionText.textContent = pregunta.pregunta;
            questionDiv.appendChild(questionText);

            if (pregunta.opciones) {
                const optionsContainer = document.createElement("div");
                optionsContainer.classList.add("options");
                pregunta.opciones.forEach((opcion, i) => {
                    const optionText = document.createElement("p");
                    optionText.textContent = `${String.fromCharCode(97 + i)}) ${opcion}`;
                    optionsContainer.appendChild(optionText);
                });
                questionDiv.appendChild(optionsContainer);
            }

            const regenerateButton = document.createElement("button");
            regenerateButton.textContent = "Regenerar";
            regenerateButton.classList.add("regenerate-btn");
            regenerateButton.addEventListener("click", () => regenerateQuestion(index));

            questionDiv.appendChild(regenerateButton);
            questionsContainer.appendChild(questionDiv);
        });

        loadingIndicator.style.display = "none";
        examContainer.style.display = "block";
    } else {
        alert("No se encontraron datos del examen.");
    }

    async function regenerateQuestion(index) {
        try {
            const response = await fetch("/regenerate_question", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ index, curso, tema }),
            });
            const data = await response.json();
            preguntas[index] = data.pregunta;
            localStorage.setItem("examenPreguntas", JSON.stringify(examData));
            renderQuestions(); // Recargar las preguntas
        } catch (error) {
            alert("Hubo un error al regenerar la pregunta. Inténtalo nuevamente.");
        }
    }

    printButton.addEventListener("click", () => window.print());
});

