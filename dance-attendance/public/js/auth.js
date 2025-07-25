import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword,
         signInWithEmailAndPassword, signOut, onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyB87YkEmqgcyMsENv_LcTmxF1PNZZ7KqxI",
    authDomain: "flowermove-734a2.firebaseapp.com",
    projectId: "flowermove-734a2",
    storageBucket: "flowermove-734a2.firebasestorage.app",
    messagingSenderId: "152908668013",
    appId: "1:152908668013:web:0ae45bc629d959fe287364",
    measurementId: "G-D905CNMJF8"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ===== Registro =====
window.register = async () => {
  const email = document.getElementById("r-email").value;
  const pass  = document.getElementById("r-pass").value;
  try {
    await createUserWithEmailAndPassword(auth, email, pass);
    window.location = "dashboard.html";
  } catch (err) {
    document.getElementById("msg").textContent = err.message;
  }
};

// ===== Login =====
window.login = async () => {
  const email = document.getElementById("l-email").value;
  const pass  = document.getElementById("l-pass").value;
  try {
    await signInWithEmailAndPassword(auth, email, pass);
    window.location = "dashboard.html";
  } catch (err) {
    document.getElementById("msg").textContent = err.message;
  }
};

// ===== Logout =====
window.doLogout = async () => {
  await signOut(auth);
  window.location = "index.html";
};

// ===== Protege dashboard.html =====
if (window.location.pathname.endsWith("dashboard.html")) {
  onAuthStateChanged(auth, user => {
    if (!user) window.location = "index.html";
    else document.getElementById("logout").onclick = window.doLogout;
  });
}
