'use strict';
var URL_BASE_JUGADORES = 'https://futbolle-daw-uai-2026.onrender.com/api/players';
var URL_JUGADOR_ALEATORIO = URL_BASE_JUGADORES + '/random';
var URL_BUSQUEDA_JUGADORES = URL_BASE_JUGADORES + '/search';
function manejarRespuestaApi(respuesta) {
  if (!respuesta.ok) {
    throw new Error('El servidor respondió con un error.');
  }
  return respuesta.json();
}
function obtenerJugadorSecreto() {
  return fetch(URL_JUGADOR_ALEATORIO).then(manejarRespuestaApi);
}
function buscarJugadores(consulta, limite) {
  var url;
  url = URL_BUSQUEDA_JUGADORES + '?q=' + encodeURIComponent(consulta) + '&limit=' + limite;
  return fetch(url).then(manejarRespuestaApi);
}
