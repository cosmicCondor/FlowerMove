// Datos usuarios login
const USERNAME = "admin";
const PASSWORD = "flower123";

// Meses permitidos (septiembre a junio)
const MESES = [
  "Septiembre", "Octubre", "Noviembre", "Diciembre",
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"
];

// Turnos con alumnos inventados
const ALUMNOS_INICIALES = {
  infantil: [
    {name:"Lucía", asistencia:false, importe:70},
    {name:"Mateo", asistencia:true, importe:60},
    {name:"Sofía", asistencia:true, importe:65},
    {name:"Lucas", asistencia:false, importe:50},
    {name:"Emma", asistencia:true, importe:70},
    {name:"Hugo", asistencia:false, importe:40},
    {name:"Valeria", asistencia:true, importe:55},
    {name:"Liam", asistencia:true, importe:60},
    {name:"Martina", asistencia:false, importe:68},
    {name:"Diego", asistencia:true, importe:72},
  ],
  junior: [
    {name:"Noah", asistencia:true, importe:80},
    {name:"Mía", asistencia:false, importe:70},
    {name:"Ethan", asistencia:true, importe:75},
    {name:"Isabella", asistencia:true, importe:82},
    {name:"Oliver", asistencia:false, importe:60},
    {name:"Camila", asistencia:true, importe:58},
    {name:"Elías", asistencia:true, importe:70},
    {name:"Aria", asistencia:false, importe:72},
    {name:"Sebastián", asistencia:true, importe:78},
    {name:"Zoe", asistencia:true, importe:80},
  ],
  inicio: [
    {name:"David", asistencia:true, importe:90},
    {name:"Clara", asistencia:false, importe:85},
    {name:"Adrián", asistencia:true, importe:95},
    {name:"Sara", asistencia:true, importe:98},
    {name:"Mario", asistencia:false, importe:88},
    {name:"Nora", asistencia:true, importe:87},
    {name:"Pablo", asistencia:true, importe:92},
    {name:"Lara", asistencia:false, importe:89},
    {name:"Álvaro", asistencia:true, importe:90},
    {name:"Julia", asistencia:true, importe:93},
  ],
  youth: [
    {name:"Carlos", asistencia:true, importe:110},
    {name:"Elena", asistencia:false, importe:100},
    {name:"Bruno", asistencia:true, importe:108},
    {name:"Marta", asistencia:true, importe:115},
    {name:"Rubén", asistencia:false, importe:105},
    {name:"Alicia", asistencia:true, importe:112},
    {name:"Javier", asistencia:true, importe:113},
    {name:"Carmen", asistencia:false, importe:109},
    {name:"Sergio", asistencia:true, importe:111},
    {name:"Irene", asistencia:true, importe:114},
  ],
  adulto: [
    {name:"Laura", asistencia:true, importe:130},
    {name:"Miguel", asistencia:false, importe:115},
    {name:"Ana", asistencia:true, importe:120},
    {name:"Fernando", asistencia:true, importe:125},
    {name:"Cristina", asistencia:false, importe:118},
    {name:"Luis", asistencia:true, importe:119},
    {name:"Patricia", asistencia:true, importe:122},
    {name:"David", asistencia:false, importe:126},
    {name:"Sandra", asistencia:true, importe:128},
    {name:"Jorge", asistencia:true, importe:121},
  ],
};

// Estado app: login, mes actual, turno, datos alumnos etc
let estado = {
  loggedIn: false,
  turnoActivo: "infantil",
  mesActivo: "Septiembre",
  alumnosPorTurno: {},
};

// Guardar y cargar datos desde localStorage para persistencia
function guardarDatos(){
  localStorage.setItem("flowermoveDatos", JSON.stringify(estado.alumnosPorTurno));
}
function cargarDatos(){
  const data = localStorage.getItem("flowermoveDatos");
  if(data){
    estado.alumnosPorTurno = JSON.parse(data);
  } else {
    estado.alumnosPorTurno = JSON.parse(JSON.stringify(ALUMNOS_INICIALES));
  }
}

function mostrarLoginError(msg){
  const err = document.getElementById("login-error");
  err.textContent = msg;
}

function init(){
  cargarDatos();
  // Poblar select meses
  const monthSelect = document.getElementById("month-select");
  MESES.forEach(mes => {
    const option = document.createElement("option");
    option.value=mes;
    option.textContent=mes;
    monthSelect.appendChild(option);
  });
  monthSelect.value = estado.mesActivo;

  // Turnos botones
  const turnoBtns = document.querySelectorAll(".turno-btn");
  turnoBtns.forEach(btn=>{
    btn.addEventListener("click", ()=>{
      document.querySelector(".turno-btn.active").classList.remove("active");
      btn.classList.add("active");
      estado.turnoActivo = btn.dataset.turno;
      renderTablaAlumnos();
    });
  });

  // Cambiar mes
  monthSelect.addEventListener("change", (e)=>{
    estado.mesActivo = e.target.value;
    renderTablaAlumnos();
  });

  // Añadir alumno
  const addForm = document.getElementById("add-alumno-form");
  addForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const name = document.getElementById("nuevo-alumno-name").value.trim();
    const importe = parseFloat(document.getElementById("nuevo-alumno-importe").value);
    const asistencia = document.getElementById("nuevo-alumno-asistencia").checked;
    if(name && !isNaN(importe) && importe >= 0){
      estado.alumnosPorTurno[estado.turnoActivo].push({
        name, importe, asistencia
      });
      guardarDatos();
      addForm.reset();
      renderTablaAlumnos();
    }
  });

  // Logout botón
  document.getElementById("logout-btn").addEventListener("click", ()=>{
    estado.loggedIn = false;
    mostrarLogin();
  });

  // Login form
  document.getElementById("login-form").addEventListener("submit", (e)=>{
    e.preventDefault();
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();
    if(user === USERNAME && pass === PASSWORD){
      estado.loggedIn = true;
      mostrarApp();
    } else {
      mostrarLoginError("Usuario o contraseña incorrectos");
    }
  });

  mostrarLogin();
}

