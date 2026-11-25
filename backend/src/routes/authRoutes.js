//RUTAS de autenticacion: solo dicen "que url" va a "que metodo del controlador", sin logica
import { Router } from 'express';

export default function authRoutes(authController) {
    const router = Router();

    router.post('/registro', authController.registro());   // POST /api/auth/registro

    return router;
}
