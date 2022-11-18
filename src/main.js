const express = require('express');
const moment = require('moment');
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
const messages = new Container('./src/db/messages.txt');

app.get('/', (req, res) => {
    res.send('index.html', { root: publicRoot });
});



//Server
const server = httpServer.listen(port, () => {
    console.log(`Server listening to: ${server.address().port}`);
});

server.on('error', error => console.log(`Error: ${error}`));


io.on('connection', async(socket) => {
    console.log('New client connected!');

    const productsList = await products.getAll();
    socket.emit('new-connection', productsList);

    socket.on('new-product', (data) =>{
        products.save(data);
        io.sockets.emit('product', data);
    });

    const messagesList = await messages.getAll();
    socket.emit('messages', messagesList);

    socket.on('new-message', async data => {
        data.time = moment(new Date()).format('DD/MM/YYYY hh:mm:ss');
        await messages.save(data);
        const messagesList = await messages.getAll();
        io.sockets.emit('messages', messagesList);
    });
});