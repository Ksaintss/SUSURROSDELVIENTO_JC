// ==========================================
// CARRITO DE COMPRAS - SUSURROS DEL VIENTO
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar carrito desde localStorage o vacío
  let carrito = JSON.parse(localStorage.getItem('carritoGhibli')) || [];

  // Formateador de moneda en Pesos Colombianos (COP)
  const formatearCOP = (valor) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  // Precios sugeridos para los productos del sitio
  const preciosProductos = {
    'Calcifer, el fuego mágico': 45000,
    'Totoro, el guardián del bosque': 60000,
    'San, la Princesa Mononoke': 55000,
    'La Valentía de Chihiro': 50000,
    'Haku (El Espíritu del Río)': 65000,
    'La Aventura de Kiki': 48000,
    'El Valor de Nausicaä': 52000,
    'Ponyo en el Mar': 42000,
    'Jiji, el Compañero Fiel': 38000
  };

  // 1. Asignar eventos a los botones de "Agregar al carrito"
  const botonesAgregar = document.querySelectorAll('.card .btn-primary, .card .btn-outline-primary');
  
  botonesAgregar.forEach((boton) => {
    boton.addEventListener('click', (e) => {
      e.preventDefault();
      
      const tarjeta = e.target.closest('.card');
      if (!tarjeta) return;

      const titulo = tarjeta.querySelector('.card-title')?.innerText.trim() || 'Artesanía Ghibli';
      const imagenSrc = tarjeta.querySelector('.card-img-top')?.getAttribute('src') || 'assets/img/totoro.jpg';
      const precio = preciosProductos[titulo] || 45000;

      agregarAlCarrito(titulo, precio, imagenSrc);
    });
  });

  // 2. Función para agregar producto al carrito
  function agregarAlCarrito(nombre, precio, imagen) {
    const existe = carrito.find(item => item.nombre === nombre);

    if (existe) {
      existe.cantidad++;
    } else {
      carrito.push({
        id: Date.now(),
        nombre: nombre,
        precio: precio,
        imagen: imagen,
        cantidad: 1
      });
    }

    guardarYActualizar();
    mostrarNotificacion(`¡${nombre} añadido al carrito!`);
  }

  // 3. Eliminar producto del carrito
  window.eliminarDelCarrito = function(id) {
    carrito = carrito.filter(item => item.id !== id);
    guardarYActualizar();
  };

  // 4. Cambiar cantidad de producto
  window.cambiarCantidad = function(id, cambio) {
    const producto = carrito.find(item => item.id === id);
    if (producto) {
      producto.cantidad += cambio;
      if (producto.cantidad <= 0) {
        eliminarDelCarrito(id);
      } else {
        guardarYActualizar();
      }
    }
  };

  // 5. Guardar en localStorage y actualizar la interfaz
  function guardarYActualizar() {
    localStorage.setItem('carritoGhibli', JSON.stringify(carrito));
    actualizarContadorHeader();
  }

  // 6. Actualizar el contador total en el icono del menú
  function actualizarContadorHeader() {
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    let badge = document.querySelector('.cart-badge-count');
    
    if (!badge) {
      const botonForm = document.querySelector('a[href="formulario.html"]');
      if (botonForm) {
        botonForm.classList.add('position-relative');
        badge = document.createElement('span');
        badge.className = 'cart-badge-count position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger';
        botonForm.appendChild(badge);
      }
    }

    if (badge) {
      badge.textContent = totalItems;
      badge.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }
  }

  // 7. Notificación flotante (Toast)
  function mostrarNotificacion(mensaje) {
    let toast = document.getElementById('toast-notificacion');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-notificacion';
      toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #4a7c59;
        color: white;
        padding: 12px 24px;
        border-radius: 25px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 9999;
        font-weight: 600;
        transition: opacity 0.3s ease;
      `;
      document.body.appendChild(toast);
    }

    toast.textContent = mensaje;
    toast.style.opacity = '1';

    setTimeout(() => {
      toast.style.opacity = '0';
    }, 2500);
  }

  // Inicializar contador al cargar la página
  actualizarContadorHeader();
});