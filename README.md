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
- **Categorías:** las de `"categorias"` arman solas el menú de arriba, el menú del celular, los
  filtros y el pie. Puedes agregar, renombrar o reordenar.
- **Portada:** `"portada"` es una lista; cada elemento es una imagen con su título. Si hay más de
  una, aparecen los puntitos y van rotando.
- **Despachos:** cada zona de `"envios"` puede tener sus `"comunas"` o sus `"regiones"`. Cuando el
  cliente escribe su comuna en el checkout, la página elige sola la zona y su precio. La zona con
  `"regiones": ["*"]` es la que se usa cuando no calza ninguna otra.
- El resto de los campos está explicado con comentarios al principio del mismo archivo.

### Las fotos

Son las del catálogo de Instagram. A las piezas publicitarias (las de fondo lila) se les quitó el
fondo, el logo y los textos, así todos los modelos quedan sobre blanco. Cuatro modelos
(Kallpa, Inti Oro y Yastay Ébano) solo tenían fotos con la bota puesta: esas se dejaron tal cual,
bien encuadradas.

**Para agregar un modelo nuevo:** guarda su foto en `img/catalogo/` (`.webp` o `.jpg`, proporción
4:3, ~1200 px de ancho, de preferencia fondo blanco) y escribe la ruta en `"fotos"`. Si la foto no
es 4:3 no pasa nada: la página la recorta centrada.

Las imágenes de la portada son `img/portada-1.webp`, `-2` y `-3`, y la de la banda del medio es
`img/temporada.webp`.

---

## 2. Cómo compra el cliente

1. **Catálogo** → elige una categoría, filtra por su talla u ordena por precio.
2. **Ficha del producto** → fotos, tallas con stock real, cantidad, «Agregar al carrito» y
   «Agregar a favoritos». Abajo: descripción, materiales, cambios y despacho.
3. **Carrito** (panel lateral) → cambia cantidades, ve el subtotal y sigue a «Finalizar compra».
   También puede saltarse el formulario con «Comprar por WhatsApp».
4. **Checkout** → datos de contacto, envío a domicilio o retiro en la tienda, dirección,
   **cupón de descuento** y el total con el despacho ya calculado.
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

## 3. El asistente

Abajo a la derecha hay un chat que responde dudas: tallas, stock por talla, despachos, formas de
pago, cambios, horario y recomendaciones. Cuando recomienda un modelo lo muestra como tarjeta, y al
tocarla se abre su ficha.

Funciona de dos maneras:

| | Cuándo | Qué responde |
|---|---|---|
| **Con IA** | Hay una clave de Claude configurada | Entiende preguntas escritas de cualquier forma, usando el catálogo completo |
| **Modo básico** | No hay clave, o se abre el archivo sin servidor | Responde solo con el catálogo: tallas, stock, despachos, pagos, cambios, horario y búsqueda |

**La página nunca deja de funcionar por no tener la clave.** Sin ella el chat sigue respondiendo.

### Configurar la IA

1. Saca una clave en [console.anthropic.com](https://console.anthropic.com).
2. Guárdala como variable del proyecto, **nunca dentro del código**:
   - **Cloudflare:** Settings → Variables and Secrets → `ANTHROPIC_API_KEY` (tipo *Secret*).
   - **Vercel:** Settings → Environment Variables → `ANTHROPIC_API_KEY`.
3. Vuelve a publicar.

Opcional: `ASISTENTE_MODELO` para cambiar el modelo (por defecto `claude-haiku-5-5`, rápido y barato).

Para revisar que quedó bien, abre `tu-pagina/api/asistente` en el navegador: dice si la clave está
puesta (nunca la muestra).

**Cuidado con el gasto:** cada mensaje del cliente es una llamada a la API. El servidor ya trae dos
protecciones: solo responde a peticiones de la propia página y limita a 25 mensajes cada 10 minutos
por persona. El catálogo se manda con caché para que las preguntas seguidas salgan más baratas.

---

## 4. Publicar la página

El comando de construcción arma `dist/` con **solo** los archivos de la página (los servidores y las
herramientas no quedan a la vista).

### Cloudflare Pages (lo más simple)

1. Conecta el repositorio en Cloudflare → Workers & Pages → Create → Pages.
2. Build command: `sh herramientas/construir.sh`
3. Build output directory: `dist`
4. Agrega la variable `ANTHROPIC_API_KEY` y vuelve a publicar.

La carpeta `functions/` la toma Cloudflare sola: ahí vive `/api/asistente`.

### Vercel

1. Importa el repositorio. La configuración ya está en `vercel.json`.
2. Agrega `ANTHROPIC_API_KEY` en Environment Variables.

La carpeta `api/` es la que usa Vercel; por dentro llama al mismo servidor de `functions/`.

### Cloudflare Workers (dirección `.workers.dev`)

Está `wrangler.jsonc` y `worker.js`. Publicar: `npx wrangler deploy`.

### Probar en tu computador

```sh
python3 -m http.server 8787
```

y abre `http://localhost:8787`. Así el chat anda en modo básico (no hay servidor para `/api/`).

---

## 5. Los archivos

```
catalogo.js              ← TODO lo que se edita: tienda, colores, portada, despachos, cupones, productos
index.html               La página (una sola; las vistas se arman con JavaScript)
css/estilos.css          Estilos
js/tema.js               Aplica los colores de la marca de catalogo.js
js/app.js                Menú, portada, catálogo, ficha, carrito, checkout y mensaje de WhatsApp
js/asistente.js          El chat (modo IA y modo básico)
functions/api/asistente.js   Servidor del asistente (Cloudflare Pages y Workers)
api/asistente.js         El mismo servidor, para Vercel
lib/comun.js             Utilidades de los servidores (no se publica)
lib/vercel.js            Adaptador de Vercel (no se publica)
worker.js                Entrada para Cloudflare Workers
herramientas/construir.sh    Arma dist/
img/                     Portada, íconos y fotos de los productos
```

Las direcciones internas (lo que va después del `#`): `#/` portada, `#/catalogo` todo,
`#/c/botines` una categoría, `#/p/<id>` una ficha, `#/favoritos` lo guardado y `#/checkout`.
Se pueden compartir: cada una abre directo donde corresponde.

---

## 6. Preguntas frecuentes

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

## 7. Lo que falta para publicar

1. **El número de WhatsApp** (`negocio.whatsapp`). Mientras diga `56900000000`, los pedidos no
   llegan a ninguna parte.
2. **La dirección**, si quieres mostrar la tienda y el mapa.
3. **Los precios de despacho** de `negocio.envios`: están puestos como ejemplo.
4. **El stock por talla**, cuando lo tengas contado (ver «Las tallas»).
5. Revisar que «Envíos a todo Chile» de la barra de arriba sea efectivo.
