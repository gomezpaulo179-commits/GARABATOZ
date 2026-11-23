//lee las variables del .env y las deja en un unico objeto para usarlas en todo el proyecto
import 'dotenv/config';

const config = {
    puerto: process.env.PORT || 3000,
    urlFrontend: process.env.FRONTEND_URL || 'http://localhost:4200',
    mongo: {
        uri: process.env.MONGODB_URI,
        nombreDb: process.env.MONGODB_DB || 'garabatoz'
    }
};

if (!config.mongo.uri) {
    throw new Error('falta MONGODB_URI en el archivo .env');
}

export default config;
