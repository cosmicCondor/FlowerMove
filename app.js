import { initializeApp } from "firebase/app";
// Credenciales
const CREDENCIALES = {
  admin: { user: "Elisabeth", pass: "flowerElyRoses" },
  profesor: { user: "Profe", pass: "flowerProfe123" }
};
// Meses permitidos
const MESES = [
  "Agosto 2025",
  "Septiembre 2025", "Octubre 2025", "Noviembre 2025", "Diciembre 2025",
  "Enero 2026", "Febrero 2026", "Marzo 2026", "Abril 2026", "Mayo 2026", "Junio 2026"
];
// Base alumnos con eliminación lógica
const BASE_ALUMNOS = {
  infantil: [
    { name: "Lucía", pagado: false, registros: {}, activo: true, fechaEliminacion: null },
    { name: "Mateo", pagado: false, registros: {}, activo: true, fechaEliminacion: null },
    { name: "Sofía", pagado: false, registros: {}, activo: true, fechaEliminacion: null },
    { name: "Lucas", pagado: false, registros: {}, activo: true, fechaEliminacion: null },
    { name: "Emma", pagado: false, registros: {}, activo: true, fechaEliminacion: null },
    { name: "Hugo", pagado: false, registros: {}, activo: true, fechaEliminacion: null },
    { name: "Valeria", pagado: false, registros: {}, activo: true, fechaEliminacion: null },
    { name: "Liam", pagado: false, registros: {}, activo: true, fechaEliminacion: null },
    { name: "Martina", pagado: false, registros: {}, activo: true, fechaEliminacion: null },
    { name: "Diego", pagado: false, registros: {}, activo: true, fechaEliminacion: null }
  ],
  inicio: [
    { name: "David", pagado: false, registros: {}, activo: true, fechaEliminacion: null },
    { name: "Clara", pagado: false, registros: {}, activo: true, fechaEliminacion: null },
    { name: "Adrián", pagado: false, registros: {}, activo: true, fechaEliminacion: null },
    { name: "Sara", pagado: false, registros: {}, activo: true, fechaEliminacion: null },
    { name: "Mario", pagado: false, registros: {}, activo: true, fechaEliminacion: null },
    { name: "Nora", pagado: false, registros: {}, activo: true, fechaEliminacion: null },
    { name: "Pablo", pagado: false, registros: {}, activo: true, fechaEliminacion: null },
    { name: "Lara", pagado: false, registros: {}, activo: true, fechaEliminacion: null },
    { name: "Álvaro", pagado: false, registros: {}, activo: true, fechaEliminacion: null },
    { name: "Julia", pagado: false, registros: {}, activo: true, fechaEliminacion: null }
  ],
  youth: [
    { name: "Carlos", pagado: false, registros: {}, activo: true, fechaEliminacion: null },
    { name: "Elena", pagado: false, registros: {}, activo: true, fechaEliminacion: null },
    { name: "Bruno", pagado: false, registros: {}, activo: true, fechaEliminacion: null },
    { name: "Marta", pagado: false, registros: {}, activo: true, fechaEliminacion: null },
    { name: "Rubén", pagado: false, registros: {}, activo: true, fechaEliminacion: null },
    { name: "Alicia", pagado: false, registros: {}, activo: true, fechaEliminacion: null },
    { name: "Javier", pagado: false, registros: {}, activo: true, fechaEliminacion: null },
    { name: "Carmen", pagado: false, registros: {}, activo: true, fechaEliminacion: null },
    { name: "Sergio", pagado: false, registros: {}, activo: true, fechaEliminacion: null },
    { name: "Irene", pagado: false, registros: {}, activo: true, fechaEliminacion: null }
  ]
};

let estado = {
  loggedIn: false,
  role: null, // 'admin' o 'profesor'
  turnoActivo: "infantil",
  mesActivo: MESES[0],
  fechaActiva: null,
  alumnosPorMes: {}
};

