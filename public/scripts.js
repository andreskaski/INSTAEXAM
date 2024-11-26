document.addEventListener("DOMContentLoaded", () => {
    const loadingIndicator = document.getElementById("loadingIndicator");
    const examContainer = document.getElementById("examContainer");
    const questionsContainer = document.getElementById("questionsContainer");
    const examCurso = document.getElementById("examCurso");
    const examTema = document.getElementById("examTema");
    const printButton = document.getElementById("printButton");

    const examData = JSON.parse(localStorage.getItem("examenPreguntas")) || {};
    const { curso, tema, preguntas } = examData;

    // Mostrar spinner mientras se cargan los datos
    loadingIndicator.style.display = "block";

    // Simular retraso para mostrar spinner (solo para efecto visual)
    setTimeout(() => {
        if (curso && tema && preguntas) {
            examCurso.textContent = curso;
            examTema.textContent = tema;

            // Renderizar preguntas
            preguntas.forEach((pregunta, index) => {
                const questionDiv = document.createElement("div");
                questionDiv.classList.add("question");

                // Texto de la pregunta
                const questionText = document.createElement("p");
                questionText.textContent = `${index + 1}. ${pregunta.pregunta}`;
                questionDiv.appendChild(questionText);

                // Opciones si es de opción múltiple
                if (pregunta.opciones) {
                    const optionsDiv = document.createElement("div");
                    optionsDiv.classList.add("options");
                    pregunta.opciones.forEach((opcion, i) => {
                        const optionText = document.createElement("p");
                        optionText.textContent = `${String.fromCharCode(97 + i)}. ${opcion}`;
                        optionsDiv.appendChild(optionText);
                    });
                    questionDiv.appendChild(optionsDiv);
                }

                // Botón para regenerar pregunta
                const regenerateButton = document.createElement("button");
                regenerateButton.textContent = "Regenerar";
                regenerateButton.addEventListener("click", () => regenerateQuestion(index));
                questionDiv.appendChild(regenerateButton);

                questionsContainer.appendChild(questionDiv);
            });

            // Mostrar contenedor del examen
            loadingIndicator.style.display = "none";
            examContainer.style.display = "block";
        } else {
            alert("Error: No se encontraron datos del examen.");
        }
    }, 1000);

    // Función para regenerar una pregunta
    function regenerateQuestion(index) {
        alert(`Regenerando la pregunta ${index + 1}...`);
        // Aquí puedes agregar la lógica para regenerar preguntas desde el servidor
    }

    // Funcionalidad de impresión
    printButton.addEventListener("click", () => window.print());
});
