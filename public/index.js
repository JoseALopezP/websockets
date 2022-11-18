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

function render(data) {
    const html = data.map((element) => {
        return(`
            <div style="color: brown">
            <strong style="color: blue">${element.email}</strong> [${element.time}] :
            <em style="color: green">${element.text}</em> </div>
            `)
    }).join(" ");
    document.getElementById('messagesList').innerHTML = html;
  }

socket.on('messages', function(data) { render(data); });

function addMessage(e){
    const message = {
        email: document.getElementById('email').value,
        text: document.getElementById('text').value
    };
    if (message.email) {
      socket.emit('new-message', message);
    } else {
      alert('Please, introduce email');
    }
    return false;
}