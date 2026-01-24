// Título dinámico
const tituloTag = document.getElementsByTagName("title")[0];
const h1Title = document.getElementById("titulo").innerText;
tituloTag.textContent = h1Title;

// Clase
class Tarea {
    constructor(id, titulo, fecha, prioridad, completada = false) {
        this.id = id;
        this.titulo = titulo;
        this.fecha = fecha;
        this.prioridad = prioridad;
        this.completada = completada;
    }

    toggle() {
        this.completada = !this.completada;
    }
}


const STORAGE_KEY = "tareas";

function cargarDesdeStorage() {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    return data.map(x => new Tarea(x.id, x.titulo, x.fecha, x.prioridad, x.completada));
}

let tareas = cargarDesdeStorage();


// DOM
const form = document.getElementById("tareaForm");
const listaTareas = document.getElementById("listaTareas");
const panelControles = document.getElementById("panelControles");
const estadoVacio = document.getElementById("estadoVacio");

const inputTitulo = document.getElementById("tituloTarea");
const inputFecha = document.getElementById("fecha");
const inputPrioridad = document.getElementById("prioridad");

const formTitle = document.getElementById("formTitle");
const btnSubmit = document.getElementById("btnSubmit");
const btnCancelar = document.getElementById("btnCancelar");

// Estado UI
let filtroActual = "todas"; // todas | pendientes | completadas
let ordenActual = "fecha";  // fecha | prioridad
let editandoId = null;

// Guardar
function guardarStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tareas));
}

// Datos remotos (JSON local) - async
async function cargarTareasIniciales() {
    try {
        const resp = await fetch("./data/tareas_iniciales.json");
        if (!resp.ok) throw new Error("No se pudo cargar tareas_iniciales.json");
        const data = await resp.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Helpers: ordenar
function prioridadPeso(p) {
    if (p === "alta") return 1;
    if (p === "media") return 2;
    return 3; // baja
}

function obtenerTareasProcesadas() {
    let lista = [...tareas];

    // filtro
    if (filtroActual === "pendientes") lista = lista.filter(t => !t.completada);
    if (filtroActual === "completadas") lista = lista.filter(t => t.completada);

    // orden
    if (ordenActual === "fecha") {
        lista.sort((a, b) => (a.fecha || "").localeCompare(b.fecha || ""));
    } else if (ordenActual === "prioridad") {
        lista.sort((a, b) => prioridadPeso(a.prioridad) - prioridadPeso(b.prioridad));
    }

    return lista;
}

// Panel de controles (HTML generado desde JS)
function renderControles() {
    const total = tareas.length;
    const completas = tareas.filter(t => t.completada).length;
    const pendientes = total - completas;

    panelControles.innerHTML = `
    <div class="controles">
      <div class="resumen">
        <span><strong>Total:</strong> ${total}</span>
        <span><strong>Pendientes:</strong> ${pendientes}</span>
        <span><strong>Completadas:</strong> ${completas}</span>
      </div>

      <div class="acciones">
        <select id="filtroSelect">
          <option value="todas" ${filtroActual === "todas" ? "selected" : ""}>Todas</option>
          <option value="pendientes" ${filtroActual === "pendientes" ? "selected" : ""}>Pendientes</option>
          <option value="completadas" ${filtroActual === "completadas" ? "selected" : ""}>Completadas</option>
        </select>

        <select id="ordenSelect">
          <option value="fecha" ${ordenActual === "fecha" ? "selected" : ""}>Ordenar por fecha</option>
          <option value="prioridad" ${ordenActual === "prioridad" ? "selected" : ""}>Ordenar por prioridad</option>
        </select>
      </div>
    </div>
  `;

    // listeners de controles
    document.getElementById("filtroSelect").addEventListener("change", (e) => {
        filtroActual = e.target.value;
        renderTareas();
    });

    document.getElementById("ordenSelect").addEventListener("change", (e) => {
        ordenActual = e.target.value;
        renderTareas();
    });
}

// Render lista (HTML generado desde JS)
function renderTareas() {
    renderControles();

    const lista = obtenerTareasProcesadas();
    listaTareas.innerHTML = "";

    if (lista.length === 0) {
        estadoVacio.textContent = "No hay tareas para mostrar con este filtro.";
        return;
    } else {
        estadoVacio.textContent = "";
    }

    lista.forEach(t => {
        const li = document.createElement("li");
        li.className = t.completada ? "tarea completada" : "tarea";

        li.innerHTML = `
    <div>
        <strong>${t.titulo}</strong><br>
        Fecha: ${t.fecha} | Prioridad: ${t.prioridad}
    </div>

    <div class="botones">
        <button class="btn btn-completar" data-action="toggle" data-id="${t.id}">✔</button>
        <button class="btn btn-editar" data-action="editar" data-id="${t.id}">✎</button>
        <button class="btn btn-eliminar" data-action="eliminar" data-id="${t.id}">✖</button>
    </div>
    `;

        listaTareas.appendChild(li);
    });
}

// Event delegation (mejor que onclick inline)
listaTareas.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const action = btn.dataset.action;
    const id = Number(btn.dataset.id);

    if (action === "toggle") {
        const tarea = tareas.find(t => t.id === id);
        if (!tarea) return;
        tarea.toggle();
        guardarStorage();
        renderTareas();

        Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: tarea.completada ? "Tarea completada" : "Tarea marcada como pendiente",
            showConfirmButton: false,
            timer: 1300
        });
    }

    if (action === "editar") {
        iniciarEdicion(id);
    }

    if (action === "eliminar") {
        const result = await Swal.fire({
            title: "¿Eliminar tarea?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        });

        if (result.isConfirmed) {
            tareas = tareas.filter(t => t.id !== id);
            guardarStorage();
            renderTareas();

            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Tarea eliminada",
                showConfirmButton: false,
                timer: 1300
            });
        }
    }
});

