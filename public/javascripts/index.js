
// Find elements containing "En Venta" and add the "en-venta" class

document.querySelectorAll('.card-condition').forEach((element) => {
    if (element.textContent.includes('Venta')) {
      element.classList.add('for-sale');
    } else if (element.textContent.includes('Alquiler')) {
      element.classList.add('for-rent');
    }
  });



  var buttons = document.querySelectorAll('.search-card-button');
  console.log(buttons)
  buttons.forEach(function(button) {
    button.addEventListener('click', function() {
      // Obtén el valor del atributo "data" del botón
      var dataValue = button.getAttribute('data-propiedad-tipo');
      
      // Crea la URL con el valor de dataValue
      var url = '/api/propiedades/' + dataValue;

      console.log(url)
      console.log(dataValue)


// Redirige a la nueva página con la URL
window.location.href = url;
    })})
  
  





  