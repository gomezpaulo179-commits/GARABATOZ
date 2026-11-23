//punto de entrada del servidor nodejs de GARABATOZ
import express from 'express';
import cors from 'cors';
import config from './src/config/config.js';
import DbService from './src/services/DbService.js';
import EstadoController from './src/controllers/EstadoController.js';
import estadoRoutes from './src/routes/estadoRoutes.js';

const app = express();

//---------------- middlewares globales ----------------
app.use(cors({ origin: config.urlFrontend }));   // solo dejamos entrar peticiones de nuestro angular
app.use(express.json());                          // para poder leer el body en JSON (req.body)

//---------------- servicios y controladores ----------------
const dbService = new DbService(config.mongo.uri, config.mongo.nombreDb);
const estadoController = new EstadoController(dbService);

//---------------- rutas ----------------
app.use('/api/estado', estadoRoutes(estadoController));

//---------------- arranque: primero mongo, luego el servidor ----------------
try {
    await dbService.conectar();
    app.listen(config.puerto, () => console.log(`🚀 servidor GARABATOZ en http://localhost:${config.puerto}`));
} catch (error) {
    console.error('❌ no se pudo conectar a MongoDB Atlas:', error.message);
    process.exit(1);
}
