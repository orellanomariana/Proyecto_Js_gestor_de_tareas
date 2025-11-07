// ===============================
// 📋 Gestor de Tareas en Consola
// ===============================

const tareas = [];

class Tarea {
    constructor(id, titulo, descripcion, prioridad, fechaLimite) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.prioridad = prioridad;
        this.fechaLimite = fechaLimite;
        this.completada = false;
    }
}


function agregarTarea() {
    const titulo = prompt("Ingrese el título de la tarea (obligatorio):");
    if (!titulo) {
    alert("El título es obligatorio.");
    return;
    }

const descripcion = prompt("Ingrese una descripción (opcional):");

let prioridad = prompt("Ingrese la prioridad (baja, media, alta):").toLowerCase();
    while (!["baja", "media", "alta"].includes(prioridad)) {
        alert("Prioridad no válida. Use: baja, media o alta.");
        prioridad = prompt("Ingrese la prioridad (baja, media, alta):").toLowerCase();
    }

let fechaLimite = prompt("Ingrese la fecha límite (formato: aaaa-mm-dd):");
    while (!/^\d{4}-\d{2}-\d{2}$/.test(fechaLimite)) {
    alert("⚠️ Formato de fecha inválido. Use el formato: aaaa-mm-dd.");
    fechaLimite = prompt("Ingrese nuevamente la fecha límite (aaaa-mm-dd):");
}

const id = tareas.length + 1;
const nuevaTarea = new Tarea(id, titulo, descripcion, prioridad, fechaLimite);
    tareas.push(nuevaTarea);

    
    console.log("✅ Tarea agregada correctamente:");
    console.table([tareas[tareas.length - 1]]);
    console.log("📋 Lista completa de tareas:");
    console.table(tareas);
}

function verTareas() {
    
    if (tareas.length === 0) {
    alert("📭 No hay tareas registradas aún.");
    return;
    }
    alert(`Tienes ${tareas.length} tareas registradas. Consultá la consola para ver el detalle 👇`);
    console.log("=== 📋 Lista de tareas ===");
    tareas.forEach(t => {
    console.log(`[${t.id}] ${t.titulo} - ${t.prioridad.toUpperCase()} - ${t.fechaLimite} - ${t.completada ? "✅ Completada" : "❌ Pendiente"}`);
    });
}

function editarTarea() {
    const id = parseInt(prompt("Ingrese el ID de la tarea a editar:"));
    const tarea = tareas.find(t => t.id === id);

    if (!tarea) {
        alert("No existe una tarea con ese ID.");
    return;
    }

    const campo = prompt("¿Qué desea editar? (titulo / descripcion / prioridad / fecha)").toLowerCase();

    switch (campo) {
        case "titulo":
        tarea.titulo = prompt("Nuevo título:");
        break;
        case "descripcion":
        tarea.descripcion = prompt("Nueva descripción:");
        break;
        case "prioridad":
        let nuevaPrioridad = prompt("Nueva prioridad (baja, media, alta):").toLowerCase();
        while (!["baja", "media", "alta"].includes(nuevaPrioridad)) {
        alert("Prioridad no válida. Use: baja, media o alta.");
        nuevaPrioridad = prompt("Nueva prioridad (baja, media, alta):").toLowerCase();
        }
        tarea.prioridad = nuevaPrioridad;
        break;
        case "fecha":
        const nuevaFecha = prompt("Nueva fecha (aaaa-mm-dd):");
        if (!/^\d{4}-\d{2}-\d{2}$/.test(nuevaFecha)) {
        alert("Formato de fecha inválido.");
            return;
        }
        tarea.fechaLimite = nuevaFecha;
        break;
        default:
        alert("Campo no válido.");
        return;
    }

    console.clear();
    console.log("✏️ Tarea actualizada correctamente:");
    console.table(tareas);
    }

function eliminarTarea() {
    const id = parseInt(prompt("Ingrese el ID de la tarea a eliminar:"));
    const indice = tareas.findIndex(t => t.id === id);

    if (indice === -1) {
        alert("No existe una tarea con ese ID.");
        return;
    }

    const confirmar = confirm(`¿Está seguro de eliminar la tarea "${tareas[indice].titulo}"?`);
    if (confirmar) {
    tareas.splice(indice, 1);
    console.clear();
    console.log("❌ Tarea eliminada correctamente.");
    console.table(tareas);
    }
}

function completarTarea() {
    const id = parseInt(prompt("Ingrese el ID de la tarea a marcar como completada:"));
    const tarea = tareas.find(t => t.id === id);

    if (!tarea) {
    alert("No existe una tarea con ese ID.");
    return;
    }

    tarea.completada = true;
    console.clear();
    console.log(`✅ La tarea "${tarea.titulo}" fue marcada como completada.`);
    console.table(tareas);
}

// ===============================
// 🌀 Menú principal
// ===============================

function mostrarMenu() {
    let opcion;
    do {
    /*console.log(`
=== 🧭 MENÚ PRINCIPAL ===
1. Agregar tarea
2. Ver tareas
3. Editar tarea
4. Eliminar tarea
5. Marcar tarea como completada
6. Salir
    `);*/

    opcion = prompt(`
=== 🧭 MENÚ PRINCIPAL ===
1️⃣ Agregar tarea
2️⃣ Ver tareas
3️⃣ Editar tarea
4️⃣ Eliminar tarea
5️⃣ Marcar tarea como completada
6️⃣ Cerrar menú

Elija una opción (1-6):
    `);

    switch (opcion) {
        case "1":
            agregarTarea();
            break;
        case "2":
            verTareas();
            break;
        case "3":
            editarTarea();
            break;
        case "4":
            eliminarTarea();
            break;
        case "5":
            completarTarea();
            break;
        case "6":
                // Confirmar antes de cerrar
                const confirmarSalida = confirm("¿Confirmas que deseas cerrar el menú?");
                if (confirmarSalida) {
                    alert("✅ Menú cerrado. Revisa la consola para ver los detalles de tus tareas.");
                    console.log("👋 Fin del programa.");
                } else {
                    opcion = ""; // Si cancela, sigue en el menú
                }
                break;
            default:
                alert("⚠️ Opción no válida. Ingrese un número del 1 al 6.");
        }
    } while (opcion !== "6");
}

// ===============================
// 🚀 Inicio del simulador
// ===============================

alert("👋 Bienvenido/a al Gestor de Tareas.");


console.log(`
========================================
🗓️  GESTOR DE TAREAS - SIMULADOR JS
========================================
Este simulador te permitirá:
✅ Agregar tareas
✅ Editarlas o eliminarlas
✅ Marcar como completadas
✅ Ver el listado completo en consola
----------------------------------------
`);

mostrarMenu();
