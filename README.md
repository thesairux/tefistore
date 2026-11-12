# Tefi Store — página de venta de calzado

Tienda de zapatos con **catálogo por categorías**, **ficha de producto**, **carrito lateral**,
**checkout con cupón de descuento** y un **asistente con IA** que responde dudas de los clientes.
El pedido se envía armado por **WhatsApp**.

Es una página estática (HTML, CSS y JavaScript, sin frameworks) más una función de servidor para el
asistente. Funciona en Cloudflare Pages, Cloudflare Workers o Vercel.

---

## 1. Lo que hay que saber para usarla

**Todo lo que se ve en la página se edita en un solo archivo: `catalogo.js`.**
Ahí están los datos de la tienda, los colores de la marca, el horario, los despachos, los cupones,
la guía de tallas, las imágenes de la portada y todos los modelos con su precio y sus tallas.

Los productos, precios y descripciones salen del catálogo de Instagram (@tefistore_style).

Ejemplo de un producto:

```js
{
  "id": "intiara-camel",                    // no se repite y no se cambia (el asistente lo usa)
  "nombre": "Intiara Camel",
  "precio": 22990,                          // sin punto ni signo
  "precioAntes": 25990,                     // opcional: muestra el precio tachado y el % de descuento
  "fotos": ["img/catalogo/intiara-camel.webp"],   // la primera es la del catálogo
  "detalle": "Botín de gamuza premium con doble hebilla lateral.",
  "descripcion": "Un nombre que simboliza luz...",      // se ve en «Descripción»
  "material": "Tipo gamuza premium",
  "cuidados": "Limpia con cepillo seco.",               // se ve en «Material y cuidados»
  "colores": [{ "nombre": "Camel", "hex": "#a9682f" }],
  "nota": "Horma pequeña: se recomienda pedir una talla más.",
  "etiquetas": [],                          // "nuevo", "oferta" o "ultimos"
  "destacado": true,                        // sale en la portada
  "tallas": "35-40"
}
```

### Las tallas

`"tallas"` se puede escribir de dos formas:

| Forma | Qué hace |
|---|---|
| `"35-40"` | Esas tallas están disponibles. La página no promete cuántos pares hay. |
| `{ "35": 2, "36": 4, "39": 0 }` | Cuántos pares quedan. Aparece «última» o «quedan 2», y la talla en 0 sale tachada. |

Hoy está la primera forma, porque el stock por talla todavía no está contado. Cuando lo tengas,
cambia el rango por el detalle y la página empieza a mostrar el stock real sola.

- **Esconder un producto:** `"disponible": false`.
- **Producto sin tallas** (un accesorio, por ejemplo): `"tallaUnica": true` y `"stock": 12`.
- **Categorías:** las de `"categorias"` arman solas el menú de arriba, el menú del celular, el
  filtro «Tipo de zapato» del catálogo y el pie. Puedes agregar, renombrar o reordenar. Cada una
  lleva su `"foto"`, que es la que sale en «Compra por categoría»; si la dejas vacía se usa la del
  primer producto.
- **Portada:** `"portada"` es una lista; cada elemento es una imagen con su título. Si hay más de
  una, aparecen los puntitos y van rotando. `"portadaSegundos"` dice cuánto dura cada imagen
  (entre 2 y 20; por defecto 4).
- **Despachos:** cada zona de `"envios"` puede tener sus `"comunas"` o sus `"regiones"`. Cuando el
  cliente escribe su comuna en el checkout, la página elige sola la zona. La zona con
  `"regiones": ["*"]` es la que se usa cuando no calza ninguna otra.
- **Envíos por pagar:** con `"envioPorPagar": true` el despacho no se suma al total y la página lo
  muestra como «Por pagar» en el checkout y en el mensaje de WhatsApp. Si algún día cobras el
  envío, ponlo en `false` y agrega `"precio"` a cada zona.
- **Retiro:** con `"retiroEnTienda": true` aparece la opción de retirar sin costo. `"retiroComuna"`
  dice dónde (hoy, La Serena); fuera de ahí el pedido va por despacho, y ese es por pagar.
