// app.js

// Datos usuarios login
const USERNAME = "admin";
const PASSWORD = "flower123";

// Meses permitidos (agosto 2025 a junio 2026)
const MESES = [
  "Agosto 2025",
  "Septiembre 2025", "Octubre 2025", "Noviembre 2025", "Diciembre 2025",
  "Enero 2026", "Febrero 2026", "Marzo 2026", "Abril 2026", "Mayo 2026", "Junio 2026"
];

// Turnos con datos base por defecto (se clonarán para cada mes)
const BASE_ALUMNOS = {
  infantil: [
    { name: "Lucía", importe: 70 },
    { name: "Mateo", importe: 60 },
    { name: "Sofía", importe: 65 },
    { name: "Lucas", importe: 50 },
    { name: "Emma", importe: 70 },
    { name: "Hugo", importe: 40 },
    { name: "Valeria", importe: 55 },
    { name: "Liam", importe: 60 },
    { name: "Martina", importe: 68 },
    { name: "Diego", importe: 72 }
  ],
  junior: [
    { name: "Noah", importe: 80 },
    { name: "Mía", importe: 70 },
    { name: "Ethan", importe: 75 },
    { name: "Isabella", importe: 82 },
    { name: "Oliver", importe: 60 },
    { name: "Camila", importe: 58 },
    { name: "Elías", importe: 70 },
    { name: "Aria", importe: 72 },
    { name: "Sebastián", importe: 78 },
    { name: "Zoe", importe: 80 }
  ],
  inicio: [
    { name: "David", importe: 90 },
    { name: "Clara", importe: 85 },
    { name: "Adrián", importe: 95 },
    { name: "Sara", importe: 98 },
    { name: "Mario", importe: 88 },
    { name: "Nora", importe: 87 },
    { name: "Pablo", importe: 92 },
    { name: "Lara", importe: 89 },
    { name: "Álvaro", importe: 90 },
    { name: "Julia", importe: 93 }
  ],
  youth: [
    { name: "Carlos", importe: 110 },
    { name: "Elena", importe: 100 },
    { name: "Bruno", importe: 108 },
    { name: "Marta", importe: 115 },
    { name: "Rubén", importe: 105 },
    { name: "Alicia", importe: 112 },
    { name: "Javier", importe: 113 },
    { name: "Carmen", importe: 109 },
    { name: "Sergio", importe: 111 },
    { name: "Irene", importe: 114 }
  ],
  adulto: [
    { name: "Laura", importe: 130 },
    { name: "Miguel", importe: 115 },
    { name: "Ana", importe: 120 },
    { name: "Fernando", importe: 125 },
    { name: "Cristina", importe: 118 },
    { name: "Luis", importe: 119 },
    { name: "Patricia", importe: 122 },
    { name: "David", importe: 126 },
    { name: "Sandra", importe: 128 },
    { name: "Jorge", importe: 121 }
  ]
};

// Estado de la app
let estado = {
  loggedIn: false,
  turnoActivo: "infantil",
  mesActivo: MESES[0],
  fechaActiva: null,
  alumnosPorMes: {} // estructura: { mes: { turno: [ {name, importe, registros:{fechaISO: true/false}} ] } }
};

// Persistencia en localStorage
function guardarDatos() {
  localStorage.setItem("flowermoveDatos", JSON.stringify(estado.alumnosPorMes));
}

function cargarDatos() {
  const data = localStorage.getItem("flowermoveDatos");
  if (data) {
    estado.alumnosPorMes = JSON.parse(data);

    // Asegurar que cada mes del array MESES esté inicializado
    MESES.forEach(mes => {
      if (!estado.alumnosPorMes.hasOwnProperty(mes)) {
        estado.alumnosPorMes[mes] = {};
        Object.keys(BASE_ALUMNOS).forEach(turno => {
          estado.alumnosPorMes[mes][turno] = BASE_ALUMNOS[turno].map(a => ({
            name: a.name,
            importe: a.importe,
            registros: {}
          }));
        });
      }
    });

  } else {
    // Inicializar clonando BASE_ALUMNOS y añadiendo registros vacíos
    MESES.forEach(mes => {
      estado.alumnosPorMes[mes] = {};
      Object.keys(BASE_ALUMNOS).forEach(turno => {
        estado.alumnosPorMes[mes][turno] = BASE_ALUMNOS[turno].map(a => ({
          name: a.name,
          importe: a.importe,
          registros: {}
        }));
      });
    });
  }
}

