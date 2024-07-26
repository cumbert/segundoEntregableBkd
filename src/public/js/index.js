
const socket = io()
socket.emit('message',"Soy el mensaje enviado.")



socket.on('productUpdate', (products) => {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '' // Limpiar la lista actual

    // Renderizar la nueva lista de productos
    products.forEach(product => {
        const li = document.createElement('li')
        li.setAttribute('data-id', product.pid)
        li.textContent = `${product.title} - $${product.price}`
        productList.appendChild(li)
    })
})
