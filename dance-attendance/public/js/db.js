import { getFirestore, collection, doc,
         setDoc, getDocs, deleteDoc, updateDoc } 
  from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
import { app } from "./auth.js";  // usa misma instancia

export const db = getFirestore(app);

// Colección: attendance/{group}/{month}/{student}
// Datos: { present: bool, paid: bool, amount: number }
export const colRef = (group, month) =>
  collection(db, "attendance", group, month);

export const fetchStudents = (group, month) =>
  getDocs(colRef(group, month));

export const addStudentDoc = (group, month, name) =>
  setDoc(doc(db, "attendance", group, month, name), {
    present: false, paid: false, amount: 0
  });

export const removeStudentDoc = (group, month, name) =>
  deleteDoc(doc(db, "attendance", group, month, name));

export const updateStudentDoc = (group, month, name, data) =>
  updateDoc(doc(db, "attendance", group, month, name), data);

