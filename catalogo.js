/*
  CATÁLOGO
  ========
  Aquí están los datos de la tienda, los colores, el horario, los envíos y todos los zapatos
  con sus precios y tallas. Para editar, cambia el texto entre comillas o el número y guarda.

  Reglas rápidas:
  - Los precios van sin punto ni signo: 39990 (no "$39.990").
  - "tema": colores de la marca. "color" es el principal (botones, detalles) y "colorDestacado"
    el de los títulos resaltados. Van en formato #rrggbb. Si quedan vacíos, se usan los de la plantilla.
  - "tallas" de cada producto: la talla y cuántos pares quedan.
      "38": 3   → quedan 3 pares de la talla 38
      "39": 0   → talla agotada (sale tachada y no se puede elegir)
    Si el producto no usa tallas (calcetines, plantillas, limpieza), pon "tallaUnica": true.
  - "colores": los colores en que está ese modelo. "hex" es solo para el círculo que se ve en la ficha.
  - "precioAntes": precio anterior. Si lo pones, la página muestra el descuento. Quítalo si no hay oferta.
  - Producto sin stock en ninguna talla: se muestra como «Agotado» solo.
    Para esconder un producto de la página, agrega "disponible": false
  - "destacado": true lo muestra en la portada (conviene que tenga foto).
  - "etiquetas": ["nuevo"], ["oferta"], ["ultimos"] → la cinta de color en la tarjeta.
  - Fotos: guárdalas en img/catalogo/ y escribe la ruta, ej: "img/catalogo/mi-foto.webp".
    Las que vienen son dibujos de ejemplo (.svg): reemplázalas por las fotos reales de la tienda.
  - "forma" solo la usan los dibujos de ejemplo (herramientas/imagenes.py). Con fotos reales no importa.
  - "secciones" son los botones grandes del catálogo (Mujer, Hombre, Niños…) y cada una tiene sus
    "categorias" (si hay más de una, aparecen como botones chicos).
  - Lo que quede vacío ("") no se muestra: por ejemplo, sin "direccion" no aparece la sección Tienda.
  - "envios": los sectores a los que llega el despacho, con su precio y plazo.
    "envioGratisDesde": 69990 → sobre ese monto el despacho sale $0. Pon 0 para desactivarlo.
  - Horario: "10:00-20:00" o "cerrado". Para dos turnos: "10:00-14:00, 15:30-20:00".
  - "cupones": códigos de descuento (uno por pedido).
      "tipo": "porcentaje" (10 = 10%) o "monto" (5000 = $5.000), con su "valor".
      Opcionales: "minimo" (compra mínima), "tope" (descuento máximo de un porcentaje),
      "desde" y "hasta" ("2026-12-31"), "activo": false (apagado) y "visible": false (no aparece
      en la página; sirve para redes o volantes). La tienda confirma cada cupón por WhatsApp.
  Cuidado con las comas: cada elemento de una lista va separado por una coma.
*/
window.CATALOGO = {
  "negocio": {
    "nombre": "Tefi Store",
    "rubro": "Zapatos y zapatillas",
    "whatsapp": "56900000000",
    "whatsappVisible": "+56 9 0000 0000",
    "instagram": "tefi.store",
    "facebook": "",
    "correo": "",
    "direccion": "Av. Francisco de Aguirre 123, local 4",
    "sector": "Centro",
    "ciudad": "La Serena",
    "region": "Coquimbo",
    "mapa": "https://www.google.com/maps/search/?api=1&query=Av.+Francisco+de+Aguirre+123%2C+La+Serena",
    "mapaBusqueda": "Av. Francisco de Aguirre 123, La Serena, Chile",
    "retiroEnTienda": true,
    "notaRetiro": "Te avisamos por WhatsApp cuando tu pedido esté listo (normalmente el mismo día).",
    "envioGratisDesde": 69990,
    "envios": [
      { "nombre": "La Serena y Coquimbo", "precio": 2990, "detalle": "1 a 2 días hábiles" },
      { "nombre": "Región de Coquimbo", "precio": 4990, "detalle": "2 a 3 días hábiles" },
      { "nombre": "Resto de Chile", "precio": 5990, "detalle": "3 a 5 días hábiles, por Starken o Chilexpress" }
    ],
    "pagos": [
      "Débito",
      "Crédito (hasta 3 cuotas sin interés)",
      "Transferencia",
      "Efectivo en la tienda"
    ],
    "cambios": "Tienes 10 días corridos para cambiar la talla, con la boleta y el zapato sin uso.",
    "garantia": "6 meses por falla de fábrica."
  },
  "tema": {
    "color": "#6d3bd4",
    "colorDestacado": "#ffc53d"
  },
  "horario": {
    "lunes": "10:00-20:00",
    "martes": "10:00-20:00",
    "miercoles": "10:00-20:00",
    "jueves": "10:00-20:00",
    "viernes": "10:00-20:30",
    "sabado": "10:30-19:00",
    "domingo": "cerrado"
  },
  "horarioConfirmado": true,
  "diasCerrados": [],
  "textos": {
    "portada": {
      "titulo": "Encuentra",
      "destacado": "tu par",
      "bajada": "Zapatillas, botas, tacos y zapatos de vestir para mujer, hombre y niños. Elige tu talla, ármalo todo y envíanos el pedido por WhatsApp."
    },
    "catalogo": {
      "titulo": "Nuestro",
      "destacado": "catálogo",
      "bajada": "Mostramos solo las tallas que tenemos en tienda. Si la tuya no aparece, escríbenos y la buscamos."
    },
    "cupones": {
      "titulo": "Cupones",
      "destacado": "de la semana",
      "bajada": "Toca «Usar cupón» y el descuento se aplica en tu pedido. Un cupón por pedido."
    },
    "tallas": {
      "titulo": "¿Cuál es tu",
      "destacado": "talla?",
      "bajada": "Mide tu pie en centímetros, del talón al dedo más largo, de pie y sobre una hoja. Si te queda entre dos tallas, elige la más grande."
    },
    "pasos": {
      "titulo": "Compra en",
      "destacado": "3 pasos."
    },
    "tienda": {
      "titulo": "Visítanos",
      "destacado": "en la tienda"
    },
    "cierre": {
      "titulo": "¿Lista o listo",
      "destacado": "para estrenar?"
    }
  },
  "guiaTallas": [
    { "talla": "35", "cm": "22,5", "us": "5" },
    { "talla": "36", "cm": "23,0", "us": "5,5" },
    { "talla": "37", "cm": "23,5", "us": "6,5" },
    { "talla": "38", "cm": "24,5", "us": "7,5" },
    { "talla": "39", "cm": "25,0", "us": "8" },
    { "talla": "40", "cm": "25,5", "us": "8,5" },
    { "talla": "41", "cm": "26,5", "us": "9,5" },
    { "talla": "42", "cm": "27,0", "us": "10" },
    { "talla": "43", "cm": "27,5", "us": "10,5" },
    { "talla": "44", "cm": "28,5", "us": "11,5" }
  ],
  "cupones": [
    {
      "codigo": "PRIMERPAR",
      "tipo": "porcentaje",
      "valor": 10,
      "minimo": 30000,
      "tope": 8000,
      "detalle": "10% en tu primera compra",
      "activo": true,
      "visible": true
    },
    {
      "codigo": "DOSPARES",
      "tipo": "monto",
      "valor": 6000,
      "minimo": 70000,
      "detalle": "$6.000 menos llevando dos pares o más",
      "activo": true,
      "visible": true
    }
  ],
  "secciones": [
    {
      "id": "mujer",
      "nombre": "Mujer",
      "categorias": [
        {
          "id": "zapatillas-mujer",
          "nombre": "Zapatillas",
          "productos": [
            {
              "id": "zapatilla-nube",
              "nombre": "Zapatilla urbana Nube",
              "marca": "Nordic",
              "precio": 39990,
              "precioAntes": 49990,
              "forma": "zapatilla",
              "foto": "img/catalogo/zapatilla-nube.svg",
              "detalle": "Cuero sintético liso, suela de goma de 3 cm y plantilla acolchada.\nAnda bien para todo el día y combina con todo.",
              "material": "Cuero sintético",
              "colores": [
                { "nombre": "Blanco", "hex": "#f2f0ec" },
                { "nombre": "Negro", "hex": "#23222a" }
              ],
              "etiquetas": ["oferta"],
              "destacado": true,
              "tallas": { "35": 2, "36": 4, "37": 5, "38": 3, "39": 0, "40": 1 }
            },
            {
              "id": "zapatilla-brisa",
              "nombre": "Zapatilla running Brisa",
              "marca": "Vento",
              "precio": 44990,
              "forma": "zapatilla",
              "foto": "img/catalogo/zapatilla-brisa.svg",
              "detalle": "Malla liviana que transpira, suela con amortiguación y talón reforzado.\nPara caminar, trotar y el gimnasio.",
              "material": "Malla técnica",
              "colores": [
                { "nombre": "Coral", "hex": "#ff6f61" },
                { "nombre": "Gris", "hex": "#9aa0a6" }
              ],
              "etiquetas": ["nuevo"],
              "destacado": true,
              "tallas": { "35": 1, "36": 3, "37": 4, "38": 4, "39": 2, "40": 0 }
            },
            {
              "id": "zapatilla-mia",
              "nombre": "Zapatilla plataforma Mia",
              "marca": "Tefi",
              "precio": 42990,
              "forma": "zapatilla",
              "foto": "img/catalogo/zapatilla-mia.svg",
              "detalle": "Plataforma de 4,5 cm, cordones gruesos y cierre lateral para que entre fácil.",
              "material": "Cuero sintético",
              "colores": [
                { "nombre": "Negro", "hex": "#23222a" },
                { "nombre": "Blanco", "hex": "#f2f0ec" }
              ],
              "etiquetas": [],
              "tallas": { "35": 0, "36": 2, "37": 3, "38": 2, "39": 1, "40": 0 }
            },
            {
              "id": "zapatilla-dune",
              "nombre": "Zapatilla de lona Dune",
              "marca": "Tefi",
              "precio": 24990,
              "forma": "zapatilla",
              "foto": "img/catalogo/zapatilla-dune.svg",
              "detalle": "Lona de algodón, suela flexible y plantilla extraíble. Lo más liviano de la tienda.",
              "material": "Lona de algodón",
              "colores": [
                { "nombre": "Beige", "hex": "#d9c8ad" },
                { "nombre": "Azul", "hex": "#2f4b8f" },
                { "nombre": "Negro", "hex": "#23222a" }
              ],
              "etiquetas": [],
              "tallas": { "35": 3, "36": 5, "37": 6, "38": 4, "39": 3, "40": 2 }
            }
          ]
        },
        {
          "id": "botas-mujer",
          "nombre": "Botas y botines",
          "productos": [
            {
              "id": "botin-vera",
              "nombre": "Botín taco Vera",
              "marca": "Vera",
              "precio": 54990,
              "forma": "bota",
              "foto": "img/catalogo/botin-vera.svg",
              "detalle": "Taco cuadrado de 7 cm, cierre interior y punta semicuadrada.\nSube bastante el look sin cansar el pie.",
              "material": "Cuero sintético",
              "colores": [
                { "nombre": "Negro", "hex": "#23222a" },
                { "nombre": "Café", "hex": "#7a4b2a" }
              ],
              "etiquetas": ["nuevo"],
              "destacado": true,
              "tallas": { "35": 1, "36": 3, "37": 3, "38": 2, "39": 1, "40": 0 }
            },
            {
              "id": "bota-nordica",
              "nombre": "Bota caña alta Nórdica",
              "marca": "Nordic",
              "precio": 69990,
              "precioAntes": 84990,
              "forma": "bota",
              "foto": "img/catalogo/bota-nordica.svg",
              "detalle": "Caña de 38 cm, forro afelpado y suela de goma con dibujo.\nPara el frío y la lluvia.",
              "material": "Cuero sintético con forro afelpado",
              "colores": [
                { "nombre": "Café", "hex": "#7a4b2a" },
                { "nombre": "Negro", "hex": "#23222a" }
              ],
              "etiquetas": ["oferta"],
              "tallas": { "35": 0, "36": 2, "37": 2, "38": 2, "39": 1, "40": 1 }
            },
            {
              "id": "botin-lara",
              "nombre": "Botín chelsea Lara",
              "marca": "Tefi",
              "precio": 49990,
              "forma": "bota",
              "foto": "img/catalogo/botin-lara.svg",
              "detalle": "Elástico a los lados, se pone de una y queda firme. Suela de 2,5 cm.",
              "material": "Cuero sintético",
              "colores": [
                { "nombre": "Negro", "hex": "#23222a" },
                { "nombre": "Camel", "hex": "#b4834a" }
              ],
              "etiquetas": [],
              "tallas": { "35": 2, "36": 3, "37": 4, "38": 3, "39": 2, "40": 0 }
            }
          ]
        },
        {
          "id": "vestir-mujer",
          "nombre": "Tacos y vestir",
          "productos": [
            {
              "id": "stiletto-gala",
              "nombre": "Stiletto Gala",
              "marca": "Vera",
              "precio": 47990,
              "forma": "taco",
              "foto": "img/catalogo/stiletto-gala.svg",
              "detalle": "Taco aguja de 9 cm, punta fina y plantilla con gel en la zona del metatarso.",
              "material": "Charol sintético",
              "colores": [
                { "nombre": "Rojo", "hex": "#b3122f" },
                { "nombre": "Negro", "hex": "#23222a" },
                { "nombre": "Nude", "hex": "#dcae97" }
              ],
              "etiquetas": [],
              "tallas": { "35": 2, "36": 2, "37": 3, "38": 2, "39": 1, "40": 0 }
            },
            {
              "id": "taco-oficina",
              "nombre": "Zapato taco medio Oficina",
              "marca": "Vera",
              "precio": 44990,
              "forma": "taco",
              "foto": "img/catalogo/taco-oficina.svg",
              "detalle": "Taco de 5 cm, ancho y estable. El que aguanta la jornada completa.",
              "material": "Cuero sintético mate",
              "colores": [
                { "nombre": "Negro", "hex": "#23222a" },
                { "nombre": "Azul noche", "hex": "#28325c" }
              ],
              "etiquetas": [],
              "tallas": { "35": 1, "36": 3, "37": 4, "38": 3, "39": 2, "40": 1 }
            },
            {
              "id": "balerina-suave",
              "nombre": "Balerina Suave",
              "marca": "Tefi",
              "precio": 29990,
              "forma": "mocasin",
              "foto": "img/catalogo/balerina-suave.svg",
              "detalle": "Plana, con lazo al frente y plantilla blanda. Se dobla para llevarla en el bolso.",
              "material": "Gamuza sintética",
              "colores": [
                { "nombre": "Nude", "hex": "#dcae97" },
                { "nombre": "Negro", "hex": "#23222a" },
                { "nombre": "Burdeo", "hex": "#6d2235" }
              ],
              "etiquetas": [],
              "tallas": { "35": 3, "36": 4, "37": 4, "38": 3, "39": 1, "40": 0 }
            }
          ]
        },
        {
          "id": "sandalias-mujer",
          "nombre": "Sandalias",
          "productos": [
            {
              "id": "sandalia-marea",
              "nombre": "Sandalia plana Marea",
              "marca": "Tefi",
              "precio": 27990,
              "forma": "sandalia",
              "foto": "img/catalogo/sandalia-marea.svg",
              "detalle": "Tiras cruzadas, hebilla regulable y suela blanda. Para el verano y la playa.",
              "material": "Cuero sintético",
              "colores": [
                { "nombre": "Dorado", "hex": "#c9a227" },
                { "nombre": "Negro", "hex": "#23222a" },
                { "nombre": "Blanco", "hex": "#f2f0ec" }
              ],
              "etiquetas": [],
              "tallas": { "35": 2, "36": 4, "37": 5, "38": 4, "39": 2, "40": 1 }
            },
            {
              "id": "sandalia-verano",
              "nombre": "Sandalia taco Verano",
              "marca": "Vera",
              "precio": 34990,
              "forma": "sandalia",
              "foto": "img/catalogo/sandalia-verano.svg",
              "detalle": "Taco de 6 cm con plataforma delantera, así se siente más bajo de lo que se ve.",
              "material": "Cuero sintético",
              "colores": [
                { "nombre": "Blanco", "hex": "#f2f0ec" },
                { "nombre": "Coral", "hex": "#ff6f61" }
              ],
              "etiquetas": ["nuevo"],
              "tallas": { "35": 1, "36": 2, "37": 3, "38": 2, "39": 1, "40": 0 }
            }
          ]
        }
      ]
    },
    {
      "id": "hombre",
      "nombre": "Hombre",
      "categorias": [
        {
          "id": "zapatillas-hombre",
          "nombre": "Zapatillas",
          "productos": [
            {
              "id": "zapatilla-tramo",
              "nombre": "Zapatilla urbana Tramo",
              "marca": "Nordic",
              "precio": 42990,
              "forma": "zapatilla",
              "foto": "img/catalogo/zapatilla-tramo.svg",
              "detalle": "Corte liso, suela de goma gruesa y plantilla con memoria.\nLa que sirve para la oficina y para salir.",
              "material": "Cuero sintético",
              "colores": [
                { "nombre": "Blanco", "hex": "#f2f0ec" },
                { "nombre": "Negro", "hex": "#23222a" },
                { "nombre": "Gris", "hex": "#9aa0a6" }
              ],
              "etiquetas": [],
              "destacado": true,
              "tallas": { "39": 2, "40": 4, "41": 5, "42": 4, "43": 2, "44": 1 }
            },
            {
              "id": "zapatilla-ritmo",
              "nombre": "Zapatilla running Ritmo",
              "marca": "Vento",
              "precio": 46990,
              "precioAntes": 56990,
              "forma": "zapatilla",
              "foto": "img/catalogo/zapatilla-ritmo.svg",
              "detalle": "Malla que transpira, entresuela con rebote y lengua acolchada.\nPara trotar y para andar todo el día.",
              "material": "Malla técnica",
              "colores": [
                { "nombre": "Azul", "hex": "#2f4b8f" },
                { "nombre": "Negro", "hex": "#23222a" }
              ],
              "etiquetas": ["oferta"],
              "tallas": { "39": 1, "40": 3, "41": 4, "42": 3, "43": 2, "44": 0 }
            },
            {
              "id": "zapatilla-muro",
              "nombre": "Zapatilla skate Muro",
              "marca": "Tefi",
              "precio": 39990,
              "forma": "zapatilla",
              "foto": "img/catalogo/zapatilla-muro.svg",
              "detalle": "Lona reforzada en los costados, suela plana con buen agarre y caña baja.",
              "material": "Lona reforzada",
              "colores": [
                { "nombre": "Negro", "hex": "#23222a" },
                { "nombre": "Verde", "hex": "#2f6b4f" }
              ],
              "etiquetas": [],
              "tallas": { "39": 2, "40": 3, "41": 3, "42": 3, "43": 1, "44": 1 }
            }
          ]
        },
        {
          "id": "vestir-hombre",
          "nombre": "Vestir",
          "productos": [
            {
              "id": "oxford-don",
              "nombre": "Zapato Oxford Don",
              "marca": "Don",
              "precio": 59990,
              "forma": "mocasin",
              "foto": "img/catalogo/oxford-don.svg",
              "detalle": "Cuero con terminación brillante, cordones y suela cosida.\nPara matrimonios, titulaciones y la oficina.",
              "material": "Cuero",
              "colores": [
                { "nombre": "Negro", "hex": "#23222a" },
                { "nombre": "Café", "hex": "#7a4b2a" }
              ],
              "etiquetas": [],
              "destacado": true,
              "tallas": { "39": 1, "40": 3, "41": 4, "42": 3, "43": 2, "44": 1 }
            },
            {
              "id": "mocasin-puerto",
              "nombre": "Mocasín Puerto",
              "marca": "Don",
              "precio": 52990,
              "forma": "mocasin",
              "foto": "img/catalogo/mocasin-puerto.svg",
              "detalle": "Sin cordones, con antifaz y suela liviana. Cómodo desde el primer día.",
              "material": "Cuero",
              "colores": [
                { "nombre": "Café", "hex": "#7a4b2a" },
                { "nombre": "Azul noche", "hex": "#28325c" }
              ],
              "etiquetas": [],
              "tallas": { "39": 2, "40": 2, "41": 3, "42": 2, "43": 1, "44": 0 }
            }
          ]
        },
        {
          "id": "botas-hombre",
          "nombre": "Botas y botines",
          "productos": [
            {
              "id": "bota-faena",
              "nombre": "Bota de trabajo Faena",
              "marca": "Faena",
              "precio": 64990,
              "forma": "bota",
              "foto": "img/catalogo/bota-faena.svg",
              "detalle": "Punta de acero, suela antideslizante y resistente al aceite.\nCumple para obra y bodega.",
              "material": "Cuero",
              "colores": [
                { "nombre": "Café", "hex": "#7a4b2a" },
                { "nombre": "Negro", "hex": "#23222a" }
              ],
              "etiquetas": [],
              "tallas": { "39": 1, "40": 2, "41": 4, "42": 4, "43": 3, "44": 2 }
            },
            {
              "id": "botin-norte",
              "nombre": "Botín urbano Norte",
              "marca": "Nordic",
              "precio": 57990,
              "forma": "bota",
              "foto": "img/catalogo/botin-norte.svg",
              "detalle": "Caña corta, cordones y suela tipo tractor. Para el invierno de todos los días.",
              "material": "Cuero sintético",
              "colores": [
                { "nombre": "Negro", "hex": "#23222a" },
                { "nombre": "Café", "hex": "#7a4b2a" }
              ],
              "etiquetas": ["nuevo"],
              "tallas": { "39": 2, "40": 3, "41": 3, "42": 2, "43": 1, "44": 0 }
            }
          ]
        }
      ]
    },
    {
      "id": "ninos",
      "nombre": "Niños",
      "categorias": [
        {
          "id": "escolar",
          "nombre": "Escolar y zapatillas",
          "productos": [
            {
              "id": "zapatilla-paso",
              "nombre": "Zapatilla escolar Paso",
              "marca": "Tefi Kids",
              "precio": 29990,
              "forma": "zapatilla",
              "foto": "img/catalogo/zapatilla-paso.svg",
              "detalle": "Negra entera, con velcro y elástico: se la pone solo.\nSuela que no marca el piso del colegio.",
              "material": "Cuero sintético",
              "colores": [
                { "nombre": "Negro", "hex": "#23222a" }
              ],
              "etiquetas": [],
              "tallas": { "28": 3, "29": 4, "30": 4, "31": 3, "32": 3, "33": 2, "34": 2 }
            },
            {
              "id": "zapatilla-chispa",
              "nombre": "Zapatilla con luces Chispa",
              "marca": "Tefi Kids",
              "precio": 27990,
              "forma": "zapatilla",
              "foto": "img/catalogo/zapatilla-chispa.svg",
              "detalle": "Luces en la suela que se cargan con cable USB (viene incluido).\nCierre con velcro.",
              "material": "Sintético",
              "colores": [
                { "nombre": "Rosado", "hex": "#e8698f" },
                { "nombre": "Azul", "hex": "#2f4b8f" }
              ],
              "etiquetas": ["nuevo"],
              "destacado": true,
              "tallas": { "26": 2, "27": 3, "28": 3, "29": 2, "30": 2, "31": 1 }
            }
          ]
        },
        {
          "id": "verano-ninos",
          "nombre": "Sandalias",
          "productos": [
            {
              "id": "sandalia-rio",
              "nombre": "Sandalia Río",
              "marca": "Tefi Kids",
              "precio": 19990,
              "forma": "sandalia",
              "foto": "img/catalogo/sandalia-rio.svg",
              "detalle": "De goma, se puede mojar y se lava con agua. Tira atrás para que no se salga.",
              "material": "Goma EVA",
              "colores": [
                { "nombre": "Azul", "hex": "#2f4b8f" },
                { "nombre": "Rosado", "hex": "#e8698f" }
              ],
              "etiquetas": [],
              "tallas": { "26": 2, "27": 3, "28": 4, "29": 3, "30": 2, "31": 2 }
            }
          ]
        }
      ]
    },
    {
      "id": "accesorios",
      "nombre": "Accesorios",
      "categorias": [
        {
          "id": "cuidado",
          "nombre": "Cuidado del calzado",
          "productos": [
            {
              "id": "kit-limpieza",
              "nombre": "Kit de limpieza para zapatillas",
              "marca": "Tefi",
              "precio": 12990,
              "forma": "caja",
              "foto": "img/catalogo/kit-limpieza.svg",
              "detalle": "Espuma limpiadora, cepillo blando y paño de microfibra.",
              "material": "",
              "colores": [],
              "etiquetas": [],
              "tallaUnica": true,
              "stock": 12
            },
            {
              "id": "betun-neutro",
              "nombre": "Betún neutro",
              "marca": "Tefi",
              "precio": 4490,
              "forma": "frasco",
              "foto": "img/catalogo/betun-neutro.svg",
              "detalle": "Sirve para cualquier color de cuero. Pote de 50 ml.",
              "material": "",
              "colores": [],
              "etiquetas": [],
              "tallaUnica": true,
              "stock": 20
            },
            {
              "id": "plantillas-gel",
              "nombre": "Plantillas de gel",
              "marca": "Tefi",
              "precio": 7990,
              "forma": "caja",
              "foto": "img/catalogo/plantillas-gel.svg",
              "detalle": "Se recortan a tu talla. Amortiguan el talón y el metatarso.",
              "material": "",
              "colores": [],
              "etiquetas": [],
              "tallaUnica": true,
              "stock": 15
            }
          ]
        },
        {
          "id": "complementos",
          "nombre": "Complementos",
          "productos": [
            {
              "id": "calcetines-pack",
              "nombre": "Calcetines invisibles (pack de 3)",
              "marca": "Tefi",
              "precio": 5990,
              "forma": "caja",
              "foto": "img/catalogo/calcetines-pack.svg",
              "detalle": "Algodón con silicona en el talón para que no se bajen.",
              "material": "Algodón",
              "colores": [],
              "etiquetas": [],
              "tallaUnica": true,
              "stock": 25
            },
            {
              "id": "cordones-planos",
              "nombre": "Cordones planos (par)",
              "marca": "Tefi",
              "precio": 2990,
              "forma": "cordon",
              "foto": "img/catalogo/cordones-planos.svg",
              "detalle": "120 cm. Pídelos en blanco, negro o beige por WhatsApp.",
              "material": "",
              "colores": [],
              "etiquetas": [],
              "tallaUnica": true,
              "stock": 30
            },
            {
              "id": "bolso-tefi",
              "nombre": "Bolso de tela Tefi",
              "marca": "Tefi",
              "precio": 9990,
              "forma": "accesorio",
              "foto": "img/catalogo/bolso-tefi.svg",
              "detalle": "Tela gruesa, con bolsillo interior. Para el gimnasio o la feria.",
              "material": "Lona",
              "colores": [],
              "etiquetas": [],
              "tallaUnica": true,
              "stock": 8
            }
          ]
        }
      ]
    }
  ]
};
