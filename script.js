import {get, post, deletes, update} from "./services";

const routes = {
  "/": "./users.html",
  "/users": "./users.html",
  "/newuser": "./newuser.html",
  "/about": "./about.html",
};

document.body.addEventListener("click", (e) => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    navigate(e.target.getAttribute("href"));
  }
});

async function navigate(pathname) {
  const route = routes[pathname];
  const html = await fetch(route).then((res) => res.text());
  document.getElementById("content").innerHTML = html;
  history.pushState({}, "", pathname);
  // Ejecutar lógica específica según la ruta
  if (pathname === "/users") {
      fetchUsers();
  } else if (pathname === "/newuser") {
      setTimeout(createuser, 0);
  }
}

window.addEventListener("popstate", () =>
  navigate(location.pathname)
);

async function fetchUsers(){
  try{
    const users = await get("http://localhost:3000/Users");
    const container = document.getElementById("users-container");
    if (!container) return;
    let html = "";
    for(let user of users){
        html += `
            <div class="user-card">
            <h3>${user.name}</h3>
            <p>Email: ${user.email}</p>
            <p>Phone: ${user.phone}</p>
            <div>
              <button class="deletebtn" onclick="deleteUser(${user.id})">Delete</button>
              <button class="editbtn" onclick="Edit(${user.id})">Edit</button>
            </div>
            </div>
        `;
    }
    container.innerHTML = html;
  } catch (error) {
    alert("Error al obtener usuarios: " + error);
  }
}

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
        } catch (error) {
            alert("Error al eliminar usuario: " + error);
        }
    }
    }

async function createuser() {
    let form = document.getElementById("new-user-form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        let name = document.getElementById("Name").value;
        let email = document.getElementById("Email").value;
        let phone = document.getElementById("Phone").value;
        let EnrrolNumber = document.getElementById("Enrrollnumber").value;
        let date = document.getElementById("Dateofadmision").value;
        let count = await get("http://localhost:3000/Users").then(data => data.length + 1);
        let newUser = {
            id: String(count), // Generar un ID único
            name: name,
            email: email,
            phone: phone,
            enrollNumber: EnrrolNumber,
            dateOfAdmission: date
        };
        let createdUser = await post("http://localhost:3000/Users", newUser);
        if(createdUser){
            Swal.fire({
                icon: 'success',
                title: 'User added!',
                text: 'The User was added successfully.'
            })
        }else{
            alert("Error al crear el usuario");
        }
    })
}
async function Edit(id) {
    try {
        const user = await get(`http://localhost:3000/Users/${id}`);
        if (!user) {
            alert("Usuario no encontrado");
            return;
        }
        const { value: formValues } = await Swal.fire({
            title: "Edit user",
            html:
                `<input id="swal-input1" class="swal2-input" placeholder="Name" value="${user.name}">` +
                `<input id="swal-input2" class="swal2-input" placeholder="Email" value="${user.email}">`+
                `<input id="swal-input3" class="swal2-input" placeholder="Phone" value="${user.phone}">`,

            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {
                return [
                    document.getElementById('swal-input1').value,
                    document.getElementById('swal-input2').value,
                    document.getElementById('swal-input3').value
                ];
            }
        });

        if (formValues) {
            await update("http://localhost:3000/Users", id, {
                ...user,
                name: formValues[0],
                email: formValues[1],
                phone:  formValues[2]
            });
            alert("Usuario actualizado correctamente");
            fetchUsers();
        }
    } catch (error) {
        Swal.fire({
            title: "Error",
            text: error.message
        });
    }
}
window.deleteUser = deleteUser;
window.Edit = Edit;
// Al cargar la SPA por primera vez, mostrar la vista actual
navigate(location.pathname);