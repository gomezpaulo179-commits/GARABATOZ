# 🧠 DECISIONES DEL PROYECTO GARABATOZ

Aquí está **cada decisión** tomada en el proyecto, **por qué** se tomó y qué otra opción se descartó.
Sirve para poder defender el proyecto delante del profe.

Cada decisión indica quién la tomó:
- 🙋 **Paulo**: la decidí yo.
- 🤖 **Propuesta**: la propuso Claude y la aprobé.
- ⚙️ **Técnica**: detalle técnico que tomó Claude al programar (se puede cambiar si no me convence).

---

## 📌 Índice

1. [Decisiones generales del proyecto](#1-decisiones-generales-del-proyecto)
2. [Base de datos](#2-base-de-datos)
3. [Backend (Node)](#3-backend-node)
4. [Frontend (Angular)](#4-frontend-angular)
5. [Diseño](#5-diseño)
6. [APIs](#6-apis)
7. [Seguridad](#7-seguridad)

---

## 1. Decisiones generales del proyecto

### 1.1 Angular + Node + MongoDB 🙋
- **Por qué:** es lo que pidió el proyecto y lo que estamos dando en clase.

### 1.2 Dos carpetas separadas: `frontend/` y `backend/` 🤖
- **Por qué:** son dos programas distintos que se arrancan por separado (puerto 4200 y puerto 3000).
  Separados se ve claro qué es del cliente y qué del servidor, y cada uno tiene su propio `package.json`.
- **Descartado:** meterlo todo mezclado en una carpeta → lío de dependencias y de archivos.

### 1.3 Copiar la estructura de carpetas de PcComponentes 🤖
- **Qué:** `modulos/_shared_`, `modulos/zonaCliente`, `modulos/zonaTienda`, cada uno con `models/`, `views/`, `controllers/`.
- **Por qué:** ya la conozco de clase y es la que usa el profe, así le resulta familiar al corregir.

### 1.4 MVC en los dos lados (vista ↔ controlador ↔ servicio) 🤖
- **Por qué:** es obligatorio según la corrección del examen
  ("todos los proyectos siguen la arquitectura MVC... el código debe seguir esta implementación").
- Además separa responsabilidades: si algo falla sé dónde mirar.

### 1.5 Trabajar por fases y consultar antes de cada una 🙋
- **Por qué:** quiero entender lo que se hace y poder cambiar cosas antes de que estén programadas.
- **Orden de las fases:** primero lo que todo lo demás necesita (conexión → login → productos → carrito → envíos → pago),
  luego las APIs "extra" y al final el diseño. El diseño va al final porque cambiar colores no rompe nada,
  pero cambiar la lógica cuando ya hay diseño sí da trabajo doble.

### 1.6 Llevar un `SEGUIMIENTO.md` y este `DECISIONES.md` 🙋
- **Por qué:** para entender cada cosa y poder explicarla en la defensa.

### 1.7 Catálogo: ropa ancha, gorras y chándal, sin cadenas 🙋
- **Por qué:** es el estilo de la marca (raperos de los 2000) pero no quiero vender joyería.

---

## 2. Base de datos

### 2.1 MongoDB Atlas en vez de Mongo local 🙋
- **Por qué:** está en la nube y es gratis. Funciona desde cualquier PC (casa, clase) sin instalar MongoDB,
  y el profe puede probarlo igual.
- **Descartado:** Mongo local → habría que instalarlo en cada ordenador donde se pruebe.

### 2.2 Driver nativo (`mongodb`) en vez de Mongoose 🤖
- **Por qué:** en la corrección del examen el profe usa `this.dbService.updateOne('clientes', ...)` y `ObjectId`,
  que es el driver nativo. Hacerlo igual que él = menos sorpresas al corregir.
- **Descartado:** Mongoose → más "mágico" (esquemas, validaciones automáticas), pero es otra forma de trabajar
  que no hemos visto con el profe.

### 2.3 Una clase `DbService` como único punto de acceso a Mongo 🤖
- **Por qué:** igual que el `dbService` del profe. Si algún día cambio de base de datos,
  solo toco este archivo y no todos los controladores.

### 2.3.1 Modelo `Cliente` como clase con método estático `crear()` ⚙️
- **Por qué:** sin Mongoose no hay esquemas; esta clase garantiza que todos los clientes tienen los mismos campos.
- **Misma forma que PcComponentes** (`cliente.cuenta.email`, `fechaCreacion` en milisegundos...) y que la consulta del profe
  (`{ 'cuenta.email': ... }`).
- **Email en minúsculas y sin espacios** 🙋 → así la comprobación de "este email ya existe" (paso 2) funciona aunque cambien las mayúsculas.
  - Matiz: el estándar SMTP (RFC 5321) dice que la parte de antes de la @ *puede* distinguir mayúsculas,
    pero desaconseja aprovecharlo y casi ningún proveedor lo hace (Gmail, Outlook... tratan `Smith` y `smith` igual).
    Por eso normalizar a minúsculas es lo habitual.
  - Descartado: guardar el email tal cual y comparar sin mayúsculas al buscar → más "correcto" pero más complicado en Mongo.
- **Campos del registro:** nombre, apellidos, email, contraseña, teléfono (opcional) y casilla de novedades.
  La casilla de privacidad es obligatoria pero no se guarda: sin marcarla no se puede registrar.

### 2.4 Configuración del cluster: Free (M0), AWS, París, sin datos de ejemplo 🤖
- **Free:** 0 €, de sobra para un proyecto de clase (512 MB).
- **París:** una de las regiones más cercanas a España → menos tiempo de respuesta.
- **Sin "Preload sample dataset":** los datos de ejemplo ocupan espacio de los 512 MB y no los vamos a usar.
- **"Automate security setup" marcado:** crea el usuario y da acceso desde mi IP sin tener que hacerlo a mano.

### 2.5 Contraseña de la base de datos solo con letras y números 🤖
- **Por qué:** la contraseña va dentro de la cadena `mongodb+srv://usuario:contraseña@...`.
  Símbolos como `@ # / :` tienen significado en una URL y romperían la conexión.

### 2.6 Base de datos llamada `garabatoz` 🤖
- **Por qué:** nombre claro. Se cambia en el `.env` (`MONGODB_DB`) sin tocar código.

---

## 3. Backend (Node)

### 3.1 Express 5 ⚙️
- **Por qué:** es el framework más usado para APIs en Node y el que se ve en clase. La versión 5 es la actual
  y captura sola los errores de las funciones `async`.

### 3.2 `"type": "module"` (usar `import` en vez de `require`) ⚙️
- **Por qué:** es la forma moderna de JavaScript y la misma sintaxis que en Angular, así no mezclo dos estilos.

### 3.3 Carpetas `config / routes / controllers / services / models` ⚙️
- **Por qué:** cada capa tiene una sola tarea:
  - `routes` → qué URL va a qué método (sin lógica).
  - `controllers` → la lógica.
  - `services` → hablar con fuera (Mongo, APIs externas).
  - `models` → la forma de los datos.
  - `config` → leer el `.env`.

### 3.4 Los métodos del controlador DEVUELVEN la función `(req, res)` ⚙️
- **Qué:** `router.get('/', estadoController.comprobarEstado())` (con paréntesis).
- **Por qué:** es exactamente el patrón que el profe pone en la corrección. Además permite meter
  middlewares delante, como `AuthController.verificarAccessToken()`.

### 3.5 Pasar el `dbService` al controlador por el constructor (inyección de dependencias) ⚙️
- **Por qué:** así hay **una sola conexión** a Mongo para todo el servidor, creada en `server.js`.
  Si cada controlador creara la suya, se abrirían conexiones de más.

### 3.6 Conectar a Mongo ANTES de arrancar el servidor ⚙️
- **Por qué:** un servidor sin base de datos no sirve. Si Atlas falla, el proceso para con un mensaje claro
  (`❌ no se pudo conectar a MongoDB Atlas`) en vez de arrancar y fallar en cada petición.

### 3.7 `config.js` que lee el `.env` y avisa si falta `MONGODB_URI` ⚙️
- **Por qué:** todo el proyecto lee la configuración de un solo sitio. Si se me olvida el `.env`,
  me entero nada más arrancar con un error que dice exactamente qué falta.

### 3.8 Endpoint de prueba `GET /api/estado` ⚙️
- **Por qué:** comprobar de una vez que funcionan Angular → Node → Atlas antes de programar nada más.
  Si el login fallara, sabríamos que no es culpa de la conexión.

### 3.9 Todas las rutas empiezan por `/api` ⚙️
- **Por qué:** distingue claramente las peticiones de datos de las páginas, y es lo que usa el proxy de Angular.

### 3.10 `nodemon` para desarrollo ⚙️
- **Por qué:** reinicia el servidor solo al guardar un archivo. Sin él habría que parar y arrancar a mano cada vez.

---

## 4. Frontend (Angular)

### 4.1 Angular 22 (última versión), sin SSR 🤖
- **Por qué:** la misma versión que el proyecto de PcComponentes.
  SSR (renderizar en el servidor) no hace falta para este proyecto y complica la configuración.

### 4.2 Proxy (`proxy.conf.json`) en vez de escribir `http://localhost:3000` ⚙️
- **Por qué:** en el código solo pongo `/api/...`. Si el servidor cambia de dirección, cambio un archivo y no todos los servicios.
  Además evita problemas de CORS durante el desarrollo.

### 4.3 Los servicios van en `_shared_/services/` ⚙️
- **Por qué:** el proyecto de PcComponentes no tenía carpeta de servicios. Los pongo en `_shared_`
  porque los usan varias zonas (por ejemplo, `ClienteService` lo usarán el login, las direcciones y los pedidos).

### 4.4 Controladores como clases `@Injectable()` dadas en `providers` de cada vista ⚙️
- **Por qué:** en Angular no existe "controlador" como tal (el componente hace de todo). Para cumplir el MVC del profe,
  saco la lógica a una clase aparte. Al ponerla en `providers` de la vista, **cada vista tiene su propio controlador**
  y se borra al salir de ella.
- **Descartado:** meter la lógica en el `.ts` del componente → funciona, pero no sería MVC.

### 4.5 Signals para el estado de la vista ⚙️
- **Por qué:** es lo recomendado en Angular moderno. Cuando cambia el valor, la vista se repinta sola,
  sin tener que avisar a mano.

### 4.6 Sintaxis nueva `@if / @else` en las plantillas ⚙️
- **Por qué:** es la actual en Angular (sustituye a `*ngIf`) y se lee más fácil.

### 4.7 Interfaces para los datos (`IEstado`) ⚙️
- **Por qué:** TypeScript avisa si escribo mal un campo. Mismo estilo que `ICuenta` en PcComponentes.

### 4.8 Borrar `app.spec.ts` (el test de ejemplo) ⚙️
- **Por qué:** comprobaba el texto de la página de ejemplo de Angular, que he quitado. Habría fallado siempre.

### 4.9 Subir el límite de tamaño (`budgets`) a 1 MB ⚙️
- **Por qué:** Bootstrap hace que la app pase un poco de los 500 KB por defecto y salía un aviso al compilar.
  1 MB es normal para una app con Bootstrap.

### 4.10 Página en español (`lang="es"`) y título GARABATOZ ⚙️
- **Por qué:** el idioma correcto ayuda a los lectores de pantalla y al navegador (accesibilidad).

---

## 5. Diseño

### 5.1 Interfaz negra con grafitis con mucha personalidad 🙋
- **Por qué:** es la identidad de la marca.

### 5.2 Bootstrap solo para estructura, todo el aspecto con CSS propio 🤖 + 🙋
- **Por qué:** Bootstrap ahorra mucho en rejilla (filas/columnas responsive) y modales,
  pero su aspecto por defecto es muy "genérico". Con CSS propio queda original.
- **Bootstrap cargado desde `angular.json`** (CSS + JS) y nuestro `styles.css` después, para poder sobrescribirlo.

### 5.3 Sin música en la web 🙋
- **Por qué:** según el profe de Interfaces, la música automática empeora la experiencia de usuario
  y no queda estético.

### 5.4 El diseño va al final (fase 8) 🤖
- **Por qué:** ver 1.5. Mientras tanto, solo fondo negro y diseño básico.

### 5.5 Título en grafiti con la fuente Sedgwick Ave Display 🙋 + ⚙️
- **Elegido por Paulo:** fuente *Sedgwick Ave Display*, relleno blanco, borde negro, sombra 3D y letras giradas.
- **Fuente instalada con npm (`@fontsource`) en vez de cargarla desde Google Fonts** ⚙️: va dentro del proyecto,
  funciona sin internet y el navegador no hace peticiones a webs externas (en la línea de la regla del profe).
- **Sombra 3D gris oscuro y no negra** ⚙️: el fondo es negro, una sombra negra no se vería
  y el borde negro tampoco. Sobre el gris se distinguen los dos.
- **Letras en dos capas (`.letra` blanca + `::before` negra) en vez de un solo borde** ⚙️: el borde negro sobre la letra blanca
  se comía el relleno en algunos navegadores y las letras salían finas. Con dos capas de un solo color cada una
  se ve igual en todos y se pueden engordar.
- **La imagen de referencia (abecedario de @Appi.Art) solo como inspiración** 🤖: es obra de otro artista, no se copian sus letras.

### 5.6 Grafitis originales, no copiados 🤖
- **Por qué:** usar arte de otros puede dar problemas de derechos. Haremos SVG propios o fotos mías.

---

## 6. APIs

### 6.1 Lista de APIs elegidas 🤖 + 🙋
| API | Por qué |
|---|---|
| API REST propia | Base de todo; ya cuenta como API |
| GeoAPI | Provincias y poblaciones para las direcciones de envío. Es lo que pedía el profe en el examen |
| Login con Google | Muy usado en webs reales y estaba en PcComponentes |
| Stripe (modo prueba) | Para que el carrito tenga pago, sin cobrar dinero de verdad |
| Cloudinary | Guardar las fotos de la ropa en la nube |
| Nodemailer | Email de bienvenida al registrarse |

- **Descartado:** Spotify / música (ver 5.3).

### 6.2 Las APIs las meto yo siguiendo los pasos 🙋
- **Por qué:** para aprender a integrarlas y poder explicarlo en la defensa.

---

## 7. Seguridad

### 7.1 El frontend NUNCA llama a APIs externas: todo pasa por Node 🤖
- **Por qué:** fue el "fallo gordo" del examen (casi suspenso). Todo lo que hay en Angular se puede leer
  en el navegador con F12, así que cualquier clave secreta ahí quedaría a la vista. Node hace de puente (gateway).

### 7.2 Secretos en `.env`, que no se sube a git ⚙️
- **Por qué:** la contraseña de Atlas (y luego las claves de Google, Stripe...) no pueden acabar en GitHub.
  El `.gitignore` excluye `.env` y `node_modules`. El `.env.example` explica qué rellenar, sin datos reales.

### 7.3 CORS solo para `http://localhost:4200` ⚙️
- **Por qué:** Node solo acepta peticiones desde el navegador de nuestro Angular, no desde cualquier web.

### 7.4 (Fase 2, pendiente) Contraseñas cifradas con bcrypt y sesión con JWT 🤖
- **bcrypt:** si alguien entra en la base de datos, no puede leer las contraseñas.
- **JWT:** el servidor no tiene que guardar sesiones; el cliente enseña su "pulsera" en cada petición.
- **`idCliente` sacado del token, no de la URL:** lo pide el profe; si fuera en la URL, cualquiera
  podría cambiar el número y tocar los datos de otro cliente.
