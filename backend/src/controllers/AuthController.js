//CONTROLADOR de autenticacion: registro (y en los siguientes pasos: login y verificarAccessToken)
//      router ----> AuthController ----> DbService ======> MongoDB Atlas
import bcrypt from 'bcryptjs';
import Cliente from '../models/Cliente.js';

export default class AuthController {
    constructor(dbService) {
        this.dbService = dbService;
    }

    //POST /api/auth/registro
    //body: { nombre, apellidos, email, password, telefono?, aceptaPrivacidad, aceptaNovedades? }
    registro() {
        return async (req, res) => {
            try {
                const { nombre, apellidos, email, password, telefono, aceptaPrivacidad, aceptaNovedades } = req.body ?? {};   // ?? {} por si llega sin body

                //1. VALIDAR: nunca te fies de lo que llega del cliente (se puede saltar el formulario y mandar cualquier cosa)
                const error = this._validarRegistro({ nombre, apellidos, email, password, aceptaPrivacidad });
                if (error) {
                    return res.status(400).json({ ok: false, mensaje: error });
                }

                //2. CIFRAR la password con bcrypt: en mongo nunca se guarda la password real, solo su "huella" (hash)
                //   el 10 es el coste: cuantas veces se repite el cifrado (mas alto = mas seguro pero mas lento)
                const passwordCifrada = await bcrypt.hash(password, 10);

                //3. CONSTRUIR el cliente con el modelo (aqui el email ya queda en minusculas y sin espacios)
                const cliente = Cliente.crear({ nombre, apellidos, email, password: passwordCifrada, telefono, aceptaNovedades: aceptaNovedades === true });

                //4. COMPROBAR que el email no esta ya registrado
                const existe = await this.dbService.findOne('clientes', { 'cuenta.email': cliente.cuenta.email });
                if (existe) {
                    return res.status(409).json({ ok: false, mensaje: 'Ya existe una cuenta con ese email' });
                }

                //5. GUARDAR en mongo
                const resultado = await this.dbService.insertOne('clientes', cliente);

                //6. RESPONDER (sin mandar nunca la password de vuelta)
                res.status(201).json({ ok: true, mensaje: 'Cuenta creada correctamente', idCliente: resultado.insertedId });

            } catch (error) {
                console.error('error en registro:', error.message);
                res.status(500).json({ ok: false, mensaje: 'Error en el servidor al crear la cuenta' });
            }
        };
    }

    //metodo "privado" (por convenio empieza por _): devuelve el texto del primer error, o null si todo esta bien
    _validarRegistro({ nombre, apellidos, email, password, aceptaPrivacidad }) {
        if (!nombre?.trim() || !apellidos?.trim()) return 'El nombre y los apellidos son obligatorios';
        if (!email?.trim()) return 'El email es obligatorio';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'El email no tiene un formato valido';
        if (!password || password.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
        if (aceptaPrivacidad !== true) return 'Debes aceptar la politica de privacidad';
        return null;
    }
}
