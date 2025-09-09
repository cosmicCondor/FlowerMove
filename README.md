# 🌸 FlowerMove Asistencias

**FlowerMove Asistencias** es una aplicación web desarrollada para la gestión de asistencia y control de pagos en la academia de baile FlowerMove. Permite a profesores y administradores llevar un registro digital, seguro y multiusuario de la asistencia de los alumnos y del estado de sus pagos mensuales, todo desde cualquier dispositivo con acceso a Internet.

---

## 🚀 Tecnologías utilizadas

- **HTML5**: Estructura semántica y accesible.
- **CSS3**: Diseño responsive, visual atractivo y tematización acorde a la imagen de la academia.
- **JavaScript (ES6+)**: Lógica de negocio, interacción dinámica y manipulación del DOM.
- **Firebase Firestore**: Base de datos NoSQL en la nube para persistencia y sincronización en tiempo real.

---

## 🎯 Funcionalidades principales

- **Login seguro** para profesores y administradores.
- **Selección de mes y fecha** (solo lunes y miércoles, adaptado al calendario académico).
- **Gestión por turnos**: Infantil, Inicio y Youth.
- **Visualización y edición de asistencia** por alumno y fecha.
- **Control de pagos**: selector visual para marcar si el alumno ha abonado la cuota mensual.
- **Alta de nuevos alumnos** con estado de pago inicial.
- **Eliminación lógica** de alumnos (no se pierden datos históricos).
- **Sincronización en la nube**: los cambios se reflejan instantáneamente en todos los dispositivos.
- **Interfaz responsive** y amigable, optimizada para móvil y escritorio.

---

## 🖥️ Estructura del proyecto

/FlowerMove 
│ 
├── index.html # Página principal de la app 
├── style.css # Estilos personalizados y responsive 
├── app.js # Lógica de negocio y conexión con Firestore 
├── 404.html # Página de error para despliegue en Firebase Hosting 
└── .firebase/ # Configuración y caché de Firebase Hosting


---

## 📝 Descripción técnica

- **Persistencia**: Todos los datos de alumnos, asistencias y pagos se almacenan en Firestore, permitiendo edición y consulta multiusuario en tiempo real.
- **Control de acceso**: El sistema distingue entre roles (profesor/admin) para habilitar o restringir acciones como la eliminación de alumnos.
- **UI/UX**: El diseño utiliza colores corporativos, iconografía clara (✔️/❌ para asistencia, 💰/💸 para pagos) y formularios intuitivos.
- **Escalabilidad**: La estructura de datos permite añadir nuevos turnos, meses o funcionalidades sin grandes refactorizaciones.
- **Mantenimiento**: El código está modularizado y documentado para facilitar futuras ampliaciones o integraciones.

---

## 🌐 Despliegue y acceso

- **Firebase Hosting**: Preparado para despliegue directo en Firebase, con soporte para HTTPS y rutas amigables.
- **Acceso multi-dispositivo**: Solo necesitas un navegador moderno.

---

## 👩‍💻 Para desarrolladores

1. Clona el repositorio.
2. Configura tu proyecto de Firebase.
3. Ejecuta con un servidor local o despliega en Firebase Hosting.

---

## 💡 ¿Por qué es diferente?

- **Sin papeles**: Olvídate de las hojas de asistencia y los listados de pagos en papel.
- **Colaborativo**: Varios profesores pueden gestionar la asistencia en tiempo real.
- **Seguro y privado**: Los datos están protegidos en la nube y solo accesibles para usuarios autorizados.
- **Visual y usable**: Pensado para que cualquier persona de la academia pueda usarlo sin formación técnica.

---

## 🪩 FlowerMove, ¡baila y gestiona sin preocupaciones!
