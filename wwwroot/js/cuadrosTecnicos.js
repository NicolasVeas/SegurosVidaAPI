document.addEventListener("DOMContentLoaded", () => {

    const apiUrl = "https://localhost:7164/api/CuadrosTecnicos";
    const authUrl = "https://localhost:7164/api/Auth/login";
    const tableBody = document.querySelector("#cuadros-table");
    const updateForm = document.querySelector("#update-form");
    const createForm = document.querySelector("#create-form");
    const jwtTokenDisplay = document.querySelector("#jwt-token-display");

    // Variable de control para evitar duplicados en el envío
    let isSubmitting = false;

    // Función para obtener el token JWT
    function getToken() {
        return fetch(authUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: "admin",
                password: "password"
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al obtener el token");
                }
                return response.json();
            })
            .then(data => {
                console.log("Token JWT obtenido:", data.token);
                localStorage.setItem("jwtToken", data.token); // Guardar el token en localStorage
                jwtTokenDisplay.textContent = data.token; // Actualizar el contenido del token en la página
                return data.token;
            })
            .catch(error => {
                console.error("Error al obtener el token JWT:", error);
                jwtTokenDisplay.textContent = "Error al obtener el token"; 
            });
    }

    // Función para hacer las solicitudes a la API con el token JWT
    function fetchWithToken(url, options = {}) {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            return getToken().then(token => {
                return fetch(url, {
                    ...options,
                    headers: {
                        ...options.headers,
                        "Authorization": `Bearer ${token}`
                    }
                });
            });
        } else {
            console.log("Usando token almacenado:", token);
            jwtTokenDisplay.textContent = token;
            return fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    "Authorization": `Bearer ${token}`
                }
            });
        }
    }

    // Función para obtener cuadros técnicos
    function getCuadrosTecnicos() {
        console.log("Obteniendo cuadros técnicos...");
        fetchWithToken(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al obtener cuadros técnicos");
                }
                return response.json();
            })
            .then(data => {
                console.log("Datos obtenidos de la API:", data);
                tableBody.innerHTML = "";
                data.forEach(cuadro => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                    <td>${cuadro.id}</td>
                    <td>${cuadro.nombre}</td>
                    <td>${cuadro.descripcion}</td>
                    <td>${cuadro.montoAsegurado}</td>
                    <td>${cuadro.prima}</td>
                    <td>
                        <button class="btn btn-outline-primary btn-sm" onclick="editCuadro(${cuadro.id})">Editar</button>
                        <button class="btn btn-outline-danger btn-sm" onclick="deleteCuadro(${cuadro.id})">Eliminar</button>
                    </td>
                `;
                    tableBody.appendChild(row);
                });
            })
            .catch(error => {
                console.error("Error al cargar los cuadros técnicos:", error);
            });
    }

    // Llamar la función al cargar la página
    getToken().then(getCuadrosTecnicos);

    // Función para editar un cuadro técnico
    window.editCuadro = (id) => {
        fetchWithToken(`${apiUrl}/${id}`)
            .then(response => response.json())
            .then(cuadro => {
                document.querySelector("#cuadro-id").value = cuadro.id;
                document.querySelector("#nombre").value = cuadro.nombre;
                document.querySelector("#descripcion").value = cuadro.descripcion;
                document.querySelector("#montoAsegurado").value = cuadro.montoAsegurado;
                document.querySelector("#prima").value = cuadro.prima;
            });
    };

    // Función para actualizar cuadro técnico
    updateForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (isSubmitting) return; // Evitar envíos duplicados
        console.log("Actualizando cuadro técnico...");
        isSubmitting = true;

        const id = document.querySelector("#cuadro-id").value;
        const nombre = document.querySelector("#nombre").value;
        const descripcion = document.querySelector("#descripcion").value;
        const montoAsegurado = document.querySelector("#montoAsegurado").value;
        const prima = document.querySelector("#prima").value;

        fetchWithToken(`${apiUrl}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id, nombre, descripcion, montoAsegurado, prima
            })
        })
            .then(() => {
                console.log("Cuadro técnico actualizado");
                getCuadrosTecnicos(); // Refresca la tabla automáticamente
                updateForm.reset(); // Limpia el formulario
            })
            .finally(() => {
                isSubmitting = false; // Permitir nuevos envíos
            });
    });

    // Función para añadir un cuadro técnico
    createForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (isSubmitting) return; // Evitar envíos duplicados
        console.log("Añadiendo cuadro técnico...");
        isSubmitting = true;

        const nombre = document.querySelector("#nombre-create").value;
        const descripcion = document.querySelector("#descripcion-create").value;
        const montoAsegurado = document.querySelector("#montoAsegurado-create").value;
        const prima = document.querySelector("#prima-create").value;

        fetchWithToken(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre, descripcion, montoAsegurado, prima
            })
        })
            .then(() => {
                console.log("Cuadro técnico añadido");
                getCuadrosTecnicos(); // Refresca la tabla automáticamente
                createForm.reset(); // Limpia el formulario
            })
            .finally(() => {
                isSubmitting = false; // Permitir nuevos envíos
            });
    });

    // Función para eliminar un cuadro técnico
    window.deleteCuadro = (id) => {
        fetchWithToken(`${apiUrl}/${id}`, {
            method: "DELETE"
        })
            .then(() => {
                console.log("Cuadro técnico eliminado");
                getCuadrosTecnicos(); // Refresca la tabla automáticamente
            })
            .catch(error => {
                console.error("Error al eliminar cuadro técnico:", error);
            });
    };
});
