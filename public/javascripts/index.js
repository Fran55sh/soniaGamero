// Find elements containing "En Venta" and add the "en-venta" class
document.querySelectorAll('.card-condition').forEach((element) => {
    if (element.textContent.includes('En Venta')) {
      element.classList.add('for-sale');
    } else if (element.textContent.includes('En Alquiler')) {
      element.classList.add('for-rent');
    }
  });
  