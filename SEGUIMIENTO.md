# SEGUIMIENTO DEL PROYECTO GARABATOZ

Diario del proyecto: qué se ha hecho, por qué y cómo funciona cada cosa.
Se actualiza al terminar cada fase.

---

## Índice

1. [Qué es GARABATOZ](#1-qué-es-garabatoz)
2. [Decisiones tomadas](#2-decisiones-tomadas)
3. [Reglas del profesor (NO saltarse)](#3-reglas-del-profesor-no-saltarse)
4. [Plan por fases](#4-plan-por-fases)
5. [FASE 1 – Esqueleto del proyecto (hecha)](#5-fase-1--esqueleto-del-proyecto-hecha)
6. [Cómo arrancar el proyecto](#6-cómo-arrancar-el-proyecto)
7. [Glosario rápido](#7-glosario-rápido)
8. [Cambios pequeños](#8-cambios-pequeños)

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
| 1 | Esqueleto: Angular + Bootstrap, servidor Express, conexión con Atlas | Hecha |
| 2 | Registro e inicio de sesión con JWT + middleware `verificarAccessToken` | En curso (paso a paso, ver apartado 8) |
| 3 | Tienda: productos y secciones | Pendiente |
| 4 | Carrito | Pendiente |
| 5 | Mi cuenta: direcciones de envío con GeoAPI (vía Node) | Pendiente |
| 6 | Pedido y pago con Stripe (modo prueba) | Pendiente |
| 7 | Login con Google, Cloudinary y Nodemailer | Pendiente |
| 8 | Diseño negro con grafitis (CSS propio) | Pendiente |

---

## 5. FASE 1 – Esqueleto del proyecto (hecha)

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

> **Analogía:** el `.env` es la caja fuerte. Solo Node tiene la llave. Angular jamás la ve,
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

> **Analogía:** es como un buzón en la puerta. Angular deja la carta en "/api" y el proxy
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

> **Analogía del restaurante:**
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
} @else if (ctrl.conectado()) { mensaje verde
} @else {                       mensaje rojo
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
7. El controlador actualiza los signals → la vista se repinta → **mensaje verde**.

### 5.4 Configuración de MongoDB Atlas (hecha a mano)

1. Cuenta en https://www.mongodb.com/cloud/atlas/register
2. Cluster **Free (M0)**, nombre `GARABATOZ`, proveedor AWS, región París.
   Desmarcado "Preload sample dataset" (no queremos datos de ejemplo ocupando espacio).
3. "Automate security setup" marcado → crea el usuario y da acceso desde mi IP.
4. Usuario de base de datos: `gomezpaulo179_db_user` (contraseña guardada solo en el `.env`).
5. Connect → Controladores (Drivers) → Node.js → copiar la cadena `mongodb+srv://...` al `.env`,
   cambiando `<db_password>` por la contraseña.

> **Aviso:** en la contraseña de la base de datos mejor solo letras y números:
> símbolos como `@ # / :` rompen la cadena de conexión.

### 5.5 Resultado de la fase 1
- Backend conectado a Atlas (`conectado a MongoDB Atlas, base de datos: garabatoz`).
- Frontend en http://localhost:4200 mostrando el mensaje verde.

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

---

## 8. Cambios pequeños

A partir de aquí vamos paso a paso, con cambios pequeños, para entender cada parte.

### 8.1 Título GARABATOZ en estilo grafiti (25/11/2026)

**Qué:** el título de la página de inicio pasa de texto normal a letras de grafiti:
relleno blanco, borde negro, sombra 3D gris y cada letra un poco girada y a distinta altura.

**Archivos tocados:**

| Archivo | Cambio |
|---|---|
| `frontend/package.json` | Nueva dependencia `@fontsource/sedgwick-ave-display` (la fuente) |
| `frontend/angular.json` | Se carga el CSS de la fuente en `styles` (entre Bootstrap y nuestro `styles.css`) |
| `inicio.ts` | Array `letrasTitulo`: cada letra con su `giro` (grados) y `subida` (em) |
| `inicio.html` | El `<h1>` pinta cada letra en su propio `<span>` con un `@for` |
| `inicio.css` | Estilos `.titulo-grafiti` y `.letra` |

**Cómo funciona:**

1. **La fuente.** Es *Sedgwick Ave Display*, gratuita (Google Fonts). En vez de pedirla a Google cada vez
   que se abre la web, está instalada como paquete npm (`@fontsource`) → viene dentro del proyecto,
   funciona sin internet y el navegador no hace peticiones a webs externas.

2. **Una letra = un `<span>`.** Para girar cada letra por separado tienen que ser elementos distintos.
   En `inicio.ts` hay una lista:
   ```ts
   { letra: 'G', giro: -8, subida: 0.05 }
   ```
   y en el HTML un `@for` recorre la lista y crea un `<span>` por letra. A cada uno le pasa dos
   **variables CSS** con su giro y su subida:
   ```html
   [style.--giro.deg]="l.giro"      →  style="--giro: -8deg"
   [style.--subida.em]="l.subida"   →  style="--subida: 0.05em"
   ```
   El CSS las usa en `transform: rotate(var(--giro)) translateY(var(--subida))`.

   > **Analogía:** es como un rótulo hecho con letras sueltas pegadas a mano en una pared:
   > cada una queda un poco torcida y a su altura, y eso le da el toque callejero.

   Está en la **vista** y no en el controlador porque es algo puramente visual, no lógica de la página.

3. **Relleno blanco + borde negro.**
   - `color: #fff` → relleno blanco.
   - `-webkit-text-stroke: 0.07em #000` → borde negro alrededor de cada letra.
   - `paint-order: stroke fill` → pinta primero el borde y luego el relleno encima.
     Sin esto, el borde se "come" la mitad del blanco y las letras quedan finas.

4. **Sombra 3D.** `text-shadow` con 8 sombras gris oscuro, cada una 1px más abajo y a la derecha.
   Apiladas parecen un bloque. Es gris y no negra porque el fondo de la web es negro:
   una sombra negra no se vería, y sobre el gris sí se distingue el borde negro.

5. **Tamaño adaptable.** `font-size: clamp(3.5rem, 13vw, 9rem)` → crece con el ancho de la pantalla,
   pero nunca baja de 3.5rem (móvil) ni pasa de 9rem (pantallas grandes).

6. **Accesibilidad.** El `<h1>` lleva `aria-label="GARABATOZ"` y los `<span>` `aria-hidden="true"`:
   un lector de pantalla lee la palabra entera en vez de "G, A, R, A...".

**Después de este cambio** hay que hacer `npm install` en `frontend` (hay un paquete nuevo).

### 8.2 Letras del título más gordas (25/11/2026)

**Qué:** las letras del título se veían finas. Ahora son más gruesas y el contorno negro se ve mejor.

**Archivos tocados:** `inicio.html` (atributo `data-letra` en cada `<span>`) e `inicio.css`.

**Por qué se veían finas:** el borde negro (`-webkit-text-stroke`) se pinta a caballo del contorno de la letra:
mitad hacia fuera y mitad hacia DENTRO, comiéndose el blanco. `paint-order: stroke fill` debería evitarlo,
pero no todos los navegadores lo respetan en texto HTML, y en el mío las letras salían finas.

**Solución: pintar cada letra en dos capas**, como un grafiti de verdad (primero el contorno, luego el relleno):

```
capa de delante  (.letra)          → letra blanca + borde BLANCO de 0.03em  → la engorda
capa de atrás    (.letra::before)  → la misma letra en negro + borde NEGRO de 0.1em
                                      + la sombra 3D gris
```

- Cada capa es de **un solo color** (blanco sobre blanco, negro sobre negro), así que da igual que el borde
  se pinte por dentro o por fuera: no se come nada. Funciona igual en todos los navegadores.
- Como el borde negro de atrás (0.1em) es más gordo que el blanco de delante (0.03em), asoma alrededor → contorno.
- **`::before`** es un "pseudo-elemento": una caja extra que CSS crea dentro del `<span>` sin tocar el HTML.
  Con `content: attr(data-letra)` escribe dentro la misma letra, que lee del atributo `data-letra`
  que le pone el HTML (`[attr.data-letra]="l.letra"`).
- `z-index: -1` la manda detrás de la letra blanca.
- Se subió un poco el `letter-spacing` (0.06em) para que las letras gordas no se toquen.

> **Analogía:** es como recortar cada letra dos veces, una en cartulina negra un poco más grande
> y otra en blanca, y pegar la blanca encima. El borde negro que sobra es el contorno.

**Ajuste fino:** para hacerlas más o menos gordas basta con cambiar los dos números de `-webkit-text-stroke`
en `inicio.css` (el blanco de `.letra` y el negro de `.letra::before`). El negro tiene que ser siempre mayor que el blanco.

### 8.3 FASE 2 · Paso 1 – Modelo del cliente (25/11/2026)

La fase 2 (registro e inicio de sesión) se hace en pasos pequeños:

1. Modelo del cliente (hecho)
2. Endpoint de registro (guardar en Mongo) y probarlo con Thunder Client (hecho)
3. Cifrar la contraseña con bcrypt (hecho)
4. Endpoint de login que devuelve el token JWT
5. Middleware `verificarAccessToken` y una ruta protegida
6. Angular: modelo y `ClienteService`
7. Vista del login/registro (solo HTML)
8. Controlador que une vista y servicio
9. Guardar el token y proteger páginas

**Qué:** archivo nuevo `backend/src/models/Cliente.js`. Todavía no se usa en ningún sitio: es la "plantilla" que usará el registro en el paso 2.

**Por qué hace falta:** con el driver nativo, MongoDB no obliga a ninguna estructura: podrías guardar un cliente
con `nombre` y otro con `name`, y nadie te avisaría. Si todos se crean con `Cliente.crear(...)`, todos tienen los mismos campos.

> **Analogía:** es la ficha de socio de un gimnasio. Antes de apuntar a nadie decides qué casillas tiene la ficha,
> y luego todas las fichas se rellenan con el mismo formato.

**Forma de un cliente** (igual que `Cliente` + `Cuenta` en PcComponentes):

```
cliente
├── nombre, apellidos
├── cuenta
│   ├── email            en minúsculas
│   ├── password         CIFRADA (se hará en el paso 3)
│   ├── telefono
│   ├── activada         true
│   ├── fechaCreacion    milisegundos (Date.now())
│   ├── imagenAvatar     '' de momento
│   └── aceptaNovedades  casilla de descuentos
├── direcciones []       fase de envíos
├── pedidos []           fase de pedidos
└── favoritos []
```

**Línea a línea, lo importante:**

- `export default class Cliente` → una clase que se puede importar desde otros archivos.
- `static crear(...)` → **static** = se llama sobre la clase, sin hacer `new`: `Cliente.crear({...})`.
  No hace falta un objeto "cliente" para fabricar otro, igual que no hace falta una ficha para imprimir fichas en blanco.
- `crear({ nombre, apellidos, ... })` → **desestructuración**: recibe UN objeto y saca sus propiedades en variables.
  Así se llama con los datos del formulario tal cual: `Cliente.crear(req.body)`.
- `telefono = ''`, `aceptaNovedades = false` → **valores por defecto** si no vienen (son opcionales).
- `.trim()` → quita espacios al principio y al final (`" Paulo "` → `"Paulo"`).
- `.toLowerCase()` en el email → `Paulo@Gmail.com` y `paulo@gmail.com` cuentan como el mismo email
  Así, cuando en el paso 2 comprobemos si el email ya existe, la comprobación funciona aunque cambien las mayúsculas
  (el `.toLowerCase()` solo no impide duplicados: lo que los impide es esa comprobación).
- `fechaCreacion: Date.now()` → número de milisegundos desde 1970. Como en PcComponentes: un número se guarda
  y se compara sin líos de zonas horarias ni conversiones de objetos `Date`.
- Arrays vacíos `[]` → así existen desde el principio y en las siguientes fases solo hay que añadir cosas.

**Prueba hecha:**
```
Cliente.crear({ nombre: ' Paulo ', apellidos: 'Gomez', email: 'Paulo@Gmail.com ', password: 'xxx', aceptaNovedades: true })
→ { nombre: 'Paulo', apellidos: 'Gomez', cuenta: { email: 'paulo@gmail.com', ..., aceptaNovedades: true }, direcciones: [], ... }
```

### 8.4 FASE 2 · Paso 2 – Endpoint de registro (25/11/2026)

**Qué:** `POST /api/auth/registro` recibe los datos del formulario y guarda el cliente en la colección `clientes` de Atlas.

**Archivos:**

| Archivo | Cambio |
|---|---|
| `backend/src/controllers/AuthController.js` | NUEVO. Método `registro()` y `_validarRegistro()` |
| `backend/src/routes/authRoutes.js` | NUEVO. `router.post('/registro', ...)` |
| `backend/server.js` | 3 líneas: importar, crear `authController`, montar `/api/auth` |

**Recorrido de una petición:**
```
POST /api/auth/registro  { nombre, apellidos, email, password, telefono, aceptaPrivacidad, aceptaNovedades }
   │
server.js → express.json() convierte el body en req.body
   │
authRoutes.js → "/registro" va a authController.registro()
   │
AuthController.registro():
   1. VALIDAR       ¿faltan campos? ¿email raro? ¿password < 8? ¿no acepta privacidad?  → 400
   2. CONSTRUIR     Cliente.crear(...)  (email en minúsculas)
   3. COMPROBAR     dbService.findOne('clientes', { 'cuenta.email': ... })  ¿ya existe? → 409
   4. GUARDAR       dbService.insertOne('clientes', cliente)
   5. RESPONDER     201 { ok, mensaje, idCliente }   (nunca se devuelve la password)
```

**Códigos de respuesta HTTP** (el número le dice al frontend qué ha pasado sin leer el texto):

| Código | Significa | Cuándo |
|---|---|---|
| 201 Created | Creado | La cuenta se ha guardado |
| 400 Bad Request | Datos mal enviados | Falta algo, email raro, password corta, no acepta privacidad |
| 409 Conflict | Choca con algo que ya existe | El email ya está registrado |
| 500 Internal Server Error | Fallo del servidor | Mongo caído, error de código... |

**Lo importante:**

- **Validar en el servidor aunque el formulario también valide.** Cualquiera puede saltarse el formulario
  y mandar la petición a mano (como hacemos con Thunder Client). El servidor es la última puerta.
  > **Analogía:** el formulario es el cartel de "prohibido entrar con comida"; el servidor es el segurata de la puerta.
- **La validación va en un método aparte** `_validarRegistro()` que devuelve el texto del error o `null`.
  El `_` delante es un convenio para decir "esto es de uso interno de la clase".
- `nombre?.trim()` → el `?.` (encadenamiento opcional) evita que pete si `nombre` no viene: da `undefined` en vez de error.
- **Expresión regular del email** `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` → "algo sin espacios ni @, una @, algo, un punto, algo".
  Es una comprobación básica: no garantiza que el correo exista, solo que tiene forma de correo.
- `aceptaPrivacidad !== true` → tiene que ser exactamente `true`. Se valida pero **no se guarda**:
  si no la acepta, no hay cuenta.
- `req.body ?? {}` → si llega una petición sin datos, `req.body` es `undefined`; con `?? {}` se usa un objeto vacío
  y la validación responde 400 en vez de romperse con un 500.
- **El duplicado se comprueba con el email ya normalizado** (`cliente.cuenta.email`, en minúsculas),
  por eso primero se construye el cliente y luego se busca.

**Aviso: en este paso la contraseña se guardaba tal cual** (sin cifrar). Se arregló en el paso 3 con bcrypt (ver 8.6).
Por eso para probar se usa una contraseña inventada, y el cliente de prueba se borra después.

**Pruebas hechas** (con una base de datos falsa en memoria):

| Prueba | Resultado |
|---|---|
| Datos correctos, email `Paulo@Gmail.com` | 201, guardado como `paulo@gmail.com` |
| Mismo email en minúsculas | 409 Ya existe una cuenta con ese email |
| Password `123` | 400 La contraseña debe tener al menos 8 caracteres |
| `aceptaPrivacidad: false` | 400 Debes aceptar la politica de privacidad |
| Email `nomail` | 400 El email no tiene un formato valido |

**Cómo probarlo con Thunder Client** (extensión de VS Code):
1. New Request → método **POST** → URL `http://localhost:3000/api/auth/registro`
2. Pestaña **Body → JSON**:
   ```json
   {
     "nombre": "Prueba",
     "apellidos": "Garabatoz",
     "email": "prueba@garabatoz.com",
     "password": "contrasena123",
     "telefono": "600000000",
     "aceptaPrivacidad": true,
     "aceptaNovedades": false
   }
   ```
3. **Send** → debe responder `201`. Si lo mandas otra vez → `409`.
4. En Atlas: **Browse Collections → garabatoz → clientes** → ahí está el documento.

### 8.5 Quitar emojis del código y de la documentación (25/11/2026)

**Qué:** se quitan los emojis del código y de `SEGUIMIENTO.md` y `DECISIONES.md`. A partir de ahora no se usan en ningún archivo del proyecto.

En la documentación se cambian por texto: en `DECISIONES.md` las marcas de quién tomó cada decisión pasan a ser **[Paulo]**, **[Propuesta]** y **[Técnica]**; en `SEGUIMIENTO.md` las analogías se marcan con **Analogía:**, los avisos con **Aviso:** y el estado de las fases con texto (Hecha, En curso, Pendiente).

| Archivo | Antes | Ahora |
|---|---|---|
| `backend/server.js` | emoji de cohete y de cruz delante de los mensajes | sin emoji |
| `backend/src/services/DbService.js` | emoji de check delante del mensaje | sin emoji |
| `frontend/.../inicio.html` | emojis de check y cruz delante del mensaje de estado | sin emoji (el color verde/rojo de la alerta ya lo indica) |

### 8.6 FASE 2 · Paso 3 – Cifrar la contraseña con bcrypt (25/11/2026)

**Qué:** al registrarse, la contraseña se guarda en Mongo **cifrada** (como un *hash*), nunca la real.

**Archivos:**

| Archivo | Cambio |
|---|---|
| `backend/package.json` | Nueva dependencia `bcryptjs` |
| `backend/src/controllers/AuthController.js` | `import bcrypt from 'bcryptjs'` y una línea nueva en `registro()` |

**Después de este cambio** hay que hacer `npm install` en `backend` (hay un paquete nuevo).

**El código nuevo:**
```js
const passwordCifrada = await bcrypt.hash(password, 10);
const cliente = Cliente.crear({ ..., password: passwordCifrada, ... });
```

**Qué es un hash:** una "huella" de la contraseña.
- De la contraseña se saca siempre la misma huella... pero **de la huella no se puede sacar la contraseña**.
- En el login (paso 4) no se "descifra" nada: se calcula la huella de lo que escribe el usuario
  y se compara con la guardada usando `bcrypt.compare(passwordEscrita, hashGuardado)`.

> **Analogía:** una trituradora de papel con truco. Con el confeti no puedes recomponer el folio,
> pero si te dan otro folio puedes triturarlo y ver si sale exactamente el mismo confeti.

**Por qué importa:** si alguien entra en la base de datos (o se filtra), no ve las contraseñas.
Y como mucha gente repite contraseña, tampoco podría usarlas en otras webs.

**Cómo es un hash de bcrypt** (60 caracteres):
```
$2b$10$NhC4KuNP9A.LL1LcLeocW.04LOkU7nxjcU5H2tcdM2nrgqG0igQ.q
 │   │  └───────────┬──────────┘└──────────────┬────────────┘
 │   │       sal (22 caracteres)        la huella en sí
 │   └── coste 10
 └── versión del algoritmo
```

- **Sal (salt):** un trozo aleatorio que bcrypt mezcla con la contraseña. Por eso dos usuarios con la misma
  contraseña tienen hashes distintos, y no sirven las "tablas" de hashes ya calculados que usan los atacantes.
  La sal va guardada dentro del propio hash, por eso `compare` sabe usarla.
- **Coste 10:** cuántas vueltas da el cifrado (2^10 = 1024). Cuanto más alto, más lento para un atacante
  que pruebe millones de contraseñas. 10 es el valor habitual: unas décimas de segundo por registro.
- `await` → cifrar tarda un poco, así que `bcrypt.hash` devuelve una promesa y esperamos a que termine.

**Prueba hecha** (base de datos falsa en memoria):
- Registro con password `12345678` → guardado `$2b$10$NhC4...` (60 caracteres).
- `bcrypt.compare('12345678', hash)` → `true`; `bcrypt.compare('otra1234', hash)` → `false`.
- Los demás casos del paso 2 (409, 400...) siguen funcionando igual.

**Cómo comprobarlo tú:** borra el cliente de prueba anterior en Atlas, vuelve a registrarlo con Thunder Client
y mira el campo `cuenta.password` en Atlas: debe empezar por `$2b$10$`.

