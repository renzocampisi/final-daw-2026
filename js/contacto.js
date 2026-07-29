'use strict';
var EXPRESION_NOMBRE = /^[A-Za-z0-9À-ÿ\s]+$/;
var EXPRESION_MAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var MAIL_DESTINO_CONTACTO = 'campisirenzo0@gmail.com';
function mostrarErrorCampo(elemento, mensaje) {
  elemento.textContent = mensaje;
  elemento.className = 'mensaje-error';
}
function ocultarErrorCampo(elemento) {
  elemento.className = 'mensaje-error oculto';
}
function validarNombreContacto() {
  var valor, elementoError;
  valor = document.getElementById('input-nombre-contacto').value.trim();
  elementoError = document.getElementById('error-nombre-contacto');
  if (valor.length === 0 || !EXPRESION_NOMBRE.test(valor)) {
    mostrarErrorCampo(elementoError, 'Ingresá un nombre válido, solo letras y números.');
    return false;
  }
  ocultarErrorCampo(elementoError);
  return true;
}
function validarMailContacto() {
  var valor, elementoError;
  valor = document.getElementById('input-mail-contacto').value.trim();
  elementoError = document.getElementById('error-mail-contacto');
  if (!EXPRESION_MAIL.test(valor)) {
    mostrarErrorCampo(elementoError, 'Ingresá un mail válido.');
    return false;
  }
  ocultarErrorCampo(elementoError);
  return true;
}
function validarMensajeContacto() {
  var valor, elementoError;
  valor = document.getElementById('input-mensaje-contacto').value.trim();
  elementoError = document.getElementById('error-mensaje-contacto');
  if (valor.length <= 5) {
    mostrarErrorCampo(elementoError, 'El mensaje debe tener más de 5 caracteres.');
    return false;
  }
  ocultarErrorCampo(elementoError);
  return true;
}
function construirEnlaceMailto(nombre, mail, mensaje) {
  var asunto, cuerpo;
  asunto = encodeURIComponent('Contacto de ' + nombre + ' desde Futbolle');
  cuerpo = encodeURIComponent(mensaje + '\n\nMail de respuesta: ' + mail);
  return 'mailto:' + MAIL_DESTINO_CONTACTO + '?subject=' + asunto + '&body=' + cuerpo;
}
function manejarEnvioContacto(evento) {
  var nombreValido, mailValido, mensajeValido, nombre, mail, mensaje;
  evento.preventDefault();
  nombreValido = validarNombreContacto();
  mailValido = validarMailContacto();
  mensajeValido = validarMensajeContacto();
  if (!nombreValido || !mailValido || !mensajeValido) {
    return;
  }
  nombre = document.getElementById('input-nombre-contacto').value.trim();
  mail = document.getElementById('input-mail-contacto').value.trim();
  mensaje = document.getElementById('input-mensaje-contacto').value.trim();
  window.location.href = construirEnlaceMailto(nombre, mail, mensaje);
}
function inicializarEventosContacto() {
  document.getElementById('formulario-contacto').addEventListener('submit', manejarEnvioContacto);
}
document.addEventListener('DOMContentLoaded', inicializarEventosContacto);
