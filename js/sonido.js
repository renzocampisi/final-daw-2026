'use strict';
var CONTEXTO_AUDIO = null;
function obtenerContextoAudio() {
  if (CONTEXTO_AUDIO === null) {
    CONTEXTO_AUDIO = new (window.AudioContext || window.webkitAudioContext)();
  }
  return CONTEXTO_AUDIO;
}
function reproducirTono(frecuencia, duracionMs) {
  var contexto, oscilador, ganancia;
  contexto = obtenerContextoAudio();
  oscilador = contexto.createOscillator();
  ganancia = contexto.createGain();
  oscilador.type = 'sine';
  oscilador.frequency.value = frecuencia;
  ganancia.gain.value = 0.15;
  oscilador.connect(ganancia);
  ganancia.connect(contexto.destination);
  oscilador.start();
  oscilador.stop(contexto.currentTime + duracionMs / 1000);
}
function reproducirSonidoAcierto() {
  reproducirTono(880, 120);
}
function reproducirSegundaNotaVictoria() {
  reproducirTono(880, 220);
}
function reproducirSonidoVictoria() {
  reproducirTono(660, 150);
  setTimeout(reproducirSegundaNotaVictoria, 150);
}
function reproducirSonidoDerrota() {
  reproducirTono(220, 400);
}
