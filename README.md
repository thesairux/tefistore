# Tefi Store — página de venta de zapatos

Página de catálogo con **bolsa de compra**, **tallas con stock real**, **despachos**, **cupones**,
envío del pedido por **WhatsApp** y un **asistente con IA** que responde dudas de los clientes.

Es una página estática (HTML, CSS y JavaScript, sin frameworks) más una función de servidor para el
asistente. Funciona en Cloudflare Pages, Cloudflare Workers o Vercel.

---

## 1. Lo que hay que saber para usarla

**Todo lo que se ve en la página se edita en un solo archivo: `catalogo.js`.**
Ahí están los datos de la tienda, los colores de la marca, el horario, los despachos, los cupones y
todos los modelos con su precio, sus colores y cuántos pares quedan en cada talla.

Ejemplo de un producto:

```js
{
  "id": "zapatilla-nube",                 // no se repite y no se cambia (el asistente lo usa)
  "nombre": "Zapatilla urbana Nube",
  "marca": "Nordic",
  "precio": 39990,                        // sin punto ni signo
  "precioAntes": 49990,                   // opcional: muestra el descuento
  "foto": "img/catalogo/zapatilla-nube.svg",
  "detalle": "Cuero sintético liso...",
  "material": "Cuero sintético",
  "colores": [{ "nombre": "Blanco", "hex": "#f2f0ec" }],
  "etiquetas": ["oferta"],                // "nuevo", "oferta" o "ultimos"
  "destacado": true,                      // sale en la portada
  "tallas": { "35": 2, "36": 4, "37": 5, "38": 3, "39": 0, "40": 1 }
}
```

- **Talla agotada:** déjala en `0`. Sale tachada y no se puede elegir.
- **Producto sin tallas** (calcetines, betún, plantillas): `"tallaUnica": true` y `"stock": 12`.
- **Esconder un producto:** `"disponible": false`.
- Los demás campos (tienda, horario, despachos, cupones, guía de tallas) están explicados con
  comentarios al principio del mismo archivo.

### Las fotos

Las imágenes que vienen (`img/catalogo/*.svg`) son **dibujos de ejemplo**, no fotos reales.
Cuando tengas las fotos de la tienda:

1. Guárdalas en `img/catalogo/` (de preferencia `.webp` o `.jpg`, ~800 px de ancho).
2. Cambia la ruta en `"foto"` dentro de `catalogo.js`.

Para volver a generar los dibujos de ejemplo (si agregas productos nuevos):

```sh
python3 herramientas/imagenes.py
```

Usa el campo `"forma"` de cada producto: `zapatilla`, `bota`, `taco`, `sandalia`, `mocasin`,
`caja`, `frasco`, `cordon` o `accesorio`. Con fotos reales ese campo deja de importar.

---

## 2. El asistente

Abajo a la derecha hay un chat que responde dudas de los clientes: tallas, stock por talla,
despachos, formas de pago, cambios, horario y recomendaciones. Cuando recomienda un modelo lo
muestra como tarjeta, y al tocarla se abre la ficha para elegir la talla.

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

## 3. Publicar la página

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

## 4. Los archivos

```
catalogo.js              ← TODO lo que se edita: tienda, colores, horario, despachos, productos
index.html               La página
css/estilos.css          Estilos (incluye modo oscuro)
js/tema.js               Aplica los colores de la marca de catalogo.js
js/app.js                Catálogo, filtros, ficha, bolsa y mensaje de WhatsApp
js/asistente.js          El chat (modo IA y modo básico)
functions/api/asistente.js   Servidor del asistente (Cloudflare Pages y Workers)
api/asistente.js         El mismo servidor, para Vercel
lib/comun.js             Utilidades de los servidores (no se publica)
lib/vercel.js            Adaptador de Vercel (no se publica)
worker.js                Entrada para Cloudflare Workers
herramientas/construir.sh    Arma dist/
herramientas/imagenes.py     Genera los dibujos de ejemplo del catálogo
img/catalogo/            Imágenes de los productos
```

---

## 5. Preguntas frecuentes

**¿Se cobra desde la página?**
No. La página arma el pedido y lo manda por WhatsApp; el pago se coordina ahí. Por eso los precios
y el stock se muestran como referenciales.

**Cambié un precio y no se ve.**
Es la caché del navegador. Recarga con `Ctrl+F5` (o `Cmd+Shift+R`). En Cloudflare y Vercel el
archivo `catalogo.js` ya se sirve sin caché.

**¿Cómo cambio los colores de la marca?**
En `catalogo.js`, en `"tema"`: `"color"` es el principal (botones y detalles) y `"colorDestacado"`
el de los títulos resaltados.

**¿Cómo cambio el número de WhatsApp?**
En `catalogo.js` → `negocio.whatsapp` (solo números, con el 56 adelante) y `negocio.whatsappVisible`
(como se muestra en pantalla).
