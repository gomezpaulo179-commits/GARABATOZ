# 📒 SEGUIMIENTO DEL PROYECTO GARABATOZ

Diario del proyecto: qué se ha hecho, por qué y cómo funciona cada cosa.
Se actualiza al terminar cada fase.

---

## 📌 Índice

1. [Qué es GARABATOZ](#1-qué-es-garabatoz)
2. [Decisiones tomadas](#2-decisiones-tomadas)
3. [Reglas del profesor (NO saltarse)](#3-reglas-del-profesor-no-saltarse)
4. [Plan por fases](#4-plan-por-fases)
5. [FASE 1 – Esqueleto del proyecto ✅](#5-fase-1--esqueleto-del-proyecto-)
6. [Cómo arrancar el proyecto](#6-cómo-arrancar-el-proyecto)
7. [Glosario rápido](#7-glosario-rápido)

---

## 1. Qué es GARABATOZ

Portal web de mi marca de ropa **GARABATOZ**, inspirada en el estilo de los raperos y artistas de los años 2000
(ropa ancha, gorras, chándal...). La interfaz será **negra con grafitis con mucha personalidad**.

Lo que tendrá el portal:

- Registro e inicio de sesión (también con Google).
- Catálogo de productos dividido por secciones.
- Carrito de la compra.
- Zona "Mi cuenta" con direcciones de envío a domicilio (como en PcComponentes).
- Pago de prueba.
- Varias APIs externas, siempre pasando por nuestro servidor Node.

**Tecnologías:**

| Parte | Tecnología | Para qué |
|---|---|---|
| Frontend | Angular 22 | Lo que ve el usuario en el navegador |
| Estructura visual | Bootstrap 5 | Solo rejilla (filas/columnas) y modales |
| Diseño | CSS propio | Todo el aspecto: colores, grafitis, fuentes |
| Backend | Node.js + Express 5 | Servidor: API REST y puente con APIs externas |
| Base de datos | MongoDB Atlas (driver nativo) | Guardar clientes, productos, pedidos... |

---

## 2. Decisiones tomadas

- **MongoDB Atlas** (en la nube, gratis) en vez de Mongo local → funciona desde cualquier PC sin instalar nada.
- **Driver nativo de MongoDB** con una clase `DbService`, **no Mongoose** → es como lo hace el profe
  (`dbService.updateOne('clientes', ...)`), así le resulta familiar al corregir.
- **Bootstrap solo para estructura**, todo el aspecto con **CSS propio** → queda más original para el estilo grafiti.
- **Sin música** en la web → según el profe de Interfaces empeora la experiencia de usuario.
- **Sin cadenas** en el catálogo. Sí ropa ancha, gorras y chándal.
- Estructura de carpetas copiada del proyecto de **PcComponentes** (`_shared_`, `zonaCliente`, `zonaTienda`).
- Las APIs externas las meto **yo mismo** siguiendo los pasos que me den.

**APIs del proyecto:**

1. API REST propia en Node (productos, clientes, pedidos).
2. GeoAPI → provincias y poblaciones para las direcciones de envío.
3. Login con Google.
4. Stripe en modo prueba → pagar el carrito.
5. Cloudinary → guardar las fotos de la ropa.
6. Nodemailer → email de bienvenida al registrarse.

---

## 3. Reglas del profesor (NO saltarse)

Sacadas de la corrección de mi examen de la 1ª evaluación:

1. **MVC en los dos lados** (Angular y Node).
2. **El frontend NUNCA llama a una API externa.** Fue el "fallo gordo" del examen (casi suspenso).
   Todo pasa por Node, que hace de puente (gateway). Las claves secretas solo viven en el `.env` de Node.

   ```
   vista  <---->  controlador  <---->  servicio (HttpClient)  ======>  Node  <---->  API externa
   ```

3. **El controlador no hace peticiones HTTP.** Para eso está el servicio (en Angular, `ClienteService` etc.).
4. **`verificarAccessToken()` es un método estático de `AuthController`** que devuelve un middleware
   `(req, res, next)` y se pone delante de cada endpoint protegido.
5. **El `idCliente` NO va en la URL**: se saca del token JWT y se guarda en `req.idCliente`.
6. **Consultas a Mongo simples**: usar operadores como `$[]` en vez de recorrer arrays índice a índice.
7. Si se borra la dirección **predeterminada**, otra tiene que pasar a ser la predeterminada.

---

## 4. Plan por fases

| Fase | Qué | Estado |
|---|---|---|
| 1 | Esqueleto: Angular + Bootstrap, servidor Express, conexión con Atlas | ✅ Hecha |
| 2 | Registro e inicio de sesión con JWT + middleware `verificarAccessToken` | ⏳ Pendiente de confirmar |
| 3 | Tienda: productos y secciones | ⬜ |
| 4 | Carrito | ⬜ |
| 5 | Mi cuenta: direcciones de envío con GeoAPI (vía Node) | ⬜ |
| 6 | Pedido y pago con Stripe (modo prueba) | ⬜ |
| 7 | Login con Google, Cloudinary y Nodemailer | ⬜ |
| 8 | Diseño negro con grafitis (CSS propio) | ⬜ |

---

## 5. FASE 1 – Esqueleto del proyecto ✅

**Objetivo:** tener el frontend y el backend creados, conectados entre sí y con la base de datos,
y comprobarlo con una página que diga "todo funciona".

### 5.1 Estructura de carpetas creada

```
proyecto-GARABATOZ/
├── README.md                      instrucciones cortas para arrancar
├── SEGUIMIENTO.md                 este archivo
│
├── backend/                       ── NODE + EXPRESS ──
│   ├── server.js                  punto de entrada: arranca todo
│   ├── package.json               dependencias del backend
│   ├── .env.example               plantilla de variables secretas
│   ├── .env                       variables secretas reales (lo creé yo a mano, NO se sube a git)
│   ├── .gitignore                 dice a git qué NO subir (node_modules y .env)
│   └── src/
│       ├── config/config.js       lee el .env
│       ├── services/DbService.js  único sitio que habla con MongoDB
│       ├── controllers/EstadoController.js
│       ├── routes/estadoRoutes.js
│       └── models/                (vacía, se usa en la fase 2)
│
└── frontend/                      ── ANGULAR ──
    ├── package.json               dependencias del frontend (incluye Bootstrap)
    ├── angular.json               configuración de Angular (aquí se carga Bootstrap)
    ├── proxy.conf.json            redirige /api → http://localhost:3000
    └── src/
        ├── index.html             página base (título GARABATOZ, idioma español)
        ├── main.ts                arranca Angular
        ├── styles.css             estilos globales (fondo negro)
        ├── app/
        │   ├── app.ts / app.html  componente raíz: solo tiene <router-outlet />
        │   ├── app.config.ts      configuración global (router + HttpClient)
        │   └── app.routes.ts      qué vista se ve en cada URL
        └── modulos/
            ├── _shared_/
            │   ├── models/IEstado.ts
            │   └── services/EstadoService.ts
            └── zonaTienda/
                └── inicio/
                    ├── controllers/InicioController.ts
                    └── views/inicio/  (inicio.ts, inicio.html, inicio.css)
```

### 5.2 BACKEND explicado archivo por archivo

#### `package.json`
Lista de "piezas" que necesita el backend. Al hacer `npm install` se descargan en `node_modules/`.

| Paquete | Para qué sirve |
|---|---|
| `express` | Crea el servidor y las rutas (`GET /api/estado`...) |
| `mongodb` | Driver oficial para hablar con MongoDB |
| `dotenv` | Lee el archivo `.env` y mete sus valores en `process.env` |
| `cors` | Permite que Angular (puerto 4200) pueda llamar a Node (puerto 3000) |
| `nodemon` (desarrollo) | Reinicia el servidor solo cada vez que guardas un archivo |

También tiene `"type": "module"` → nos deja usar `import ... from` en vez de `require(...)`.

Scripts:
- `npm start` → arranca normal.
- `npm run dev` → arranca con nodemon (el que usamos mientras programamos).

#### `.env` y `.env.example`
El `.env` guarda los **secretos** (contraseña de la base de datos, y más adelante claves de Google, Stripe...).

```
PORT=3000                         puerto donde escucha Node
FRONTEND_URL=http://localhost:4200  única web a la que dejamos llamar a Node
MONGODB_URI=mongodb+srv://...     dirección + usuario + contraseña de Atlas
MONGODB_DB=garabatoz              nombre de la base de datos
```

- `.env` → el real, con mi contraseña. **Nunca se sube a GitHub** (está en `.gitignore`).
- `.env.example` → la plantilla sin datos reales, para que otra persona sepa qué tiene que rellenar.

> 💡 Analogía: el `.env` es la caja fuerte. Solo Node tiene la llave. Angular jamás la ve,
> porque todo lo que está en Angular lo puede leer cualquiera abriendo el navegador (F12).

#### `src/config/config.js`
Lee el `.env` (con `import 'dotenv/config'`) y lo guarda todo en un único objeto `config`.
Así en el resto del código escribo `config.mongo.uri` en vez de `process.env.MONGODB_URI` por todas partes.
Si falta `MONGODB_URI`, lanza un error nada más arrancar para que me entere enseguida.

#### `src/services/DbService.js`
La clase que **habla con MongoDB**. Es la única que lo hace; los controladores siempre pasan por ella.

- `constructor(uri, nombreDb)` → prepara el cliente de Mongo con la dirección de Atlas.
- `conectar()` → abre la conexión y elige la base de datos `garabatoz`.
- `ping()` → pregunta a Mongo "¿estás vivo?". Lo usa el endpoint de estado.
- `toObjectId(id)` → convierte un texto en `ObjectId` (el tipo de id que usa Mongo).
- `find`, `findOne`, `insertOne`, `updateOne`, `deleteOne` → operaciones CRUD genéricas.
  Se les pasa el nombre de la colección: `dbService.findOne('clientes', { 'cuenta.email': email })`.

Las variables con `#` delante (`#cliente`, `#db`) son **privadas**: solo se pueden usar dentro de la clase.

#### `src/controllers/EstadoController.js`
Controlador de prueba. Tiene el método `comprobarEstado()`, que **devuelve una función** `(req, res)`.
Ese es el patrón que pide el profe: así en las rutas se escribe `controller.metodo()` y se pueden
poner middlewares delante.

Lo que hace: llama a `dbService.ping()`.
- Si Mongo responde → `200` con `{ ok: true, mensaje: 'Servidor GARABATOZ y MongoDB Atlas funcionando' }`.
- Si falla → `500` con `{ ok: false, ... }`.

Recibe el `dbService` por el constructor (**inyección de dependencias**): el controlador no crea
la conexión, se la "entregan" desde `server.js`. Así solo hay una conexión para todo el servidor.

#### `src/routes/estadoRoutes.js`
Solo dice **qué URL va a qué método del controlador**, sin lógica:

```js
router.get('/', estadoController.comprobarEstado());   // GET /api/estado
```

#### `server.js`
El punto de entrada. En orden:

1. Crea la app de Express.
2. **Middlewares globales** (se ejecutan en todas las peticiones):
   - `cors({ origin: config.urlFrontend })` → solo acepta peticiones de nuestro Angular.
   - `express.json()` → convierte el body JSON de las peticiones en un objeto (`req.body`).
3. Crea el `DbService` y los controladores, pasándoles el `dbService`.
4. Monta las rutas: `app.use('/api/estado', estadoRoutes(estadoController))`.
5. **Primero conecta con Mongo y después arranca el servidor.** Si Mongo falla, para el proceso
   con un mensaje claro (no tiene sentido un servidor sin base de datos).

#### Recorrido de una petición en Node

```
GET /api/estado
   │
   ▼
server.js  (cors, express.json)
   │
   ▼
estadoRoutes.js        "esta URL va a comprobarEstado()"
   │
   ▼
EstadoController.js    lógica: ¿mongo responde?
   │
   ▼
DbService.js  ======>  MongoDB Atlas
```

### 5.3 FRONTEND explicado archivo por archivo

#### Cómo se creó
Con la herramienta oficial de Angular: `ng new frontend --style=css --routing --ssr=false`.
Después le añadí Bootstrap y quité lo que no hacía falta (la página de ejemplo de Angular
y su test, que fallaría al cambiar la página).

#### `package.json`
- Se añadió `bootstrap` a las dependencias.
- El script `start` ahora es `ng serve --proxy-config proxy.conf.json` → arranca Angular usando el proxy.

#### `angular.json`
- En `styles` se cargan el CSS de Bootstrap y luego `src/styles.css` (el nuestro va después para poder sobrescribir).
- En `scripts` se carga el JS de Bootstrap (necesario para modales, desplegables...).
- Subí el límite de tamaño (`budgets`) de 500 KB a 1 MB porque Bootstrap lo pasaba un poco y daba un aviso al compilar.

#### `proxy.conf.json`
Cuando Angular pide algo a `/api/...`, el proxy lo reenvía a `http://localhost:3000/api/...` (nuestro Node).

> 💡 Analogía: es como un buzón en la puerta. Angular deja la carta en "/api" y el proxy
> se la lleva al Node. Así en el código nunca escribo `http://localhost:3000`, y si un día
> subo el servidor a internet solo cambio el proxy, no todo el código.

#### `src/app/app.config.ts`
Configuración global de Angular:
- `provideRouter(routes)` → activa la navegación entre páginas.
- `provideHttpClient()` → activa `HttpClient`, sin esto los servicios no pueden hacer peticiones.

#### `src/app/app.routes.ts`
Qué vista se pinta en cada URL:
- `''` (la raíz, `http://localhost:4200/`) → vista `Inicio`.
- `'**'` (cualquier otra URL) → redirige a la raíz.

#### `src/app/app.ts` y `app.html`
El componente raíz. Solo tiene `<router-outlet />`: el "hueco" donde Angular mete la vista que toque según la URL.

#### MVC en Angular: la página de inicio

```
inicio.html / inicio.ts   <---->  InicioController.ts  <---->  EstadoService.ts  ======>  Node /api/estado
      (VISTA)                         (CONTROLADOR)                (SERVICIO)
```

> 💡 Analogía del restaurante:
> - **Vista** = la mesa. Solo enseña lo que le traen.
> - **Controlador** = el camarero. Sabe qué hay que enseñar y decide qué pedir, pero no cocina.
> - **Servicio** = el único que entra en la cocina (Node).

**`_shared_/models/IEstado.ts`** → una `interface` que describe qué devuelve Node:
`{ ok: boolean, mongo: string, mensaje: string }`. Sirve para que TypeScript avise si me equivoco con un nombre.

**`_shared_/services/EstadoService.ts`** → el SERVICIO.
- `@Injectable({ providedIn: 'root' })` → una sola instancia para toda la app.
- `inject(HttpClient)` → pide a Angular el objeto que hace peticiones HTTP.
- `comprobarEstado()` → hace `GET /api/estado` y devuelve un `Observable`
  (una "promesa de respuesta": todavía no hay datos, llegarán cuando Node conteste).

**`zonaTienda/inicio/controllers/InicioController.ts`** → el CONTROLADOR.
- Tiene 3 **signals**: `cargando`, `conectado` y `mensaje`.
  Un signal es una variable "con alarma": cuando cambia su valor, la vista se repinta sola.
- `comprobarServidor()` → pone `cargando` a true, pide el estado al servicio y se **suscribe** (`subscribe`):
  - `next` (todo bien) → guarda `conectado` y `mensaje`, y quita el `cargando`.
  - `error` (Node apagado o caído) → guarda el mensaje "No hay conexion con el servidor de nodejs".

**`zonaTienda/inicio/views/inicio/inicio.ts`** → la VISTA (parte lógica).
- `providers: [InicioController]` → cada vez que se abre esta vista se crea su propio controlador.
- `ngOnInit()` → se ejecuta al abrirse la vista y llama a `ctrl.comprobarServidor()`.

**`inicio.html`** → la VISTA (lo que se ve). Usa la sintaxis nueva de Angular:

```html
@if (ctrl.cargando()) {        spinner girando
} @else if (ctrl.conectado()) { mensaje verde ✅
} @else {                       mensaje rojo ❌
}
```

Los signals se leen con paréntesis: `ctrl.mensaje()`.

#### Recorrido completo al abrir http://localhost:4200

1. Angular mira `app.routes.ts` → la raíz es la vista `Inicio`.
2. Se crea `Inicio` y su `InicioController`. `ngOnInit` llama a `comprobarServidor()`.
3. El controlador pide al `EstadoService` → `GET /api/estado`.
4. El proxy lo manda a Node (puerto 3000).
5. Node: ruta → `EstadoController` → `DbService.ping()` → Atlas responde.
6. Node devuelve `{ ok: true, ... }`.
7. El controlador actualiza los signals → la vista se repinta → **mensaje verde** ✅.

### 5.4 Configuración de MongoDB Atlas (hecha a mano)

1. Cuenta en https://www.mongodb.com/cloud/atlas/register
2. Cluster **Free (M0)**, nombre `GARABATOZ`, proveedor AWS, región París.
   Desmarcado "Preload sample dataset" (no queremos datos de ejemplo ocupando espacio).
3. "Automate security setup" marcado → crea el usuario y da acceso desde mi IP.
4. Usuario de base de datos: `gomezpaulo179_db_user` (contraseña guardada solo en el `.env`).
5. Connect → Controladores (Drivers) → Node.js → copiar la cadena `mongodb+srv://...` al `.env`,
   cambiando `<db_password>` por la contraseña.

> ⚠️ En la contraseña de la base de datos mejor solo letras y números:
> símbolos como `@ # / :` rompen la cadena de conexión.

### 5.5 Resultado de la fase 1
✅ Backend conectado a Atlas (`✅ conectado a MongoDB Atlas, base de datos: garabatoz`).
✅ Frontend en http://localhost:4200 mostrando el mensaje verde.

---

## 6. Cómo arrancar el proyecto

Hacen falta **dos terminales** abiertas a la vez:

```
# terminal 1
cd backend
npm install        (solo la primera vez o si cambian las dependencias)
npm run dev

# terminal 2
cd frontend
npm install        (solo la primera vez o si cambian las dependencias)
npm start
```

Abrir http://localhost:4200

---

## 7. Glosario rápido

| Palabra | Qué es |
|---|---|
| **API REST** | Conjunto de URLs de un servidor que devuelven datos (normalmente JSON) |
| **Endpoint** | Cada una de esas URLs, p. ej. `GET /api/estado` |
| **Middleware** | Función que se ejecuta *antes* de llegar al controlador (p. ej. comprobar el token) |
| **Gateway** | Node haciendo de intermediario entre Angular y las APIs externas |
| **JWT** | "Pulsera de festival": token que te dan al hacer login y que enseñas en cada petición protegida |
| **Observable** | Respuesta que llegará en el futuro; hay que suscribirse (`subscribe`) para recibirla |
| **Signal** | Variable de Angular que repinta la vista sola cuando cambia |
| **Proxy** | Redirige las peticiones de `/api` de Angular a Node |
| **CORS** | Regla de seguridad del navegador: Node tiene que decir qué webs le pueden llamar |
| **`.env`** | Archivo con secretos, solo en el servidor, nunca en git |
| **Inyección de dependencias** | Darle a una clase lo que necesita desde fuera en vez de que lo cree ella |