- **Políticas de compra:** las de `"politicas"` salen en el pie, bajo «Antes de comprar». Cada una
  abre una ventana con su texto, igual que la guía de tallas. También están en la ficha de cada
  producto, y el asistente las respeta cuando le preguntan.
- El resto de los campos está explicado con comentarios al principio del mismo archivo.

### Las fotos

Son las del catálogo de Instagram. A las piezas publicitarias (las de fondo lila) se les quitó el
fondo, el logo y los textos, así todos los modelos quedan sobre blanco. Cuatro modelos
(Kallpa, Inti Oro y Yastay Ébano) solo tenían fotos con la bota puesta: esas se dejaron tal cual,
bien encuadradas.

**Para agregar un modelo nuevo:** guarda su foto en `img/catalogo/` (`.webp` o `.jpg`, proporción
4:3, ~1200 px de ancho, de preferencia fondo blanco) y escribe la ruta en `"fotos"`. Si la foto no
es 4:3 no pasa nada: la página la recorta centrada.

De cada foto del catálogo hay además una copia de 700 px (`nombre-700.webp`), que es la que baja el
navegador en las tarjetas chicas: el catálogo pesa así menos de la mitad. Las genera el script
`herramientas/miniaturas.py`; hay que volver a correrlo si agregas fotos a mano (las que subes
desde el panel no la necesitan, porque ya van achicadas).

Las imágenes de la portada son `img/portada-1.webp`, `-2` y `-3`. La banda del medio y las fotos
de «Compra por categoría» apuntan a una foto del catálogo, y se pueden cambiar desde el panel.

Cuando un producto tiene una foto por color (misma cantidad de fotos que de colores), la ficha
muestra el nombre del color bajo cada miniatura y dice cuál está elegido.

---

## 2. Cómo compra el cliente

1. **Catálogo** → elige una categoría, filtra por su talla u ordena por precio.
2. **Ficha del producto** → fotos, tallas con stock real, cantidad, «Agregar al carrito» y
   «Agregar a favoritos». Abajo: descripción, materiales, cambios y despacho.
3. **Carrito** (panel lateral) → cambia cantidades, ve el subtotal y sigue a «Finalizar compra».
   También puede saltarse el formulario con «Comprar por WhatsApp».
4. **Checkout** → datos de contacto, envío a domicilio o retiro, dirección y **cupón de
   descuento**. El envío es por pagar, así que no se suma al total.
5. **Enviar pedido por WhatsApp** → llega todo escrito al WhatsApp de la tienda.

Desde la página no se cobra nada: el pago se coordina por WhatsApp. Por eso los precios y el stock
se muestran como referenciales.

### Los cupones

Se configuran en `"cupones"` dentro de `catalogo.js` y hay tres tipos:

| `"tipo"` | Qué hace | Ejemplo |
|---|---|---|
| `"porcentaje"` | Descuenta un % de los productos | `{"codigo":"PRIMERPAR","tipo":"porcentaje","valor":10,"tope":8000}` |
| `"monto"` | Descuenta una cantidad fija | `{"codigo":"DOSPARES","tipo":"monto","valor":6000,"minimo":70000}` |
| `"envio"` | Deja el despacho en $0 | `{"codigo":"ENVIOGRATIS","tipo":"envio","valor":0,"minimo":40000}` |

Opcionales: `"minimo"` (compra mínima), `"tope"` (descuento máximo de un porcentaje), `"desde"` y
`"hasta"` (`"2026-12-31"`), `"activo": false` (apagado) y `"visible": false` (no se publica en la
página; sirve para redes o volantes, el cliente igual lo puede escribir).

Los cupones visibles salen en la portada y como sugerencia en el checkout. **Ojo:** los códigos se
pueden leer en el archivo, así que la tienda confirma cada cupón por WhatsApp.

---

## 3. El panel de administración

En **tu-pagina/admin** hay un panel para cambiar la tienda sin tocar código. Lo que haces ahí se
guarda en `catalogo.js` dentro del repositorio, y la página se vuelve a publicar sola en un par de
minutos.

Qué se puede editar:

