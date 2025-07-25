import { fetchStudents, addStudentDoc,
         removeStudentDoc, updateStudentDoc } from "./db.js";

const tbody = document.querySelector("#table tbody");
document.getElementById("load").onclick = loadTable;
document.getElementById("addStudent").onclick = addStudent;

async function loadTable() {
  tbody.innerHTML = "";
  const g = groupSel.value, m = monthSel.value;
  const snapshot = await fetchStudents(g, m);
  snapshot.forEach(docSnap => createRow(g, m, docSnap.id, docSnap.data()));
}

function createRow(g, m, name, data) {
  const tr = document.createElement("tr");

  // Nombre
  tr.innerHTML = `<td>${name}</td>`;
  
  // Checkbox asistencia
  const chk = document.createElement("input");
  chk.type = "checkbox"; chk.checked = data.present;
  chk.onchange = () => updateStudentDoc(g, m, name, { present: chk.checked });
  tr.appendChild(tdWrap(chk));

  // Checkbox pagó
  const payChk = document.createElement("input");
  payChk.type = "checkbox"; payChk.checked = data.paid;
  payChk.onchange = () => updateStudentDoc(g, m, name, { paid: payChk.checked });
  tr.appendChild(tdWrap(payChk));

  // Importe €
  const amount = document.createElement("input");
  amount.type = "number"; amount.value = data.amount;
  amount.onchange = () => updateStudentDoc(g, m, name, { amount: +amount.value });
  tr.appendChild(tdWrap(amount));

  // Eliminar
  const del = document.createElement("button");
  del.textContent = "X";
  del.onclick = async () => { await removeStudentDoc(g, m, name); tr.remove(); };
  tr.appendChild(tdWrap(del));

  tbody.appendChild(tr);
}

function tdWrap(el) {
  const td = document.createElement("td");
  td.appendChild(el); return td;
}

async function addStudent() {
  const name = studentName.value.trim();
  if (!name) return;
  await addStudentDoc(groupSel.value, monthSel.value, name);
  studentName.value = ""; loadTable();
}

// Cargar tabla al abrir
window.addEventListener("DOMContentLoaded", loadTable);

