"use strict";

const CLAVE = "trabajadores";

const ICONO_EDITAR =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>';
const ICONO_ELIMINAR =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>';

const datosIniciales = [
  { id: 1, nombre: "Jose", apPaterno: "Martinez", apMaterno: "Fernandez", matricula: "23051124", departamento: "Sistemas", fechaIngreso: "2020-12-09", estatus: "Activo" },
  { id: 2, nombre: "Maria Lucia", apPaterno: "Galindo", apMaterno: "Perez", matricula: "23041224", departamento: "Sistemas", fechaIngreso: "2020-12-09", estatus: "Activo" }
];

/* ---------- Referencias al DOM ---------- */
const form = document.getElementById("form");
const modo = document.getElementById("modo");
const tbody = document.getElementById("tbody");
const conteo = document.getElementById("conteo");
const vacio = document.getElementById("vacio");
const filtro = document.getElementById("filtro");
const toast = document.getElementById("toast");

const campos = ["nombre", "apPaterno", "apMaterno", "matricula", "departamento", "fechaIngreso", "estatus"];
const el = Object.fromEntries(campos.map((c) => [c, document.getElementById(c)]));

/* ---------- Estado ---------- */
let trabajadores = cargar();
let editandoId = null;
let textoFiltro = "";

function cargar() {
  try {
    const guardado = localStorage.getItem(CLAVE);
    if (guardado) return JSON.parse(guardado);
  } catch (e) { /* si falla el almacenamiento, usamos los datos de ejemplo */ }
  return structuredClone(datosIniciales);
}

function guardarEnDisco() {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(trabajadores));
  } catch (e) { /* sin almacenamiento: los datos duran solo la sesión */ }
}

/* ---------- Utilidades ---------- */
function formatoFecha(iso) {
  // 2020-12-09 -> 09/12/20
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a.slice(2)}`;
}

function nombreCompleto(t) {
  return [t.nombre, t.apPaterno, t.apMaterno].filter(Boolean).join(" ");
}

function escapar(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

let temporizador;
function avisar(mensaje) {
  toast.textContent = mensaje;
  toast.hidden = false;
  clearTimeout(temporizador);
  temporizador = setTimeout(() => (toast.hidden = true), 2500);
}

/* ---------- Validación ---------- */
function marcarError(campo, mensaje) {
  const contenedor = el[campo].closest(".campo");
  const salida = document.getElementById("err-" + campo);
  contenedor.classList.toggle("invalido", Boolean(mensaje));
  if (salida) salida.textContent = mensaje || "";
}

function validar() {
  let valido = true;
  const obligatorios = {
    nombre: "Escribe el nombre.",
    apPaterno: "Escribe el apellido paterno.",
    matricula: "Escribe la matrícula.",
    departamento: "Selecciona un departamento.",
    fechaIngreso: "Selecciona la fecha de ingreso.",
    estatus: "Selecciona el estatus."
  };

  for (const [campo, mensaje] of Object.entries(obligatorios)) {
    const vacio = el[campo].value.trim() === "";
    marcarError(campo, vacio ? mensaje : "");
    if (vacio) valido = false;
  }

  const matricula = el.matricula.value.trim();
  if (matricula) {
    if (!/^\d{4,10}$/.test(matricula)) {
      marcarError("matricula", "Usa solo números (4 a 10 dígitos).");
      valido = false;
    } else if (trabajadores.some((t) => t.matricula === matricula && t.id !== editandoId)) {
      marcarError("matricula", "Esa matrícula ya está registrada.");
      valido = false;
    }
  }

  if (el.fechaIngreso.value && el.fechaIngreso.value > new Date().toISOString().slice(0, 10)) {
    marcarError("fechaIngreso", "La fecha no puede ser futura.");
    valido = false;
  }

  return valido;
}

/* ---------- Formulario ---------- */
function limpiarFormulario() {
  form.reset();
  campos.forEach((c) => marcarError(c, ""));
}

function salirDeEdicion() {
  editandoId = null;
  modo.textContent = "Nuevo";
  limpiarFormulario();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validar()) return;

  const datos = {
    nombre: el.nombre.value.trim(),
    apPaterno: el.apPaterno.value.trim(),
    apMaterno: el.apMaterno.value.trim(),
    matricula: el.matricula.value.trim(),
    departamento: el.departamento.value,
    fechaIngreso: el.fechaIngreso.value,
    estatus: el.estatus.value
  };

  if (editandoId === null) {
    const id = trabajadores.reduce((max, t) => Math.max(max, t.id), 0) + 1;
    trabajadores.push({ id, ...datos });
    avisar("Trabajador guardado.");
  } else {
    trabajadores = trabajadores.map((t) => (t.id === editandoId ? { id: t.id, ...datos } : t));
    avisar("Cambios guardados.");
  }

  guardarEnDisco();
  salirDeEdicion();
  pintar();
});

document.getElementById("btn-limpiar").addEventListener("click", limpiarFormulario);
document.getElementById("btn-cancelar").addEventListener("click", salirDeEdicion);

/* ---------- Búsqueda ---------- */
function buscar() {
  textoFiltro = filtro.value.trim().toLowerCase();
  pintar();
}
document.getElementById("btn-buscar").addEventListener("click", buscar);
filtro.addEventListener("input", buscar);

/* ---------- Tabla ---------- */
function pintar() {
  const visibles = trabajadores.filter((t) => {
    if (!textoFiltro) return true;
    const pajar = `${nombreCompleto(t)} ${t.matricula} ${t.departamento}`.toLowerCase();
    return pajar.includes(textoFiltro);
  });

  conteo.textContent = `${visibles.length} resultado${visibles.length === 1 ? "" : "s"}`;
  vacio.hidden = visibles.length > 0;

  tbody.innerHTML = visibles
    .map(
      (t) => `
      <tr>
        <td>${escapar(nombreCompleto(t))}</td>
        <td>${escapar(t.matricula)}</td>
        <td>${escapar(t.departamento)}</td>
        <td>${formatoFecha(t.fechaIngreso)}</td>
        <td class="${t.estatus === "Inactivo" ? "estatus-inactivo" : ""}">${escapar(t.estatus)}</td>
        <td>
          <button class="icono editar" data-id="${t.id}" aria-label="Editar ${escapar(nombreCompleto(t))}">${ICONO_EDITAR}</button>
          <button class="icono eliminar" data-id="${t.id}" aria-label="Eliminar ${escapar(nombreCompleto(t))}">${ICONO_ELIMINAR}</button>
        </td>
      </tr>`
    )
    .join("");
}

tbody.addEventListener("click", (e) => {
  const boton = e.target.closest("button[data-id]");
  if (!boton) return;
  const id = Number(boton.dataset.id);
  const trabajador = trabajadores.find((t) => t.id === id);
  if (!trabajador) return;

  if (boton.classList.contains("editar")) {
    editandoId = id;
    modo.textContent = "Editar";
    campos.forEach((c) => {
      el[c].value = trabajador[c] ?? "";
      marcarError(c, "");
    });
    el.nombre.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else if (confirm(`¿Eliminar a ${nombreCompleto(trabajador)}?`)) {
    trabajadores = trabajadores.filter((t) => t.id !== id);
    if (editandoId === id) salirDeEdicion();
    guardarEnDisco();
    pintar();
    avisar("Trabajador eliminado.");
  }
});

/* ---------- Inicio ---------- */
pintar();
