'use strict';
var NUMERO_MAXIMO_INTENTOS = 8;
var estadoJuego = {
  nombreJugadorHumano: '',
  dificultad: 'facil',
  jugadorSecreto: null,
  intentosRealizados: [],
  intentosMaximos: NUMERO_MAXIMO_INTENTOS,
  horaInicio: null,
  horaFin: null,
  partidaTerminada: false
};
function calcularNivelPistasMedio(intentosRealizados) {
  var nivel;
  nivel = Math.floor(intentosRealizados / 2);
  return nivel > 3 ? 3 : nivel;
}
var PUNTOS_BASE_DIFICULTAD = { facil: 60, medio: 80, dificil: 100 };
function calcularBonusTiempo(duracionSegundos) {
  if (duracionSegundos < 60) {
    return 20;
  } else if (duracionSegundos < 120) {
    return 10;
  }
  return 0;
}
function calcularPuntaje(dificultad, intentosUsados, duracionSegundos, gano) {
  var puntaje;
  if (!gano) {
    return 0;
  }
  puntaje = PUNTOS_BASE_DIFICULTAD[dificultad] - (intentosUsados - 1) * 10 + calcularBonusTiempo(duracionSegundos);
  return puntaje < 10 ? 10 : puntaje;
}
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
function intentoTieneAcierto(resultadoComparacion) {
  return resultadoComparacion.nacionalidad === 'correcto' ||
    resultadoComparacion.club === 'correcto' ||
    resultadoComparacion.posicion === 'correcto' ||
    resultadoComparacion.edad === 'correcto' ||
    resultadoComparacion.overall === 'correcto' ||
    resultadoComparacion.altura === 'correcto';
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
