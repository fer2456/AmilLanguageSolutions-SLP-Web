// ===================================================================
// scripts.js
// Carga perfiles, filtra horarios y gestiona mini-modal de reserva
// ===================================================================

// -----------------------------------------
// 1) Variables globales
// -----------------------------------------

// Aquí guardaremos el array completo de profesores tras el fetch
let TEACHERS = [];

// Objeto temporal para almacenar la reserva pendiente
let pendingReservation = { prof: null, dia: null, hora: null };

// -----------------------------------------
// 2) Código que se ejecuta al cargar DOM
// -----------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // 2.1) Referencias a elementos del DOM
  const profilesContainer = document.getElementById('profiles-container'); // sección "Conoce a nuestros profesores"
  const teacherDetail     = document.getElementById('teacher-detail');     // mini-detalle en el modal
  const seleccionarBtns   = document.querySelectorAll('.seleccionar');    // botones "Reservar X"
  
  // -----------------------------------------
  // 2.2) Cargar y renderizar perfiles de profesores
  // -----------------------------------------
  fetch('teachers.json')                                  // turn0file2 cargar JSON
    .then(res => res.json())
    .then(data => {
      TEACHERS = data;                                    // guardamos array global
      // Generamos un <div class="teacher-card" id="teacher-<id>"> por cada profe
      profilesContainer.innerHTML = TEACHERS.map(t => `
        <div class="teacher-card" id="teacher-${t.id}">
          <img src="${t.photo}" alt="Foto de ${t.name}">
          <div class="info">
            <h3>${t.name}</h3>
            <p>${t.bio}</p>
            <div class="tags">
              ${t.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
          </div>
        </div>
      `).join('');
    })
    .catch(err => {
      console.error('Error cargando teachers.json:', err);
      profilesContainer.innerHTML = '<p>Error al cargar perfiles de profesores.</p>';
    });

  // -----------------------------------------
  // 2.3) Capturar clicks en botones de reserva
  // -----------------------------------------
  seleccionarBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();                                 // evita submit inmediato
      // Leemos data-profe, data-dia y data-hora de la celda
      const prof = btn.dataset.profe;
      const dia  = btn.dataset.dia;
      const hora = btn.dataset.hora;
      // Guardamos temporalmente
      pendingReservation = { prof, dia, hora };
      // Abrimos el mini-modal con detalle del profe
      openMiniModal(prof);
    });
  });
});

// -----------------------------------------
// 3) Funciones para mini-modal
// -----------------------------------------

/**
 * Muestra el mini-modal con foto, nombre y tags del profesor seleccionado.
 * @param {string} profId — coincide con t.id en teachers.json
 */
function openMiniModal(profId) {
  const prof = TEACHERS.find(t => t.id === profId);
  if (!prof) return alert('Perfil no encontrado');
  
  // Rellenamos el contenido del mini-modal
  document.getElementById('mini-photo').src = prof.photo;
  document.getElementById('mini-photo').alt = `Foto de ${prof.name}`;
  document.getElementById('mini-name').textContent = prof.name;
  document.getElementById('mini-tags').innerHTML =
    prof.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
  
  // Mostramos el mini-modal
  document.getElementById('mini-teacher-modal').style.display = 'block';
}

/** Cierra el mini-modal */
function closeMiniModal() {
  document.getElementById('mini-teacher-modal').style.display = 'none';
}

/**
 * Confirma la reserva: rellena los inputs ocultos y muestra el botón de envío.
 * Luego cierra el mini-modal.
 */
function confirmReservation() {
  const { prof, dia, hora } = pendingReservation;
  document.getElementById('profesorSeleccionado').value = prof;
  document.getElementById('diaSeleccionado').value       = dia;
  document.getElementById('horaSeleccionada').value     = hora;
  document.getElementById('resumenReserva').textContent  =
    `${prof} – ${dia} a las ${hora}`;
  document.getElementById('botonEnviar').style.display   = 'inline-block';
  closeMiniModal();
}

/**
 * Desplaza al perfil completo en la sección de maestros y lo destaca brevemente.
 */
function viewFullProfile() {
  closeMiniModal();
  const { prof } = pendingReservation;
  const el = document.getElementById(`teacher-${prof}`);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  el.classList.add('highlight');
  setTimeout(() => el.classList.remove('highlight'), 2000);
}

// -----------------------------------------
// 4) Resto de funciones existentes (modales, filtros, quiz, etc.)
//    – Mantén tu lógica de abrirModal(), cerrarModal(), filtrarProfesor(), quiz, etc.
//    – Asegúrate de no duplicar variables ni de reutilizar 'container' aquí.
// -----------------------------------------
// ...