let productCount = 0;
const carritoProducts = [];

const productContainer = document.getElementById('product-container');
const carritoButton = document.querySelector('.carrito');
const modalBody = document.getElementById('modal-body-list');
const carritoModal = new bootstrap.Modal(document.getElementById('carritoModal'));

fetch('https://dummyjson.com/products')
  .then(response => response.json())
  .then(data => {
    data.products.forEach(product => {
      const card = document.createElement('div');
      card.classList.add('col-md-4', 'mb-4');
      card.innerHTML = `
        <div class="card" style="width: 18rem;">
          <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}">
          <div class="card-body">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text">${product.description}</p>
            <p class="card-text"><strong>Precio:</strong> $${product.price}</p>
            <a href="#" class="btn btn-primary" data-product-title="${product.title}" data-product-price="${product.price}" data-product-thumbnail="${product.thumbnail}">Comprar</a>
          </div>
        </div>
      `;
      productContainer.appendChild(card);
    });

    const comprarButtons = document.querySelectorAll('.card .btn-primary');
    comprarButtons.forEach(button => {
      button.addEventListener('click', () => {
        const productTitle = button.getAttribute('data-product-title');
        const productPrice = parseFloat(button.getAttribute('data-product-price'));
        const productThumbnail = button.getAttribute('data-product-thumbnail');

        carritoProducts.push({
          title: productTitle,
          price: productPrice,
          thumbnail: productThumbnail,
        });

        productCount++;
        actualizarCarrito();

        Swal.fire({
          title: 'Producto agregado al carrito',
          text: `Has agregado ${productTitle} al carrito`,
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });
      });
    });

    carritoButton.addEventListener('click', () => {
      mostrarCarrito();
      carritoModal.show();
    });
  })
  .catch(error => console.error('Error:', error));

function actualizarCarrito() {
  carritoButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-cart4" viewBox="0 0 16 16">
      <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5M3.14 5l.5 2H5V5zM6 5v2h2V5zm3 0v2h2V5zm3 0v2h1.36l.5-2zm1.11 3H12v2h.61zM11 8H9v2h2zM8 8H6v2h2zM5 8H3.89l.5 2H5zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0"/>
    </svg>
    <span class="badge bg-secondary">${productCount}</span>
  `;
}

function mostrarCarrito() {
  modalBody.innerHTML = '';
  carritoProducts.forEach((product, index) => {
    const productItem = document.createElement('li');
    productItem.classList.add('list-group-item');
    productItem.innerHTML = `
      <img src="${product.thumbnail}" alt="${product.title}" width="50" height="50">
      <span>${product.title}</span>
      <span>$${product.price.toFixed(2)}</span>
      <button class="btn btn-danger" onclick="eliminarProducto(${index})">Eliminar</button>
    `;
    modalBody.appendChild(productItem);
  });
}

function eliminarProducto(index) {
  carritoProducts.splice(index, 1);
  productCount--;
  actualizarCarrito();
  mostrarCarrito();
}