| Pestaña | Qué cambia |
|---|---|
| **Productos** | Nombre, precio, precio anterior, categoría, fotos, textos, colores, aviso de horma, cinta, destacado, esconder. Agregar y eliminar modelos. |
| **Portada** | La barra de arriba, las imágenes de portada (con los segundos que dura cada una), la banda del medio y los tres pasos. |
| **Tienda** | WhatsApp, Instagram, dirección, retiro, zonas de despacho, formas de pago y las políticas de compra. |
| **Cupones** | Crear, apagar y borrar cupones. |
| **Ajustes** | Colores de la marca, categorías (con su foto), guía de tallas y los títulos de cada sección. |
| **Estadísticas** | Visitas, clics a WhatsApp, embudo de compra y los modelos más vistos. Ver la sección 5. |

### Las tallas, desde el panel

Cada producto tiene dos modos:

- **Rango** (`35-40`): se ofrecen esas tallas sin prometer cuántos pares hay.
- **Stock por talla**: escribes cuántos pares quedan de cada una. En 0 la talla sale tachada, y con
  1 o 2 la ficha avisa «última» o «quedan 2». El filtro del catálogo empieza a esconder los modelos
  que no tengan la talla buscada.
- **Stock por color y talla** (solo si el modelo tiene dos o más colores): una tabla por color. En
  la página, la clienta elige primero el color y ve solo las tallas que hay de ese color; un color
  sin pares aparece tachado como «sin stock», y el color elegido viaja en el pedido de WhatsApp.
  En `catalogo.js` queda como un `"tallas"` dentro de cada color.

Para pasar de uno a otro, los botones están arriba de las tallas.

### Las fotos

Todas las fotos se eligen desde el teléfono o el computador: no se pega ninguna ruta ni ningún
enlace. Las de los productos se recortan solas a 4:3 sobre fondo blanco; las de la portada, la
banda y las categorías llenan el marco recortando lo que sobra. El panel las achica y las guarda
en la carpeta `fotos/` del repositorio. La primera foto de la lista es la que se ve en el catálogo; las
demás salen en la ficha con las flechas. Las fotos que dejas de usar se borran al guardar.

### El token de GitHub

El panel guarda haciendo un commit, así que el token necesita **permiso de escritura**, no solo
de lectura. Con un token «fine-grained»: GitHub → Settings → Developer settings → Personal access
tokens → Fine-grained tokens → el token → Repository permissions → **Contents: Read and write**.
Con uno clásico, el permiso `repo`.

Si le falta ese permiso, el panel deja entrar y muestra el catálogo (leer sí puede), pero al
guardar avisa «El token de GitHub no tiene permiso para escribir en el repositorio».

Para revisarlo, abre `tu-pagina/api/admin?probar=1`: dice si encuentra el repositorio, si la rama
existe y si el token **puede escribir de verdad** (lo comprueba creando un objeto suelto, que no
aparece en el historial y GitHub borra solo). Nunca muestra el token.

### Configurarlo

Necesita dos claves en las variables del proyecto (Cloudflare: Settings → Variables and Secrets;
Vercel: Settings → Environment Variables). Las dos como **Secret**:

| Variable | Para qué |
|---|---|
| `ADMIN_PASSWORD` | La contraseña del panel. Mínimo 12 caracteres. **Sin ella el panel no deja entrar a nadie.** |
| `GITHUB_TOKEN` | Un token de GitHub con permiso *Contents: Read and write* sobre este repositorio. Es el que guarda los cambios. |
| `GITHUB_REPO` | `usuario/repositorio`. En Vercel se deduce solo; en Cloudflare hay que ponerlo. |
| `ADMIN_USER` | Opcional. El usuario del panel; si no lo pones es `tefistore`. |
| `GITHUB_BRANCH` | Opcional. La rama donde se guarda; si no lo pones, la publicada. |

El token se saca en GitHub → Settings → Developer settings → Personal access tokens → Fine-grained,
dándole acceso solo a este repositorio.

Para revisar que quedó bien, abre `tu-pagina/api/admin` en el navegador: dice qué falta (nunca
muestra las claves).

**El panel no se indexa** en Google (`robots.txt` y la cabecera `noindex`), pero igual conviene una
contraseña larga: con ella se puede cambiar todo lo que se ve en la página.

