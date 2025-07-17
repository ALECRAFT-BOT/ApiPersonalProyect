const { error } = require('node:console');
const http = require('node:http');
const fs = require('node:fs');

const server = http.createServer((req, res) => {
    console.log('peticion recibida recibida');
    if(req.url === '/') {
        res.writeHead(200, {'Content-Type': 'text/html', 'charset': 'utf-8'}),
        res.end('<h2>Hola, mundo!</h2>');
    }else if(req.url === '/contacto') {
        res.writeHead(200, {'Content-Type': 'text/html', 'charset': 'utf-8'}),
        res.end('<h2>Esta es la pagina de contacto</h2>')
    }else if(req.url === '/imagen-ejemplo') {
        fs.readFile('./public/images/imagen-linda.jpg', (error, data) => {
        if(error){
            res.statusCode = 500;
            res.end('<h1>internal server error</h1>');
        }else{
            res.writeHead(200, {'Content-Type': 'image/jpg'});
        res.end(data);
        }
    });
    }
});

server.listen(52132, () => {
    //const serverAddress = server.address();
    //console.log(`servidor iniciado en el puerto ${serverAddress.port}`);
    //console.log(`la direccion del servidor es http://localhost:${serverAddress.port}`);
    console.log('servidor iniciado en el puerto 52132');
    console.log('la direccion del servidor es http://localhost:52132');
});

