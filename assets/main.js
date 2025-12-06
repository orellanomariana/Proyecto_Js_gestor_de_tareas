let titulo = document.getElementsByTagName('title')[0];
let h1Title = document.getElementById('titulo').innerText;
titulo.textContent = h1Title;

// Clase Tarea

class Tarea {
    constructor(id, titulo, fecha, prioridad) {
        this.id = id;
        this.titulo = titulo;
        this.fecha = fecha;
        this.prioridad = prioridad;
        this.completada = false;
    }

    completar() {
        this.completada = true;
    }
}


// Variables y Storage


let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

const form = document.getElementById("tareaForm");
const listaTareas = document.getElementById("listaTareas");


// Guardar en Storage


function guardarStorage() {
    localStorage.setItem("tareas", JSON.stringify(tareas));
}


// Renderizar lista


function renderTareas() {
    listaTareas.innerHTML = "";

    tareas.forEach(t => {
        const li = document.createElement("li");
        if (t.completada) {
            li.className = "tarea completada";
        } else {
            li.className = "tarea";
        }

        li.innerHTML = `
            <div>
                <strong>${t.titulo}</strong>  
                <br>
                Fecha: ${t.fecha} | Prioridad: ${t.prioridad}
            </div>

            <div class="botones">
                <button class="btn btn-completar" onclick="completarTarea(${t.id})">✔</button>
                <button class="btn btn-eliminar" onclick="eliminarTarea(${t.id})">✖</button>
            </div>
        `;

        listaTareas.appendChild(li);
    });
}


// Agregar tarea


form.addEventListener("submit", (e) => {
    e.preventDefault();

    const titulo = document.getElementById("tituloTarea").value;
    const fecha = document.getElementById("fecha").value;
    const prioridad = document.getElementById("prioridad").value;

    const nueva = new Tarea(Date.now(), titulo, fecha, prioridad);

    tareas.push(nueva);
    guardarStorage();
    renderTareas();

    form.reset();
});


// Completar tarea


function completarTarea(id) {
    const tarea = tareas.find(t => t.id === id);
    tarea.completada = true;

    guardarStorage();
    renderTareas();
}


// Eliminar tarea


function eliminarTarea(id) {
    tareas = tareas.filter(t => t.id !== id);

    guardarStorage();
    renderTareas();
}


// Inicio


renderTareas();
