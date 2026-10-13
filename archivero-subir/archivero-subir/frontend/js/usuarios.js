// Lógica de la pantalla "Gestión de usuarios".
// Por ahora los datos son de ejemplo (en memoria).
// Cuando esté el backend con Django, aquí se cambia por fetch() a la API.

let usuarios = [
  { id: 1, nombre: 'Luis Fernando', apPaterno: 'Martinez', apMaterno: 'Hernandez', rol: 'Administrador' },
  { id: 2, nombre: 'Maria De la Luz', apPaterno: 'Ramirez', apMaterno: 'Sanchez', rol: 'RH' }
];

let siguienteId = 3;      // id del próximo usuario nuevo
let idEditando = null;    // si es null estamos creando, si no, editando

// Elementos de la página
const formulario = document.getElementById('form-usuario');
const campos = {
  nombre: document.getElementById('nombre'),
  apPaterno: document.getElementById('apPaterno'),
  apMaterno: document.getElementById('apMaterno'),
  password: document.getElementById('password'),
  rol: document.getElementById('rol')
};
const tabla = document.getElementById('tabla-usuarios');
const contador = document.getElementById('contador');
const textoBuscar = document.getElementById('texto-buscar');

// ---------- Tabla ----------

function nombreCompleto(u) {
  return [u.nombre, u.apPaterno, u.apMaterno].filter(Boolean).join(' ');
}

function dibujarTabla() {
  const filtro = normalizarTexto(textoBuscar.value.trim());

  // si hay texto en el buscador, filtramos por nombre o rol
  const lista = usuarios.filter(function (u) {
    const texto = normalizarTexto(nombreCompleto(u) + ' ' + u.rol);
    return texto.includes(filtro);
  });

  contador.textContent = lista.length + (lista.length === 1 ? ' resultado' : ' resultados');
  tabla.innerHTML = '';

  if (lista.length === 0) {
    tabla.innerHTML = '<tr><td colspan="3" class="tabla-vacia">No hay usuarios que mostrar</td></tr>';
    return;
  }

  lista.forEach(function (u) {
    const fila = document.createElement('tr');
    fila.innerHTML =
      '<td class="col-nombre"></td>' +
      '<td></td>' +
      '<td class="col-acciones">' +
        '<button class="icono-btn" type="button" data-accion="editar" aria-label="Editar">' + ICONOS.editar + '</button>' +
        '<button class="icono-btn" type="button" data-accion="borrar" aria-label="Eliminar">' + ICONOS.borrar + '</button>' +
      '</td>';

    // textContent para que no se inyecte HTML si alguien escribe etiquetas
    fila.children[0].textContent = nombreCompleto(u);
    fila.children[1].textContent = u.rol;

    fila.querySelector('[data-accion="editar"]').addEventListener('click', function () {
      editarUsuario(u.id);
    });
    fila.querySelector('[data-accion="borrar"]').addEventListener('click', function () {
      borrarUsuario(u.id);
    });

    tabla.appendChild(fila);
  });
}

// ---------- Formulario ----------

function mostrarError(campo, mensaje) {
  campos[campo].classList.add('con-error');
  document.getElementById('error-' + campo).textContent = mensaje;
}

function quitarErrores() {
  Object.keys(campos).forEach(function (campo) {
    campos[campo].classList.remove('con-error');
    const span = document.getElementById('error-' + campo);
    if (span) span.textContent = '';
  });
}

function limpiarFormulario() {
  formulario.reset();
  quitarErrores();
  idEditando = null;
}

// Regresa true si todo está bien
function validarFormulario() {
  quitarErrores();
  let valido = true;

  if (campos.nombre.value.trim() === '') {
    mostrarError('nombre', 'El nombre es obligatorio');
    valido = false;
  }
  if (campos.apPaterno.value.trim() === '') {
    mostrarError('apPaterno', 'El apellido paterno es obligatorio');
    valido = false;
  }
  // la contraseña solo es obligatoria al crear; al editar se puede dejar vacía
  if (idEditando === null && campos.password.value === '') {
    mostrarError('password', 'La contraseña es obligatoria');
    valido = false;
  }
  if (campos.password.value !== '' && campos.password.value.length < 8) {
    mostrarError('password', 'Mínimo 8 caracteres');
    valido = false;
  }
  if (campos.rol.value === '') {
    mostrarError('rol', 'Selecciona un rol');
    valido = false;
  }

  return valido;
}

function guardarUsuario(evento) {
  evento.preventDefault();
  if (!validarFormulario()) return;

  const datos = {
    nombre: campos.nombre.value.trim(),
    apPaterno: campos.apPaterno.value.trim(),
    apMaterno: campos.apMaterno.value.trim(),
    rol: campos.rol.value
  };
  // OJO: la contraseña NO se guarda aquí; el backend la va a recibir y encriptar

  if (idEditando === null) {
    datos.id = siguienteId++;
    usuarios.push(datos);
  } else {
    const posicion = usuarios.findIndex(function (u) { return u.id === idEditando; });
    datos.id = idEditando;
    usuarios[posicion] = datos;
  }

  limpiarFormulario();
  dibujarTabla();
}

function editarUsuario(id) {
  const u = usuarios.find(function (x) { return x.id === id; });
  quitarErrores();
  idEditando = id;

  campos.nombre.value = u.nombre;
  campos.apPaterno.value = u.apPaterno;
  campos.apMaterno.value = u.apMaterno;
  campos.password.value = '';
  campos.rol.value = u.rol;

  campos.nombre.focus();
}

function borrarUsuario(id) {
  const u = usuarios.find(function (x) { return x.id === id; });
  if (!confirm('¿Eliminar a ' + nombreCompleto(u) + '?')) return;

  usuarios = usuarios.filter(function (x) { return x.id !== id; });
  if (idEditando === id) limpiarFormulario();
  dibujarTabla();
}

// ---------- Eventos ----------
formulario.addEventListener('submit', guardarUsuario);
document.getElementById('btn-limpiar').addEventListener('click', limpiarFormulario);
document.getElementById('btn-cancelar').addEventListener('click', limpiarFormulario);
document.getElementById('btn-buscar').addEventListener('click', dibujarTabla);
textoBuscar.addEventListener('input', dibujarTabla);

dibujarTabla();
