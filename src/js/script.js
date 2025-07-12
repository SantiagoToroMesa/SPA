import {get, post, deletes, update} from "./services.js";

const routes = {
    //rutas de la aplicación
  "/": "src/html/login.html",
  "/users": "src/html/users.html",
  "/newuser": "src/html/newuser.html",
  "/about": "src/html/about.html",
};

document.body.addEventListener("click", (e) => {
    // Si el elemento clickeado es un enlace con el atributo data-link
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    navigate(e.target.getAttribute("href"));
  }
});
function updateActiveNav() {
    // Remover clase activa de todos los enlaces
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
    });

    // Obtener la ruta actual
    const currentPath = location.pathname;
    
    // Agregar clase activa al enlace correspondiente
    const currentLink = document.querySelector(`nav a[href="${currentPath}"]`);
    if (currentLink) {
        currentLink.classList.add('active');
    }
}
function printUserRole() {
    const userRoleSpan = document.getElementById("user-role");
    let user = null;

    if (localStorage.getItem("loggedUser")) {
        user = JSON.parse(localStorage.getItem("loggedUser"));
    }
    if (user && user.role) {
        userRoleSpan.textContent = `Rol: ${user.role}`;
        userRoleSpan.style.display = "block";
    } else {
        userRoleSpan.textContent = "";
        userRoleSpan.style.display = "none";
    }
}

function updateLogoutBtn() {
  const btn = document.querySelector('.logout-btn');
  const user = JSON.parse(localStorage.getItem("loggedUser"));
  if (btn) {
    if (user) {
      btn.style.display = "inline-block";
      btn.textContent = "Logout";
    } else {
      btn.style.display = "none";
    }
  }
}

if (document.querySelector('.logout-btn')) {
  document.querySelector('.logout-btn').addEventListener('click', () => {
    localStorage.removeItem("loggedUser");
    navigate("/");
  });
}

// Llama a printUserRole después de cada navegación (excepto en login)
async function navigate(pathname) {
  history.pushState({}, "", pathname);
  const route = routes[pathname];
  const user = JSON.parse(localStorage.getItem("loggedUser"));
  const html = await fetch(route).then((res) => res.text());
  const app = document.getElementById("app");
  const loginContainer = document.getElementById("login-container");
  if (pathname === "/") {
      if (app) app.style.display = "none";
      if (loginContainer) {
          loginContainer.style.display = "";
          loginContainer.innerHTML = html;
          setupLogin();
      }
        // Ocultar nav y logo en la página de login
      printUserRole();

      updateLogoutBtn();
  } else {
        // Si no es la página de login, mostrar el app y ocultar el loginContainer
      if (app) app.style.display = "";
      if (loginContainer) {
          loginContainer.style.display = "none";
          loginContainer.innerHTML = "";
      }
        // Actualizar el contenido del app con la nueva vista
      document.getElementById("content").innerHTML = html;
      // Mostrar/ocultar nav y logo según la ruta
      const nav = document.querySelector("nav");
      const logo = document.querySelector(".logo-container");
      if (nav) nav.style.display = "";
      if (logo) logo.style.display = "";
      // Ejecutar lógica específica según la ruta
      if (pathname === "/users") {
            // Si es la página de usuarios, llamar a fetchUsers
          fetchUsers();
      }
      if (pathname === "/newuser") {
            // Si es la página de nuevo usuario, llamar a createuser
          setTimeout(createuser, 0);
      }
      if (!user && pathname !== "/") {
          // Si el usuario no está logueado y no es la página de login, redirigir a login
          Swal.fire("Ups", "Primero iniciá sesión", "warning");
          return navigate("/");
      }
      if (pathname === "/newuser" && user?.role !== "admin") {
            // Si el usuario no es admin, mostrar mensaje de acceso denegado
          Swal.fire("Acceso denegado", "No tienes permisos para entrar aquí", "error");
          return navigate("/users");
      }
      // Actualizar navegación activa SOLO cuando el nav está visible
      updateActiveNav();
      // Mostrar el role
      printUserRole();
      updateLogoutBtn();
  }
}


window.addEventListener("popstate", () => {
  navigate(location.pathname);
});

async function fetchUsers(){
  try{
    // Obtiene la lista de usuarios desde el servidor
    const users = await get("http://localhost:3000/Users");
    const currentUser = JSON.parse(localStorage.getItem("loggedUser"));
    const isAdmin = currentUser?.role === "admin";
    const container = document.getElementById("users-container");
    if (!container) return;
    let html = "";
    for(let user of users){
        // Verifica si el usuario es el actual y no es admin, para ocultar acciones
        const actionshtml = isAdmin ? `
            <button class="deletebtn" onclick="deleteUser(${user.id})">Delete</button>
            <button class="editbtn" onclick="Edit(${user.id})">Edit</button>
        ` : '';
        // Crea una tarjeta para cada usuario con sus datos
        html += `
            <div class="user-card">
            <h3>${user.name}</h3>
            <p><strong>ID:</strong> ${user.id}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Phone:</strong> ${user.phone}</p>
            <p><strong>Enroll Number:</strong> ${user.enrollNumber}</p>
            <p><strong>Date of Admission:</strong> ${user.dateOfAdmission}</p>
            <p><strong>Role:</strong> ${user.role}</p>
            <div>
                ${actionshtml}
            </div>
            </div>
        `;
    }
    container.innerHTML = html;
  } catch (error) {
    alert("Error al obtener usuarios: " + error);
  }
}

