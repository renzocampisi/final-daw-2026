'use strict';
var CLAVE_TEMA_OSCURO = 'futbolle-tema-oscuro';
function actualizarIconoBotonTema() {
  var boton, iconoLuna, iconoSol, esOscuro;
  boton = document.getElementById('boton-modo-oscuro');
  iconoLuna = document.getElementById('icono-luna');
  iconoSol = document.getElementById('icono-sol');
  esOscuro = document.body.classList.contains('modo-oscuro');
  if (esOscuro) {
    iconoLuna.setAttribute('class', 'icono-tema oculto');
    iconoSol.setAttribute('class', 'icono-tema');
    boton.setAttribute('aria-label', 'Cambiar a modo claro');
  } else {
    iconoLuna.setAttribute('class', 'icono-tema');
    iconoSol.setAttribute('class', 'icono-tema oculto');
    boton.setAttribute('aria-label', 'Cambiar a modo oscuro');
  }
}
function aplicarTemaGuardado() {
  var guardado;
  guardado = localStorage.getItem(CLAVE_TEMA_OSCURO);
  if (guardado === 'true') {
    document.body.classList.add('modo-oscuro');
  }
  actualizarIconoBotonTema();
}
function manejarClickModoOscuro() {
  document.body.classList.toggle('modo-oscuro');
  localStorage.setItem(CLAVE_TEMA_OSCURO, document.body.classList.contains('modo-oscuro') ? 'true' : 'false');
  actualizarIconoBotonTema();
}
function inicializarTema() {
  aplicarTemaGuardado();
  document.getElementById('boton-modo-oscuro').addEventListener('click', manejarClickModoOscuro);
}
document.addEventListener('DOMContentLoaded', inicializarTema);