---

## 4. El asistente

Abajo a la derecha hay un chat que responde dudas: tallas, stock por talla, despachos, formas de
pago, cambios, horario y recomendaciones. Cuando recomienda un modelo lo muestra como tarjeta, y al
tocarla se abre su ficha.

Funciona de dos maneras:

El chat siempre intenta primero con el catálogo, y solo pasa a la IA lo que el catálogo no supo
responder:

| | Quién contesta | Qué responde |
|---|---|---|
| **Siempre** | El catálogo, en el navegador | Tallas, horma, stock, precios, despacho, plazos, retiro, pagos, cupones, políticas, categorías y búsqueda. Es instantáneo, no gasta cupo y lo que dice es exactamente lo publicado. |
| **Solo si hay clave** | La IA (Gemini o Claude) | Las preguntas raras, las que están mal escritas o las que piden una recomendación. |

Ese orden importa por dos razones: los datos que no pueden salir mal (sobre todo que **no hay
cambios ni devoluciones**) nunca los inventa un modelo, y con el plan gratuito de Gemini el cupo
diario rinde mucho más, porque la mayoría de las preguntas ni siquiera llega a Google.

**La página nunca deja de funcionar por no tener la clave**, y si el cupo se acaba el chat sigue
igual: la clienta no ve ningún error.

### Configurar la IA

Sirve cualquiera de las dos. **Gemini tiene plan gratuito**; Claude es de pago.

| Variable | Dónde se saca | Costo |
|---|---|---|
| `GEMINI_API_KEY` | [aistudio.google.com](https://aistudio.google.com) → Get API key | Plan gratuito con un tope de mensajes por día |
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) | De pago, por uso |

1. Saca la clave donde corresponda.
2. Guárdala como variable del proyecto, **nunca dentro del código**:
   - **Cloudflare:** Settings → Variables and Secrets → el nombre de arriba, tipo **Secret**.
   - **Vercel:** Settings → Environment Variables.
3. Vuelve a publicar (las variables no se aplican hasta el siguiente despliegue).

Si pones las dos, manda Gemini.

Opcionales: `GEMINI_MODELO` y `ASISTENTE_MODELO` para elegir el modelo. Google les cambia el
nombre seguido, así que si el que pusiste ya no existe, el servidor busca solo uno de la familia
*flash* que tu cuenta sí tenga; por eso normalmente no hace falta tocar nada.

Para revisar que quedó bien, abre `tu-pagina/api/asistente` en el navegador: dice si hay clave,
cuál de las dos se está usando y con qué modelo (nunca muestra la clave).

**Cuando se acaba el cupo diario del plan gratuito**, Google responde 429 y el chat vuelve solo al
modo básico, sin romperse ni mostrar errores raros.

**Cuidado con el gasto:** cada mensaje del cliente es una llamada a la API. El servidor ya trae dos
protecciones: solo responde a peticiones de la propia página y limita a 25 mensajes cada 10 minutos
por persona. El catálogo se manda con caché para que las preguntas seguidas salgan más baratas.

---

## 5. Las estadísticas

En el panel, la pestaña **Estadísticas** muestra visitas, clics a WhatsApp, uso del asistente, el
embudo (cuántas agregan algo, abren el carrito y envían el pedido) y los modelos más vistos y más
agregados.

**No se guarda nada de la persona**: ni IP, ni nombre, ni teléfono, ni qué compró cada una. Solo
contadores por día y cuántas veces se vio o se agregó cada modelo.

Para activarlas hace falta una base de datos gratuita de Cloudflare (D1). Se hace una sola vez:

1. En Cloudflare: **Storage & Databases → D1 → Create**. Nómbrala `tefistore-estadisticas`.
2. Copia el **Database ID**.
3. En el repositorio, abre `wrangler.jsonc`: la línea de `d1_databases` está comentada. Quítale las
   barras del principio y pega ahí el ID.
4. Guarda y espera el despliegue. Desde ahí se empiezan a contar las visitas.

Sin la base, la página funciona igual: no se cuenta nada y el panel explica estos pasos. En Vercel
no hay D1, así que ahí la analítica queda apagada.

---

