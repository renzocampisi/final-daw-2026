'use strict';
var idTemporizadorBusqueda = null;
var MAPA_ACENTOS = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'à': 'a', 'è': 'e', 'ì': 'i', 'ò': 'o', 'ù': 'u', 'ä': 'a', 'ë': 'e', 'ï': 'i', 'ö': 'o', 'ü': 'u', 'â': 'a', 'ê': 'e', 'î': 'i', 'ô': 'o', 'û': 'u', 'ñ': 'n', 'ç': 'c' };
var LIMITE_BUSQUEDA_AMPLIADA = 25;
var estadoBusquedaAmpliada = { consultaOriginal: '', consultaActual: '' };
function manejarJugadorSecretoObtenido(jugadorSecreto) {
  rehabilitarBotonesInicio();
  inicializarEstadoPartida(estadoJuego.nombreJugadorHumano, jugadorSecreto);
  limpiarTablero();
  actualizarContador(estadoJuego.intentosMaximos);
  document.getElementById('temporizador').textContent = '00:00';
  detenerIntervaloTemporizador();
  mostrarPantallaJuego();
}
function manejarErrorJugadorSecreto() {
  rehabilitarBotonesInicio();
  mostrarModalError('No se pudo cargar el jugador secreto. Revisá tu conexión.', reintentarObtenerJugadorSecreto);
}
function reintentarObtenerJugadorSecreto() {
  ocultarModal('modal-error');
  iniciarNuevaPartida();
}
function iniciarNuevaPartida() {
  deshabilitarBotonesInicio();
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
function normalizarTexto(texto) {
  var resultado, i, caracter;
  resultado = '';
  texto = texto.toLowerCase();
  for (i = 0; i < texto.length; i++) {
    caracter = texto.charAt(i);
    resultado += MAPA_ACENTOS[caracter] || caracter;
  }
  return resultado;
}
function filtrarPorCoincidenciaFlexible(listaJugadores, consultaOriginal) {
  var consultaNormalizada, resultado, i;
  consultaNormalizada = normalizarTexto(consultaOriginal);
  resultado = [];
  for (i = 0; i < listaJugadores.length; i++) {
    if (normalizarTexto(listaJugadores[i].name).indexOf(consultaNormalizada) !== -1) {
      resultado.push(listaJugadores[i]);
    }
  }
  return resultado;
}
function manejarErrorBusqueda() {
  ocultarAutocompletado();
  mostrarModalError('No se pudo buscar jugadores. Revisá tu conexión.', null);
}
function intentarBusquedaAmpliada() {
  if (estadoBusquedaAmpliada.consultaActual.length < 2) {
    renderizarAutocompletado([]);
    return;
  }
  buscarJugadores(estadoBusquedaAmpliada.consultaActual, LIMITE_BUSQUEDA_AMPLIADA).then(manejarResultadoBusquedaAmpliada).catch(manejarErrorBusqueda);
}
function manejarResultadoBusquedaAmpliada(listaJugadores) {
  var listaFiltrada;
  if (listaJugadores.length === 0) {
    estadoBusquedaAmpliada.consultaActual = estadoBusquedaAmpliada.consultaActual.slice(0, -1);
    intentarBusquedaAmpliada();
    return;
  }
  listaFiltrada = filtrarPorCoincidenciaFlexible(listaJugadores, estadoBusquedaAmpliada.consultaOriginal);
  renderizarAutocompletado(listaFiltrada);
}
function manejarRespuestaBusqueda(listaJugadores) {
  if (listaJugadores.length === 0) {
    estadoBusquedaAmpliada.consultaActual = estadoBusquedaAmpliada.consultaOriginal.slice(0, -1);
    intentarBusquedaAmpliada();
    return;
  }
  renderizarAutocompletado(listaJugadores);
}
function ejecutarBusquedaDiferida() {
  var consulta;
  consulta = document.getElementById('input-busqueda').value.trim();
  if (consulta.length < 2) {
    ocultarAutocompletado();
    return;
  }
  estadoBusquedaAmpliada.consultaOriginal = consulta;
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
  if (estadoJuego.partidaTerminada) {
    return;
  }
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
