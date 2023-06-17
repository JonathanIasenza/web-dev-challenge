import products from './products.js';
import stockPrices from './stock-price.js';

let carrito = [];
const divisa = '$';
const DOMitems = document.querySelector('#items');
const DOMcarrito = document.querySelector('#carrito');
const DOMtotal = document.querySelector('#total');
const DOMbotonVaciar = document.querySelector('#boton-vaciar');

document.addEventListener('DOMContentLoaded', function () {


function getProductDetails(productId) {
  const product = products.find(p => p.id === productId);
  const sku = product.skus[0].code;
  const stockPrice = stockPrices[sku];
  const price = stockPrice ? stockPrice.price : 0;
  const stock = stockPrice ? stockPrice.stock : 0;
  return { product, price, stock, sku };
}

function obtenerPrecio(sku) {
  const cerveza = products.find((cerveza) => cerveza.sku === sku);
  if (cerveza) {
    return cerveza.precio;
  }
  return null; 
}

function mostrarPrecio(sku) {
  const precio = obtenerPrecio(sku); // Obtener el precio según el SKU

  // Actualizar el precio en el detalle de la cerveza correspondiente
  const precioElement = document.getElementById(`beer-price-${sku}`);
  if (precioElement) {
    precioElement.textContent = precio;
  }
}


  function renderizarProductos(product, price) {
    const productElement = document.createElement('div');
    productElement.classList.add('card', 'col-sm-4');
  
    const productCardBody = document.createElement('div');
    productCardBody.classList.add('card-body');
  
    const productTitle = document.createElement('h5');
    productTitle.classList.add('card-title');
    productTitle.textContent = product.brand;
  
    const productImage = document.createElement('img');
    productImage.classList.add('img-fluid');
    productImage.src = product.image;
    productImage.alt = product.brand;
    productImage.addEventListener('click', () => {
    const productId = parseInt(productButton.getAttribute('marcador'));
      mostrarDetallesCerveza(productId);
      
    });
  
    const productPrice = document.createElement('p');
    productPrice.classList.add('card-text');
    productPrice.textContent = `${divisa}${(price / 100).toLocaleString('es-ES', { minimumFractionDigits: 2 })}`;
  
    const productButton = document.createElement('button');
    productButton.classList.add('btn', 'btn-primary', 'align-self-end');
    productButton.classList.add('boton-add');
    productButton.style.backgroundColor = '#FF9F24';
    productButton.style.border = 'none';
    productButton.textContent = '+';
    productButton.setAttribute('marcador', product.id);
    productButton.addEventListener('click', anadirProductoAlCarrito);
  
    productCardBody.appendChild(productTitle);
    productCardBody.appendChild(productImage);
    productCardBody.appendChild(productPrice);
    productCardBody.appendChild(productButton);
    productElement.appendChild(productCardBody);
  
    return productElement;
  }

  function mostrarDetallesCerveza(productId) {
    const { product, price, stock } = getProductDetails(productId);
    const beer = products.find(product => product.id === productId);
    const beerDetailsElement = document.getElementById('items');
    const skuButtons = product.skus.map((sku) => {
      const skuButton = document.createElement('button');
      skuButton.classList.add('btn', 'btn-dark', 'sku-button');
      skuButton.textContent = sku.name;
      skuButton.setAttribute('sku', sku.code);
      skuButton.addEventListener('click', () => {
        const sku = skuButton.getAttribute('sku');
        mostrarPrecio(sku);
      });
      return skuButton;
    });
  
    if (beerDetailsElement) {
      beerDetailsElement.innerHTML = `
        <h4 style="text-align:center">Detail</h4>
        <img style="width:15%; margin:auto" src="${beer.image}" alt="${beer.brand}"/>
        <h2>${beer.brand}</h2>
        <p>Origin: ${beer.origin} | Stock: ${stock}</p>
        <h2 style="text-align:right; color:orange">${divisa}${(price / 100).toLocaleString('es-ES', { minimumFractionDigits: 2 })}</h2>
        <b>Description</b>
        <p>${beer.information}</p>
        <p> Style: ${beer.style}</p>
        <p>Subestilo: ${beer.substyle}</p>
        <p>ABV: ${beer.abv}</p>
        <p>Size:</p>
      `;
      skuButtons.forEach((button) => {
        beerDetailsElement.appendChild(button);
      });
    }
  }
  

  function renderizarCarrito() {
    DOMcarrito.textContent = '';
    const carritoSinDuplicados = [...new Set(carrito)];
    carritoSinDuplicados.forEach((item) => {
      const miItem = getProductDetails(parseInt(item));
      const numeroUnidadesItem = carrito.reduce((total, itemId) => {
        return itemId === item ? total += 1 : total;
      }, 0);
      const miNodo = document.createElement('li');
      miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
      const price = miItem.price;
      miNodo.textContent = `${numeroUnidadesItem} x ${miItem.product.brand} - ${divisa}${(price / 100).toLocaleString('es-ES', { minimumFractionDigits: 2 })}`;
      const miBoton = document.createElement('button');
      miBoton.classList.add('btn', 'btn-danger', 'mx-8');
      miBoton.textContent = 'X';
      miBoton.style.marginLeft = '1rem';
      miBoton.style.backgroundColor = '#FF9F24';
      miBoton.style.border = 'none';
      miBoton.dataset.item = item;
      miBoton.addEventListener('click', borrarItemCarrito);
      miNodo.appendChild(miBoton);
      DOMcarrito.appendChild(miNodo);
    });
    DOMtotal.textContent = calcularTotal();
  }

  function anadirProductoAlCarrito(evento) {
    carrito.push(evento.target.getAttribute('marcador'))
    renderizarCarrito();
  }

  function borrarItemCarrito(evento) {
    const id = evento.target.dataset.item;
    carrito = carrito.filter((carritoId) => {
      return carritoId !== id;
    });
    renderizarCarrito();
  }

  function calcularTotal() {
    const total = carrito.reduce((total, item) => {
      const miItem = getProductDetails(parseInt(item));
      return total + miItem.price;
    }, 0);

    const formattedTotal = (total / 100).toLocaleString('es-ES', { style: 'currency', currency: 'USD' });
    return formattedTotal;
  }
  function vaciarCarrito() {
    carrito = [];
    renderizarCarrito();
  }

  DOMbotonVaciar.addEventListener('click', vaciarCarrito);
  const searchInput = document.getElementById('searchInput');

  searchInput.addEventListener('input', function (event) {
    const searchTerm = event.target.value.toLowerCase();
    const filteredProducts = products.filter(product => product.brand.toLowerCase().includes(searchTerm));
    renderProducts(filteredProducts);
  });

  function renderProducts(productsArray = products) {
    DOMitems.innerHTML = '';
    productsArray.forEach(prod => {
      const { product, price, stock } = getProductDetails(prod.id);
      const productElement = renderizarProductos(product, price, stock);
      DOMitems.appendChild(productElement);
    });
  }

  const btnAll = document.querySelector('#btn-all');
  const btnBeers = document.querySelector('#btn-beers');
  const btnWine = document.querySelector('#btn-wine');
  const itemsContainer = document.querySelector('#items');

  function filtrarProductosPorCategoria(categoria) {
    return products.filter(producto => {
      return producto.category === categoria;
    });
  }

  function renderizarProductosFiltrados(productosFiltrados) {
    itemsContainer.innerHTML = '';
    productosFiltrados.forEach(producto => {
      const { product, price, stock } = getProductDetails(producto.id);
      const productElement = renderizarProductos(product, price, stock);
      itemsContainer.appendChild(productElement);
    });
  }

  btnAll.addEventListener('click', () => {
    renderProducts();
  });

  btnBeers.addEventListener('click', () => {
    renderProducts();
  });

  btnWine.addEventListener('click', () => {
    itemsContainer.innerHTML = '';
    const mensajeElement = document.createElement('p');
    mensajeElement.textContent = 'Sorry, There are no wines currently in the store :( ';
    itemsContainer.appendChild(mensajeElement);
  });


  function getStockPrice(code) {
    const product = stockPrices[code];

    if (product) {
      return {
        stock: product.stock,
        price: product.price
      };
    } else {
      return null;
    }
  }

  renderProducts();

});