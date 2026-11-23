//RUTAS: solo dicen "que url" va a "que metodo del controlador", sin logica
import { Router } from 'express';

export default function estadoRoutes(estadoController) {
    const router = Router();

    router.get('/', estadoController.comprobarEstado());   // GET /api/estado

    return router;
}
