const form = document.getElementById('prestamoForm');
const prestamosTableBody = document.getElementById('prestamosTableBody');
const solicitanteSelect = document.getElementById('solicitante');
const documentoSelect = document.getElementById('documentoMatricula');
const idPrestamoInput = document.getElementById('idPrestamo');
const btnCancelar = document.getElementById('btnCancelar');

async function inicializarPantalla() {
    try {

        const resUsuarios = await fetch('/api/usuarios');
        const usuarios = await resUsuarios.json();
        solicitanteSelect.innerHTML = '<option value="">Seleccione un usuario...</option>';
        usuarios.forEach(u => {
            solicitanteSelect.innerHTML += `<option value="${u.idUsuarios}">${u.Nombre}${u.Apellido_paterno || ''}</option>`;
        });

        // Cargar documentos disponibles
        const resDocs = await fetch('/api/documentos');
        const documentos = await resDocs.json();
        documentoSelect.innerHTML = '<option value="">Seleccione un documento...</option>';
        documentos.forEach(d => {
            documentoSelect.innerHTML += `<option value="${d.idDocumento}">Expediente ID: ${d.idDocumento} - (Foto:${d.Foto})</option>`;
        });

        cargarPrestamos();
    } catch (error) {
        console.error("Error al inicializar datos:", error);
    }
}

async function cargarPrestamos() {
    try {
        const response = await fetch('/api/prestamos');
        const prestamos = await response.json();
        renderTablaPrestamos(prestamos);
    } catch (error) {
        console.error("Error al cargar los préstamos:", error);
    }
}

function renderTablaPrestamos(prestamos) {
    prestamosTableBody.innerHTML = '';
    
    if (prestamos.length === 0) {
        prestamosTableBody.innerHTML = `<tr><td colspan="7" class="empty-message">No hay préstamos registrados</td></tr>`;
        return;
    }

    prestamos.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${p.idDocumento}</td>
            <td>${p.Trabajador || 'N/A'}</td>
            <td>${p.Fecha_prestamo ? p.Fecha_prestamo.split('T')[0] : ''}</td>
            <td>${p.Fecha_entrega ? p.Fecha_entrega.split('T')[0] : ''}</td>
            <td>${p.Estatus || 'Prestado'}</td>
            <td>${p.Usuario || 'N/A'}</td>
            <td style="text-align: center;">
                <div class="action-btns">
                    <button class="action-icon" onclick="eliminarPrestamo(${p.idPrestamo})" title="Eliminar">🗑️</button>
                </div>
            </td>
        `;
        prestamosTableBody.appendChild(tr);
    });
}

// Registrar nuevo préstamo
form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const usuario_id = solicitanteSelect.value;
    const documento_id = documentoSelect.value;
    const fecha_prestamo = document.getElementById('fechaPrestamo').value;
    const fecha_entrega = document.getElementById('fechaEntrega').value;

    if (!usuario_id || !documento_id || !fecha_prestamo || !fecha_entrega) return;

    try {
        const response = await fetch('/api/prestamos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id, documento_id, fecha_prestamo, fecha_entrega })
        });

        if (response.ok) {
            form.reset();
            idPrestamoInput.value = '';
            cargarPrestamos();
        }
    } catch (error) {
        console.error("Error al registrar préstamo:", error);
    }
});

window.eliminarPrestamo = async function(id) {
    if (confirm("¿Estás seguro de eliminar este registro de préstamo?")) {
        try {
            const response = await fetch(`/api/prestamos/${id}`, { method: 'DELETE' });
            if (response.ok) {
                cargarPrestamos();
            }
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    }
}

btnCancelar.addEventListener('click', () => {
    form.reset();
    idPrestamoInput.value = '';
});

inicializarPantalla();
