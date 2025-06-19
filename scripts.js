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