const express = require('express');
const DittoJson = require('./pokemon/ditto.json');
const app = express();

const PORT = process.env.PORT ?? 3000;

app.disable('x-powered-by'); // Deshabilitar el encabezado x-powered-by

app.use('/pokemon', (req, res, next)=> {
    if(req.method !== 'POST') return next();
    if(req.headers['content-type'] !== 'application/json') return next();

    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        const data = JSON.parse(body);
        data.timestamp = Date.now();
        res.body = data;
    next();
});
    
})



app.get('/', (req, res) => {
    res.status(200).send('<h1>Bienvenido a mi servidor</h1>');
})

app.get('/pokemon/ditto', (req, res) => {
    res.json(DittoJson)
})

app.post('/pokemon', (req, res) => {
    res.status(201).json(req.body);
})

app.use((req, res) => {
    res.status(404).send('<h1>404 Not Found</h1>');
})



app.listen(PORT, () => {
    console.log(`servidor iniciado en el puerto ${PORT}`);
    console.log(`la direccion del servidor es http://localhost:${PORT}`);
})