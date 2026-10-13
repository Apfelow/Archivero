// Lógica del menú principal: abrir y cerrar la barra lateral.

const portal = document.getElementById('portal');
const botonColapsar = document.getElementById('btn-colapsar');

// valor = true oculta el menú, false lo muestra
function colapsarMenu(valor) {
  portal.classList.toggle('colapsado', valor);
  botonColapsar.setAttribute('aria-expanded', String(!valor));
  botonColapsar.setAttribute('aria-label', valor ? 'Mostrar menú' : 'Ocultar menú');
}

botonColapsar.addEventListener('click', function () {
  colapsarMenu(!portal.classList.contains('colapsado'));
});

// en el celular empieza oculto para que no ocupe toda la pantalla
if (window.innerWidth <= 760) {
  colapsarMenu(true);
}
