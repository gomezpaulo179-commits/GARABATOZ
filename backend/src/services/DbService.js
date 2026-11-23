//SERVICIO de acceso a MongoDB con el driver nativo (igual que el dbService del profe)
//los controladores NUNCA tocan mongo directamente, siempre pasan por aqui:
//      router ----> controlador ----> DbService ======> MongoDB Atlas
import { MongoClient, ObjectId } from 'mongodb';

export default class DbService {
    #cliente;
    #db;

    constructor(uri, nombreDb) {
        this.#cliente = new MongoClient(uri);
        this.nombreDb = nombreDb;
    }

    async conectar() {
        await this.#cliente.connect();
        this.#db = this.#cliente.db(this.nombreDb);
        console.log(`✅ conectado a MongoDB Atlas, base de datos: ${this.nombreDb}`);
    }

    async desconectar() {
        await this.#cliente.close();
    }

    //comprueba que mongo responde (lo usa el endpoint /api/estado)
    async ping() {
        return await this.#db.command({ ping: 1 });
    }

    //convierte un string en ObjectId de mongo
    static toObjectId(id) {
        return new ObjectId(id);
    }

    //------------- operaciones CRUD genericas sobre cualquier coleccion -------------
    async find(coleccion, filtro = {}, opciones = {}) {
        return await this.#db.collection(coleccion).find(filtro, opciones).toArray();
    }

    async findOne(coleccion, filtro, opciones = {}) {
        return await this.#db.collection(coleccion).findOne(filtro, opciones);
    }

    async insertOne(coleccion, documento) {
        return await this.#db.collection(coleccion).insertOne(documento);
    }

    async updateOne(coleccion, filtro, operacion, opciones = {}) {
        return await this.#db.collection(coleccion).updateOne(filtro, operacion, opciones);
    }

    async deleteOne(coleccion, filtro) {
        return await this.#db.collection(coleccion).deleteOne(filtro);
    }
}
