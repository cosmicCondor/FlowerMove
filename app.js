// Datos usuarios login
const USERNAME = "admin";
const PASSWORD = "flower123";

// Meses permitidos (agosto 2025 a junio 2026)
const MESES = [
  "Agosto 2025",
  "Septiembre 2025", "Octubre 2025", "Noviembre 2025", "Diciembre 2025",
  "Enero 2026", "Febrero 2026", "Marzo 2026", "Abril 2026", "Mayo 2026", "Junio 2026"
];

// Base alumnos con estado pagado inicial (false por defecto)
const BASE_ALUMNOS = {
  infantil: [
    { name: "Lucía", pagado: false },
    { name: "Mateo", pagado: false },
    { name: "Sofía", pagado: false },
    { name: "Lucas", pagado: false },
    { name: "Emma", pagado: false },
    { name: "Hugo", pagado: false },
    { name: "Valeria", pagado: false },
    { name: "Liam", pagado: false },
    { name: "Martina", pagado: false },
    { name: "Diego", pagado: false }
  ],
  junior: [
    { name: "Noah", pagado: false },
    { name: "Mía", pagado: false },
    { name: "Ethan", pagado: false },
    { name: "Isabella", pagado: false },
    { name: "Oliver", pagado: false },
    { name: "Camila", pagado: false },
    { name: "Elías", pagado: false },
    { name: "Aria", pagado: false },
    { name: "Sebastián", pagado: false },
    { name: "Zoe", pagado: false }
  ],
  inicio: [
    { name: "David", pagado: false },
    { name: "Clara", pagado: false },
    { name: "Adrián", pagado: false },
    { name: "Sara", pagado: false },
    { name: "Mario", pagado: false },
    { name: "Nora", pagado: false },
    { name: "Pablo", pagado: false },
    { name: "Lara", pagado: false },
    { name: "Álvaro", pagado: false },
    { name: "Julia", pagado: false }
  ],
  youth: [
    { name: "Carlos", pagado: false },
    { name: "Elena", pagado: false },
    { name: "Bruno", pagado: false },
    { name: "Marta", pagado: false },
    { name: "Rubén", pagado: false },
    { name: "Alicia", pagado: false },
    { name: "Javier", pagado: false },
    { name: "Carmen", pagado: false },
    { name: "Sergio", pagado: false },
    { name: "Irene", pagado: false }
  ],
  adulto: [
    { name: "Laura", pagado: false },
    { name: "Miguel", pagado: false },
    { name: "Ana", pagado: false },
    { name: "Fernando", pagado: false },
    { name: "Cristina", pagado: false },
    { name: "Luis", pagado: false },
    { name: "Patricia", pagado: false },
    { name: "David", pagado: false },
    { name: "Sandra", pagado: false },
    { name: "Jorge", pagado: false }
  ]
};

// Estado de la app
let estado = {
  loggedIn: false,
  turnoActivo: "infantil",
  mesActivo: MESES[0],
  fechaActiva: null,
  alumnosPorMes: {}  // Estructura: { mes: { turno: [ {name, pagado, registros:{} } ] } }
};

// Guardar en localStorage
function guardarDatos() {
  localStorage.setItem("flowermoveDatos", JSON.stringify(estado.alumnosPorMes));
}

// Cargar datos o inicializar
function cargarDatos() {
  const data = localStorage.getItem("flowermoveDatos");
  if (data) {
    estado.alumnosPorMes = JSON.parse(data);
    // Asegurar meses y turnos inicializados
    MESES.forEach(mes => {
      if (!estado.alumnosPorMes.hasOwnProperty(mes)) {
        estado.alumnosPorMes[mes] = {};
        Object.keys(BASE_ALUMNOS).forEach(turno => {
          estado.alumnosPorMes[mes][turno] = BASE_ALUMNOS[turno].map(a => ({
            name: a.name,
            pagado: a.pagado,
            registros: {}
          }));
        });
      }
    });
  } else {
    MESES.forEach(mes => {
      estado.alumnosPorMes[mes] = {};
      Object.keys(BASE_ALUMNOS).forEach(turno => {
        estado.alumnosPorMes[mes][turno] = BASE_ALUMNOS[turno].map(a => ({
          name: a.name,
          pagado: a.pagado,
          registros: {}
        }));
      });
    });
  }
}

// Obtener fechas lunes y miércoles de un mes
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

// Mostrar o ocultar elemento
function toggle(el, show) {
  el.classList.toggle("hidden", !show);
}

// Render selector fechas con fecha activa al más cercano a hoy o anterior
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
  fechas.forEach(f => {
    const iso = f.toISOString().slice(0,10);
    if (iso <= hoyISO) seleccion = iso;
  });
  estado.fechaActiva = seleccion;
  if (seleccion) sel.value = seleccion;

  sel.onchange = e => {
    estado.fechaActiva = e.target.value || null;
    renderTablaAlumnos();
  };
}

// Render tabla alumnos
function renderTablaAlumnos() {
  const tbody = document.querySelector("#alumnos-table tbody");
  tbody.innerHTML = "";
  if (!estado.fechaActiva) return;

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
    const optFecha = document.getElementById("date-select").selectedOptions[0];
    tdFecha.textContent = optFecha ? optFecha.textContent : "";
    tr.appendChild(tdFecha);

    // Nombre
    const tdName = document.createElement("td");
    tdName.textContent = alumno.name;
    tr.appendChild(tdName);

    // Asistencia
    const tdAsis = document.createElement("td");
    tdAsis.classList.add("asistencia-cell");
    if (!pasada) {
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

    // Importe abonado (botón toggle)
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

    // Acciones (solo modificar)
    const tdAcciones = document.createElement("td");
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
    tr.appendChild(tdAcciones);

    tbody.appendChild(tr);
  });
}

// Actualizar estilo y texto del botón pagado
function actualizarBtnPagado(btn, estadoPago) {
  if (estadoPago === true) {
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

// Init app y eventos
window.addEventListener("load", () => {
  cargarDatos();

  const selMes = document.getElementById("month-select");
  MESES.forEach(m => {
    const option = document.createElement("option");
    option.value = m;
    option.textContent = m;
    selMes.appendChild(option);
  });
  selMes.value = estado.mesActivo;
  selMes.onchange = e => {
    estado.mesActivo = e.target.value;
    renderSelectFechas();
    renderTablaAlumnos();
  };

  document.querySelectorAll(".turno-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelector(".turno-btn.active").classList.remove("active");
      btn.classList.add("active");
      estado.turnoActivo = btn.dataset.turno;
      renderTablaAlumnos();
    });
  });

  const addForm = document.getElementById("add-alumno-form");
  addForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("nuevo-alumno-name").value.trim();
    const pagadoValue = document.getElementById("nuevo-alumno-pagado").value === "true";
    if (name) {
      estado.alumnosPorMes[estado.mesActivo][estado.turnoActivo].push({
        name,
        pagado: pagadoValue,
        registros: {}
      });
      guardarDatos();
      addForm.reset();
      renderTablaAlumnos();
    }
  });

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

  document.getElementById("logout-btn").addEventListener("click", () => {
    estado.loggedIn = false;
    mostrarLogin();
  });

  mostrarLogin();
});
