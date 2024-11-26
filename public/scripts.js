document.addEventListener("DOMContentLoaded", () => {
    const loadingIndicator = document.getElementById("loadingIndicator");
    const examContainer = document.getElementById("examContainer");

    // Cargar los datos del examen desde el servidor
    fetch("/generar_examen", { method: "GET" })
        .then((response) => response.json())
        .then((exam) => {
            loadingIndicator.style.display = "none";
            examContainer.style.display = "block";

            // Rellenar datos del examen
            document.getElementById("examCurso").textContent = exam.curso;
            document.getElementById("examTema").textContent = exam.tema;

            // Renderizar las preguntas
            const questionsSection = document.querySelector(".questions");
            questionsSection.innerHTML = ""; // Limpiar contenido previo

            exam.preguntas.forEach((pregunta, index) => {
                const questionCard = document.createElement("div");
                questionCard.classList.add("question-card");

                const questionTitle = document.createElement("h3");
                questionTitle.textContent = `Pregunta ${index + 1}: ${pregunta.tipo}`;
                questionCard.appendChild(questionTitle);

                const questionText = document.createElement("p");
                questionText.textContent = pregunta.pregunta;
                questionCard.appendChild(questionText);

                if (pregunta.opciones) {
                    const optionsList = document.createElement("ul");
                    pregunta.opciones.forEach((opcion) => {
                        const optionItem = document.createElement("li");
                        optionItem.textContent = opcion;
                        optionsList.appendChild(optionItem);
                    });
                    questionCard.appendChild(optionsList);
                }

                questionsSection.appendChild(questionCard);
            });
        })
        .catch((error) => {
            console.error("Error al cargar el examen:", error);
        });

    // Botón para imprimir
    const printButton = document.getElementById("printButton");
    if (printButton) {
        printButton.addEventListener("click", () => window.print());
    }

    // Botón para volver al dashboard
    const generateAgain = document.getElementById("generateAgain");
    if (generateAgain) {
        generateAgain.addEventListener("click", () => {
            window.location.href = "/dashboard";
        });
    }
});
