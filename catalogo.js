/*
  CATÁLOGO DE TEFI STORE
  ======================
  Este es el ÚNICO archivo que hay que editar para cambiar la página: los datos de la tienda,
  los colores, el horario, los despachos, los cupones y todos los zapatos con sus tallas.
  Cambia el texto entre comillas o el número y guarda.

  Reglas rápidas
  --------------
  - Los precios van sin punto ni signo: 22990 (no "$22.990").
  - "tallas" se puede escribir de dos formas:
      "35-40"                      → esas tallas están disponibles (sin contar pares)
      { "35": 2, "36": 4, "37": 0 } → cuántos pares quedan de cada talla.
        Con esta forma la página avisa «última» o «quedan 2», y la talla en 0 sale tachada.
    Si no llevas la cuenta del stock, deja el rango: es lo más simple y no promete lo que no hay.
  - "fotos": una o varias. La primera es la que se ve en el catálogo; las demás salen en la ficha
    con las flechas. Guárdalas en img/catalogo/ y escribe la ruta.
  - "precioAntes": precio anterior. Si lo pones, se muestra tachado y aparece el % de descuento.
  - "nota": aviso corto que sale junto a las tallas (por ejemplo, si la horma es pequeña).
  - "destacado": true lo muestra en la portada, en «Destacados».
  - "etiquetas": ["nuevo"], ["oferta"] o ["ultimos"] → la cinta de la tarjeta.
  - Para esconder un producto sin borrarlo: "disponible": false
  - "categorias" arman solas el menú de arriba, el del celular, los filtros y el pie.
  - Lo que quede vacío ("") no se muestra: por ejemplo, sin "direccion" no aparece la sección Tienda.
  - "envios": cada zona puede tener sus "comunas" o sus "regiones". Cuando el cliente escribe su
    comuna en el checkout, la página elige sola la zona y su precio. La zona con "regiones": ["*"]
    es la que se usa cuando no calza ninguna otra.
  - "envioPorPagar": true → el cliente paga el envío al recibirlo, así que NO se suma al total del
    pedido; la página lo muestra como «por pagar». Si algún día cobras el envío, ponlo en false y
    agrégale "precio" a cada zona de "envios".
  - "envioGratisDesde": 60000 → sobre ese monto el despacho sale $0. Pon 0 para desactivarlo
    (con "envioPorPagar": true no se usa).
  - "politicas": las reglas de compra, cada una con su "titulo" y su "texto". Salen numeradas en
    la portada, en el pie y en la ficha de cada producto.
  - "pasos": los tres pasos de «Comprar es simple». "icono": talla, camion, wsp, bolsa o tienda.
  - "cupones": códigos de descuento (uno por pedido). Está vacío; abajo quedó el ejemplo del formato.
  Cuidado con las comas: cada elemento de una lista va separado por una coma.

  POR COMPLETAR (lo que falta para publicar)
  ------------------------------------------
  1. "direccion": la dirección del local. Si la dejas vacía, la página no muestra la sección Tienda
     ni el mapa, y el retiro se coordina por WhatsApp.
  2. "envios": revisa los plazos reales de cada zona.
  3. Stock por talla: cuando lo tengas, cambia "35-40" por { "35": 2, ... } en cada modelo.
*/
window.CATALOGO = {
  "negocio": {
    "nombre": "Tefi Store",
    "rubro": "Calzado",
    "whatsapp": "56941706063",
    "whatsappVisible": "+56 9 4170 6063",
    "instagram": "tefistore_style",
    "facebook": "",
    "correo": "",
    "direccion": "",
    "sector": "",
    "ciudad": "La Serena",
    "region": "Coquimbo",
    "mapa": "",
    "mapaBusqueda": "",
    "retiroEnTienda": true,
    "nombreRetiro": "Retiro en La Serena",
    "notaRetiro": "Coordinamos el punto y la hora por WhatsApp.",
    "envioPorPagar": true,
    "envioGratisDesde": 0,
    "envios": [
      { "nombre": "La Serena y Coquimbo", "detalle": "1 a 2 días hábiles (estimado)", "comunas": ["La Serena", "Coquimbo"] },
      { "nombre": "Región de Coquimbo", "detalle": "2 a 3 días hábiles (estimado)", "regiones": ["Coquimbo"] },
      { "nombre": "Resto de Chile", "detalle": "3 a 5 días hábiles (estimado), por Starken o Chilexpress", "regiones": ["*"] }
    ],
    "pagos": [
      "Transferencia",
      "Débito",
      "Crédito",
      "Efectivo al retirar"
    ],
    "cambios": "No se hacen cambios ni devoluciones.",
    "garantia": "",
    "politicas": [
      { "titulo": "Cambios y devoluciones", "texto": "No se hacen cambios ni devoluciones. Por eso, si tienes dudas con la talla, escríbenos antes de comprar y la vemos juntas." },
      { "titulo": "Reservas", "texto": "No se hacen reservas. El pedido queda tomado cuando se confirma." },
      { "titulo": "Reembolsos", "texto": "No se realizan reembolsos." },
      { "titulo": "Envíos", "texto": "Todos los envíos son por pagar: el despacho lo pagas al recibirlo, directo al transporte. No se hacen excepciones." },
      { "titulo": "Plazos de entrega", "texto": "Los valores de envío y los tiempos de llegada son estimativos. No nos hacemos responsables si el plazo es mayor, porque no depende de nosotros." }
    ]
  },
  "tema": {
    "color": "#6a1138",
    "colorDestacado": "#b98a3e"
  },
  "anuncio": [
    "Envíos a todo Chile",
    "Compra fácil por WhatsApp"
  ],
  "horario": null,
  "horarioConfirmado": false,
  "diasCerrados": [],
  "portada": [
    {
      "titulo": "Una forma\nde caminar",
      "bajada": "Calzado con estilo, comodidad y versatilidad para tu día a día.",
      "foto": "img/portada-1.webp",
      "boton": "Ver colección",
      "enlace": "#/catalogo"
    },
    {
      "titulo": "Botas que\nestilizan",
      "bajada": "Caña alta, taco firme y diseño que no pasa desapercibido.",
      "foto": "img/portada-2.webp",
      "boton": "Ver botas",
      "enlace": "#/c/botas"
    },
    {
      "titulo": "Brilla con\ntu estilo",
      "bajada": "Modelos nuevos cada temporada, en tallas 35 a la 40.",
      "foto": "img/portada-3.webp",
      "boton": "Ver el catálogo",
      "enlace": "#/catalogo"
    }
  ],
  "temporada": {
    "etiqueta": "Lo más pedido",
    "titulo": "Modelo Intiara",
    "bajada": "Botín de gamuza premium con doble hebilla, taco cómodo y estable. En camel y en negro.",
    "foto": "img/temporada.webp",
    "boton": "Ver el modelo",
    "enlace": "#/p/intiara-camel"
  },
  "pasos": [
    {
      "icono": "talla",
      "titulo": "Elige tu talla",
      "texto": "Todos los modelos van de la 35 a la 40. Varios tienen horma pequeña: si dudas, pregúntanos antes de comprar."
    },
    {
      "icono": "camion",
      "titulo": "Completa tus datos",
      "texto": "Envío a domicilio o retiro en La Serena. El envío lo pagas al recibirlo, directo al transporte."
    },
    {
      "icono": "wsp",
      "titulo": "Confirmamos por WhatsApp",
      "texto": "Te llega el detalle del pedido. Confirmamos que esté tu talla y el total, y recién ahí pagas."
    }
  ],
  "textos": {
    "catalogo": {
      "titulo": "Catálogo",
      "bajada": "Todos los modelos vienen de la talla 35 a la 40. Antes de enviarte el pedido confirmamos por WhatsApp que esté tu talla."
    },
    "destacados": { "titulo": "Destacados" },
    "tallas": {
      "titulo": "Guía de tallas",
      "bajada": "Mide tu pie en centímetros, del talón al dedo más largo, de pie y sobre una hoja. Ojo: varios modelos tienen horma pequeña, así que conviene pedir una talla más."
    },
    "tienda": { "titulo": "Visítanos en la tienda" },
    "pasos": { "titulo": "Comprar es simple" },
    "politicas": { "titulo": "Políticas de compra", "bajada": "Para que no haya sorpresas, esto es lo que acordamos en cada compra." }
  },
  "regiones": [
    "Arica y Parinacota", "Tarapacá", "Antofagasta", "Atacama", "Coquimbo", "Valparaíso",
    "Metropolitana", "O'Higgins", "Maule", "Ñuble", "Biobío", "La Araucanía",
    "Los Ríos", "Los Lagos", "Aysén", "Magallanes"
  ],
  "guiaTallas": [
    { "talla": "35", "cm": "22,5", "us": "5" },
    { "talla": "36", "cm": "23,0", "us": "5,5" },
    { "talla": "37", "cm": "23,5", "us": "6,5" },
    { "talla": "38", "cm": "24,5", "us": "7,5" },
    { "talla": "39", "cm": "25,0", "us": "8" },
    { "talla": "40", "cm": "25,5", "us": "8,5" }
  ],
  "cupones": [
    /* Ejemplo del formato, para cuando quieras lanzar una promoción:
    {
      "codigo": "PRIMERPAR",
      "tipo": "porcentaje",        // "porcentaje", "monto" o "envio" (despacho gratis)
      "valor": 10,
      "minimo": 30000,             // compra mínima (opcional)
      "tope": 8000,                // descuento máximo de un porcentaje (opcional)
      "detalle": "10% en tu primera compra",
      "activo": true,
      "visible": true              // false: no se publica en la página, pero el código funciona
    }
    */
  ],
  "categorias": [
    {
      "id": "botines",
      "nombre": "Botines",
      "productos": [
        {
          "id": "intiara-camel",
          "nombre": "Intiara Camel",
          "precio": 22990,
          "fotos": ["img/catalogo/intiara-camel.webp"],
          "detalle": "Botín de gamuza premium con doble hebilla lateral, cómodo y versátil para tu día a día.",
          "descripcion": "Un nombre que simboliza luz, sofisticación y fuerza interior.\nAcabado tipo gamuza premium, de líneas refinadas y diseño contemporáneo. Sus delicadas hebillas y su estructura firme aportan carácter, y el taco estable hace que se pueda usar todo el día.",
          "material": "Tipo gamuza premium",
          "cuidados": "Limpia con cepillo seco de cerdas suaves. No lo mojes ni uses betún líquido.",
          "colores": [{ "nombre": "Camel", "hex": "#a9682f" }],
          "nota": "Horma pequeña: se recomienda pedir una talla más.",
          "etiquetas": [],
          "destacado": true,
          "tallas": "35-40"
        },
        {
          "id": "intiara-black",
          "nombre": "Intiara Black",
          "precio": 22990,
          "fotos": ["img/catalogo/intiara-black.webp"],
          "detalle": "El mismo Intiara en negro: líneas limpias, hebillas delicadas y taco firme.",
          "descripcion": "Un nombre que representa luz interior, poder y elegancia atemporal.\nAcabado tipo gamuza premium con diseño refinado. Sus hebillas aportan carácter y su taco firme brinda una pisada cómoda y segura.",
          "material": "Tipo gamuza premium",
          "cuidados": "Limpia con cepillo seco de cerdas suaves. No lo mojes ni uses betún líquido.",
          "colores": [{ "nombre": "Negro", "hex": "#1d1d1f" }],
          "nota": "Horma pequeña: se recomienda pedir una talla más.",
          "etiquetas": [],
          "destacado": true,
          "tallas": "35-40"
        },
        {
          "id": "amarua-force",
          "nombre": "Amarua Force",
          "precio": 21990,
          "fotos": ["img/catalogo/amarua-force.webp"],
          "detalle": "Botín tipo cuero con forro, estructura firme y taco estable.",
          "descripcion": "Un nombre que evoca fuerza interior y elegancia, diseñado para mujeres que destacan con cada paso.\nDiseño sofisticado y contemporáneo: comodidad sin renunciar al estilo.",
          "material": "Tipo cuero con forro",
          "cuidados": "Paño húmedo y betún neutro de vez en cuando.",
          "colores": [{ "nombre": "Negro", "hex": "#1d1d1f" }],
          "nota": "Horma pequeña: se recomienda pedir una talla más.",
          "etiquetas": [],
          "tallas": "35-40"
        },
        {
          "id": "sayani-prime",
          "nombre": "Sayani Prime",
          "precio": 19990,
          "precioAntes": 22990,
          "fotos": ["img/catalogo/sayani-prime.webp"],
          "detalle": "La combat que no puede faltar en tu clóset: chunky, firme y con toda la actitud.",
          "descripcion": "Perfectas para jeans, vestidos oversized o looks street.\nCordones al frente y suela gruesa con buen agarre.",
          "material": "Tipo cuero",
          "cuidados": "Cepilla el polvo y pasa un paño húmedo.",
          "colores": [{ "nombre": "Negro", "hex": "#1d1d1f" }],
          "nota": "Horma normal.",
          "etiquetas": ["oferta"],
          "destacado": true,
          "tallas": "35-40"
        },
        {
          "id": "quilla-seda",
          "nombre": "Quilla Seda",
          "precio": 19990,
          "precioAntes": 22990,
          "fotos": ["img/catalogo/quilla-seda.webp"],
          "detalle": "Plataforma firme y taco con tachas doradas. Un diseño que no pasa desapercibido.",
          "descripcion": "Perfectas para elevar cualquier look, de día o de noche.\nCierre lateral y plataforma delantera, así el taco se siente más bajo de lo que se ve.",
          "material": "Tipo cuero",
          "cuidados": "Paño húmedo y betún neutro.",
          "colores": [{ "nombre": "Marrón", "hex": "#4a2d20" }],
          "nota": "Horma normal.",
          "etiquetas": ["oferta"],
          "tallas": "35-40"
        },
        {
          "id": "pachara-black",
          "nombre": "Pachara Black",
          "precio": 18990,
          "fotos": ["img/catalogo/pachara-black.webp"],
          "detalle": "Botín outdoor con acabado gamuza premium, suela antideslizante y acolchado interno.",
          "descripcion": "Un nombre que representa fuerza, versatilidad y estilo urbano. Diseñado para mujeres activas que buscan comodidad sin perder actitud.\nTobillera alta para mayor sujeción y detalles en contraste rosa y gris.",
          "material": "Tipo gamuza premium",
          "cuidados": "Cepillo húmedo y jabón suave. No la metas a la lavadora.",
          "colores": [{ "nombre": "Negro con rosa y gris", "hex": "#1d1d1f" }],
          "nota": "Horma pequeña: se recomienda pedir una talla más.",
          "etiquetas": [],
          "tallas": "35-40"
        },
        {
          "id": "pachara-camel",
          "nombre": "Pachara Camel",
          "precio": 18990,
          "fotos": ["img/catalogo/pachara-camel.webp"],
          "detalle": "El Pachara en camel, con detalles en rosa y negro. Suela antideslizante y acolchado interno.",
          "descripcion": "Un nombre que transmite conexión con la naturaleza, calidez y fuerza. Diseñado para acompañarte en cada aventura con estilo.\nPerfecto para un look urbano con actitud.",
          "material": "Tipo gamuza premium",
          "cuidados": "Cepillo húmedo y jabón suave. No la metas a la lavadora.",
          "colores": [{ "nombre": "Camel con rosa y negro", "hex": "#b1763a" }],
          "nota": "Horma pequeña: se recomienda pedir una talla más.",
          "etiquetas": [],
          "tallas": "35-40"
        }
      ]
    },
    {
      "id": "botas",
      "nombre": "Botas",
      "productos": [
        {
          "id": "kallpa",
          "nombre": "Kallpa",
          "precio": 24990,
          "precioAntes": 30990,
          "fotos": ["img/catalogo/kallpa-noir.webp", "img/catalogo/kallpa-white.webp"],
          "detalle": "Bota estilizada con detalle de cadena y taco firme. En negro y en blanco.",
          "descripcion": "Sofisticación en cada paso.\nDiseño estilizado, detalle de cadena y taco firme que eleva cualquier look. Una bota pensada para mujeres seguras, que marcan presencia.",
          "material": "Tipo cuero",
          "cuidados": "Paño húmedo. Guarda la bota de pie para que no se marque la caña.",
          "colores": [
            { "nombre": "Negro", "hex": "#1d1d1f" },
            { "nombre": "Blanco", "hex": "#f2f0ec" }
          ],
          "nota": "Horma pequeña: se recomienda pedir una talla más.",
          "etiquetas": ["oferta"],
          "destacado": true,
          "tallas": "35-40"
        },
        {
          "id": "inti-oro",
          "nombre": "Inti Oro",
          "precio": 24990,
          "precioAntes": 32990,
          "fotos": ["img/catalogo/inti-oro.webp"],
          "detalle": "Diseño western bordado en tono camel, elegante y lleno de personalidad.",
          "descripcion": "Un modelo diferente, que combina con todo.\nPerfectas para elevar looks neutros, jeans, vestidos u outfits boho chic.",
          "material": "Tipo gamuza",
          "cuidados": "Cepillo seco de cerdas suaves.",
          "colores": [{ "nombre": "Camel", "hex": "#a9682f" }],
          "nota": "Horma pequeña: se recomienda pedir una talla más.",
          "etiquetas": ["oferta"],
          "tallas": "35-40"
        },
        {
          "id": "yastay-ebano",
          "nombre": "Yastay Ébano",
          "precio": 24990,
          "precioAntes": 29990,
          "fotos": ["img/catalogo/yastay-ebano.webp"],
          "detalle": "Una bota que estiliza al instante: caña alta con efecto drapeado y taco firme.",
          "descripcion": "Perfectas para outfits elegantes, salidas nocturnas o eventos especiales.",
          "material": "Tipo cuero",
          "cuidados": "Paño húmedo. Guárdala de pie para mantener la caña.",
          "colores": [{ "nombre": "Negro", "hex": "#1d1d1f" }],
          "nota": "Horma pequeña: se recomienda pedir una talla más.",
          "etiquetas": ["oferta"],
          "tallas": "35-40"
        },
        {
          "id": "sumaq-atelier",
          "nombre": "Sumaq Atelier",
          "precio": 21990,
          "precioAntes": 25990,
          "fotos": ["img/catalogo/sumaq-atelier.webp"],
          "detalle": "Diseño urbano con hebilla metálica, cierre frontal y suela chunky.",
          "descripcion": "Versión elegante y moderna: una bota con presencia y actitud.",
          "material": "Tipo cuero",
          "cuidados": "Paño húmedo y betún neutro.",
          "colores": [{ "nombre": "Negro", "hex": "#1d1d1f" }],
          "nota": "Horma pequeña: se recomienda pedir una talla más.",
          "etiquetas": ["oferta"],
          "tallas": "35-40"
        },
        {
          "id": "aynara-terra",
          "nombre": "Aynara Street Terra",
          "precio": 21990,
          "fotos": ["img/catalogo/aynara-terra.webp"],
          "detalle": "Bota de gamuza premium en tono terracota, con suaves pliegues y hebillas delicadas.",
          "descripcion": "Un nombre que evoca libertad, conexión con la tierra y elegancia auténtica.\nSu taco firme asegura comodidad y estabilidad en cada paso.",
          "material": "Tipo gamuza premium",
          "cuidados": "Cepillo seco de cerdas suaves.",
          "colores": [{ "nombre": "Terracota", "hex": "#7d3b2e" }],
          "nota": "Horma pequeña: se recomienda pedir una talla más.",
          "etiquetas": [],
          "tallas": "35-40"
        },
        {
          "id": "aynara-black",
          "nombre": "Aynara Street Black",
          "precio": 21990,
          "fotos": ["img/catalogo/aynara-black.webp"],
          "detalle": "La Aynara en negro: pliegues suaves, hebillas y taco firme.",
          "descripcion": "Un nombre que refleja libertad, carácter y elegancia urbana.\nInspirada en la mujer que se mueve con seguridad y estilo propio.",
          "material": "Tipo gamuza premium",
          "cuidados": "Cepillo seco de cerdas suaves.",
          "colores": [{ "nombre": "Negro", "hex": "#1d1d1f" }],
          "nota": "Horma pequeña: se recomienda pedir una talla más.",
          "etiquetas": [],
          "tallas": "35-40"
        }
      ]
    },
    {
      "id": "zapatillas",
      "nombre": "Zapatillas",
      "productos": [
        {
          "id": "kallpa-chaki",
          "nombre": "Kallpa Chaki",
          "precio": 18990,
          "fotos": ["img/catalogo/kallpa-chaki-cafe.webp"],
          "detalle": "Zapatilla deportiva con suela alta. Viene en negro y en café.",
          "descripcion": "Representa la fuerza y resistencia del espíritu andino, inspirada en el desierto de Atacama. Cada zapatilla refleja energía, identidad y superación personal.",
          "material": "Textil con detalles sintéticos",
          "cuidados": "Cepillo húmedo y jabón suave.",
          "colores": [
            { "nombre": "Café", "hex": "#6b4a37" },
            { "nombre": "Negro", "hex": "#1d1d1f" }
          ],
          "nota": "Horma normal.",
          "etiquetas": [],
          "destacado": true,
          "tallas": "35-40"
        },
        {
          "id": "rumi-chaki",
          "nombre": "Rumi Chaki",
          "precio": 18990,
          "fotos": ["img/catalogo/rumi-chaki.webp"],
          "detalle": "Zapatilla blanca con detalles en rosado y suela alta.",
          "descripcion": "Representa la firmeza y resistencia de la piedra en el paisaje del desierto. Inspirada en la fortaleza de la cultura andina.",
          "material": "Textil con detalles sintéticos",
          "cuidados": "Cepillo húmedo y jabón suave.",
          "colores": [{ "nombre": "Rosado y blanco", "hex": "#e8c9cd" }],
          "nota": "Horma normal.",
          "etiquetas": [],
          "tallas": "35-40"
        },
        {
          "id": "hatun-nam",
          "nombre": "Hatun Ñam",
          "precio": 12990,
          "fotos": ["img/catalogo/hatun-nam.webp"],
          "detalle": "Zapatilla urbana de ecocuero negro con franjas blancas y suela de goma.",
          "descripcion": "Simboliza el gran camino de la vida y la historia ancestral andina. Inspirada en las rutas del desierto atacameño.",
          "material": "Ecocuero",
          "cuidados": "Paño húmedo con jabón suave.",
          "colores": [{ "nombre": "Negro", "hex": "#1d1d1f" }],
          "nota": "Horma normal.",
          "etiquetas": [],
          "tallas": "35-40"
        }
      ]
    }
  ]
};
