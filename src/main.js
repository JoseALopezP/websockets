const express = require('express');
const app = express();
const Container = require('./container/containerFs.js');
const {Server: HttpServer} = require('http');
const {Server: IOServer} = require('socket.io');

const port = 8080;
const publicRoot = './public';

//json
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

//Public
app.use(express.static(publicRoot));


const products = new Container('./src/db/products.txt');


app.get('/', (req, res) => {
    res.send('index.html', {root: publicRoot});
});



//Server
const server = httpServer.listen(port, () => {
    console.log(`Server listening to: ${server.address().port}`);
});

server.on('error', error => console.log(`Error: ${error}`));

io.on('connection', (socket) => {
    console.log('New client connected!');

    const productsList = products.getAll();
    socket.emit('product', productsList);

    socket.on('new-product', (data) =>{
        products.save(data);
        const newProductsList = products.getAll();
        io.socket.emit('product', newProductsList);
    })
})