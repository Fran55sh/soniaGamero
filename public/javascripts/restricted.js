const propiedadesContainer = document.getElementById("propiedades-container");
function renderPropiedades(propiedades) {
  propiedades.forEach((propiedad) => {
    const propiedadElement = document.createElement("div");
    propiedadElement.innerHTML = `
                <h2>${propiedad.nombre}</h2>
                <p>${propiedad.descripcion}</p>
                <p>Precio: $${propiedad.precio}</p>
                <p>Tipo: ${propiedad.tipo.nombre}</p>
                <p>Condición: ${propiedad.condicion.nombre}</p>
                <hr>
            `;
    propiedadesContainer.appendChild(propiedadElement);
  });
}

async function getPropiedades() {
  await fetch("api/propiedades")
    .then((response) => response.json())
    .then((data) => renderPropiedades(data));
}


// Agrega un listener al evento submit del formulario
document.getElementById("propiedadForm").addEventListener("submit", (event) => {
  event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

  // Obtiene los valores ingresados por el usuario
  const nombre = document.getElementById("nombre").value;
  const descripcion = document.getElementById("descripcion").value;
  const precio = document.getElementById("precio").value;
  const esDestacado = document.getElementById("esDestacado").checked;
  const tipo = document.getElementById("tipo").value;
  const condicion = document.getElementById("condicion").value;

  // Realiza una solicitud HTTP al servidor para crear la nueva propiedad
  fetch("/crear-propiedad", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nombre,
      descripcion,
      precio,
      esDestacado,
      tipo,
      condicion,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert("Propiedad creada exitosamente", data);
      // Puedes redirigir al usuario a otra página o realizar alguna acción adicional después de crear la propiedad
    })
    .catch((error) => {
      console.error("Error al crear la propiedad:", error);
      alert("Error al crear la propiedad");
    });
});


