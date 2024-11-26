document.addEventListener("DOMContentLoaded", () => {
    const questionsContainer = document.getElementById("questionsContainer");
    const examCurso = document.getElementById("examCurso");
    const examTema = document.getElementById("examTema");

    const examData = JSON.parse(localStorage.getItem("examData"));

    if (examData) {
        examCurso.textContent = examData.curso;
        examTema.textContent = examData.tema;

        renderQuestions(examData.preguntas);
    }

    function renderQuestions(questions) {
        questionsContainer.innerHTML = "";
        questions.forEach((q, index) => {
            const questionDiv = document.createElement("div");
            questionDiv.innerHTML = `
                <h3>Pregunta ${index + 1}</h3>
                <p>${q.pregunta}</p>
                ${q.opciones ? `<ul>${q.opciones.map(opt => `<li>${opt}</li>`).join("")}</ul>` : ""}
                <button class="button" onclick="regenerateQuestion(${index})">Regenerar</button>
            `;
            questionsContainer.appendChild(questionDiv);
        });
    }

    document.getElementById("printButton").addEventListener("click", () => {
        window.print();
    });
});

function regenerateQuestion(index) {
    alert("Función para regenerar pregunta en desarrollo");
}
