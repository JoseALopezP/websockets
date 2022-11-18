const socket = io();

function renderProduct(product){
    const row = document.createElement('tr');
    const title = document.createElement('td');
    title.innerHTML = product.title;
    row.appendChild(title);

    const price = document.createElement('td');
    price.innerHTML = product.price;
    row.appendChild(price);

    const thumbnail = document.createElement('td');
    const img = document.createElement('img');
    img.setAttribute("src", product.thumbnail);
    thumbnail.appendChild(img);
    row.appendChild(thumbnail);

    document.getElementById('productsListTable').appendChild(row);
}

socket.on('new-connection', data => {
    data.forEach(element => {
        renderProduct(element);
    });
});

socket.on('product', data => {
    renderProduct(data);
});

function addProduct(element) {
    const product ={
        title: document.getElementById("title").value,
        price: document.getElementById("price").value,
        thumbnail: document.getElementById("thumbnail").value,
    }
    socket.emit('new-product', product);
    return false;
}