// Firebase config (sustituye tus datos)
const firebaseConfig = {
  apiKey: "AIzaSyA2HvQzDnNVJFMWzUCqwyU4OqxskmEzVyU",
  authDomain: "flowermove-5e5d9.firebaseapp.com",
  projectId: "flowermove-5e5d9",
  storageBucket: "flowermove-5e5d9.firebasestorage.app",
  messagingSenderId: "266710754447",
  appId: "1:266710754447:web:7fb9a6807c1f8fe1457cfa"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

async function guardarDatos() {
  try {
    await db.collection("flowermove").doc("datos").set(estado.alumnosPorMes);
  } catch (error) {
    console.error("Error guardando datos en Firestore:", error);
  }
}

async function cargarDatos() {
  try {
    const doc = await db.collection("flowermove").doc("datos").get();
    if (doc.exists) {
      estado.alumnosPorMes = doc.data();
    } else {
      MESES.forEach(mes => {
        estado.alumnosPorMes[mes] = {};
        Object.keys(BASE_ALUMNOS).forEach(turno => {
          // Copia profunda
          estado.alumnosPorMes[mes][turno] = JSON.parse(JSON.stringify(BASE_ALUMNOS[turno]));
        });
      });
      await guardarDatos();
    }
  } catch (error) {
    console.error("Error cargando datos de Firestore:", error);
  }
}

// Obtener fechas lunes y miércoles
function obtenerFechasLunMie(mesAnio) {
  const [nombreMes, anioStr] = mesAnio.split(" ");
  const mesesMap = {
    Enero:0, Febrero:1, Marzo:2, Abril:3, Mayo:4, Junio:5,
    Julio:6, Agosto:7, Septiembre:8, Octubre:9, Noviembre:10, Diciembre:11
  };
  const mesNum = mesesMap[nombreMes];
  const anio = parseInt(anioStr, 10);
  const fechas = [];
  const d = new Date(anio, mesNum, 1);
  while (d.getMonth() === mesNum) {
    if (d.getDay() === 1 || d.getDay() === 3) fechas.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return fechas;
}

// Mostrar u ocultar elementos
function toggle(el, show) {
  el.classList.toggle("hidden", !show);
}

// Select de fechas
function renderSelectFechas() {
  const fechas = obtenerFechasLunMie(estado.mesActivo);
  const sel = document.getElementById("date-select");
  sel.innerHTML = "";
  fechas.forEach(f => {
    const iso = f.toISOString().slice(0,10);
    const text = f.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
    const option = document.createElement("option");
    option.value = iso;
    option.textContent = text;
    sel.appendChild(option);
  });
  const hoyISO = new Date().toISOString().slice(0,10);
  let seleccion = fechas.length > 0 ? fechas[0].toISOString().slice(0,10) : null;
  fechas.forEach(f => { if (f.toISOString().slice(0,10) <= hoyISO) seleccion = f.toISOString().slice(0,10); });
  estado.fechaActiva = seleccion;
  if (seleccion) sel.value = seleccion;
  sel.onchange = e => { estado.fechaActiva = e.target.value || null; renderTablaAlumnos(); };
}

// Renderizar tabla alumnos con eliminación lógica
function renderTablaAlumnos() {
  const tbody = document.querySelector("#alumnos-table tbody");
  tbody.innerHTML = "";
  if (!estado.fechaActiva) return;
  let alumnos = estado.alumnosPorMes[estado.mesActivo][estado.turnoActivo];
  if (!alumnos) return;
  const hoyISO = new Date().toISOString().slice(0,10);
  const pasada = estado.fechaActiva <= hoyISO;
  const mesActualIdx = MESES.indexOf(estado.mesActivo);

  alumnos
    .filter(alumno => {
      // Mostrar si está activo, o si fue eliminado en un mes posterior al actual
      if (alumno.activo) return true;
      if (alumno.fechaEliminacion) {
        const idxElim = MESES.indexOf(alumno.fechaEliminacion);
        return mesActualIdx < idxElim;
      }
      return false;
    })
    .forEach((alumno, idx) => {
      const tr = document.createElement("tr");
      // Fecha
      const tdFecha = document.createElement("td");
      tdFecha.textContent = document.getElementById("date-select").selectedOptions[0]?.textContent || "";
      tr.appendChild(tdFecha);
      // Nombre
      const tdName = document.createElement("td");
      tdName.textContent = `${idx + 1}. ${alumno.name}`;
      tr.appendChild(tdName);
      // Asistencia
      const tdAsis = document.createElement("td");
      tdAsis.classList.add("asistencia-cell");
      if (!pasada) {
        tdAsis.textContent = "";
        tdAsis.title = "Fecha futura, no disponible";
      } else {
        const reg = alumno.registros[estado.fechaActiva];
        tdAsis.textContent = reg === true ? "✔️" : reg === false ? "❌" : "";
        tdAsis.title = "Click para cambiar asistencia";
        tdAsis.style.cursor = "pointer";
        tdAsis.onclick = () => {
          alumno.registros[estado.fechaActiva] = !(alumno.registros[estado.fechaActiva] === true);
          guardarDatos();
          renderTablaAlumnos();
        };
      }
      tr.appendChild(tdAsis);
      // Pago
      const tdPagado = document.createElement("td");
      if (!pasada) {
        tdPagado.textContent = "";
      } else {
        const btnPago = document.createElement("button");
        btnPago.classList.add("pago-toggle");
        actualizarBtnPagado(btnPago, alumno.pagado);
        btnPago.onclick = () => {
          alumno.pagado = !alumno.pagado;
          guardarDatos();
          actualizarBtnPagado(btnPago, alumno.pagado);
        };
        tdPagado.appendChild(btnPago);
      }
      tr.appendChild(tdPagado);
      // Acciones
      const tdAcciones = document.createElement("td");
      // Modificar nombre
      if (estado.role === "profesor" || estado.role === "admin") {
        const btnMod = document.createElement("button");
        btnMod.textContent = "Modificar";
        btnMod.classList.add("btn-modificar");
        btnMod.onclick = () => {
          const nuevoNombre = prompt("Nuevo nombre:", alumno.name);
          if (nuevoNombre && nuevoNombre.trim()) {
            alumno.name = nuevoNombre.trim();
            guardarDatos();
            renderTablaAlumnos();
          }
        };
        tdAcciones.appendChild(btnMod);
      }
      // Eliminar lógico alumno (solo admin)
      if (estado.role === "admin" && alumno.activo) {
        const btnDel = document.createElement("button");
        btnDel.textContent = "Eliminar";
        btnDel.classList.add("btn-eliminar");
        btnDel.onclick = () => {
          if (confirm(`¿Eliminar a ${alumno.name}?`)) {
            alumno.activo = false;
            alumno.fechaEliminacion = estado.mesActivo;
            guardarDatos();
            renderTablaAlumnos();
          }
        };
        tdAcciones.appendChild(btnDel);
      }
      tr.appendChild(tdAcciones);
      tbody.appendChild(tr);
    });
}

// Botón pagado
function actualizarBtnPagado(btn, estadoPago) {
  if (estadoPago) {
    btn.textContent = "💰 Sí";
    btn.style.background = "#4CAF50";
    btn.style.color = "white";
  } else {
    btn.textContent = "💸 No";
    btn.style.background = "#E53935";
    btn.style.color = "white";
  }
}

function mostrarLogin() {
  toggle(document.getElementById("login-container"), true);
  toggle(document.getElementById("app"), false);
}
function mostrarApp() {
  toggle(document.getElementById("login-container"), false);
  toggle(document.getElementById("app"), true);
  renderSelectFechas();
  renderTablaAlumnos();
}

window.addEventListener("load", async () => {
  await cargarDatos();
  const selMes = document.getElementById("month-select");
  MESES.forEach(m => {
    const option = document.createElement("option");
    option.value = m;
    option.textContent = m;
    selMes.appendChild(option);
  });
  selMes.value = estado.mesActivo;
  selMes.onchange = e => { estado.mesActivo = e.target.value; renderSelectFechas(); renderTablaAlumnos(); };
  document.querySelectorAll(".turno-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelector(".turno-btn.active").classList.remove("active");
      btn.classList.add("active");
      estado.turnoActivo = btn.dataset.turno;
      renderTablaAlumnos();
    });
  });
  document.getElementById("add-alumno-form").addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("nuevo-alumno-name").value.trim();
    const pagadoValue = document.getElementById("nuevo-alumno-pagado").value === "true";
    if (name) {
      estado.alumnosPorMes[estado.mesActivo][estado.turnoActivo].push({
        name,
        pagado: pagadoValue,
        registros: {},
        activo: true,
        fechaEliminacion: null
      });
      guardarDatos();
      e.target.reset();
      renderTablaAlumnos();
    }
  });
  document.getElementById("login-form").addEventListener("submit", e => {
    e.preventDefault();
    const u = document.getElementById("username").value.trim();
    const p = document.getElementById("password").value.trim();
    const rol = Object.keys(CREDENCIALES).find(r => CREDENCIALES[r].user === u && CREDENCIALES[r].pass === p);
    if (rol) {
      estado.loggedIn = true;
      estado.role = rol;
      document.getElementById("user-role").textContent = rol.toUpperCase();
      mostrarApp();
    } else {
      document.getElementById("login-error").textContent = "Usuario o contraseña incorrectos";
    }
  });
  document.getElementById("logout-btn").addEventListener("click", () => {
    estado.loggedIn = false;
    estado.role = null;
    mostrarLogin();
  });
  mostrarLogin();
});