// Mostrar login o app
function mostrarLogin(){
  document.getElementById("login-container").classList.remove("hidden");
  document.getElementById("app").classList.add("hidden");
  document.getElementById("login-error").textContent = "";
}
function mostrarApp(){
  document.getElementById("login-container").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
  renderTablaAlumnos();
}

// Render tabla alumnos
function renderTablaAlumnos(){
  const tbody = document.querySelector("#alumnos-table tbody");
  tbody.innerHTML = "";
  const alumnos = estado.alumnosPorTurno[estado.turnoActivo];
  if(!alumnos) return;

  alumnos.forEach((alumno, index)=>{
    const tr = document.createElement("tr");

    // Nombre (o input en modo edición)
    const tdName = document.createElement("td");

    // Asistencia (click para cambiar)
    const tdAsistencia = document.createElement("td");
    tdAsistencia.classList.add("asistencia-cell");
    tdAsistencia.textContent = alumno.asistencia ? "✔️" : "❌";
    tdAsistencia.title = "Click para cambiar asistencia";
    tdAsistencia.style.cursor = "pointer";
    tdAsistencia.addEventListener("click", ()=>{
      alumno.asistencia = !alumno.asistencia;
      guardarDatos();
      renderTablaAlumnos();
    });

    // Importe con barra o input editable
    const tdImporte = document.createElement("td");

    // Acciones
    const tdActions = document.createElement("td");

    // Estado para edición
    let enEdicion = false;

    // Botón modificar / guardar
    const btnModificar = document.createElement("button");
    btnModificar.textContent = "Modificar";
    btnModificar.className = "btn-modificar";
    btnModificar.addEventListener("click", ()=>{
      if(!enEdicion){
        // Modo edición: cambiar campos a inputs
        enEdicion = true;        
        // Nombre input editable
        const inputName = document.createElement("input");
        inputName.type = "text";
        inputName.className = "editable";
        inputName.value = alumno.name;
        tdName.innerHTML = "";
        tdName.appendChild(inputName);

        // Importe input editable
        const inputImporte = document.createElement("input");
        inputImporte.type = "number";
        inputImporte.min = "0";
        inputImporte.step = "0.01";
        inputImporte.className = "editable";
        inputImporte.value = alumno.importe.toFixed(2);
        tdImporte.innerHTML = "";
        tdImporte.appendChild(inputImporte);

        btnModificar.textContent = "Guardar";
      } else {
        // Guardar cambios
        const inputName = tdName.querySelector("input");
        const inputImporte = tdImporte.querySelector("input");
        const nuevoNombre = inputName.value.trim();
        const nuevoImporte = parseFloat(inputImporte.value);

        if(nuevoNombre && !isNaN(nuevoImporte) && nuevoImporte >= 0){
          alumno.name = nuevoNombre;
          alumno.importe = nuevoImporte;
          guardarDatos();
          enEdicion = false;
          renderTablaAlumnos();
        } else {
          alert("Por favor, ingresa un nombre válido y un importe numérico positivo.");
        }
      }
    });

    // Rellenar filas en modo lectura si no está en edición
    if(!enEdicion){
      tdName.textContent = alumno.name;

      const maxImporte = 150;
      const barra = document.createElement("div");
      barra.className = "barra-importe";
      barra.style.width = Math.min((alumno.importe/maxImporte)*100,100) + "%";
      barra.textContent = "";
      barra.setAttribute("data-text", alumno.importe.toFixed(2) + " €");
      tdImporte.appendChild(barra);
    }

    // Botón eliminar
    const btnDel = document.createElement("button");
    btnDel.textContent = "Eliminar 🗑️";
    btnDel.className = "btn-eliminar";
    btnDel.style.marginLeft = "10px";
    btnDel.addEventListener("click", ()=>{
      if(confirm(`¿Eliminar alumno ${alumno.name}?`)){
        estado.alumnosPorTurno[estado.turnoActivo].splice(index,1);
        guardarDatos();
        renderTablaAlumnos();
      }
    });

    tdActions.appendChild(btnModificar);
    tdActions.appendChild(btnDel);

    tr.appendChild(tdName);
    tr.appendChild(tdAsistencia);
    tr.appendChild(tdImporte);
    tr.appendChild(tdActions);

    tbody.appendChild(tr);
  });
}

window.addEventListener("load", init);
