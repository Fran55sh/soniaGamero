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

async function getCourses() {
  await fetch("api/propiedades")
    .then((response) => response.json())
    .then((data) => renderPropiedades(data));
}

// Agrega un listener al evento submit del formulario
const formulario = document.getElementById("propiedadForm")
formulario.addEventListener("submit", (event) => {
  event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

  // Obtiene los valores ingresados por el usuario
  // Obtén los archivos de imagen seleccionados
  const fotosInput = document.getElementById('fotos'); // Reemplaza 'fotos' con el ID del campo de entrada de imágenes en tu formulario HTML
  let fotos = fotosInput.files;
  console.log(fotos)
  const nombre = document.getElementById("nombre").value;
  const descripcion = document.getElementById("descripcion").value;
  const precio = document.getElementById("precio").value;
  const esDestacado = document.getElementById("esDestacado").checked;
//   const foto = document.getElementById("foto").value;
  const tipo = document.getElementById("tipo").value;
  const condicion = document.getElementById("condicion").value;

  const array = [
    {
      nombre: 'Elemento 1',
      rutaImagen: 'ruta/imagen1.jpg'
    },
    {
      nombre: 'Elemento 2',
      rutaImagen: 'ruta/imagen2.jpg'
    },
    {
      nombre: 'Elemento 3',
      rutaImagen: 'ruta/imagen3.jpg'
    },
    {
      nombre: 'Elemento 4',
      rutaImagen: 'ruta/imagen4.jpg'
    },
    {
      nombre: 'Elemento 5',
      rutaImagen: 'ruta/imagen5.jpg'
    }
  ];
  
  foto = JSON.stringify(array);
  // Realiza una solicitud HTTP al servidor para crear la nueva propiedad
  fetch("/crear-propiedad", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: nombre,
    descripcion,
    precio,
    esDestacado,
    foto,
    tipo,
    condicion,

    }).then((response) => response.json())
    .then((data) => {
      alert("Propiedad creada exitosamente", data);
      // Puedes redirigir al usuario a otra página o realizar alguna acción adicional después de crear la propiedad
    })
    .catch((error) => {
      console.error( "Error al crear la propiedad:", error);
      alert("Error al crear la propiedad");
    });
});
