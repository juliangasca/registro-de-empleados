import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore, collection, addDoc, getDocs,
  doc , deleteDoc , updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDSf0aNb6DKVd9NjZAaJTbaUlAo-ELP29I",
  authDomain: "proyec-82b5a.firebaseapp.com",
  projectId: "proyec-82b5a",
  storageBucket: "proyec-82b5a.firebasestorage.app",
  messagingSenderId: "889867842044",
  appId: "1:889867842044:web:3590c0eb0c90904e3c8279",
  measurementId: "G-7D8KR9VBKL"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const alumnosRef = collection(db, "empelado");

let modoEdicion = false;
let idAlumnoActual = "";

const form = document.getElementById("alumnoForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const datos = {
    nombre: form.nombre.value,
    edad: parseInt(form.edad.value),
    apellido: form.apellido.value,
    puesto: form.puesto.value.split(",").map(m => m.trim()),
    contacto: {
      email: form.email.value,
      telefono: form.telefono.value
    }
  };

  if (modoEdicion) {
    const ref = doc(db, "empleado", idAlumnoActual);
    await updateDoc(ref, datos);
    modoEdicion = false;
    idAlumnoActual = "";
    form.querySelector("button").textContent = "Guardar";
  } else {
    await addDoc(alumnosRef, datos);
  }

  form.reset();
  mostrarAlumnos();
});

// Mostrar todos los alumnos
async function mostrarAlumnos() {
  const contenedor = document.getElementById("listaAlumnos");
  contenedor.innerHTML ='';
  const snapshot = await getDocs(alumnosRef);
  snapshot.forEach(docu => {
    const data = docu.data();
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>${data.nombre}</h3>
      <p><strong>Edad:</strong> ${data.edad}</p>
      <p><strong>Apellido:</strong> ${data.apellido}</p>
      <p><strong>Puesto:</strong> ${data.puesto.join(", ")}</p>
      <p><strong>Email:</strong> ${data.contacto.email}</p>
      <p><strong>Teléfono:</strong> ${data.contacto.telefono}</p>
      <button onclick='editarAlumno("${docu.id}", ${JSON.stringify(data).replace(/"/g, '&quot;')})'>Editar</button>
      <button onclick="eliminarAlumno('${docu.id}')">Eliminar</button>
    `;
    contenedor.appendChild(div);
  });
  }
  
window.editarAlumno = (id, data) => {
  form.nombre.value = data.nombre;
  form.edad.value = data.edad;
  form.apellido.value = data.apellido;
  form.puesto.value = data.puesto.join(", ");
  form.email.value = data.contacto.email;
  form.telefono.value = data.contacto.telefono;
  idAlumnoActual = id;
  modoEdicion = true;
   
  form.querySelector("button").textContent = "Actualizar";
};
  
// Buscar alumno por nombre
window.buscarRegistro = async () => {
  const nombreBuscar = document.getElementById("buscar").value.trim().toLowerCase();
  const snapshot = await getDocs(alumnosRef);
  const contenedor = document.getElementById("listaAliumnos");
  contenedor.innerHTML ='';
  
  snapshot.forEach(docu => {
    const data = docu.data();
    if (data.nombre.toLowerCase().includes(nombreBuscar)) {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <h3>${data.nombre}</h3>
        <p><strong>Edad:</strong> ${data.edad}</p>
        <p><strong>Apellido:</strong> ${data.apellido}</p>
        <p><strong>Puesto:</strong> ${data.puesto.join(", ")}</p>
        <p><strong>Email:</strong> ${data.contacto.email}</p>
        <p><strong>Teléfono:</strong> ${data.contacto.telefono}</p>
        <button onclick='editarRegistro("${docu.id}", ${JSON.stringify(data).replace(/"/g, '&quot;')})'>Editar</button>
        <button onclick="eliminarRegistro('${docu.id}')">Eliminar</button>
      `;
      contenedor.appendChild(div);
    }
  });
};
   // ELIMINAR Empleado
window.eliminarAlumno = async (id)  => {
  await deleteDoc(doc(db, "empleado",id));
  mostrarAlumnos();
};
  mostrarAlumnos(
