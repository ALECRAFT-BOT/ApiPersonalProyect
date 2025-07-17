const z = require('zod'); // Importar Zod para validación de datos
const express = require('express');
const e = require('express');


const movieSchema = z.object({
      title: z.string({
        required_error: 'El título es requerido'
      }),
      year: z.number().int().min(1800).max(new Date().getFullYear()),
      director: z.string(),
      duration: z.number().int().positive(),
      poster: z.string().url({
        message: 'El póster debe ser una URL válida'
      }).endsWith('.jpg', '.jpeg', '.png', '.gif'),
      rate: z.number().min(0).max(10),
      genre: z.string().array(z.enum(['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance']))
    })

function validarPeliculaZod(object) {
    return movieSchema.safeParse(object);
}


function validatePartialMovie(input){
    return movieSchema.partial().safeParse(input);

}

module.exports = {validarPeliculaZod, validatePartialMovie};