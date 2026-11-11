/*
  CATÁLOGO DE TEFI STORE
  ======================
  Este es el ÚNICO archivo que hay que editar para cambiar la página: los datos de la tienda,
  los colores, el horario, los despachos, los cupones y todos los zapatos con sus tallas.
  Cambia el texto entre comillas o el número y guarda.

  Reglas rápidas
  --------------
  - Los precios van sin punto ni signo: 34990 (no "$34.990").
  - "tallas" de cada producto: la talla y cuántos pares quedan.
      "38": 3   → quedan 3 pares de la talla 38
      "39": 0   → talla agotada (sale tachada y no se puede elegir)
    Si el producto no usa tallas (betún, plantillas, calcetines), pon "tallaUnica": true y "stock": 12.
  - "fotos": una o varias. La primera es la que se ve en el catálogo; las demás salen en la ficha
    con las flechas. Guárdalas en img/catalogo/ y escribe la ruta.
    Las que terminan en .svg son dibujos de ejemplo: reemplázalos por las fotos reales de la tienda.
  - "precioAntes": precio anterior. Si lo pones, se muestra tachado y aparece el % de descuento.
  - "destacado": true lo muestra en la portada, en «Destacados».
  - "etiquetas": ["nuevo"], ["oferta"] o ["ultimos"] → la cinta de la tarjeta.
  - Para esconder un producto sin borrarlo: "disponible": false
  - "categorias" son los botones del menú de arriba (Botines, Botas, Zapatillas…). Puedes agregar,
    cambiar el nombre o el orden; el menú y los filtros se arman solos.
  - "forma" solo la usan los dibujos de ejemplo (herramientas/imagenes.py): zapatilla, bota, taco,
    sandalia, mocasin, caja, frasco, cordon o accesorio. Con fotos reales ese campo da lo mismo.
  - Lo que quede vacío ("") no se muestra: por ejemplo, sin "direccion" no aparece la sección Tienda.
  - "envios": a cada zona le puedes poner sus "comunas" o sus "regiones". Al escribir la comuna en
    el checkout, la página elige sola la zona y su precio. La zona con "regiones": ["*"] es la que
    se usa cuando no calza ninguna otra.
  - "envioGratisDesde": 69990 → sobre ese monto el despacho sale $0. Pon 0 para desactivarlo.
  - "cupones": códigos de descuento (uno por pedido).
      "tipo": "porcentaje" (10 = 10%) o "monto" (5000 = $5.000), con su "valor".
      Opcionales: "minimo" (compra mínima), "tope" (descuento máximo de un porcentaje),
      "desde" y "hasta" ("2026-12-31"), "activo": false (apagado) y "visible": false (no se publica
      en la página; sirve para redes o volantes). La tienda confirma cada cupón por WhatsApp.
  Cuidado con las comas: cada elemento de una lista va separado por una coma.
*/
window.CATALOGO = {
  "negocio": {
    "nombre": "Tefi Store",
    "rubro": "Calzado",
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
    "nombreRetiro": "Retiro en La Serena",
    "notaRetiro": "Coordinamos por WhatsApp. Normalmente queda listo el mismo día.",
    "envioGratisDesde": 69990,
    "envios": [
      { "nombre": "La Serena y Coquimbo", "precio": 2990, "detalle": "1 a 2 días hábiles", "comunas": ["La Serena", "Coquimbo"] },
      { "nombre": "Región de Coquimbo", "precio": 4990, "detalle": "2 a 3 días hábiles", "regiones": ["Coquimbo"] },
      { "nombre": "Resto de Chile", "precio": 5990, "detalle": "3 a 5 días hábiles, por Starken o Chilexpress", "regiones": ["*"] }
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
    "color": "#6a1138",
    "colorDestacado": "#b98a3e"
  },
  "anuncio": [
    "Envíos a todo Chile",
    "Compra fácil por WhatsApp"
  ],
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
  "portada": [
    {
      "titulo": "Una forma\nde caminar",
      "bajada": "Calzado con estilo, comodidad y versatilidad para tu día a día.",
      "foto": "img/portada-1.webp",
      "boton": "Ver colección",
      "enlace": "#/catalogo"
    },
    {
      "titulo": "Botines\nIntiara",
      "bajada": "Gamuza, doble hebilla y plataforma. El par que no te vas a querer sacar.",
      "foto": "img/portada-2.webp",
      "boton": "Ver botines",
      "enlace": "#/c/botines"
    },
    {
      "titulo": "Para\nmoverte",
      "bajada": "Zapatillas livianas, con buen agarre y amortiguación de verdad.",
      "foto": "img/portada-3.webp",
      "boton": "Ver zapatillas",
      "enlace": "#/c/zapatillas"
    }
  ],
  "temporada": {
    "etiqueta": "Nueva temporada",
    "titulo": "Botines urbanos",
    "bajada": "Comodidad y estilo en cada paso. Tallas de la 35 a la 40, con stock real en tienda.",
    "foto": "img/temporada.webp",
    "boton": "Ver la colección",
    "enlace": "#/c/botines"
  },
  "textos": {
    "catalogo": {
      "titulo": "Catálogo",
      "bajada": "Mostramos solo las tallas que tenemos en tienda. Si la tuya no aparece, escríbenos y la buscamos."
    },
    "destacados": { "titulo": "Destacados" },
    "tallas": {
      "titulo": "Guía de tallas",
      "bajada": "Mide tu pie en centímetros, del talón al dedo más largo, de pie y sobre una hoja. Si te queda entre dos tallas, elige la más grande."
    },
    "tienda": { "titulo": "Visítanos en la tienda" }
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
    },
    {
      "codigo": "ENVIOGRATIS",
      "tipo": "envio",
      "valor": 0,
      "minimo": 40000,
      "detalle": "Despacho gratis desde $40.000",
      "activo": true,
      "visible": false
    }
  ],
  "categorias": [
    {
      "id": "botines",
      "nombre": "Botines",
      "productos": [
        {
          "id": "botin-intiara-camel",
          "nombre": "Botín Intiara Camel",
          "precio": 34990,
          "forma": "bota",
          "fotos": ["img/catalogo/botin-intiara-camel.webp", "img/catalogo/botin-intiara-camel-2.webp"],
          "detalle": "Botín de gamuza con doble hebilla lateral, cómodo y versátil para tu día a día.",
          "descripcion": "Caña corta con doble hebilla decorativa y cierre lateral.\nTaco de 6 cm con plataforma delantera, así se siente más bajo de lo que se ve.\nSuela de goma con dibujo, no resbala.",
          "material": "Gamuza sintética",
          "cuidados": "Limpia con cepillo seco de cerdas suaves. No lo mojes ni uses betún líquido.",
          "colores": [{ "nombre": "Camel", "hex": "#b06a35" }],
          "etiquetas": [],
          "destacado": true,
          "tallas": { "35": 2, "36": 4, "37": 5, "38": 3, "39": 2, "40": 1 }
        },
        {
          "id": "botin-intiara-black",
          "nombre": "Botín Intiara Black",
          "precio": 34990,
          "forma": "bota",
          "fotos": ["img/catalogo/botin-intiara-black.webp"],
          "detalle": "El mismo Intiara, en negro: combina con todo y aguanta el uso diario.",
          "descripcion": "Caña corta con doble hebilla decorativa y cierre lateral.\nTaco de 6 cm con plataforma delantera.\nSuela de goma con dibujo.",
          "material": "Gamuza sintética",
          "cuidados": "Limpia con cepillo seco de cerdas suaves. No lo mojes ni uses betún líquido.",
          "colores": [{ "nombre": "Negro", "hex": "#1d1d1f" }],
          "etiquetas": [],
          "destacado": true,
          "tallas": { "35": 1, "36": 3, "37": 4, "38": 4, "39": 2, "40": 0 }
        },
        {
          "id": "botin-vera-negro",
          "nombre": "Botín Vera Taco Negro",
          "precio": 54990,
          "forma": "bota",
          "fotos": ["img/catalogo/botin-vera-negro.svg"],
          "detalle": "Taco cuadrado de 7 cm, punta semicuadrada y cierre interior.",
          "descripcion": "Sube bastante el look sin cansar el pie: el taco es ancho y estable.\nCierre lateral con cremallera metálica.",
          "material": "Cuero sintético",
          "cuidados": "Pasa un paño húmedo y deja secar lejos del sol.",
          "colores": [{ "nombre": "Negro", "hex": "#1d1d1f" }],
          "etiquetas": ["nuevo"],
          "tallas": { "35": 1, "36": 3, "37": 3, "38": 2, "39": 1, "40": 0 }
        },
        {
          "id": "botin-chelsea-negro",
          "nombre": "Botín Chelsea Lara Negro",
          "precio": 49990,
          "forma": "bota",
          "fotos": ["img/catalogo/botin-chelsea-negro.svg"],
          "detalle": "Elástico a los lados: se pone de una y queda firme.",
          "descripcion": "Clásico chelsea con elástico lateral y tirador atrás.\nSuela de 2,5 cm, liviana.",
          "material": "Cuero sintético",
          "cuidados": "Paño húmedo y betún neutro de vez en cuando.",
          "colores": [{ "nombre": "Negro", "hex": "#1d1d1f" }],
          "etiquetas": [],
          "tallas": { "35": 2, "36": 3, "37": 4, "38": 3, "39": 2, "40": 0 }
        },
        {
          "id": "botin-chelsea-camel",
          "nombre": "Botín Chelsea Lara Camel",
          "precio": 49990,
          "forma": "bota",
          "fotos": ["img/catalogo/botin-chelsea-camel.svg"],
          "detalle": "El chelsea de siempre, en camel. Queda bien con jeans y con vestido.",
          "descripcion": "Clásico chelsea con elástico lateral y tirador atrás.\nSuela de 2,5 cm, liviana.",
          "material": "Cuero sintético",
          "cuidados": "Paño húmedo y betún neutro de vez en cuando.",
          "colores": [{ "nombre": "Camel", "hex": "#b4834a" }],
          "etiquetas": [],
          "tallas": { "35": 1, "36": 2, "37": 3, "38": 2, "39": 1, "40": 1 }
        },
        {
          "id": "botin-norte-cafe",
          "nombre": "Botín Norte Café",
          "precio": 57990,
          "forma": "bota",
          "fotos": ["img/catalogo/botin-norte-cafe.svg"],
          "detalle": "Caña corta, cordones y suela tipo tractor. Para el invierno de todos los días.",
          "descripcion": "Corte en cuero sintético con costuras reforzadas.\nSuela gruesa con buen agarre en piso mojado.",
          "material": "Cuero sintético",
          "cuidados": "Cepilla el barro seco y pasa betún neutro.",
          "colores": [{ "nombre": "Café", "hex": "#6f4428" }],
          "etiquetas": ["nuevo"],
          "tallas": { "39": 2, "40": 3, "41": 3, "42": 2, "43": 1, "44": 0 }
        }
      ]
    },
    {
      "id": "botas",
      "nombre": "Botas",
      "productos": [
        {
          "id": "bota-nordica-cafe",
          "nombre": "Bota Caña Alta Nórdica Café",
          "precio": 69990,
          "precioAntes": 84990,
          "forma": "bota",
          "fotos": ["img/catalogo/bota-nordica-cafe.svg"],
          "detalle": "Caña de 38 cm, forro afelpado y suela de goma con dibujo.",
          "descripcion": "Para el frío y la lluvia: el forro abriga de verdad.\nCierre interior en toda la caña.",
          "material": "Cuero sintético con forro afelpado",
          "cuidados": "Seca a temperatura ambiente, nunca con estufa.",
          "colores": [{ "nombre": "Café", "hex": "#6f4428" }],
          "etiquetas": ["oferta"],
          "tallas": { "35": 0, "36": 2, "37": 2, "38": 2, "39": 1, "40": 1 }
        },
        {
          "id": "bota-nordica-negra",
          "nombre": "Bota Caña Alta Nórdica Negra",
          "precio": 69990,
          "forma": "bota",
          "fotos": ["img/catalogo/bota-nordica-negra.svg"],
          "detalle": "La misma Nórdica en negro, con forro afelpado.",
          "descripcion": "Caña de 38 cm con cierre interior.\nSuela de goma con dibujo.",
          "material": "Cuero sintético con forro afelpado",
          "cuidados": "Seca a temperatura ambiente, nunca con estufa.",
          "colores": [{ "nombre": "Negro", "hex": "#1d1d1f" }],
          "etiquetas": [],
          "tallas": { "35": 1, "36": 2, "37": 3, "38": 2, "39": 1, "40": 0 }
        },
        {
          "id": "bota-faena-cafe",
          "nombre": "Bota de Trabajo Faena",
          "precio": 64990,
          "forma": "bota",
          "fotos": ["img/catalogo/bota-faena-cafe.svg"],
          "detalle": "Punta de acero, suela antideslizante y resistente al aceite.",
          "descripcion": "Cumple para obra y bodega.\nCuero grueso con costuras doble pespunte.",
          "material": "Cuero",
          "cuidados": "Cepilla y aplica grasa de cuero una vez al mes.",
          "colores": [{ "nombre": "Café", "hex": "#6f4428" }],
          "etiquetas": [],
          "tallas": { "39": 1, "40": 2, "41": 4, "42": 4, "43": 3, "44": 2 }
        },
        {
          "id": "bota-lluvia-negra",
          "nombre": "Bota de Lluvia Marea",
          "precio": 32990,
          "forma": "bota",
          "fotos": ["img/catalogo/bota-lluvia-negra.svg"],
          "detalle": "De goma, impermeable de verdad, con plantilla extraíble.",
          "descripcion": "Caña de 30 cm.\nSe lava con agua y queda como nueva.",
          "material": "Goma",
          "cuidados": "Enjuaga con agua y deja secar boca abajo.",
          "colores": [{ "nombre": "Negro", "hex": "#1d1d1f" }],
          "etiquetas": [],
          "tallas": { "35": 2, "36": 3, "37": 3, "38": 3, "39": 2, "40": 1 }
        }
      ]
    },
    {
      "id": "zapatillas",
      "nombre": "Zapatillas",
      "productos": [
        {
          "id": "pachara-black",
          "nombre": "Pachara Black",
          "precio": 39990,
          "forma": "zapatilla",
          "fotos": ["img/catalogo/pachara-black.webp"],
          "detalle": "Zapatilla outdoor con caña media, cordones reforzados y suela con buen agarre.",
          "descripcion": "Para caminar, salir a la montaña o andar todo el día en la ciudad.\nCuello acolchado y refuerzo en la punta.\nDetalles en fucsia.",
          "material": "Textil con refuerzos sintéticos",
          "cuidados": "Cepillo húmedo y jabón suave. No la metas a la lavadora.",
          "colores": [{ "nombre": "Negro / Fucsia", "hex": "#1d1d1f" }],
          "etiquetas": [],
          "destacado": true,
          "tallas": { "36": 2, "37": 3, "38": 4, "39": 3, "40": 2, "41": 1 }
        },
        {
          "id": "zapatilla-nube-blanca",
          "nombre": "Zapatilla Nube Blanca",
          "precio": 39990,
          "precioAntes": 49990,
          "forma": "zapatilla",
          "fotos": ["img/catalogo/zapatilla-nube-blanca.svg"],
          "detalle": "Cuero sintético liso, suela de goma de 3 cm y plantilla acolchada.",
          "descripcion": "Anda bien para todo el día y combina con todo.\nPlantilla extraíble.",
          "material": "Cuero sintético",
          "cuidados": "Paño húmedo con jabón suave; la suela con cepillo.",
          "colores": [{ "nombre": "Blanco", "hex": "#f2f0ec" }],
          "etiquetas": ["oferta"],
          "destacado": true,
          "tallas": { "35": 2, "36": 4, "37": 5, "38": 3, "39": 0, "40": 1 }
        },
        {
          "id": "zapatilla-brisa-coral",
          "nombre": "Zapatilla Brisa Coral",
          "precio": 44990,
          "forma": "zapatilla",
          "fotos": ["img/catalogo/zapatilla-brisa-coral.svg"],
          "detalle": "Malla liviana que transpira, con amortiguación y talón reforzado.",
          "descripcion": "Para caminar, trotar y el gimnasio.\nPesa poco: 240 g en talla 37.",
          "material": "Malla técnica",
          "cuidados": "Lava a mano con agua fría y seca a la sombra.",
          "colores": [{ "nombre": "Coral", "hex": "#e2614f" }],
          "etiquetas": ["nuevo"],
          "tallas": { "35": 1, "36": 3, "37": 4, "38": 4, "39": 2, "40": 0 }
        },
        {
          "id": "zapatilla-ritmo-azul",
          "nombre": "Zapatilla Ritmo Azul",
          "precio": 46990,
          "precioAntes": 56990,
          "forma": "zapatilla",
          "fotos": ["img/catalogo/zapatilla-ritmo-azul.svg"],
          "detalle": "Malla que transpira, entresuela con rebote y lengua acolchada.",
          "descripcion": "Para trotar y para andar todo el día.\nRefuerzo en el talón.",
          "material": "Malla técnica",
          "cuidados": "Lava a mano con agua fría y seca a la sombra.",
          "colores": [{ "nombre": "Azul", "hex": "#2f4b8f" }],
          "etiquetas": ["oferta"],
          "tallas": { "39": 1, "40": 3, "41": 4, "42": 3, "43": 2, "44": 0 }
        },
        {
          "id": "zapatilla-dune-beige",
          "nombre": "Zapatilla de Lona Dune",
          "precio": 24990,
          "forma": "zapatilla",
          "fotos": ["img/catalogo/zapatilla-dune-beige.svg"],
          "detalle": "Lona de algodón, suela flexible y plantilla extraíble.",
          "descripcion": "Lo más liviano de la tienda.\nIdeal para el verano.",
          "material": "Lona de algodón",
          "cuidados": "Lavable a mano. No uses cloro.",
          "colores": [{ "nombre": "Beige", "hex": "#d9c8ad" }],
          "etiquetas": [],
          "tallas": { "35": 3, "36": 5, "37": 6, "38": 4, "39": 3, "40": 2 }
        },
        {
          "id": "zapatilla-muro-negra",
          "nombre": "Zapatilla Skate Muro",
          "precio": 39990,
          "forma": "zapatilla",
          "fotos": ["img/catalogo/zapatilla-muro-negra.svg"],
          "detalle": "Lona reforzada en los costados, suela plana con buen agarre.",
          "descripcion": "Caña baja, pensada para andar en skate.\nRefuerzo de goma en el empeine.",
          "material": "Lona reforzada",
          "cuidados": "Cepillo húmedo y jabón suave.",
          "colores": [{ "nombre": "Negro", "hex": "#1d1d1f" }],
          "etiquetas": [],
          "tallas": { "39": 2, "40": 3, "41": 3, "42": 3, "43": 1, "44": 1 }
        }
      ]
    },
    {
      "id": "urbanas",
      "nombre": "Urbanas",
      "productos": [
        {
          "id": "zapatilla-tramo-blanca",
          "nombre": "Zapatilla Urbana Tramo",
          "precio": 42990,
          "forma": "zapatilla",
          "fotos": ["img/catalogo/zapatilla-tramo-blanca.svg"],
          "detalle": "Corte liso, suela de goma gruesa y plantilla con memoria.",
          "descripcion": "La que sirve para la oficina y para salir.\nCordones planos de repuesto incluidos.",
          "material": "Cuero sintético",
          "cuidados": "Paño húmedo con jabón suave.",
          "colores": [{ "nombre": "Blanco", "hex": "#f2f0ec" }],
          "etiquetas": [],
          "destacado": true,
          "tallas": { "39": 2, "40": 4, "41": 5, "42": 4, "43": 2, "44": 1 }
        },
        {
          "id": "zapatilla-mia-negra",
          "nombre": "Zapatilla Plataforma Mia",
          "precio": 42990,
          "forma": "zapatilla",
          "fotos": ["img/catalogo/zapatilla-mia-negra.svg"],
          "detalle": "Plataforma de 4,5 cm, cordones gruesos y cierre lateral.",
          "descripcion": "Entra fácil gracias al cierre del costado.\nSuela liviana aunque se vea alta.",
          "material": "Cuero sintético",
          "cuidados": "Paño húmedo con jabón suave.",
          "colores": [{ "nombre": "Negro", "hex": "#1d1d1f" }],
          "etiquetas": [],
          "tallas": { "35": 0, "36": 2, "37": 3, "38": 2, "39": 1, "40": 0 }
        },
        {
          "id": "oxford-don-negro",
          "nombre": "Zapato Oxford Don",
          "precio": 59990,
          "forma": "mocasin",
          "fotos": ["img/catalogo/oxford-don-negro.svg"],
          "detalle": "Cuero con terminación brillante, cordones y suela cosida.",
          "descripcion": "Para matrimonios, titulaciones y la oficina.\nHorma clásica, ni angosta ni ancha.",
          "material": "Cuero",
          "cuidados": "Betún del color y cepillo. Guarda con hormas.",
          "colores": [{ "nombre": "Negro", "hex": "#1d1d1f" }],
          "etiquetas": [],
          "tallas": { "39": 1, "40": 3, "41": 4, "42": 3, "43": 2, "44": 1 }
        },
        {
          "id": "mocasin-puerto-cafe",
          "nombre": "Mocasín Puerto",
          "precio": 52990,
          "forma": "mocasin",
          "fotos": ["img/catalogo/mocasin-puerto-cafe.svg"],
          "detalle": "Sin cordones, con antifaz y suela liviana. Cómodo desde el primer día.",
          "descripcion": "Se pone y se saca de una.\nForro interior en cuero.",
          "material": "Cuero",
          "cuidados": "Betún neutro y paño seco.",
          "colores": [{ "nombre": "Café", "hex": "#6f4428" }],
          "etiquetas": [],
          "tallas": { "39": 2, "40": 2, "41": 3, "42": 2, "43": 1, "44": 0 }
        },
        {
          "id": "balerina-suave-nude",
          "nombre": "Balerina Suave",
          "precio": 29990,
          "forma": "mocasin",
          "fotos": ["img/catalogo/balerina-suave-nude.svg"],
          "detalle": "Plana, con lazo al frente y plantilla blanda.",
          "descripcion": "Se dobla para llevarla en el bolso.\nSuela antideslizante.",
          "material": "Gamuza sintética",
          "cuidados": "Cepillo seco de cerdas suaves.",
          "colores": [{ "nombre": "Nude", "hex": "#dcae97" }],
          "etiquetas": [],
          "tallas": { "35": 3, "36": 4, "37": 4, "38": 3, "39": 1, "40": 0 }
        },
        {
          "id": "taco-oficina-negro",
          "nombre": "Zapato Taco Medio Oficina",
          "precio": 44990,
          "forma": "taco",
          "fotos": ["img/catalogo/taco-oficina-negro.svg"],
          "detalle": "Taco de 5 cm, ancho y estable. El que aguanta la jornada completa.",
          "descripcion": "Plantilla con gel en la zona del metatarso.\nPunta redondeada.",
          "material": "Cuero sintético mate",
          "cuidados": "Paño húmedo y betún neutro.",
          "colores": [{ "nombre": "Negro", "hex": "#1d1d1f" }],
          "etiquetas": [],
          "tallas": { "35": 1, "36": 3, "37": 4, "38": 3, "39": 2, "40": 1 }
        }
      ]
    },
    {
      "id": "accesorios",
      "nombre": "Accesorios",
      "productos": [
        {
          "id": "kit-limpieza",
          "nombre": "Kit de limpieza para zapatillas",
          "precio": 12990,
          "forma": "caja",
          "fotos": ["img/catalogo/kit-limpieza.svg"],
          "detalle": "Espuma limpiadora, cepillo blando y paño de microfibra.",
          "descripcion": "Sirve para lona, malla y cuero sintético.\nRinde unos 30 lavados.",
          "material": "",
          "cuidados": "",
          "colores": [],
          "etiquetas": [],
          "tallaUnica": true,
          "stock": 12
        },
        {
          "id": "betun-neutro",
          "nombre": "Betún neutro",
          "precio": 4490,
          "forma": "frasco",
          "fotos": ["img/catalogo/betun-neutro.svg"],
          "detalle": "Sirve para cualquier color de cuero. Pote de 50 ml.",
          "descripcion": "Nutre e impermeabiliza sin cambiar el color.",
          "material": "",
          "cuidados": "",
          "colores": [],
          "etiquetas": [],
          "tallaUnica": true,
          "stock": 20
        },
        {
          "id": "plantillas-gel",
          "nombre": "Plantillas de gel",
          "precio": 7990,
          "forma": "caja",
          "fotos": ["img/catalogo/plantillas-gel.svg"],
          "detalle": "Se recortan a tu talla. Amortiguan el talón y el metatarso.",
          "descripcion": "Un par. Se pueden lavar con agua y jabón.",
          "material": "",
          "cuidados": "",
          "colores": [],
          "etiquetas": [],
          "tallaUnica": true,
          "stock": 15
        },
        {
          "id": "calcetines-pack",
          "nombre": "Calcetines invisibles (pack de 3)",
          "precio": 5990,
          "forma": "caja",
          "fotos": ["img/catalogo/calcetines-pack.svg"],
          "detalle": "Algodón con silicona en el talón para que no se bajen.",
          "descripcion": "Talla única (36 a 41).",
          "material": "Algodón",
          "cuidados": "",
          "colores": [],
          "etiquetas": [],
          "tallaUnica": true,
          "stock": 25
        },
        {
          "id": "cordones-planos",
          "nombre": "Cordones planos (par)",
          "precio": 2990,
          "forma": "cordon",
          "fotos": ["img/catalogo/cordones-planos.svg"],
          "detalle": "120 cm. Pídelos en blanco, negro o beige por WhatsApp.",
          "descripcion": "Algodón encerado, no se desatan solos.",
          "material": "Algodón",
          "cuidados": "",
          "colores": [],
          "etiquetas": [],
          "tallaUnica": true,
          "stock": 30
        }
      ]
    }
  ]
};
