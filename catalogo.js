/*
  CATÁLOGO DE TEFI STORE
  ======================
  Lo más fácil es editarlo desde el panel: tu-pagina/admin
  También se puede editar aquí: los precios van sin punto ni signo (22990), las tallas como
  "35-40" o { "35": 2, "36": 4 }, y cada elemento de una lista va separado por una coma.
  La explicación completa está en el README del repositorio.
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
    "notaRetiro": "Solo en La Serena. Coordinamos el punto y la hora por WhatsApp.",
    "retiroComuna": "La Serena",
    "envioPorPagar": true,
    "envioGratisDesde": 0,
    "envios": [
      {
        "nombre": "La Serena",
        "detalle": "1 a 2 días hábiles (estimado)",
        "comunas": [
          "La Serena",
          "Coquimbo"
        ]
      },
      {
        "nombre": "Resto de Chile",
        "detalle": "3 a 5 días hábiles (estimado), por Starken o Chilexpress",
        "regiones": [
          "*"
        ]
      }
    ],
    "pagos": [
      "Transferencia",
      "Efectivo al retirar"
    ],
    "cambios": "No se hacen cambios ni devoluciones.",
    "garantia": "",
    "politicas": [
      {
        "titulo": "Cambios y devoluciones",
        "texto": "No se hacen cambios ni devoluciones. Por eso, si tienes dudas con la talla, escríbenos antes de comprar y la vemos juntas."
      },
      {
        "titulo": "Reservas",
        "texto": "No se hacen reservas. El pedido queda tomado cuando se confirma."
      },
      {
        "titulo": "Reembolsos",
        "texto": "No se realizan reembolsos."
      },
      {
        "titulo": "Envíos",
        "texto": "Todos los envíos son por pagar: el despacho lo pagas al recibirlo, directo al transporte. No se hacen excepciones."
      },
      {
        "titulo": "Plazos de entrega",
        "texto": "Los valores de envío y los tiempos de llegada son estimativos. No nos hacemos responsables si el plazo es mayor, porque no depende de nosotros."
      }
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
    "foto": "img/catalogo/intiara-camel.webp",
    "boton": "Ver el modelo",
    "enlace": "#/p/intiara"
  },
  "textos": {
    "catalogo": {
      "titulo": "Catálogo",
      "bajada": "Todos los modelos vienen de la talla 35 a la 40. Antes de enviarte el pedido confirmamos por WhatsApp que esté tu talla.",
      "destacado": ""
    },
    "destacados": {
      "titulo": "Destacados",
      "bajada": "",
      "destacado": ""
    },
    "tallas": {
      "titulo": "Guía de tallas",
      "bajada": "Mide tu pie en centímetros, del talón al dedo más largo, de pie y sobre una hoja. Ojo: varios modelos tienen horma pequeña, así que conviene pedir una talla más.",
      "destacado": ""
    },
    "tienda": {
      "titulo": "Visítanos en la tienda",
      "bajada": "",
      "destacado": ""
    },
    "pasos": {
      "titulo": "Comprar es simple",
      "bajada": "",
      "destacado": ""
    },
    "politicas": {
      "titulo": "Políticas de compra",
      "bajada": "Para que no haya sorpresas, esto es lo que acordamos en cada compra.",
      "destacado": ""
    }
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
  "regiones": [
    "Arica y Parinacota",
    "Tarapacá",
    "Antofagasta",
    "Atacama",
    "Coquimbo",
    "Valparaíso",
    "Metropolitana",
    "O'Higgins",
    "Maule",
    "Ñuble",
    "Biobío",
    "La Araucanía",
    "Los Ríos",
    "Los Lagos",
    "Aysén",
    "Magallanes"
  ],
  "guiaTallas": [
    {
      "talla": "35",
      "cm": "22,5",
      "us": "5"
    },
    {
      "talla": "36",
      "cm": "23,0",
      "us": "5,5"
    },
    {
      "talla": "37",
      "cm": "23,5",
      "us": "6,5"
    },
    {
      "talla": "38",
      "cm": "24,5",
      "us": "7,5"
    },
    {
      "talla": "39",
      "cm": "25,0",
      "us": "8"
    },
    {
      "talla": "40",
      "cm": "25,5",
      "us": "8,5"
    }
  ],
  "cupones": [],
  "portadaSegundos": 4,
  "categorias": [
    {
      "id": "botines",
      "nombre": "Botines",
      "foto": "img/catalogo/quilla-seda.webp",
      "productos": [
        {
          "id": "intiara",
          "nombre": "Intiara",
          "precio": 22990,
          "fotos": [
            "img/catalogo/intiara-camel.webp",
            "img/catalogo/intiara-black.webp"
          ],
          "detalle": "Botín de gamuza premium con doble hebilla lateral, cómodo y versátil para tu día a día. En camel y en negro.",
          "descripcion": "Un nombre que simboliza luz, sofisticación y fuerza interior.\nAcabado tipo gamuza premium, de líneas refinadas y diseño contemporáneo. Sus delicadas hebillas y su estructura firme aportan carácter, y el taco estable hace que se pueda usar todo el día.",
          "material": "Tipo gamuza premium",
          "cuidados": "Limpia con cepillo seco de cerdas suaves. No lo mojes ni uses betún líquido.",
          "nota": "Horma pequeña: se recomienda pedir una talla más.",
          "colores": [
            {
              "nombre": "Camel",
              "hex": "#a9682f"
            },
            {
              "nombre": "Negro",
              "hex": "#1d1d1f"
            }
          ],
          "etiquetas": [],
          "tallas": "35-40",
          "destacado": true
        },
        {
          "id": "amarua-force",
          "nombre": "Amarua Force",
          "precio": 21990,
          "fotos": [
            "img/catalogo/amarua-force.webp"
          ],
          "detalle": "Botín tipo cuero con forro, estructura firme y taco estable.",
          "descripcion": "Un nombre que evoca fuerza interior y elegancia, diseñado para mujeres que destacan con cada paso.\nDiseño sofisticado y contemporáneo: comodidad sin renunciar al estilo.",
          "material": "Tipo cuero con forro",
          "cuidados": "Paño húmedo y betún neutro de vez en cuando.",
          "nota": "Horma pequeña: se recomienda pedir una talla más.",
          "colores": [
            {
              "nombre": "Negro",
              "hex": "#1d1d1f"
            }
          ],
          "etiquetas": [],
          "tallas": "35-40"
        },
        {
          "id": "sayani-prime",
          "nombre": "Sayani Prime",
          "precio": 19990,
          "fotos": [
            "img/catalogo/sayani-prime.webp"
          ],
          "detalle": "La combat que no puede faltar en tu clóset: chunky, firme y con toda la actitud.",
          "descripcion": "Perfectas para jeans, vestidos oversized o looks street.\nCordones al frente y suela gruesa con buen agarre.",
          "material": "Tipo cuero",
          "cuidados": "Cepilla el polvo y pasa un paño húmedo.",
          "nota": "Horma normal.",
          "colores": [
            {
              "nombre": "Negro",
              "hex": "#1d1d1f"
            }
          ],
          "etiquetas": [
            "oferta"
          ],
          "tallas": "35-40",
          "precioAntes": 22990,
          "destacado": true
        },
        {
          "id": "quilla-seda",
          "nombre": "Quilla Seda",
          "precio": 19990,
          "fotos": [
            "img/catalogo/quilla-seda.webp"
          ],
          "detalle": "Plataforma firme y taco con tachas doradas. Un diseño que no pasa desapercibido.",
          "descripcion": "Perfectas para elevar cualquier look, de día o de noche.\nCierre lateral y plataforma delantera, así el taco se siente más bajo de lo que se ve.",
          "material": "Tipo cuero",
          "cuidados": "Paño húmedo y betún neutro.",
          "nota": "Horma normal.",
          "colores": [
            {
              "nombre": "Marrón",
              "hex": "#4a2d20"
            }
          ],
          "etiquetas": [
            "oferta"
          ],
          "tallas": "35-40",
          "precioAntes": 22990
        },
        {
          "id": "pachara",
          "nombre": "Pachara",
          "precio": 18990,
          "fotos": [
            "img/catalogo/pachara-camel.webp",
            "img/catalogo/pachara-black.webp"
          ],
          "detalle": "Botín outdoor con acabado gamuza premium, suela antideslizante y acolchado interno. En camel con rosa y en negro con rosa y gris.",
          "descripcion": "Un nombre que representa fuerza, versatilidad y estilo urbano. Diseñado para mujeres activas que buscan comodidad sin perder actitud.\nTobillera alta para mayor sujeción y detalles en contraste rosa y gris.",
          "material": "Tipo gamuza premium",
          "cuidados": "Cepillo húmedo y jabón suave. No la metas a la lavadora.",
          "nota": "Horma pequeña: se recomienda pedir una talla más.",
          "colores": [
            {
              "nombre": "Camel",
              "hex": "#b1763a"
            },
            {
              "nombre": "Negro",
              "hex": "#1d1d1f"
            }
          ],
          "etiquetas": [],
          "tallas": "35-40"
        }
      ]
    },
    {
      "id": "botas",
      "nombre": "Botas",
      "foto": "img/catalogo/inti-oro.webp",
      "productos": [
        {
          "id": "kallpa",
          "nombre": "Kallpa",
          "precio": 24990,
          "fotos": [
            "img/catalogo/kallpa-white.webp",
            "img/catalogo/kallpa-noir.webp"
          ],
          "detalle": "Bota estilizada con detalle de cadena y taco firme. En negro y en blanco.",
          "descripcion": "Sofisticación en cada paso.\nDiseño estilizado, detalle de cadena y taco firme que eleva cualquier look. Una bota pensada para mujeres seguras, que marcan presencia.",
          "material": "Tipo cuero",
          "cuidados": "Paño húmedo. Guarda la bota de pie para que no se marque la caña.",
          "nota": "Horma pequeña: se recomienda pedir una talla más.",
          "colores": [
            {
              "nombre": "Blanco",
              "hex": "#f2f0ec"
            },
            {
              "nombre": "Negro",
              "hex": "#1d1d1f"
            }
          ],
          "etiquetas": [
            "oferta"
          ],
          "tallas": "35-40",
          "precioAntes": 30990,
          "destacado": true
        },
        {
          "id": "inti-oro",
          "nombre": "Inti Oro",
          "precio": 24990,
          "fotos": [
            "img/catalogo/inti-oro.webp"
          ],
          "detalle": "Diseño western bordado en tono camel, elegante y lleno de personalidad.",
          "descripcion": "Un modelo diferente, que combina con todo.\nPerfectas para elevar looks neutros, jeans, vestidos u outfits boho chic.",
          "material": "Tipo gamuza",
          "cuidados": "Cepillo seco de cerdas suaves.",
          "nota": "Horma pequeña: se recomienda pedir una talla más.",
          "colores": [
            {
              "nombre": "Camel",
              "hex": "#a9682f"
            }
          ],
          "etiquetas": [
            "oferta"
          ],
          "tallas": "35-40",
          "precioAntes": 32990
        },
        {
          "id": "yastay-ebano",
          "nombre": "Yastay Ébano",
          "precio": 24990,
          "fotos": [
            "img/catalogo/yastay-ebano.webp",
            "img/catalogo/yastay-ebano-2.webp"
          ],
          "detalle": "Una bota que estiliza al instante: caña alta con efecto drapeado y taco firme.",
          "descripcion": "Perfectas para outfits elegantes, salidas nocturnas o eventos especiales.",
          "material": "Tipo cuero",
          "cuidados": "Paño húmedo. Guárdala de pie para mantener la caña.",
          "nota": "Horma pequeña: se recomienda pedir una talla más.",
          "colores": [
            {
              "nombre": "Negro",
              "hex": "#1d1d1f"
            }
          ],
          "etiquetas": [
            "oferta"
          ],
          "tallas": "35-40",
          "precioAntes": 29990
        },
        {
          "id": "sumaq-atelier",
          "nombre": "Sumaq Atelier",
          "precio": 21990,
          "fotos": [
            "img/catalogo/sumaq-atelier.webp"
          ],
          "detalle": "Diseño urbano con hebilla metálica, cierre frontal y suela chunky.",
          "descripcion": "Versión elegante y moderna: una bota con presencia y actitud.",
          "material": "Tipo cuero",
          "cuidados": "Paño húmedo y betún neutro.",
          "nota": "Horma pequeña: se recomienda pedir una talla más.",
          "colores": [
            {
              "nombre": "Negro",
              "hex": "#1d1d1f"
            }
          ],
          "etiquetas": [
            "oferta"
          ],
          "tallas": "35-40",
          "precioAntes": 25990
        },
        {
          "id": "aynara-street",
          "nombre": "Aynara Street",
          "precio": 21990,
          "fotos": [
            "img/catalogo/aynara-terra.webp",
            "img/catalogo/aynara-black.webp"
          ],
          "detalle": "Bota de gamuza premium con suaves pliegues y hebillas delicadas. En terracota y en negro.",
          "descripcion": "Un nombre que evoca libertad, conexión con la tierra y elegancia auténtica.\nSu taco firme asegura comodidad y estabilidad en cada paso.",
          "material": "Tipo gamuza premium",
          "cuidados": "Cepillo seco de cerdas suaves.",
          "nota": "Horma pequeña: se recomienda pedir una talla más.",
          "colores": [
            {
              "nombre": "Terracota",
              "hex": "#7d3b2e"
            },
            {
              "nombre": "Negro",
              "hex": "#1d1d1f"
            }
          ],
          "etiquetas": [],
          "tallas": {
            "35": 1,
            "36": 1,
            "37": 1,
            "38": 1,
            "39": 1,
            "40": 1
          }
        }
      ]
    },
    {
      "id": "zapatillas",
      "nombre": "Zapatillas",
      "foto": "img/catalogo/kallpa-chaki.webp",
      "productos": [
        {
          "id": "kallpa-chaki",
          "nombre": "Kallpa Chaki",
          "precio": 18990,
          "fotos": [
            "img/catalogo/kallpa-chaki.webp"
          ],
          "detalle": "Zapatilla deportiva con suela alta. Viene en negro y en café.",
          "descripcion": "Representa la fuerza y resistencia del espíritu andino, inspirada en el desierto de Atacama. Cada zapatilla refleja energía, identidad y superación personal.",
          "material": "Textil con detalles sintéticos",
          "cuidados": "Cepillo húmedo y jabón suave.",
          "nota": "Horma normal.",
          "colores": [
            {
              "nombre": "Café",
              "hex": "#6b4a37"
            },
            {
              "nombre": "Negro",
              "hex": "#1d1d1f"
            }
          ],
          "etiquetas": [],
          "tallas": "35-40",
          "destacado": true
        },
        {
          "id": "rumi-chaki",
          "nombre": "Rumi Chaki",
          "precio": 18990,
          "fotos": [
            "img/catalogo/rumi-chaki.webp"
          ],
          "detalle": "Zapatilla blanca con detalles en rosado y suela alta.",
          "descripcion": "Representa la firmeza y resistencia de la piedra en el paisaje del desierto. Inspirada en la fortaleza de la cultura andina.",
          "material": "Textil con detalles sintéticos",
          "cuidados": "Cepillo húmedo y jabón suave.",
          "nota": "Horma normal.",
          "colores": [
            {
              "nombre": "Rosado y blanco",
              "hex": "#e8c9cd"
            }
          ],
          "etiquetas": [],
          "tallas": "35-40"
        },
        {
          "id": "hatun-nam",
          "nombre": "Hatun Ñam",
          "precio": 12990,
          "fotos": [
            "img/catalogo/hatun-nam.webp",
            "img/catalogo/hatun-nam-cafe.webp",
            "img/catalogo/hatun-nam-rojo.webp"
          ],
          "detalle": "Zapatilla urbana de ecocuero con franjas en contraste y suela de goma. En negro, café y rojo.",
          "descripcion": "Simboliza el gran camino de la vida y la historia ancestral andina. Inspirada en las rutas del desierto atacameño.",
          "material": "Ecocuero",
          "cuidados": "Paño húmedo con jabón suave.",
          "nota": "Horma normal.",
          "colores": [
            {
              "nombre": "Negro",
              "hex": "#1d1d1f"
            },
            {
              "nombre": "Café",
              "hex": "#6b4a37"
            },
            {
              "nombre": "Rojo",
              "hex": "#9b2c2c"
            },
            {
              "nombre": "Verde",
              "hex": "#263e0f"
            }
          ],
          "etiquetas": [],
          "tallas": {
            "35": 1,
            "36": 3,
            "37": 0,
            "38": 1,
            "39": 1,
            "40": 0
          }
        },
        {
          "id": "sumaq-one",
          "nombre": "Sumaq One",
          "precio": 17990,
          "fotos": [
            "img/catalogo/sumaq-one.webp",
            "img/catalogo/sumaq-one-negro.webp"
          ],
          "detalle": "Zapatilla urbana de plataforma, cómoda y con actitud.",
          "descripcion": "Comodidad total, diseño urbano y una actitud que destaca.",
          "material": "",
          "cuidados": "",
          "nota": "Horma normal.",
          "colores": [
            {
              "nombre": "Blanca",
              "hex": "#f2f0ec"
            },
            {
              "nombre": "Negro gamuza",
              "hex": "#1d1d1f"
            }
          ],
          "etiquetas": [
            "oferta"
          ],
          "tallas": "35-40",
          "precioAntes": 22990
        },
        {
          "id": "inti-prime",
          "nombre": "Inti Prime",
          "precio": 17990,
          "fotos": [
            "img/catalogo/inti-prime.webp",
            "img/catalogo/inti-prime-negro.webp"
          ],
          "detalle": "Zapatilla urbana de plataforma, liviana y con buen agarre.",
          "descripcion": "La energía del sol hecha zapatilla: comodidad total, estilo urbano y un diseño que brilla en cada paso.",
          "material": "",
          "cuidados": "",
          "nota": "Horma normal.",
          "colores": [
            {
              "nombre": "Blanca",
              "hex": "#f2f0ec"
            },
            {
              "nombre": "Negro",
              "hex": "#1d1d1f"
            }
          ],
          "etiquetas": [
            "oferta"
          ],
          "tallas": "35-40",
          "precioAntes": 22990
        },
        {
          "id": "nawi-street",
          "nombre": "Ñawi Street",
          "precio": 17990,
          "fotos": [
            "img/catalogo/nawi-street.webp",
            "img/catalogo/nawi-street-negro.webp"
          ],
          "detalle": "Zapatilla urbana de plataforma, con terminaciones limpias.",
          "descripcion": "Diseño moderno, comodidad total y un toque único que llama la atención en cada paso.",
          "material": "",
          "cuidados": "",
          "nota": "Horma normal.",
          "colores": [
            {
              "nombre": "Blanca",
              "hex": "#f2f0ec"
            },
            {
              "nombre": "Negro",
              "hex": "#1d1d1f"
            }
          ],
          "etiquetas": [
            "oferta"
          ],
          "tallas": "35-40",
          "precioAntes": 22990
        },
        {
          "id": "killa-mode",
          "nombre": "Killa Mode",
          "precio": 17990,
          "fotos": [
            "img/catalogo/killa-mode.webp"
          ],
          "detalle": "Zapatilla urbana de plataforma en charol.",
          "descripcion": "Estilo urbano inspirado en la magia de la noche, con la comodidad que te acompaña en cada paso.",
          "material": "",
          "cuidados": "",
          "nota": "Horma normal.",
          "colores": [
            {
              "nombre": "Negro charol",
              "hex": "#1d1d1f"
            }
          ],
          "etiquetas": [
            "oferta"
          ],
          "tallas": "35-40",
          "precioAntes": 22990
        },
        {
          "id": "chaska-glow",
          "nombre": "Chaska Glow",
          "precio": 17990,
          "fotos": [
            "img/catalogo/chaska-glow.webp"
          ],
          "detalle": "Zapatilla urbana de plataforma con tachas.",
          "descripcion": "La estrella que iluminará tu estilo.\nComodidad total, diseño urbano y el brillo perfecto para cada paso.",
          "material": "",
          "cuidados": "",
          "nota": "Horma normal.",
          "colores": [
            {
              "nombre": "Blanca",
              "hex": "#f2f0ec"
            }
          ],
          "etiquetas": [
            "nuevo"
          ],
          "tallas": "35-40"
        },
        {
          "id": "pacha-core",
          "nombre": "Pacha Core",
          "precio": 13990,
          "fotos": [
            "img/catalogo/pacha-core.webp",
            "img/catalogo/pacha-core-negro.webp"
          ],
          "detalle": "Zapatilla urbana con suela gruesa y detalles en contraste.",
          "descripcion": "Un diseño urbano con la solidez y comodidad que te conecta con tu estilo en cada momento.",
          "material": "",
          "cuidados": "",
          "nota": "Horma normal.",
          "colores": [
            {
              "nombre": "Pink",
              "hex": "#e0a9b8"
            },
            {
              "nombre": "Negro",
              "hex": "#1d1d1f"
            }
          ],
          "etiquetas": [
            "oferta"
          ],
          "tallas": "35-40",
          "precioAntes": 16990
        },
        {
          "id": "wayra-rush",
          "nombre": "Wayra Rush",
          "precio": 15990,
          "fotos": [
            "img/catalogo/wayra-rush.webp"
          ],
          "detalle": "Zapatilla urbana liviana, para los días largos.",
          "descripcion": "Un diseño que combina fuerza y estilo, ideal para quienes no paran nunca.\nComodidad, carácter y actitud para destacar donde vayas.",
          "material": "",
          "cuidados": "",
          "nota": "Horma normal.",
          "colores": [
            {
              "nombre": "Negro",
              "hex": "#1d1d1f"
            },
            {
              "nombre": "Gris",
              "hex": "#9a9aa0"
            }
          ],
          "etiquetas": [
            "oferta"
          ],
          "tallas": "35-40",
          "precioAntes": 19990
        },
        {
          "id": "inti-nam",
          "nombre": "Inti Ñam",
          "precio": 15990,
          "fotos": [
            "img/catalogo/inti-nam.webp"
          ],
          "detalle": "Zapatilla urbana de corte bajo, con franjas en contraste.",
          "descripcion": "Simboliza el camino guiado por el sol del desierto. Representa energía, perseverancia y conexión.",
          "material": "",
          "cuidados": "",
          "nota": "Horma normal.",
          "colores": [
            {
              "nombre": "Gris",
              "hex": "#9a9aa0"
            }
          ],
          "etiquetas": [],
          "tallas": "35-40"
        },
        {
          "id": "chaska-nam",
          "nombre": "Chaska Ñam",
          "precio": 14990,
          "fotos": [
            "img/catalogo/chaska-nam.webp"
          ],
          "detalle": "Zapatilla de lona con plataforma y cordones.",
          "descripcion": "Simboliza el camino guiado por las estrellas del cielo atacameño. Representa libertad, exploración y conexión espiritual.",
          "material": "",
          "cuidados": "",
          "nota": "Horma pequeña: se recomienda pedir una talla más.",
          "colores": [
            {
              "nombre": "Negro",
              "hex": "#1d1d1f"
            }
          ],
          "etiquetas": [],
          "tallas": "35-40"
        }
      ]
    },
    {
      "id": "sandalias",
      "nombre": "Sandalias",
      "foto": "img/catalogo/kori-desierto.webp",
      "productos": [
        {
          "id": "kori-desierto",
          "nombre": "Kori del Desierto",
          "precio": 16990,
          "fotos": [
            "img/catalogo/kori-desierto.webp"
          ],
          "detalle": "Sandalia de plataforma con doble hebilla y base de yute.",
          "descripcion": "Evoca oro y brillo. Modelo elegante que simboliza el resplandor del sol sobre la arena.",
          "material": "",
          "cuidados": "",
          "nota": "Horma pequeña: se recomienda pedir una talla más.",
          "colores": [
            {
              "nombre": "Negro",
              "hex": "#1d1d1f"
            }
          ],
          "etiquetas": [
            "nuevo"
          ],
          "tallas": "35-40"
        },
        {
          "id": "amera",
          "nombre": "Améra",
          "precio": 15990,
          "fotos": [
            "img/catalogo/amera.webp"
          ],
          "detalle": "Sandalia de plataforma de 9 cm con doble hebilla metálica.",
          "descripcion": "Un modelo con carácter, pensado para mujeres seguras de su estilo.\nDiseño firme, cómodo y con presencia.",
          "material": "",
          "cuidados": "",
          "nota": "Horma pequeña: se recomienda pedir una talla más.",
          "colores": [
            {
              "nombre": "Gris",
              "hex": "#9a9aa0"
            }
          ],
          "etiquetas": [],
          "tallas": "35-40"
        },
        {
          "id": "lumia",
          "nombre": "Lúmia",
          "precio": 18990,
          "fotos": [
            "img/catalogo/lumia.webp"
          ],
          "detalle": "Sandalia de plataforma de 9 cm con tiras finas y tachas.",
          "descripcion": "Un diseño delicado con un toque sofisticado.\nPerfecta para quienes aman destacar con elegancia sutil.",
          "material": "",
          "cuidados": "",
          "nota": "Horma pequeña: se recomienda pedir una talla más.",
          "colores": [
            {
              "nombre": "Negro",
              "hex": "#1d1d1f"
            }
          ],
          "etiquetas": [],
          "tallas": "35-40"
        },
        {
          "id": "zeira",
          "nombre": "Zéira",
          "precio": 18990,
          "fotos": [
            "img/catalogo/zeira.webp"
          ],
          "detalle": "Sandalia de plataforma de 9 cm, de líneas limpias y hebilla al frente.",
          "descripcion": "Un diseño limpio y sofisticado que se adapta a cualquier ocasión.\nComodidad y estilo para acompañarte todo el día, sin esfuerzo.",
          "material": "",
          "cuidados": "",
          "nota": "Horma pequeña: se recomienda pedir una talla más.",
          "colores": [
            {
              "nombre": "Negro",
              "hex": "#1d1d1f"
            }
          ],
          "etiquetas": [],
          "tallas": "35-40"
        },
        {
          "id": "naya",
          "nombre": "Náya",
          "precio": 15990,
          "fotos": [
            "img/catalogo/naya.webp",
            "img/catalogo/naya-negro.webp"
          ],
          "detalle": "Sandalia de plataforma de 9 cm con tiras trenzadas acolchadas.",
          "descripcion": "Pensada para quienes buscan comodidad sin perder estilo.\nUn diseño versátil que combina perfecto con tu día a día.",
          "material": "",
          "cuidados": "",
          "nota": "Horma pequeña: se recomienda pedir una talla más.",
          "colores": [
            {
              "nombre": "Blanco",
              "hex": "#f2f0ec"
            },
            {
              "nombre": "Negro",
              "hex": "#1d1d1f"
            }
          ],
          "etiquetas": [],
          "tallas": "35-40"
        },
        {
          "id": "caly",
          "nombre": "Caly",
          "precio": 15990,
          "fotos": [
            "img/catalogo/caly.webp",
            "img/catalogo/caly-negro.webp"
          ],
          "detalle": "Sandalia de plataforma de 9 cm, de una sola tira ancha.",
          "descripcion": "Una sandalia básica que nunca falla.\nIdeal para combinar con todo y usar en cualquier ocasión.",
          "material": "",
          "cuidados": "",
          "nota": "Horma normal.",
          "colores": [
            {
              "nombre": "Blanco",
              "hex": "#f2f0ec"
            },
            {
              "nombre": "Negro",
              "hex": "#1d1d1f"
            }
          ],
          "etiquetas": [],
          "tallas": "35-40"
        },
        {
          "id": "tika-del-salar",
          "nombre": "Tika del Salar",
          "precio": 15990,
          "fotos": [
            "img/catalogo/tika-del-salar.webp",
            "img/catalogo/tika-del-salar-blanco.webp"
          ],
          "detalle": "Sandalia de plataforma con hebilla dorada.",
          "descripcion": "Modelo delicado inspirado en las flores que brotan cerca de los salares. Evoca pureza, suavidad y feminidad natural.",
          "material": "",
          "cuidados": "",
          "nota": "Horma normal.",
          "colores": [
            {
              "nombre": "Negro",
              "hex": "#1d1d1f"
            },
            {
              "nombre": "Blanco",
              "hex": "#f2f0ec"
            }
          ],
          "etiquetas": [],
          "tallas": "35-40"
        },
        {
          "id": "nayra-florida",
          "nombre": "Nayra Florida",
          "precio": 11990,
          "fotos": [
            "img/catalogo/nayra-florida.webp",
            "img/catalogo/nayra-florida-blanco.webp"
          ],
          "detalle": "Sandalia cruzada con hebilla y suela acolchada.",
          "descripcion": "Sandalia que representa conexión espiritual y belleza profunda.",
          "material": "",
          "cuidados": "",
          "nota": "Horma normal.",
          "colores": [
            {
              "nombre": "Negro",
              "hex": "#1d1d1f"
            },
            {
              "nombre": "Blanco",
              "hex": "#f2f0ec"
            }
          ],
          "etiquetas": [],
          "tallas": "35-40"
        },
        {
          "id": "suyai-brisa",
          "nombre": "Suyai Brisa",
          "precio": 11990,
          "fotos": [
            "img/catalogo/suyai-brisa.webp",
            "img/catalogo/suyai-brisa-negro.webp"
          ],
          "detalle": "Sandalia liviana de una tira, para andar todo el día.",
          "descripcion": "Sandalia ligera inspirada en el viento del altiplano. Representan libertad, esperanza y movimiento.",
          "material": "",
          "cuidados": "",
          "nota": "Horma normal.",
          "colores": [
            {
              "nombre": "Café",
              "hex": "#b08a6a"
            },
            {
              "nombre": "Negro",
              "hex": "#1d1d1f"
            }
          ],
          "etiquetas": [],
          "tallas": "35-40"
        }
      ]
    },
    {
      "id": "triton",
      "nombre": "Tritón",
      "foto": "fotos/categoria-triton-233y7.jpg",
      "productos": []
    }
  ]
};
