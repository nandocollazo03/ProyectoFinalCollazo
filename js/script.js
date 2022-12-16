// Variables
const carrito = document.querySelector('#carrito');
const listaArticulos = document.querySelector('#lista-articulos');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const btnVaciarCarrito = document.querySelector('#vaciar-carrito'); 

let articulosCarrito = [];

const cargarAPIBtn = document.querySelector('#cargarAPI');

cargarEventos();

function cargarEventos() {
    
    listaArticulos.addEventListener('click', agregarArticulo);

    
    carrito.addEventListener('click', eliminarArticulo);

    
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse( localStorage.getItem('carrito') ) || [];

        carritoHTML();
    })

    
    btnVaciarCarrito.addEventListener('click', vaciarCarrito);

    
    cargarAPIBtn.addEventListener('click', obtenerDatos);
}


function agregarArticulo(e) {
    e.preventDefault();
    if(e.target.classList.contains('agregar-carrito')) {
         const articulo = e.target.parentElement.parentElement;
         leerDatosArticulo(articulo);

         Toastify({

            text: "Agregaste un artículo al carrito",
            duration: 1500,
            close: true,
            gravity: "bottom"
            
            }).showToast();
    }
}


function leerDatosArticulo(articulo) {
    const infoArticulo = {
         imagen: articulo.querySelector('img').src,
         titulo: articulo.querySelector('h4').textContent,
         precio: articulo.querySelector('.precio').textContent,
         id: articulo.querySelector('a').getAttribute('data-id'), 
         cantidad: 1
    }


    if( articulosCarrito.some( articulo => articulo.id === infoArticulo.id ) ) { 
         const articulos = articulosCarrito.map( articulo => {
              if( articulo.id === infoArticulo.id ) {
                articulo.cantidad++;
                    return articulo;
               } else {
                    return articulo;
            }
         })
         articulosCarrito = [...articulos];
    }  else {
         articulosCarrito = [...articulosCarrito, infoArticulo];
    }

    carritoHTML();
}


function eliminarArticulo(e) {
    e.preventDefault();
    if(e.target.classList.contains('borrar-articulo') ) {
         const articuloId = e.target.getAttribute('data-id')
         
         articulosCarrito = articulosCarrito.filter(articulo => articulo.id !== articuloId);

         carritoHTML();
    }
}

function carritoHTML() {

    vaciarCarrito();

    articulosCarrito.forEach(articulo => {
        const { imagen, titulo,  precio, cantidad} = articulo; 
        const row = document.createElement('tr');
         row.innerHTML = `
              <td>  
                   <img src="${imagen}" width=100>
              </td>
              <td>${titulo}</td>
              <td>${precio}</td>
              <td>${cantidad} </td>
              <td>
                   <a href="#" class="borrar-articulo" data-id="${articulo.id}">X</a>
              </td>
         `;
         contenedorCarrito.appendChild(row);
    });

    sincronizarStorage();
}

function vaciarCarrito() {
    while(contenedorCarrito.firstChild) {
         contenedorCarrito.removeChild(contenedorCarrito.firstChild);
     }
}


function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito))
}



function obtenerDatos() {
    fetch('https://v2.jokeapi.dev/joke/Programming?lang=es&type=twopart') 
        .then( respuesta => {
            return respuesta.json()
        }) 
        .then(resultado => {
            mostrarHTML(resultado)
        })
        .catch( error => {
            console.log(error);
        })
}

function mostrarHTML(datos) {
    
    const contenido = document.querySelector('.contenido-chiste');

    let html = '';

        html += `
            <p>${datos.setup} ${datos.delivery}</p>
        `

    contenido.innerHTML = html;
}