// Función para incrementar y mostrar el contador de acciones de sesión
function incrementSessionActions() {
    // Incrementa el contador de acciones de sesión y lo guarda en sessionStorage
    let count = parseInt(sessionStorage.getItem('sessionActions') || '0', 10);
    count++;
    sessionStorage.setItem('sessionActions', count);
    showSessionActions();
}

function showSessionActions() {
    // Muestra el contador de acciones de sesión
    let count = sessionStorage.getItem('sessionActions') || '0';
    const el = document.getElementById('session-actions');
    if (el) {
        el.textContent = `Acciones en esta sesión: ${count}`;
        el.style.display = 'block';
    }
}

// Llama a showSessionActions al cargar la app
showSessionActions();

async function deleteUser(id) {
    const result = await swal.fire({
        title: 'Are you sure?',
        text: 'This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    });
    if(result.isConfirmed){
        try {
            await deletes(`http://localhost:3000/Users/${id}`);
            fetchUsers(); // Actualizar la lista de usuarios
            incrementSessionActions(); // Incrementa el contador
        } catch (error) {
            alert("Error al eliminar usuario: " + error);
        }
    }
    }

async function createuser() {
    let form = document.getElementById("new-user-form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        // Obtiene los valores de los campos del formulario
        let password = document.getElementById("Password").value.trim();
        let name = document.getElementById("Name").value.trim();
        let email = document.getElementById("Email").value.trim();
        let phone = document.getElementById("Phone").value.trim();
        let EnrrolNumber = document.getElementById("Enrrollnumber").value.trim();
        let date = document.getElementById("Dateofadmision").value.trim();
        let count = await get("http://localhost:3000/Users").then(data => data.length + 1);
        if( !name || !email || !phone || !EnrrolNumber || !date || !password) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please fill in all fields.'
            });
            return;
        }
        let newUser = {
            // Crea un nuevo usuario con los datos del formulario
            id: String(count), // Generar un ID único
            name: name,
            email: email,
            phone: phone,
            enrollNumber: EnrrolNumber,
            dateOfAdmission: date,
            role: "user",
            password: password,
        };
        let createdUser = await post("http://localhost:3000/Users", newUser);
        if(createdUser){
            Swal.fire({
                icon: 'success',
                title: 'User added!',
                text: 'The User was added successfully.'
            })
            incrementSessionActions(); // Incrementa el contador
        }else{
            alert("Error al crear el usuario");
        }
    })
}
async function Edit(id) {
    try {
        // Obtiene el usuario por ID
        const user = await get(`http://localhost:3000/Users/${id}`);
        if (!user) {
            alert("Usuario no encontrado");
            return;
        }
        const { value: formValues } = await Swal.fire({
            // Configuración de SweetAlert2 para editar usuario
            title: "Edit user",
            // Muestra un formulario con los datos del usuario
            html:
                `<input id="swal-input1" class="swal2-input" placeholder="Name" value="${user.name}">` +
                `<input id="swal-input2" class="swal2-input" placeholder="Email" value="${user.email}">`+
                `<input id="swal-input3" class="swal2-input" placeholder="Phone" value="${user.phone}">`,

            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {
                return [
                    // Obtiene los valores de los inputs
                    document.getElementById('swal-input1').value,
                    document.getElementById('swal-input2').value,
                    document.getElementById('swal-input3').value
                ];
            }
        });

        if (formValues) {
            await update("http://localhost:3000/Users", id, {
                ...user,
                // Actualiza los campos del usuario con los nuevos valores
                name: formValues[0],
                email: formValues[1],
                phone:  formValues[2]
            });
            Swal.fire({
                // Muestra un mensaje de éxito
                icon: "success",
                title: "User updated!",
                text: "The user was updated successfully."
            });
            fetchUsers();
            incrementSessionActions(); // Incrementa el contador
        }
    } catch (error) {
        Swal.fire({
            title: "Error",
            text: error.message
        });
    }
}
async function setupLogin() {
    // Verifica si el usuario ya está logueado
    const form = document.getElementById("login-form");
    const msg = document.getElementById("login-msg");

    // Si el usuario ya está logueado, redirige a /users
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        const users = await get("http://localhost:3000/Users");

        const found = users.find(
            user => user.email === email && user.password === password
        );

        if (found) {
            localStorage.setItem("loggedUser", JSON.stringify(found));
            navigate("/users");
        } else {
            msg.textContent = "Correo o contraseña incorrectos";
        }
    });
}
window.deleteUser = deleteUser;
window.Edit = Edit;
// Al cargar la SPA por primera vez, mostrar la vista actual
navigate(location.pathname);
// Actualizar navegación activa inicial
updateActiveNav();