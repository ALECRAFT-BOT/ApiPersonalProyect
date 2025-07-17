const http = require('node:http');
const fs = require('fs');
const DittoJson = require('../pokemon/ditto.json');
const path = require('node:path');

const processRequest = (req, res) => {
const {method, url} = req;
const imagePath = path.join(__dirname, 'public', 'images', 'imagen-linda.jpg');

switch (method) {
    case 'GET':
        switch (url) {
            case '/':
               res.setHeader('Content-Type', 'text/html');
                return res.end('<h1>Bienvenido a mi servidor</h1>');
            case '/contact':
                res.setHeader('Content-Type', 'text/html');
                return res.end('<h1>pagina de contacto</h1>');
            case '/imagen-ejemplo':
                fs.readFile(imagePath, (error, data) => {
                if(error){
                res.statusCode = 500;
                return res.end('<h1>internal server error</h1>');
                }else{
                res.statusCode = 200;
                res.writeHead(200, {'Content-Type': 'image/jpg'});
                res.end(data);
                }   
                });
                return;
            case '/pokemon/ditto':
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify(DittoJson));
            default:
                res.statusCode = 404;
                res.writeHead(404, {'Content-Type': 'text/html', 'charset': 'utf-8'});
                return res.end('<h1>404 Not Found1</h1>');
        }
    break;

    case 'POST':
        switch (url) {
            case '/pokemon': {
            let body = '';

            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', () => {
                const data = JSON.parse(body);
                res.writeHead(201, {'Content-Type': 'application/json; charset=utf-8' });
                data.timestamp = Date.now();
                res.end(JSON.stringify(data));
            });
            break;
            }

            default:
                res.statusCode = 404;
                res.writeHead(404, {'Content-Type': 'text/html', 'charset': 'utf-8'});
                return res.end('<h1>404 Not Found</h1>');
        }

             
        }
        
    }
  
const server = http.createServer(processRequest);

server.listen(52132, () => {
    console.log('servidor iniciado en el puerto 52132');
    console.log('la direccion del servidor es http://localhost:52132');
});