// Obtener array de fechas de lunes y miércoles de un mes
function obtenerFechasLunMie(mesAnio) {
  const [nombreMes, anioStr] = mesAnio.split(" ");
  const mesesMap = {
    Enero:0, Febrero:1, Marzo:2, Abril:3, Mayo:4, Junio:5,
    Julio:6, Agosto:7, Septiembre:8, Octubre:9, Noviembre:10, Diciembre:11
  };
  const mesNum = mesesMap[nombreMes], anio = parseInt(anioStr,10);
  const fechas = [];
  const d = new Date(anio, mesNum, 1);
  while (d.getMonth() === mesNum) {
    if (d.getDay() === 1 || d.getDay() === 3) fechas.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return fechas;
}

// Mostrar u ocultar elemento
function toggle(el, show) {
  el.classList.toggle("hidden", !show);
}

// Render select de fechas
function renderSelectFechas() {
  const fechas = obtenerFechasLunMie(estado.mesActivo);
  const sel = document.getElementById("date-select");
  sel.innerHTML = "";
  const opt0 = document.createElement("option");
  opt0.value = "";
  opt0.textContent = "-- Seleccionar fecha --";
  sel.appendChild(opt0);
  fechas.forEach(f => {
    const iso = f.toISOString().slice(0,10);
    const txt = f.toLocaleDateString("es-ES",{day:"2-digit",month:"2-digit",year:"numeric"});
    const o = document.createElement("option");
    o.value = iso;
    o.textContent = txt;
    sel.appendChild(o);
  });
  // Establecer fechaActiva por defecto: buscar fecha más cercana al día actual que ya haya pasado o la primera fecha
  const hoy = new Date();
  let fechaSeleccionada = null;
  for (const f of fechas) {
    if (f.toISOString().slice(0,10) <= hoy.toISOString().slice(0,10)){
      fechaSeleccionada = f.toISOString().slice(0,10);
    }
  }
  if (!fechaSeleccionada && fechas.length > 0) {
    fechaSeleccionada = fechas[0].toISOString().slice(0,10);
  }
  estado.fechaActiva = fechaSeleccionada;
  if (estado.fechaActiva) sel.value = estado.fechaActiva; else sel.value = "";

  sel.onchange = e => {
    estado.fechaActiva = e.target.value || null;
    renderTablaAlumnos();
  };
}

// Render tabla alumnos para la fecha seleccionada
function renderTablaAlumnos() {
  const tbody = document.querySelector("#alumnos-table tbody");
  tbody.innerHTML = "";
  if (!estado.fechaActiva) return;

  // Validar que la data para mesActivo y turnoActivo exista
  const datosMes = estado.alumnosPorMes[estado.mesActivo];
  if (!datosMes) return;
  const alumnos = datosMes[estado.turnoActivo];
  if (!alumnos) return;

  const hoyISO = new Date().toISOString().slice(0,10);
  const pasada = estado.fechaActiva <= hoyISO;

  alumnos.forEach((alumno, idx) => {
    const tr = document.createElement("tr");

    // Fecha
    const tdFecha = document.createElement("td");
    const opcionFecha = document.getElementById("date-select").selectedOptions[0];
    tdFecha.textContent = opcionFecha ? opcionFecha.textContent : "";
    tr.appendChild(tdFecha);

    // Nombre
    const tdName = document.createElement("td");
    tdName.textContent = alumno.name;
    tr.appendChild(tdName);

    // Asistencia
    const tdAsis = document.createElement("td");
    tdAsis.classList.add("asistencia-cell");
    if (!pasada) {
      // Fecha futura: mostrar vacío y no permitir click
      tdAsis.textContent = "";
      tdAsis.style.cursor = "default";
      tdAsis.title = "Fecha futura, no disponible";
    } else {
      const reg = alumno.registros[estado.fechaActiva];
      tdAsis.textContent = reg === true ? "✔️" : reg === false ? "❌" : "";
      tdAsis.style.cursor = "pointer";
      tdAsis.title = "Click para cambiar asistencia";
      tdAsis.onclick = () => {
        alumno.registros[estado.fechaActiva] = !(alumno.registros[estado.fechaActiva] === true);
        guardarDatos();
        renderTablaAlumnos();
      };
    }
    tr.appendChild(tdAsis);

    // Importe
    const tdImp = document.createElement("td");
    const barra = document.createElement("div");
    barra.className = "barra-importe";
    const maxImp = 150;
    barra.style.width = Math.min(alumno.importe / maxImp * 100, 100) + "%";
    barra.setAttribute("data-text", alumno.importe.toFixed(2) + " €");
    tdImp.appendChild(barra);
    tr.appendChild(tdImp);

    // Acciones (botones Modificar y Eliminar)
    const tdAcc = document.createElement("td");

    // Botón modificar
    const btnMod = document.createElement("button");
    btnMod.textContent = "Modificar";
    btnMod.classList.add("btn-modificar");
    btnMod.onclick = () => {
      const nuevoNombre = prompt("Nuevo nombre:", alumno.name);
      if (nuevoNombre === null) return; // cancelar
      const nuevoImporteStr = prompt("Nuevo importe (€):", alumno.importe.toString());
      if (nuevoImporteStr === null) return; // cancelar
      const nuevoImporte = parseFloat(nuevoImporteStr);
      if (nuevoNombre.trim() !== "" && !isNaN(nuevoImporte) && nuevoImporte >= 0) {
        alumno.name = nuevoNombre.trim();
        alumno.importe = nuevoImporte;
        guardarDatos();
        renderTablaAlumnos();
      } else {
        alert("Nombre o importe inválidos.");
      }
    };
    tdAcc.appendChild(btnMod);

    // Botón eliminar
    const btnDel = document.createElement("button");
    btnDel.textContent = "Eliminar";
    btnDel.classList.add("btn-eliminar");
    btnDel.onclick = () => {
      if (confirm(`¿Eliminar alumno ${alumno.name}?`)) {
        estado.alumnosPorMes[estado.mesActivo][estado.turnoActivo].splice(idx, 1);
        guardarDatos();
        renderTablaAlumnos();
      }
    };
    tdAcc.appendChild(btnDel);

    tr.appendChild(tdAcc);

    tbody.appendChild(tr);
  });
}

// Mostrar login o app
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

// Init
window.addEventListener("load", () => {
  cargarDatos();

  // Meses
  const selMes = document.getElementById("month-select");
  MESES.forEach(m => {
    const o = document.createElement("option");
    o.value = m;
    o.textContent = m;
    selMes.appendChild(o);
  });
  selMes.value = estado.mesActivo;
  selMes.addEventListener("change", e => {
    estado.mesActivo = e.target.value;
    renderSelectFechas();
    renderTablaAlumnos();
  });

  // Turnos
  document.querySelectorAll(".turno-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelector(".turno-btn.active").classList.remove("active");
      btn.classList.add("active");
      estado.turnoActivo = btn.dataset.turno;
      renderTablaAlumnos();
    });
  });

  // Insertar select de fechas después del select de meses (solo si no existe)
  const nav = document.querySelector("nav");
  if (!document.getElementById("date-select")) {
    const lbl = document.createElement("label");
    lbl.htmlFor = "date-select";
    lbl.textContent = "Fecha:";
    const selDate = document.createElement("select");
    selDate.id = "date-select";
    nav.appendChild(lbl);
    nav.appendChild(selDate);
  }

  // Añadir alumno
  const addForm = document.getElementById("add-alumno-form");
  addForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("nuevo-alumno-name").value.trim();
    const importe = parseFloat(document.getElementById("nuevo-alumno-importe").value);
    if (name && !isNaN(importe) && importe >= 0) {
      estado.alumnosPorMes[estado.mesActivo][estado.turnoActivo].push({
        name,
        importe,
        registros: {}
      });
      guardarDatos();
      addForm.reset();
      renderTablaAlumnos();
    }
  });

  // Login form
  document.getElementById("login-form").addEventListener("submit", e => {
    e.preventDefault();
    const u = document.getElementById("username").value.trim();
    const p = document.getElementById("password").value.trim();
    if (u === USERNAME && p === PASSWORD) {
      estado.loggedIn = true;
      mostrarApp();
    } else {
      document.getElementById("login-error").textContent = "Usuario o contraseña incorrectos";
    }
  });

  // Logout botón
  document.getElementById("logout-btn").addEventListener("click", () => {
    estado.loggedIn = false;
    mostrarLogin();
  });

  mostrarLogin();
});
