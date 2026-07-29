'use strict';
var idTemporizadorBusqueda = null;
function manejarJugadorSecretoObtenido(jugadorSecreto) {
  inicializarEstadoPartida(estadoJuego.nombreJugadorHumano, jugadorSecreto);
  limpiarTablero();
  actualizarContador(estadoJuego.intentosMaximos);
  document.getElementById('temporizador').textContent = '00:00';
  detenerIntervaloTemporizador();
  mostrarPantallaJuego();
}
function manejarErrorJugadorSecreto() {
  mostrarModalError('No se pudo cargar el jugador secreto. Revisá tu conexión.', reintentarObtenerJugadorSecreto);
}
function reintentarObtenerJugadorSecreto() {
  ocultarModal('modal-error');
  iniciarNuevaPartida();
}
function iniciarNuevaPartida() {
  obtenerJugadorSecreto().then(manejarJugadorSecretoObtenido).catch(manejarErrorJugadorSecreto);
}
function manejarEnvioBienvenida(evento) {
  var nombre;
  evento.preventDefault();
  nombre = document.getElementById('input-nombre-jugador').value.trim();
  if (nombre.length < 3) {
    mostrarErrorBienvenida('Ingresá al menos 3 letras.');
    return;
  }
  ocultarErrorBienvenida();
  estadoJuego.nombreJugadorHumano = nombre;
  iniciarNuevaPartida();
}
function manejarRespuestaBusqueda(listaJugadores) {
  renderizarAutocompletado(listaJugadores);
}
function manejarErrorBusqueda() {
  ocultarAutocompletado();
  mostrarModalError('No se pudo buscar jugadores. Revisá tu conexión.', null);
}
function ejecutarBusquedaDiferida() {
  var consulta;
  consulta = document.getElementById('input-busqueda').value.trim();
  if (consulta.length < 2) {
    ocultarAutocompletado();
    return;
  }
  buscarJugadores(consulta, 8).then(manejarRespuestaBusqueda).catch(manejarErrorBusqueda);
}
function manejarEntradaBusqueda() {
  if (idTemporizadorBusqueda !== null) {
    clearTimeout(idTemporizadorBusqueda);
  }
  idTemporizadorBusqueda = setTimeout(ejecutarBusquedaDiferida, 300);
}
function procesarIntento(jugadorSeleccionado) {
  var resultado;
  resultado = registrarIntento(jugadorSeleccionado);
  if (resultado.tipo === 'repetido') {
    mostrarModalError('Ya intentaste con ese jugador.', null);
    return;
  }
  if (estadoJuego.intentosRealizados.length === 1) {
    iniciarIntervaloTemporizador();
  }
  pintarFilaTablero(resultado.intento);
  actualizarContador(resultado.intentosRestantes);
  if (resultado.estadoPartida === 'victoria') {
    detenerIntervaloTemporizador();
    mostrarModalVictoria(estadoJuego.intentosRealizados.length, calcularTiempoTranscurrido());
  } else if (resultado.estadoPartida === 'derrota') {
    detenerIntervaloTemporizador();
    mostrarModalDerrota(estadoJuego.jugadorSecreto);
  }
}
function manejarClickAutocompletado(evento) {
  var elementoClickeado, indice, jugadorSeleccionado;
  elementoClickeado = evento.target;
  if (!elementoClickeado.classList.contains('item-autocompletado')) {
    return;
  }
  indice = parseInt(elementoClickeado.getAttribute('data-indice'), 10);
  jugadorSeleccionado = resultadosAutocompletado[indice];
  document.getElementById('input-busqueda').value = '';
  ocultarAutocompletado();
  procesarIntento(jugadorSeleccionado);
}
function manejarClickReiniciar() {
  ocultarModal('modal-victoria');
  ocultarModal('modal-derrota');
  iniciarNuevaPartida();
}
function manejarClickReintentarError() {
  var accionPendiente;
  accionPendiente = accionReintentarError;
  ocultarModal('modal-error');
  if (accionPendiente !== null) {
    accionPendiente();
  }
}
function manejarClickCerrarError() {
  ocultarModal('modal-error');
}
function inicializarEventos() {
  document.getElementById('formulario-bienvenida').addEventListener('submit', manejarEnvioBienvenida);
  document.getElementById('input-busqueda').addEventListener('input', manejarEntradaBusqueda);
  document.getElementById('lista-autocompletado').addEventListener('click', manejarClickAutocompletado);
  document.getElementById('boton-reiniciar').addEventListener('click', manejarClickReiniciar);
  document.getElementById('boton-victoria-reiniciar').addEventListener('click', manejarClickReiniciar);
  document.getElementById('boton-derrota-reiniciar').addEventListener('click', manejarClickReiniciar);
  document.getElementById('boton-error-reintentar').addEventListener('click', manejarClickReintentarError);
  document.getElementById('boton-error-cerrar').addEventListener('click', manejarClickCerrarError);
}
