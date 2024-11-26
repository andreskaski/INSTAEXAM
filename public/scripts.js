document.addEventListener("DOMContentLoaded", () => {
    const questionsContainer = document.getElementById("questions");
    const examCurso = document.getElementById("examCurso");
    const examTema = document.getElementById("examTema");

    const examData = JSON.parse(localStorage.getItem("examData"));
    if (examData) {
        examCurso.textContent = examData.curso;
        examTema.textContent = examData.tema;

        examData.preguntas.forEach((pregunta, index) => {
            const questionDiv = document.createElement("div");
            questionDiv.className = "question";

            const questionTitle = document.createElement("h3");
            questionTitle.textContent = `Pregunta ${index + 1}: ${pregunta.tipo}`;

            const questionText = document.createElement("p");
            questionText.textContent = pregunta.pregunta;

            const regenerateButton = document.createElement("button");
            regenerateButton.textContent = "Regenerar";
            regenerateButton.onclick = async () => {
                const newQuestion = await regenerateQuestion(index);
                if (newQuestion) {
                    examData.preguntas[index] = newQuestion;
                    renderQuestions();
                }
            };

            questionDiv.appendChild(questionTitle);
            questionDiv.appendChild(questionText);
            questionDiv.appendChild(regenerateButton);

            if (pregunta.opciones) {
                const optionsList = document.createElement("ul");
                pregunta.opciones.forEach(option => {
                    const optionItem = document.createElement("li");
                    optionItem.textContent = option;
                    optionsList.appendChild(optionItem);
                });
                questionDiv.appendChild(optionsList);
            }

            questionsContainer.appendChild(questionDiv);
        });
    }

    document.getElementById("printButton").addEventListener("click", () => {
        window.print();
    });

    async function regenerateQuestion(index) {
        const response = await fetch('/regenerate_question', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ index, curso: examData.curso, tema: examData.tema })
        });
        const data = await response.json();
        return data.pregunta;
    }
});
