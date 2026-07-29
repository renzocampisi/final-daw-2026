'use strict';
var NUMERO_MAXIMO_INTENTOS = 8;
var estadoJuego = {
  nombreJugadorHumano: '',
  jugadorSecreto: null,
  intentosRealizados: [],
  intentosMaximos: NUMERO_MAXIMO_INTENTOS,
  horaInicio: null,
  horaFin: null,
  partidaTerminada: false
};
function compararIgualdad(valorIntento, valorSecreto) {
  if (valorIntento === valorSecreto) {
    return 'correcto';
  }
  return 'incorrecto';
}
function compararNumero(valorIntento, valorSecreto) {
  if (valorIntento === valorSecreto) {
    return 'correcto';
  } else if (valorSecreto > valorIntento) {
    return 'mayor';
  } else {
    return 'menor';
  }
}
function compararJugadores(jugadorIntento, jugadorSecreto) {
  var resultado;
  resultado = {
    nacionalidad: compararIgualdad(jugadorIntento.nationality, jugadorSecreto.nationality),
    club: compararIgualdad(jugadorIntento.club, jugadorSecreto.club),
    posicion: compararIgualdad(jugadorIntento.position, jugadorSecreto.position),
    edad: compararNumero(jugadorIntento.age, jugadorSecreto.age),
    overall: compararNumero(jugadorIntento.overall, jugadorSecreto.overall),
    altura: compararNumero(jugadorIntento.heightCm, jugadorSecreto.heightCm)
  };
  return resultado;
}
function yaFueIntentado(idJugador) {
  var i;
  for (i = 0; i < estadoJuego.intentosRealizados.length; i++) {
    if (estadoJuego.intentosRealizados[i].jugador.id === idJugador) {
      return true;
    }
  }
  return false;
}
function calcularTiempoTranscurrido() {
  var referenciaFin;
  if (estadoJuego.horaInicio === null) {
    return 0;
  }
  referenciaFin = estadoJuego.horaFin !== null ? estadoJuego.horaFin : new Date();
  return Math.floor((referenciaFin.getTime() - estadoJuego.horaInicio.getTime()) / 1000);
}
function formatearTiempo(segundosTotales) {
  var minutos, segundos, minutosTexto, segundosTexto;
  minutos = Math.floor(segundosTotales / 60);
  segundos = segundosTotales % 60;
  minutosTexto = minutos < 10 ? '0' + minutos : String(minutos);
  segundosTexto = segundos < 10 ? '0' + segundos : String(segundos);
  return minutosTexto + ':' + segundosTexto;
}
function inicializarEstadoPartida(nombreJugadorHumano, jugadorSecreto) {
  estadoJuego.nombreJugadorHumano = nombreJugadorHumano;
  estadoJuego.jugadorSecreto = jugadorSecreto;
  estadoJuego.intentosRealizados = [];
  estadoJuego.horaInicio = null;
  estadoJuego.horaFin = null;
  estadoJuego.partidaTerminada = false;
}
function registrarIntento(jugadorSeleccionado) {
  var yaExiste, resultadoComparacion, intento, esVictoria, intentosRestantes, estadoPartida;
  yaExiste = yaFueIntentado(jugadorSeleccionado.id);
  if (yaExiste) {
    return { tipo: 'repetido' };
  }
  if (estadoJuego.horaInicio === null) {
    estadoJuego.horaInicio = new Date();
  }
  resultadoComparacion = compararJugadores(jugadorSeleccionado, estadoJuego.jugadorSecreto);
  intento = { jugador: jugadorSeleccionado, resultado: resultadoComparacion };
  estadoJuego.intentosRealizados.push(intento);
  esVictoria = jugadorSeleccionado.id === estadoJuego.jugadorSecreto.id;
  intentosRestantes = estadoJuego.intentosMaximos - estadoJuego.intentosRealizados.length;
  estadoPartida = 'continua';
  if (esVictoria) {
    estadoPartida = 'victoria';
  } else if (intentosRestantes <= 0) {
    estadoPartida = 'derrota';
  }
  if (estadoPartida !== 'continua') {
    estadoJuego.partidaTerminada = true;
    estadoJuego.horaFin = new Date();
  }
  return {
    tipo: 'registrado',
    intento: intento,
    intentosRestantes: intentosRestantes,
    estadoPartida: estadoPartida
  };
}
