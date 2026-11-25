//MODELO: define la FORMA que tiene un cliente en la coleccion "clientes" de MongoDB.
//con el driver nativo, mongo no obliga a ninguna estructura (podrias guardar cualquier cosa),
//asi que TODOS los clientes se crean SIEMPRE con este metodo para que tengan los mismos campos.
//(misma forma que los modelos Cliente y Cuenta del proyecto de PcComponentes)
export default class Cliente {

    //recibe los datos del formulario de registro y devuelve el documento listo para guardar en mongo
    static crear({ nombre, apellidos, email, password, telefono = '', aceptaNovedades = false }) {
        return {
            nombre: nombre.trim(),
            apellidos: apellidos.trim(),
            cuenta: {
                email: email.trim().toLowerCase(),  // en minusculas: "Paulo@Gmail.com" y "paulo@gmail.com" son el mismo
                password,                           // OJO: aqui tiene que llegar ya CIFRADA (paso 3, bcrypt)
                telefono: telefono.trim(),
                activada: true,
                fechaCreacion: Date.now(),          // en milisegundos, como en PcComponentes (evita lios con objetos Date)
                imagenAvatar: '',
                aceptaNovedades                     // casilla "recibir descuentos y novedades"
            },
            direcciones: [],    // se rellenan en la fase de envios
            pedidos: [],        // se rellenan en la fase de pedidos
            favoritos: []
        };
    }
}
