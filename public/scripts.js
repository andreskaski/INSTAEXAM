document.addEventListener("DOMContentLoaded", () => {
    const examCurso = document.getElementById("examCurso");
    const examTema = document.getElementById("examTema");
    const questionsContainer = document.getElementById("questions");
    const printButton = document.getElementById("printButton");

    const preguntas = JSON.parse(localStorage.getItem("examenPreguntas"));
    const curso = localStorage.getItem("examenCurso");
    const tema = localStorage.getItem("examenTema");

    examCurso.textContent = curso;
    examTema.textContent = tema;

    preguntas.forEach((pregunta, index) => {
        const questionDiv = document.createElement("div");
        questionDiv.className = "question-card";

        const questionTitle = document.createElement("h3");
        questionTitle.textContent = `Pregunta ${index + 1}: ${pregunta.tipo}`;
        questionDiv.appendChild(questionTitle);

        const questionText = document.createElement("p");
        questionText.textContent = pregunta.pregunta;
        questionDiv.appendChild(questionText);

        if (pregunta.opciones) {
            const optionsList = document.createElement("ul");
            pregunta.opciones.forEach((opcion) => {
                const optionItem = document.createElement("li");
                optionItem.textContent = opcion;
                optionsList.appendChild(optionItem);
            });
            questionDiv.appendChild(optionsList);
        }

        questionsContainer.appendChild(questionDiv);
    });

    printButton.addEventListener("click", () => {
        window.print();
    });
});
