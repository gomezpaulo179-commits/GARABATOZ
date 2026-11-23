# GARABATOZ

Portal de la marca de ropa GARABATOZ. Angular (frontend) + Node/Express (backend) + MongoDB Atlas.

## Estructura (MVC en los dos lados)

```
frontend/  Angular
  src/modulos/_shared_/       modelos y servicios (HttpClient) comunes
  src/modulos/zonaTienda/     inicio, catalogo, carrito...
  src/modulos/zonaCliente/    login/registro, mi cuenta...
backend/   Node + Express
  server.js                   arranque
  src/config/                 lee el .env
  src/routes/                 url -> metodo del controlador
  src/controllers/            logica
  src/services/               DbService (mongo) y gateways a apis externas
  src/models/                 forma de los documentos
```

Regla de oro: Angular SOLO habla con nuestro Node. Las APIs externas y las claves secretas viven en Node.

## Arrancar

```
cd backend   -> npm install -> copiar .env.example a .env y rellenarlo -> npm run dev
cd frontend  -> npm install -> npm start  -> abrir http://localhost:4200
```
