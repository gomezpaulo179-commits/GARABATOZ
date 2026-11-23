//CONTROLADOR de prueba: dice si el servidor y la conexion a mongo funcionan
//mismo patron que pide el profe: cada metodo DEVUELVE la funcion (req,res) que usa el router
export default class EstadoController {
    constructor(dbService) {
        this.dbService = dbService;
    }

    comprobarEstado() {
        return async (req, res) => {
            try {
                await this.dbService.ping();
                res.status(200).json({ ok: true, mongo: 'conectado', mensaje: 'Servidor GARABATOZ y MongoDB Atlas funcionando' });
            } catch (error) {
                console.error('error en comprobarEstado:', error.message);
                res.status(500).json({ ok: false, mongo: 'desconectado', mensaje: 'El servidor funciona pero MongoDB no responde' });
            }
        };
    }
}