## 6. Publicar la página

El comando de construcción arma `dist/` con **solo** los archivos de la página (los servidores y las
herramientas no quedan a la vista).

### Cloudflare Pages (lo más simple)

1. Conecta el repositorio en Cloudflare → Workers & Pages → Create → Pages.
2. Build command: `sh herramientas/construir.sh`
3. Build output directory: `dist`
4. Agrega la variable `GEMINI_API_KEY` (o `ANTHROPIC_API_KEY`) y vuelve a publicar.

La carpeta `functions/` la toma Cloudflare sola: ahí vive `/api/asistente`.

### Vercel

1. Importa el repositorio. La configuración ya está en `vercel.json`.
2. Agrega `GEMINI_API_KEY` (o `ANTHROPIC_API_KEY`) en Environment Variables.

La carpeta `api/` es la que usa Vercel; por dentro llama al mismo servidor de `functions/`.

### Cloudflare Workers (dirección `.workers.dev`)

Está `wrangler.jsonc` y `worker.js`. Publicar: `npx wrangler deploy`.

### Probar en tu computador

```sh
python3 -m http.server 8787
```

y abre `http://localhost:8787`. Así el chat anda en modo básico (no hay servidor para `/api/`).

---

## 7. Los archivos

```
catalogo.js              ← TODO lo que se edita: tienda, colores, portada, despachos, cupones, productos
index.html               La página (una sola; las vistas se arman con JavaScript)
admin.html               El panel de administración (tu-pagina/admin)
css/estilos.css          Estilos
js/tema.js               Aplica los colores de la marca de catalogo.js
js/app.js                Menú, portada, catálogo, ficha, carrito, checkout y mensaje de WhatsApp
js/asistente.js          El chat (modo IA y modo básico)
functions/api/asistente.js   Servidor del asistente (Cloudflare Pages y Workers)
functions/api/admin.js       Servidor del panel: guarda los cambios en GitHub
api/asistente.js         Los mismos servidores, para Vercel
api/admin.js
lib/comun.js             Utilidades de los servidores (no se publica)
lib/vercel.js            Adaptador de Vercel (no se publica)
worker.js                Entrada para Cloudflare Workers
herramientas/construir.sh    Arma dist/
img/                     Portada, íconos y fotos de los productos
fotos/                   Las fotos que subes desde el panel
```

Las direcciones internas (lo que va después del `#`): `#/` portada, `#/catalogo` todo,
`#/c/botines` una categoría, `#/p/<id>` una ficha, `#/favoritos` lo guardado y `#/checkout`.
Se pueden compartir: cada una abre directo donde corresponde.

---

## 8. Preguntas frecuentes

**¿Se cobra desde la página?**
No. La página arma el pedido y lo manda por WhatsApp; el pago se coordina ahí.

**Cambié un precio y no se ve.**
Es la caché del navegador. Recarga con `Ctrl+F5` (o `Cmd+Shift+R`). En Cloudflare y Vercel el
archivo `catalogo.js` ya se sirve sin caché.

**¿Cómo cambio los colores de la marca?**
En `catalogo.js`, en `"tema"`: `"color"` es el principal (botones, precios, barra de arriba) y
`"colorDestacado"` el de los detalles dorados.

**¿Cómo cambio el número de WhatsApp?**
En `catalogo.js` → `negocio.whatsapp` (solo números, con el 56 adelante) y `negocio.whatsappVisible`
(como se muestra en pantalla).

**¿Dónde cambio el texto de la barra de arriba?**
En `catalogo.js` → `"anuncio"`. Cada texto de la lista se separa con una barrita.

**No aparece la sección de la tienda ni el mapa.**
Es a propósito: `"direccion"` está vacía. Escribe la dirección del local en `catalogo.js` y la
sección aparece sola, con su mapa y su horario.

---

## 9. Lo que falta para publicar

1. **La dirección**, si quieres mostrar la tienda y el mapa.
2. **Los plazos de despacho** de `negocio.envios`: están puestos como estimación.
3. **El stock por talla**, cuando lo tengas contado (ver «Las tallas»).
4. Revisar que «Envíos a todo Chile» de la barra de arriba sea efectivo.
