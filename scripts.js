  function abrirModal(id) {
    document.getElementById(id).style.display = "block";
  }

  function cerrarModal(id) {
    document.getElementById(id).style.display = "none";
  }

  window.onclick = function(event) {
    const modales = document.querySelectorAll('.modal');
    modales.forEach(modal => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  };

function filtrarProfesor(nombre) {
  const celdas = document.querySelectorAll('.tabla-horario td[data-profe]');
  celdas.forEach(celda => {
    const profe = celda.getAttribute('data-profe');
    celda.style.display = (nombre === 'todos' || profe === nombre) ? 'table-cell' : 'none';
  });

  const columnas = document.querySelectorAll('.tabla-horario td:first-child, .tabla-horario th:first-child');
  columnas.forEach(col => col.style.display = 'table-cell'); // siempre visible
}
document.querySelectorAll('.seleccionar').forEach(boton => {
  boton.addEventListener('click', () => {
    const profe = boton.getAttribute('data-profe');
    const dia = boton.getAttribute('data-dia');
    const hora = boton.getAttribute('data-hora');

    document.getElementById('profesorSeleccionado').value = profe;
    document.getElementById('diaSeleccionado').value = dia;
    document.getElementById('horaSeleccionada').value = hora;

    document.getElementById('resumenReserva').textContent = profe + " - " + dia + " a las " + hora;
    document.getElementById('botonEnviar').style.display = 'inline-block';
  });
});

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------
  // Función de mezcla (Fisher–Yates)
  function shuffle(array) {
    let m = array.length, t, i;
    while (m) {
      i = Math.floor(Math.random() * m--);
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    return array;
  }

  // ------------------------------------------------
  // Referencias al DOM
  const startBtn  = document.getElementById('start-quiz');
  const modal     = document.getElementById('quiz-modal');
  const closeBtn  = document.getElementById('quiz-close');
  const container = document.getElementById('quiz-container');
  const prevBtn   = document.getElementById('quiz-prev');
  const nextBtn   = document.getElementById('quiz-next');
  const resultDiv = document.getElementById('quiz-result');

  let questions = [];
  let current   = 0;
  let answers   = [];

  // ------------------------------------------------
  // Abrir modal y cargar preguntas
  startBtn.addEventListener('click', () => {
    fetch('questions.json')
      .then(res => res.json())
      .then(data => {
        const examLength = 50;               // ← cambia a 10, 30 o 50 según quieras
        questions = shuffle(data)
                      .slice(0, examLength);
        answers = Array(questions.length).fill(null);
        current = 0;
        showQuestion();
        resultDiv.innerHTML = '';
        modal.style.display = 'block';
      })
      .catch(err => console.error('Error cargando preguntas:', err));
  });

  // ------------------------------------------------
  // Cerrar modal
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  window.addEventListener('click', e => {
    if (e.target === modal) modal.style.display = 'none';
  });

  // ------------------------------------------------
  // Navegación Prev/Next
  prevBtn.addEventListener('click', () => {
    if (current > 0) {
      saveAnswer();
      current--;
      showQuestion();
    }
  });

  nextBtn.addEventListener('click', () => {
    saveAnswer();
    if (current < questions.length - 1) {
      current++;
      showQuestion();
    } else {
      showResult();
    }
  });

  // ------------------------------------------------
  // Renderizar pregunta actual
  function showQuestion() {
    const q = questions[current];
    container.innerHTML = `
      <div class="question">
        ${current + 1}. [${q.level}] ${q.question}
      </div>
      <ul class="options">
        ${q.options.map((opt, i) => `
          <li>
            <input
              type="radio"
              id="opt${i}"
              name="q${current}"
              value="${i}"
              ${answers[current] === i ? 'checked' : ''}
            >
            <label for="opt${i}">${opt}</label>
          </li>
        `).join('')}
      </ul>
    `;
    updateNav();
  }

  // ------------------------------------------------
  // Guardar respuesta seleccionada
  function saveAnswer() {
    const checked = container.querySelector('input[type="radio"]:checked');
    answers[current] = checked ? parseInt(checked.value) : null;
  }

  // ------------------------------------------------
  // Actualizar visibilidad y texto de botones
  function updateNav() {
    prevBtn.style.visibility = current === 0 ? 'hidden' : 'visible';
    nextBtn.textContent = current === questions.length - 1 ? 'Terminar' : 'Siguiente';
  }

  // ------------------------------------------------
  // Calcular y mostrar resultado final
  function showResult() {
    let score = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) score++;
    });

    let level;
    const p = score / questions.length;
    if (p < 0.3)      level = 'A1';
    else if (p < 0.5) level = 'A2';
    else if (p < 0.8) level = 'B1';
    else              level = 'B2';

    container.innerHTML = '';
    resultDiv.innerHTML = `
      <h3>Tu resultado: ${level}</h3>
      <p>Obtuviste ${score}/${questions.length} aciertos (${Math.round(p*100)}%).</p>
      <p>Basado en tu desempeño, te recomendamos inscribirte en el nivel <strong>${level}</strong>.</p>
    `;
    prevBtn.style.visibility = 'hidden';
    nextBtn.style.display    = 'none';
  }
});