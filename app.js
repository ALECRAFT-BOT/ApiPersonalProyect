const express = require('express');
const peliculasJson = require('./json/movies.json'); // 
const app = express();
const crypto = require('node:crypto');
const {validarPeliculaZod, validatePartialMovie} = require('./schema/movies.js'); // Importar la función de validación
const cors = require('cors');
app.use(express.json());
app.disable('x-powered-by'); // Deshabilitar el encabezado x-powered-by

app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://127.0.0.1:5500',
      'http://localhost:3000',
      'https://peliculas.com',
      'https://apipersonalproyect.onrender.com'
    ]

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
}))


app.get('/', (req, res) => {
    res.status(200).send('<h1>Bienvenido a mi servidor</h1>');
})

app.get('/peliculas', (req, res) => {
    const { genre, year } = req.query; // Obtener el género de la consulta

    let peliculasFiltradas = peliculasJson;

    if(year){
        peliculasFiltradas = peliculasFiltradas.filter(pelicula => pelicula.year === parseInt(year));
    }

    if (genre) {
        peliculasFiltradas = peliculasFiltradas.filter(p => p.genre.includes(genre));
    }
    
    if(!genre && !year){
        res.status(200).json(peliculasJson);
        return;
    }

    if(peliculasFiltradas.length === 0) {
        return res.status(404).json({
            error: 'No se encontraron películas'
        });
    }

    if (peliculasFiltradas.length > 0) {
        return res.status(200).json(peliculasFiltradas);
    }
});

app.get('/peliculas/:id', (req, res) => {
    const {id} = req.params
    const pelicula = peliculasJson.find(p => p.id === id);

    if(!pelicula) {
        return res.status(404).json({ error: 'Pelicula no encontrada' });
    }else
    {
        res.status(200).json(pelicula);
    }
})


app.post('/peliculas', (req, res) => {
    const nuevaPelicula = req.body;
    let PeliculasTemporales = peliculasJson; 
    const errores = validarPeliculaZod(nuevaPelicula);
     // Validar la nueva película
    if (!errores.success) {
        return res.status(402).json({
            error: JSON.parse(errores.error.message)
        });
    }

    const newPelicula = {
        id: crypto.randomUUID(),
        ...nuevaPelicula
    };

    PeliculasTemporales.push(newPelicula);
    res.status(201).json(newPelicula);
})

app.delete('/peliculas/:id', (req, res) => {
    const {id} = req.params;
    const peliculaIndex = peliculasJson.findIndex(p => p.id === id);

    if(peliculaIndex === -1) {
        return res.status(404).json({ error: 'Pelicula no encontrada' });
    }

    peliculasJson.splice(peliculaIndex, 1); // Eliminar la película del array
    res.status(204).json({
        message: 'Pelicula eliminada correctamente'
    }); // Respuesta sin contenido

})


app.patch('/peliculas/:id', (req, res) => {
    
    const nuevosDatos = validatePartialMovie(req.body);
    if (!nuevosDatos.success) {
        return res.status(402).json({
            error: JSON.parse(nuevosDatos.error.message)
        });
    }
    
    const {id} = req.params;
    const peliculaIndex = peliculasJson.findIndex(p => p.id === id);


    if(peliculaIndex === -1) {
        return res.status(404).json({ error: 'Pelicula no encontrada' });
    }

    const peliculaActualizada = {
        ...peliculasJson[peliculaIndex],
        ...nuevosDatos.data
    };
    
    peliculasJson[peliculaIndex] = peliculaActualizada;

    res.status(200).json(peliculaActualizada);

})


const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
    console.log(`servidor iniciado en el puerto ${PORT}`);
    console.log(`la direccion del servidor es http://localhost:${PORT}`);
});