// Alta/Edición
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const titulo = inputTitulo.value.trim();
    const fecha = inputFecha.value;
    const prioridad = inputPrioridad.value;

    if (!titulo || !fecha || !prioridad) return;

    if (editandoId) {
        // guardar edición
        const t = tareas.find(x => x.id === editandoId);
        if (!t) return;

        t.titulo = titulo;
        t.fecha = fecha;
        t.prioridad = prioridad;

        finalizarEdicion();
        guardarStorage();
        renderTareas();

        Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "Cambios guardados",
            showConfirmButton: false,
            timer: 1300
        });

    } else {
        // nueva tarea
        const nueva = new Tarea(Date.now(), titulo, fecha, prioridad, false);
        tareas.push(nueva);
        guardarStorage();
        renderTareas();

        Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "Tarea agregada",
            showConfirmButton: false,
            timer: 1300
        });
    }

    form.reset();
});

// Edición: precargar datos en el form (cumple sugerencia)
function iniciarEdicion(id) {
    const t = tareas.find(x => x.id === id);
    if (!t) return;

    editandoId = id;

    inputTitulo.value = t.titulo;
    inputFecha.value = t.fecha;
    inputPrioridad.value = t.prioridad;

    formTitle.textContent = "Editar tarea";
    btnSubmit.textContent = "Guardar cambios";
    btnCancelar.style.display = "inline-block";
}

function finalizarEdicion() {
    editandoId = null;
    formTitle.textContent = "Agregar nueva tarea";
    btnSubmit.textContent = "Agregar";
    btnCancelar.style.display = "none";
    form.reset();
}

btnCancelar.addEventListener("click", () => finalizarEdicion());

// Inicio (carga JSON async si storage está vacío)
async function init() {
    // mini estado de carga
    estadoVacio.textContent = "Cargando tareas...";

    if (tareas.length === 0) {
        const iniciales = await cargarTareasIniciales();
        // normalizamos a instancias de Tarea (opcional pero prolijo)
        tareas = iniciales.map(x => new Tarea(x.id, x.titulo, x.fecha, x.prioridad, x.completada));
        guardarStorage();
    }

    renderTareas();
}

init();
