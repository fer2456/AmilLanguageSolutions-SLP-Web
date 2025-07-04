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
  const startBtn   = document.getElementById('start-quiz');
  const modal      = document.getElementById('quiz-modal');
  const closeBtn   = document.getElementById('quiz-close');
  const container  = document.getElementById('quiz-container');
  const prevBtn    = document.getElementById('quiz-prev');
  const nextBtn    = document.getElementById('quiz-next');
  const resultDiv  = document.getElementById('quiz-result');

  let questions = [];
  let current   = 0;
  let answers   = [];

  // Abre modal
  startBtn.addEventListener('click', () => {
    fetch('questions.json')
      .then(res => res.json())
      .then(data => {
        /*questions = data;
        answers = Array(questions.length).fill(null);*/
        const examLength = 50;      // <- aquí pones 10, 30 o 50
        questions = shuffle(data).slice(0, examLength);
        current = 0;
        showQuestion();
        resultDiv.innerHTML = '';
        modal.style.display = 'block';
      })
      .catch(err => console.error('Error cargando preguntas:', err));
  });

  // Cierra modal
  closeBtn.addEventListener('click', () => modal.style.display = 'none');
  window.addEventListener('click', e => {
    if (e.target === modal) modal.style.display = 'none';
  });

  // Navegación
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

  // Muestra pregunta actual
  function showQuestion() {
    const q = questions[current];
    container.innerHTML = `
      <div class="question">
        ${current+1}. [${q.level}] ${q.question}
      </div>
      <ul class="options">
        ${q.options.map((opt, i) => `
          <li>
            <input type="radio" id="opt${i}" name="q${current}" value="${i}"
              ${answers[current] === i ? 'checked' : ''}>
            <label for="opt${i}">${opt}</label>
          </li>
        `).join('')}
      </ul>
    `;
    updateNav();
  }

  // Guarda la respuesta seleccionada
  function saveAnswer() {
    const checked = container.querySelector('input[type="radio"]:checked');
    answers[current] = checked ? parseInt(checked.value) : null;
  }

  // Actualiza botones Prev/Next
  function updateNav() {
    prevBtn.style.visibility = current === 0 ? 'hidden' : 'visible';
    nextBtn.textContent = current === questions.length - 1 ? 'Terminar' : 'Siguiente';
  }

  // Calcula y muestra resultado
  function showResult() {
    // Cuenta aciertos
    let score = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) score++;
    });

    // Mapea a nivel
    let level;
    const p = score / questions.length;
    if (p < 0.3)     level = 'A1';
    else if (p < 0.5)level = 'A2';
    else if (p < 0.8)level = 'B1';
    else             level = 'B2';

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