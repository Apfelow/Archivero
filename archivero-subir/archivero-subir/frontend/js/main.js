// Archivo principal de JavaScript.
// Aquí van las funciones que se usan en TODAS las pantallas.

// Iconos en SVG (para no depender de librerías)
const ICONOS = {
  usuario: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>',
  candado: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="20" y1="12" x2="4" y2="12"/><polyline points="10 6 4 12 10 18"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 15 12 9 18 15"/></svg>',
  ojo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  ojoCerrado: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>',
  editar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  borrar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>'
};

// Activa el ojito de las contraseñas.
// En el HTML el botón lleva: data-ver-password="idDelInput"
function activarOjitos() {
  document.querySelectorAll('[data-ver-password]').forEach(function (boton) {
    const input = document.getElementById(boton.dataset.verPassword);
    boton.innerHTML = ICONOS.ojo;

    boton.addEventListener('click', function () {
      const estaOculta = input.type === 'password';
      input.type = estaOculta ? 'text' : 'password';
      boton.innerHTML = estaOculta ? ICONOS.ojoCerrado : ICONOS.ojo;
    });
  });
}

// Quita acentos y pasa a minúsculas (sirve para buscar)
function normalizarTexto(texto) {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

// Pone los iconos en los elementos que llevan data-icono="nombre"
function pintarIconos() {
  document.querySelectorAll('[data-icono]').forEach(function (elemento) {
    elemento.innerHTML = ICONOS[elemento.dataset.icono] || '';
  });
}

// Las pantallas que todavía no existen llevan data-pendiente.
// Mientras se hacen, muestran un aviso en lugar de abrir una página vacía.
function activarPendientes() {
  document.querySelectorAll('[data-pendiente]').forEach(function (enlace) {
    enlace.addEventListener('click', function (evento) {
      evento.preventDefault();
      alert('Esta pantalla todavía no está lista.');
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  pintarIconos();
  activarOjitos();
  activarPendientes();
});
