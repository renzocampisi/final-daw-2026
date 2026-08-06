'use strict';
var CLAVE_TEMA_OSCURO = 'futbolle-tema-oscuro';
function actualizarTextoBotonTema() {
  var boton, esOscuro;
  boton = document.getElementById('boton-modo-oscuro');
  esOscuro = document.body.classList.contains('modo-oscuro');
  boton.textContent = esOscuro ? 'Modo claro' : 'Modo oscuro';
}
function aplicarTemaGuardado() {
  var guardado;
  guardado = localStorage.getItem(CLAVE_TEMA_OSCURO);
  if (guardado === 'true') {
    document.body.classList.add('modo-oscuro');
  }
  actualizarTextoBotonTema();
}
function manejarClickModoOscuro() {
  document.body.classList.toggle('modo-oscuro');
  localStorage.setItem(CLAVE_TEMA_OSCURO, document.body.classList.contains('modo-oscuro') ? 'true' : 'false');
  actualizarTextoBotonTema();
}
function inicializarTema() {
  aplicarTemaGuardado();
  document.getElementById('boton-modo-oscuro').addEventListener('click', manejarClickModoOscuro);
}
document.addEventListener('DOMContentLoaded', inicializarTema);
