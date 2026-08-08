'use strict';
var CLAVE_HISTORIAL = 'futbolle-historial';
var ordenActualHistorial = 'fecha';
function obtenerHistorial() {
  var guardado;
  guardado = localStorage.getItem(CLAVE_HISTORIAL);
  if (guardado === null) {
    return [];
  }
  return JSON.parse(guardado);
}
function guardarPartidaEnHistorial(nombreJugador, resultado, intentos, duracionSegundos) {
  var historial, partida;
  historial = obtenerHistorial();
  partida = {
    nombreJugador: nombreJugador,
    resultado: resultado,
    intentos: intentos,
    fechaHora: Date.now(),
    duracionSegundos: duracionSegundos
  };
  historial.push(partida);
  localStorage.setItem(CLAVE_HISTORIAL, JSON.stringify(historial));
}
function formatearFechaHora(marcaDeTiempo) {
  var fecha, dia, mes, anio, horas, minutos;
  fecha = new Date(marcaDeTiempo);
  dia = fecha.getDate() < 10 ? '0' + fecha.getDate() : String(fecha.getDate());
  mes = (fecha.getMonth() + 1) < 10 ? '0' + (fecha.getMonth() + 1) : String(fecha.getMonth() + 1);
  anio = fecha.getFullYear();
  horas = fecha.getHours() < 10 ? '0' + fecha.getHours() : String(fecha.getHours());
  minutos = fecha.getMinutes() < 10 ? '0' + fecha.getMinutes() : String(fecha.getMinutes());
  return dia + '/' + mes + '/' + anio + ' ' + horas + ':' + minutos;
}
function compararPorIntentos(partidaA, partidaB) {
  return partidaA.intentos - partidaB.intentos;
}
function compararPorFechaDesc(partidaA, partidaB) {
  return partidaB.fechaHora - partidaA.fechaHora;
}
function ordenarHistorial(historial) {
  var copia;
  copia = historial.slice();
  if (ordenActualHistorial === 'intentos') {
    copia.sort(compararPorIntentos);
  } else {
    copia.sort(compararPorFechaDesc);
  }
  return copia;
}
function crearFilaHistorial(partida) {
  var fila, claseResultado, textoResultado;
  fila = document.createElement('div');
  fila.className = 'fila-historial';
  claseResultado = partida.resultado === 'ganada' ? 'celda-historial resultado-correcto' : 'celda-historial resultado-incorrecto';
  textoResultado = partida.resultado === 'ganada' ? 'Ganó' : 'Perdió';
  fila.appendChild(crearCeldaResultado(partida.nombreJugador, 'celda-historial'));
  fila.appendChild(crearCeldaResultado(textoResultado, claseResultado));
  fila.appendChild(crearCeldaResultado(String(partida.intentos), 'celda-historial'));
  fila.appendChild(crearCeldaResultado(formatearFechaHora(partida.fechaHora), 'celda-historial'));
  fila.appendChild(crearCeldaResultado(formatearTiempo(partida.duracionSegundos), 'celda-historial'));
  return fila;
}
function renderizarHistorial() {
  var historial, historialOrdenado, contenedor, i;
  historial = obtenerHistorial();
  contenedor = document.getElementById('lista-historial');
  contenedor.innerHTML = '';
  if (historial.length === 0) {
    contenedor.textContent = 'Todavía no jugaste ninguna partida.';
    return;
  }
  historialOrdenado = ordenarHistorial(historial);
  for (i = 0; i < historialOrdenado.length; i++) {
    contenedor.appendChild(crearFilaHistorial(historialOrdenado[i]));
  }
}
