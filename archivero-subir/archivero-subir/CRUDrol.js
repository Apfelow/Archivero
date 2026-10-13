// Arreglo inicial vacío (preparado para sincronizar con SQL)
let roles = [];

const form = document.getElementById('roleForm');
const rolesTableBody = document.getElementById('rolesTableBody');
const idRolesInput = document.getElementById('idRoles');
const nombreInput = document.getElementById('nombre');
const descripcionInput = document.getElementById('descripcion');
const btnCancelar = document.getElementById('btnCancelar');

// Función para renderizar la tabla dinámicamente
function renderTable() {
    rolesTableBody.innerHTML = '';
    
    if (roles.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="3" class="empty-message">No hay roles registrados</td>`;
        rolesTableBody.appendChild(tr);
        return;
    }

    roles.forEach(rol => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${rol.Nombre}</td>
            <td>${rol.Descripcion}</td>
            <td style="text-align: center;">
                <div class="action-btns" style="justify-content: center;">
                    <button class="action-icon" onclick="editarRol(${rol.idRoles})" title="Editar">✏️</button>
                    <button class="action-icon" onclick="eliminarRol(${rol.idRoles})" title="Eliminar">🗑️</button>
                </div>
            </td>
        `;
        rolesTableBody.appendChild(tr);
    });
}

// Manejar el envío del formulario (Creación o Edición)
form.addEventListener('submit', function(e) {
    e.preventDefault();
    const id = idRolesInput.value;
    const nombre = nombreInput.value.trim();
    const descripcion = descripcionInput.value.trim();

    if (!nombre || !descripcion) return;

    if (id) {
        // Actualizar registro existente (Equivalente a UPDATE en SQL)
        const index = roles.findIndex(r => r.idRoles == id);
        if (index !== -1) {
            roles[index].Nombre = nombre;
            roles[index].Descripcion = descripcion;
        }
    } else {
        // Crear nuevo registro (Equivalente a INSERT INTO Roles)
        const nuevoId = roles.length > 0 ? Math.max(...roles.map(r => r.idRoles)) + 1 : 1;
        roles.push({
            idRoles: nuevoId,
            Nombre: nombre,
            Descripcion: descripcion
        });
    }

    limpiarFormulario();
    renderTable();
});

// Cargar datos en el formulario para Editar
window.editarRol = function(id) {
    const rol = roles.find(r => r.idRoles == id);
    if (rol) {
        idRolesInput.value = rol.idRoles;
        nombreInput.value = rol.Nombre;
        descripcionInput.value = rol.Descripcion;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Eliminar un registro de la tabla (Equivalente a DELETE en SQL)
window.eliminarRol = function(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este rol?")) {
        roles = roles.filter(r => r.idRoles != id);
        renderTable();
    }
}

// Botón Cancelar
btnCancelar.addEventListener('click', function() {
    limpiarFormulario();
});

function limpiarFormulario() {
    form.reset();
    idRolesInput.value = '';
}

// Inicializar la tabla vacía al cargar la página
renderTable();