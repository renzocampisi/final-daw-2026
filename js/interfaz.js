'use strict';
var resultadosAutocompletado = [];
var idIntervaloTemporizador = null;
var accionReintentarError = null;
function crearCeldaResultado(texto, clase) {
  var celda;
  celda = document.createElement('div');
  celda.className = clase;
  celda.textContent = texto;
  return celda;
}
function textoParaResultado(tipoResultado) {
  if (tipoResultado === 'mayor') {
    return ' ▲';
  } else if (tipoResultado === 'menor') {
    return ' ▼';
  }
  return '';
}
function pintarFilaTablero(intento) {
  var contenedorFila, resultado, columnas, i, clase;
  resultado = intento.resultado;
  contenedorFila = document.createElement('div');
  contenedorFila.className = 'fila-tablero';
  contenedorFila.appendChild(crearCeldaResultado(intento.jugador.name, 'celda-resultado'));
  columnas = [
    { valor: intento.jugador.nationality, tipo: resultado.nacionalidad },
    { valor: intento.jugador.club, tipo: resultado.club },
    { valor: intento.jugador.position, tipo: resultado.posicion },
    { valor: intento.jugador.age, tipo: resultado.edad },
    { valor: intento.jugador.overall, tipo: resultado.overall },
    { valor: intento.jugador.heightCm, tipo: resultado.altura }
  ];
  for (i = 0; i < columnas.length; i++) {
    clase = 'celda-resultado resultado-' + columnas[i].tipo;
    contenedorFila.appendChild(crearCeldaResultado(columnas[i].valor + textoParaResultado(columnas[i].tipo), clase));
  }
  document.getElementById('cuerpo-tablero').appendChild(contenedorFila);
}
function limpiarTablero() {
  document.getElementById('cuerpo-tablero').innerHTML = '';
}
function actualizarContador(intentosRestantes) {
  document.getElementById('contador-intentos').textContent = intentosRestantes;
}
function actualizarTemporizador() {
  document.getElementById('temporizador').textContent = formatearTiempo(calcularTiempoTranscurrido());
}
function detenerIntervaloTemporizador() {
  if (idIntervaloTemporizador !== null) {
    clearInterval(idIntervaloTemporizador);
    idIntervaloTemporizador = null;
  }
}
function iniciarIntervaloTemporizador() {
  detenerIntervaloTemporizador();
  idIntervaloTemporizador = setInterval(actualizarTemporizador, 1000);
}
function mostrarPantallaJuego() {
  document.getElementById('pantalla-bienvenida').className = 'pantalla-bienvenida oculto';
  document.getElementById('pantalla-juego').className = 'pantalla-juego';
}
function mostrarErrorBienvenida(mensaje) {
  var elemento;
  elemento = document.getElementById('error-nombre-jugador');
  elemento.textContent = mensaje;
  elemento.className = 'mensaje-error';
}
function ocultarErrorBienvenida() {
  document.getElementById('error-nombre-jugador').className = 'mensaje-error oculto';
}
function ocultarAutocompletado() {
  var lista;
  lista = document.getElementById('lista-autocompletado');
  lista.innerHTML = '';
  lista.className = 'lista-autocompletado oculto';
}
function crearItemAutocompletado(jugador, indice) {
  var item;
  item = document.createElement('li');
  item.className = 'item-autocompletado';
  item.setAttribute('data-indice', indice);
  item.textContent = jugador.name + ' — ' + jugador.club;
  return item;
}
function renderizarAutocompletado(listaJugadores) {
  var lista, i;
  resultadosAutocompletado = listaJugadores;
  if (listaJugadores.length === 0) {
    ocultarAutocompletado();
    return;
  }
  lista = document.getElementById('lista-autocompletado');
  lista.innerHTML = '';
  for (i = 0; i < listaJugadores.length; i++) {
    lista.appendChild(crearItemAutocompletado(listaJugadores[i], i));
  }
  lista.className = 'lista-autocompletado';
}
function mostrarModal(idModal) {
  document.getElementById(idModal).className = 'modal';
}
function ocultarModal(idModal) {
  document.getElementById(idModal).className = 'modal oculto';
}
function mostrarModalVictoria(cantidadIntentos, segundosTranscurridos) {
  var texto;
  texto = 'Adivinaste en ' + cantidadIntentos + ' intento(s), en ' + formatearTiempo(segundosTranscurridos) + '.';
  document.getElementById('texto-victoria').textContent = texto;
  mostrarModal('modal-victoria');
}
function mostrarModalDerrota(jugadorSecreto) {
  var texto;
  texto = 'El jugador secreto era ' + jugadorSecreto.name + ' (' + jugadorSecreto.club + ').';
  document.getElementById('texto-derrota').textContent = texto;
  mostrarModal('modal-derrota');
}
function mostrarModalError(mensaje, funcionReintentar) {
  var botonReintentar;
  document.getElementById('texto-error').textContent = mensaje;
  botonReintentar = document.getElementById('boton-error-reintentar');
  accionReintentarError = funcionReintentar || null;
  if (accionReintentarError !== null) {
    botonReintentar.className = 'boton-primario';
  } else {
    botonReintentar.className = 'boton-primario oculto';
  }
  mostrarModal('modal-error');
}
