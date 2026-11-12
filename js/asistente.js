/* =========================================================================
   Tefi Store — asistente (el chat de abajo a la derecha)

   Con la IA configurada (GEMINI_API_KEY o ANTHROPIC_API_KEY en las variables del proyecto, ver
   functions/api/asistente.js) responde con IA usando el catálogo publicado.
   Sin la clave, o abriendo index.html directo, responde solo con el catálogo
   (modo básico): tallas, stock, despachos, pagos, cambios, horario y búsqueda.
   ========================================================================= */
(function () {
  "use strict";

  var P = window.paginaTienda;
  if (!P) return;
  var C = P.datos();
  var N = C.negocio || {};
  var API = "/api/asistente";
  var GUARDADO = "tefistore-chat-v1";
  var modoIA = location.protocol !== "file:";
  var mensajes = [];      // { role, content, productos, opciones }
  var ocupado = false;
  var abierto = false;

  function $(sel, raiz) { return (raiz || document).querySelector(sel); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  var t = P.sinTildes;
  var plata = P.plata;
  function leer() { try { return JSON.parse(sessionStorage.getItem(GUARDADO) || "null"); } catch (e) { return null; } }
  function guardar() { try { sessionStorage.setItem(GUARDADO, JSON.stringify(mensajes.slice(-20))); } catch (e) { /* sin almacenamiento */ } }

  var SVG = {
    chat: '<path d="M4.5 18.5V7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v7.5a2 2 0 0 1-2 2H9l-4.5 3.5Z"/><path d="M8.5 9.5h7M8.5 12.5h4.5"/>',
    cerrar: '<path d="M6 6l12 12M18 6 6 18"/>',
    enviar: '<path d="M4 12 20 4l-6 16-3-7-7-1Z"/>',
    zapato: '<path d="M11 42c-1-9 1.5-14.5 5.5-16.5 2-1 4-.5 4.5 2 .5 2.5 2 4 5 5.5l5-7c1.5-2 4-2 5.5 0 3.5 4.5 8 7.5 13.5 9 4 1.1 6 2.8 6 5.5v1Z"/><path d="M9.5 41.5h46c2.5 0 3.5 2 2.8 3.8-.7 1.8-2.8 2.7-5.8 2.7H14c-3 0-5-1.6-5-3.7Z"/>'
  };
  function icono(n, clase) { return '<svg class="' + (clase || "icono") + '" viewBox="0 0 24 24" aria-hidden="true">' + SVG[n] + "</svg>"; }

  /* ---------- Botones de respuesta rápida ----------
     Con "a" hacen una acción del chat; con "q" mandan esa pregunta. */
  var OP = {
    talla: { t: "📏 No sé mi talla" },
    botines: { t: "👢 Ver botines" },
    botas: { t: "👢 Ver botas" },
    zapatillas: { t: "👟 Ver zapatillas" },
    sandalias: { t: "🩴 Ver sandalias" },
    catalogo: { t: "🧾 Ver el catálogo" },
    ofertas: { t: "🏷️ Qué está en oferta" },
    nuevos: { t: "✨ Lo nuevo" },
    envio: { t: "🚚 Cuánto cuesta el despacho" },
    plazos: { t: "📦 Cuánto demora en llegar" },
    retiro: { t: "📍 Puedo retirar el pedido" },
    pagos: { t: "💳 Cómo puedo pagar" },
    cambios: { t: "📋 Políticas de compra" },
    horma: { t: "🦶 Cómo es la horma" },
    material: { t: "🧵 De qué material son" },
    cupones: { t: "🎟️ Tienen cupones" },
    comprar: { t: "❓ Cómo hago un pedido" },
    mas: { t: "⋯ Más temas", a: "mas" },
    bolsa: { t: "🛍️ Mi carrito", a: "carrito" },
    humano: { t: "💬 Hablar con alguien", a: "wsp" },
    reiniciar: { t: "🔄 Empezar de nuevo", a: "reiniciar" }
  };
  var OP_INICIO = ["talla", "catalogo", "ofertas", "envio"];
  var OP_MAS = ["botines", "botas", "zapatillas", "sandalias", "nuevos", "plazos", "retiro",
    "horma", "material", "pagos", "cambios", "cupones", "comprar", "humano", "reiniciar"];

  /* =====================================================================
     Modo básico: respuestas armadas con el catálogo (sin IA)
     ===================================================================== */
  var DIAS = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
  var DIAS_TXT = { lunes: "lunes", martes: "martes", miercoles: "miércoles", jueves: "jueves", viernes: "viernes", sabado: "sábado", domingo: "domingo" };

  function horarioTexto() {
    if (!C.horario) return "";
    var dias = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
    return dias.map(function (d) {
      return DIAS_TXT[d] + ": " + (C.horario[d] && C.horario[d] !== "cerrado" ? C.horario[d] : "cerrado");
    }).join("\n");
  }
  function conTalla(talla, max) {
    return P.productos().filter(function (p) { return P.stockTalla(p, talla) > 0; }).slice(0, max || 4);
  }
  function ids(lista) { return lista.map(function (p) { return p.id; }); }

  function responderBasico(texto) {
    var q = t(texto);
    var hay = function () {
      for (var i = 0; i < arguments.length; i++) if (q.indexOf(arguments[i]) >= 0) return true;
      return false;
    };

    // ¿preguntan por una talla? ("tienen la 38", "talla 40")
    var mTalla = /\b(?:talla\s*)?(2[4-9]|3[0-9]|4[0-9])\b/.exec(q);
    if (mTalla && (hay("talla", "tienen", "queda", "hay", "stock") || /^\s*\d+\s*$/.test(q))) {
      var talla = mTalla[1];
      var lista = conTalla(talla, 4);
      if (!lista.length) {
        return {
          texto: "Justo no me queda nada en talla " + talla + " 😕 Escríbenos por WhatsApp y la pedimos a bodega.",
          opciones: ["Ver otras tallas", "Hablar por WhatsApp"]
        };
      }
      return {
        texto: "Sí, en talla " + talla + " tengo " + (lista.length === 1 ? "este modelo" : "estos modelos") + ":",
        productos: ids(lista),
        opciones: ["¿Cuánto es el despacho?", "Ver más modelos"]
      };
    }

    // ¿preguntan por las tallas en general, sin decir un número? ("¿qué tallas tienen?")
    if (hay("talla") && !hay("que talla soy", "mi talla", "guia de talla", "como se mi talla", "medir",
      "cambi", "devol", "reembols", "reserv", "garantia")) {
      var numeros = {};
      P.productos().forEach(function (p) { P.tallas(p).forEach(function (n) { numeros[n] = true; }); });
      var rango = Object.keys(numeros).sort(function (a, b) { return a - b; });
      if (rango.length) {
        return {
          texto: "Todos los modelos vienen de la talla " + rango[0] + " a la " + rango[rango.length - 1] +
            " 👟\nDime tu número y te muestro lo que hay. Si no lo tienes claro, te ayudo a medirte.",
          opciones: ["No sé mi talla", "¿Tienen la 38?"]
        };
      }
    }

    if (hay("que talla soy", "mi talla", "no se mi talla", "guia de talla", "como se mi talla", "medir")) {
      var g = (C.guiaTallas || []).slice(0, 4).map(function (x) { return x.cm + " cm → talla " + x.talla; }).join("\n");
      return {
        texto: "Fácil: párate sobre una hoja con el talón pegado a la pared y marca hasta tu dedo más largo. Mide en centímetros y compara:\n" +
          g + "\n…la tabla completa está en «Guía de tallas». Si quedas entre dos, elige la más grande 🙂",
        opciones: ["¿Tienen la 38?", "Ver zapatillas"]
      };
    }

    if (hay("despacho", "envio", "envian", "delivery", "llega a", "despachan", "por pagar")) {
      var e = (N.envios || []).map(function (x) {
        return "• " + x.nombre + (x.precio && !N.envioPorPagar ? ": " + plata(x.precio) : "") +
          (x.detalle ? " — " + x.detalle : "");
      }).join("\n");
      return {
        texto: (N.envioPorPagar
          ? "Todos los envíos son por pagar 🚚 Eso quiere decir que el despacho lo pagas al recibirlo, directo al transporte, así que no se suma al total del pedido.\n"
          : "Despachamos así:\n") + e +
          (N.envioPorPagar ? "\nLos plazos son estimados: dependen del transporte." : "") +
          (N.envioGratisDesde && !N.envioPorPagar ? "\nY sobre " + plata(N.envioGratisDesde) + " el despacho es gratis 🚚" : "") +
          (N.retiroEnTienda ? "\nTambién puedes retirar gratis" + (N.ciudad ? " en " + N.ciudad : "") + "." : ""),
        opciones: ["¿Cómo pago?", "Ver el catálogo"]
      };
    }

    if (hay("retiro", "retirar", "pasar a buscar", "puedo retirar")) {
      return {
        texto: N.retiroEnTienda
          ? "Sí, y el retiro no tiene costo" + (N.retiroComuna || N.ciudad ? " en " + (N.retiroComuna || N.ciudad) : "") + " 📍\n" +
            (N.notaRetiro || "") + "\nFuera de ahí el pedido va por despacho, y ese es por pagar."
          : "Por ahora no tenemos retiro: todos los pedidos salen por despacho, y el envío es por pagar.",
        opciones: ["¿Cuánto es el despacho?", "¿Cómo hago un pedido?"]
      };
    }

    if (hay("pago", "pagar", "cuota", "transferencia", "debito", "credito", "efectivo")) {
      return {
        texto: "Puedes pagar con: " + (N.pagos || []).join(", ") + ".\nEl pago lo coordinamos por WhatsApp; desde la página no se cobra nada.",
        opciones: ["¿Cuánto es el despacho?", "¿Cómo compro?"]
      };
    }

    if (hay("cambio", "cambiar", "devol", "garantia", "no me queda", "reembolso", "reserva", "reservar", "politica")) {
      var pol = (N.politicas || []).map(function (x) { return "• " + x.texto; }).join("\n");
      return {
        texto: pol
          ? "Estas son nuestras políticas de compra:\n" + pol +
            "\nPor eso, si tienes dudas con la talla, pregúntame antes de comprar y la vemos juntas 🙂"
          : (N.cambios || "") + (N.garantia ? "\nGarantía: " + N.garantia : ""),
        opciones: ["¿Cómo sé mi talla?", "Hablar por WhatsApp"]
      };
    }

    if (hay("horario", "hora abren", "a que hora", "abierto", "cerrado", "atienden")) {
      var ab = P.estaAbierto();
      var h = horarioTexto();
      if (!h) {
        return {
          texto: "Atendemos por WhatsApp (" + (N.whatsappVisible || "") + "). Déjanos tu pedido a la hora que quieras y te respondemos apenas lo veamos 🙂",
          opciones: ["¿Cómo compro?", "Ver el catálogo"]
        };
      }
      return {
        texto: (ab === true ? "Estamos abiertos ahora 🙌\n" : ab === false ? "Ahora estamos cerrados, pero deja tu pedido igual y te respondemos al abrir.\n" : "") + h,
        opciones: ["¿Dónde están?", "Ver el catálogo"]
      };
    }

    if (hay("donde estan", "direccion", "ubica", "como llegar", "local", "tienda queda")) {
      var donde = [N.direccion, N.sector, N.ciudad, N.region].filter(Boolean).join(", ");
      return {
        texto: N.direccion
          ? "Estamos en " + donde + ".\nEn la página, más abajo, está el mapa para llegar."
          : "Somos de " + (donde || "Chile") + ". El retiro lo coordinamos por WhatsApp, y también despachamos a tu casa.",
        opciones: ["¿Cuánto es el despacho?", "Ver el catálogo"]
      };
    }

    if (hay("cupon", "descuento", "codigo", "promo")) {
      var cu = (C.cupones || []).filter(function (c) { return c && c.activo !== false && c.visible !== false; });
      if (!cu.length) return { texto: "Por ahora no tengo cupones activos, pero siempre hay modelos en oferta 👀", opciones: ["¿Qué está en oferta?"] };
      return {
        texto: "Sí 🎟️\n" + cu.map(function (c) {
          return "• " + c.codigo + ": " + (c.tipo === "monto" ? plata(c.valor) + " menos" : c.valor + "% de descuento") +
            (c.minimo ? " (compra mínima " + plata(c.minimo) + ")" : "");
        }).join("\n") + "\nSe escribe en «Finalizar compra», antes de enviar el pedido.",
        opciones: ["Ver ofertas", "¿Cómo compro?"]
      };
    }

    if (hay("oferta", "barato", "economico", "rebaja", "liquidacion")) {
      var baratos = P.productos().filter(function (p) { return P.hayStock(p); });
      var conDcto = baratos.filter(function (p) { return p.precioAntes && p.precioAntes > p.precio; });
      var lista2 = (conDcto.length ? conDcto : baratos.slice().sort(function (a, b) { return a.precio - b.precio; })).slice(0, 4);
      return {
        texto: conDcto.length ? "Estos están con descuento ahora 🏷️" : "Estos son los más económicos que tengo:",
        productos: ids(lista2),
        opciones: ["¿Tienen la 38?", "¿Cuánto es el despacho?"]
      };
    }

    if (hay("como compro", "como pido", "hacer un pedido", "hago un pedido", "hago el pedido",
      "como se compra", "para pedir", "como funciona", "comprar")) {
      return {
        texto: "Es rápido:\n1. Elige el modelo y toca su talla.\n2. Agrégalo a «Mi bolsa».\n3. Elige despacho o retiro y envía el pedido por WhatsApp.\nAhí confirmamos stock y total, y recién después pagas 🙂",
        opciones: ["Ver el catálogo", "¿Cuánto es el despacho?"]
      };
    }

    if (hay("hola", "buenas", "buenos dias", "buenas tardes", "buenas noches") && q.length < 25) {
      return { texto: "¡Hola! 👟 Soy el asistente de " + (N.nombre || "la tienda") + ". ¿Buscas algo en especial o te ayudo a encontrar tu talla?", opciones: ["No sé mi talla", "Ver zapatillas"] };
    }

    if (hay("gracias", "muchas gracias")) {
      return { texto: "¡De nada! Cualquier cosa me preguntas 🙌", opciones: ["Ver el catálogo", "Mi carrito"] };
    }

    if (hay("recomienda", "recomendacion", "mas vendido", "que me recomiendas", "lo mejor")) {
      var dest = P.productos().filter(function (p) { return p.destacado && P.hayStock(p); }).slice(0, 4);
      return { texto: "Estos son los que más salen 👟", productos: ids(dest), opciones: ["¿Tienen la 40?", "¿Qué está en oferta?"] };
    }

    if (hay("nuevo", "novedad", "ultimo que llego", "lo ultimo", "recien lleg")) {
      var nuevos = P.productos().filter(function (p) {
        return (p.etiquetas || []).indexOf("nuevo") >= 0 && P.hayStock(p);
      }).slice(0, 4);
      if (!nuevos.length) nuevos = P.productos().filter(P.hayStock).slice(0, 4);
      return { texto: "Esto es lo último que llegó ✨", productos: ids(nuevos),
        opciones: ["¿Qué está en oferta?", "¿Cuánto es el despacho?"] };
    }

    if (hay("cuanto demora", "cuanto se demora", "cuando llega", "cuanto tarda", "plazo", "dias habiles", "tiempo de entrega", "cuando me llega")) {
      var pl = (N.envios || []).map(function (e) { return "• " + e.nombre + ": " + (e.detalle || "según el transporte"); }).join("\n");
      return {
        texto: "Estos son los plazos estimados:\n" + pl +
          "\nOjo: son estimativos, dependen del transporte, así que no podemos asegurarlos.",
        opciones: ["¿Cuánto es el despacho?", "¿Puedo retirar el pedido?"]
      };
    }

    if (hay("horma", "aprieta", "queda grande", "queda chico", "queda chica", "talla mas", "una talla mas", "es grande o", "calza grande", "calza chico")) {
      var chicos = P.productos().filter(function (p) { return /pequen/.test(t(p.nota || "")); });
      return {
        texto: "Varios modelos tienen horma pequeña: en esos conviene pedir una talla más 🦶\n" +
          (chicos.length ? "Ahora mismo son " + chicos.length + " modelos, y en cada ficha lo dice justo debajo de las tallas." :
            "En cada ficha, debajo de las tallas, dice si la horma es normal o pequeña.") +
          "\nSi me dices qué modelo miras, te confirmo cuál es su horma.",
        opciones: ["¿Cómo sé mi talla?", "¿Qué tallas tienen?"]
      };
    }

    if (hay("material", "de que estan hechos", "de que son", "cuero", "gamuza", "ecocuero", "sintetico", "lona")) {
      return {
        texto: "Los modelos son de ecocuero, gamuza sintética o lona según el diseño; la suela es de goma.\n" +
          "En cada ficha, en «Material y cuidados», está el detalle del modelo que estés mirando.",
        opciones: ["Ver el catálogo", "¿Cómo sé mi talla?"]
      };
    }

    if (hay("precio", "cuanto cuesta", "cuanto vale", "cuanto sale", "valor", "cuanto estan")) {
      var conStock = P.productos().filter(P.hayStock);
      if (conStock.length) {
        var precios = conStock.map(function (p) { return p.precio; });
        return {
          texto: "Los precios van desde " + plata(Math.min.apply(null, precios)) +
            " hasta " + plata(Math.max.apply(null, precios)) + " 👟\n" +
            "Dime qué modelo te gusta y te digo su precio exacto.",
          opciones: ["¿Qué está en oferta?", "Ver el catálogo"]
        };
      }
    }

    if (hay("seguimiento", "tracking", "numero de envio", "codigo de envio", "donde va mi pedido", "mi pedido")) {
      return {
        texto: "Cuando el pedido sale, te mandamos el número de seguimiento por WhatsApp 📦\n" +
          "Si ya compraste y quieres saber cómo va, escríbenos y lo revisamos al tiro.",
        opciones: ["Hablar por WhatsApp", "¿Cuánto demora en llegar?"]
      };
    }

    if (hay("starken", "chilexpress", "correos de chile", "que transporte", "por donde envian")) {
      return {
        texto: "Enviamos por Starken o Chilexpress, según tu zona. El despacho es por pagar: lo pagas al recibirlo, directo al transporte.",
        opciones: ["¿Cuánto demora en llegar?", "¿Puedo retirar el pedido?"]
      };
    }

    if (hay("instagram", "redes", "tiktok", "facebook", "los sigo")) {
      return {
        texto: (N.instagram ? "Estamos en Instagram como @" + N.instagram + " 📸\n" : "") +
          "Y por WhatsApp (" + (N.whatsappVisible || "") + ") respondemos todo el día.",
        opciones: ["Ver el catálogo", "Hablar por WhatsApp"]
      };
    }

    if (hay("boleta", "factura", "comprobante")) {
      return {
        texto: "Sí, te enviamos el comprobante de la compra por WhatsApp junto con la confirmación del pedido.",
        opciones: ["¿Cómo puedo pagar?", "¿Cómo hago un pedido?"]
      };
    }

    if (hay("eres un bot", "eres real", "eres una persona", "quien eres", "robot", "inteligencia artificial", "eres humano")) {
      return {
        texto: "Soy el asistente automático de " + (N.nombre || "la tienda") + " 🤖 Respondo con la info del catálogo.\n" +
          "Si quieres hablar con alguien de verdad, te paso a WhatsApp y te atienden ahí.",
        opciones: ["Hablar por WhatsApp", "Ver el catálogo"]
      };
    }

    if (hay("chao", "adios", "nos vemos", "hasta luego", "bye", "me voy")) {
      return { texto: "¡Que estés bien! 👋 Cualquier cosa, aquí estoy.", opciones: ["Ver el catálogo"] };
    }

    if (hay("stock", "disponible", "tienen disponible", "queda")) {
      return {
        texto: "El stock de la página es referencial: antes de que pagues te confirmamos por WhatsApp que esté tu talla.\n" +
          "Dime el modelo y la talla y lo reviso 🙂",
        opciones: ["¿Qué tallas tienen?", "Ver el catálogo"]
      };
    }

    // ¿piden una categoría entera? ("ver botas", "zapatillas", "sandalias")
    // Solo si la frase es corta o pide ver algo: "¿estas botas aguantan lluvia?"
    // no es un pedido de categoría.
    var corta = q.trim().split(/\s+/).length <= 4;
    var cat = (corta || hay("ver ", "muestra", "quiero", "busco", "tienen"))
      ? (C.categorias || []).filter(function (c) {
          return q.indexOf(t(c.nombre)) >= 0 || q.indexOf(t(c.id)) >= 0;
        })[0]
      : null;
    if (cat) {
      var deCat = (cat.productos || []).filter(P.hayStock).slice(0, 4);
      if (deCat.length) {
        return {
          texto: "Esto es lo que tengo en " + cat.nombre.toLowerCase() + ":",
          productos: ids(deCat),
          opciones: ["Ver el catálogo", "¿Cuánto es el despacho?"]
        };
      }
    }

    if (hay("ver el catalogo", "ver catalogo", "catalogo", "ver todo", "mas modelos", "otros modelos", "que tienen", "que venden", "que modelos")) {
      var algunos = P.productos().filter(P.hayStock).slice(0, 4);
      return {
        texto: "Tengo " + P.productos().length + " modelos entre botines, botas, zapatillas y sandalias 👟\n" +
          "Mira algunos, o dime qué buscas y te muestro:",
        productos: ids(algunos),
        opciones: ["Ver botas", "Ver sandalias", "¿Qué está en oferta?"]
      };
    }

    // Búsqueda libre en el catálogo
    var encontrados = P.buscar(texto, 4);
    if (encontrados.length) {
      return {
        texto: encontrados.length === 1 ? "Encontré esto:" : "Mira, tengo " + encontrados.length + " que calzan con eso:",
        productos: ids(encontrados),
        opciones: ["¿Qué tallas quedan?", "¿Cuánto es el despacho?"]
      };
    }

    return {
      generica: true,
      texto: "Esa no la manejo 😅 Escríbenos por WhatsApp (" + (N.whatsappVisible || "") + ") y te respondemos al tiro.\n" +
        "De lo que sí te puedo contar: tallas y horma, despacho y plazos, retiro, formas de pago, cupones, políticas de compra y los modelos del catálogo.",
      opciones: ["¿Qué tallas tienen?", "¿Cuánto es el despacho?", "Ver el catálogo"]
    };
  }

  /* =====================================================================
     Interfaz
     ===================================================================== */
  var caja, mensajesEl, opcionesEl, entrada, enviarBtn, abrirBtn;

  function crear() {
    abrirBtn = document.createElement("button");
    abrirBtn.className = "chat-abrir";
    abrirBtn.type = "button";
    abrirBtn.setAttribute("aria-label", "Abrir el asistente de la tienda");
    abrirBtn.innerHTML = icono("chat") + "<span>¿Te ayudo?</span>";
    abrirBtn.addEventListener("click", abrir);
    document.body.appendChild(abrirBtn);

    caja = document.createElement("section");
    caja.className = "chat";
    caja.hidden = true;
    caja.setAttribute("aria-label", "Asistente de la tienda");
    caja.innerHTML =
      '<header class="chat-cab">' +
        '<span class="chat-avatar">' + icono("zapato", "icono icono--lleno") + "</span>" +
        '<span class="chat-titulo"><b>Asistente ' + esc(N.nombre || "") + "</b><small>Tallas, stock y despachos</small></span>" +
        '<button class="chat-cerrar" type="button" aria-label="Cerrar el asistente">' + icono("cerrar") + "</button>" +
      "</header>" +
      '<div class="chat-mensajes" role="log" aria-live="polite"></div>' +
      '<div class="chat-opciones"></div>' +
      '<form class="chat-pie">' +
        '<input type="text" placeholder="Escribe tu pregunta…" aria-label="Escribe tu pregunta" autocomplete="off" enterkeyhint="send" maxlength="300">' +
        '<button class="chat-enviar" type="submit" aria-label="Enviar">' + icono("enviar") + "</button>" +
      "</form>" +
      '<p class="chat-nota">Respuestas automáticas. La tienda confirma stock y total por WhatsApp.</p>';
    document.body.appendChild(caja);

    mensajesEl = $(".chat-mensajes", caja);
    opcionesEl = $(".chat-opciones", caja);
    entrada = $(".chat-pie input", caja);
    enviarBtn = $(".chat-enviar", caja);

    $(".chat-cerrar", caja).addEventListener("click", cerrar);
    $(".chat-pie", caja).addEventListener("submit", function (ev) {
      ev.preventDefault();
      var v = entrada.value.trim();
      if (!v || ocupado) return;
      entrada.value = "";
      preguntar(v);
    });

    caja.addEventListener("click", function (ev) {
      var el = ev.target.closest("[data-chat-op]");
      if (el) { tocarOpcion(el.getAttribute("data-chat-op")); return; }
      el = ev.target.closest("[data-chat-producto]");
      if (el) { P.abrirFicha(el.getAttribute("data-chat-producto")); return; }
    });

    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && abierto) cerrar();
    });
  }

  function abrir() {
    abierto = true;
    caja.hidden = false;
    abrirBtn.hidden = true;
    if (!mensajes.length) saludar();
    else { pintarTodo(); }
    setTimeout(function () { if (window.innerWidth > 560) entrada.focus(); }, 60);
  }
  function cerrar() {
    abierto = false;
    caja.hidden = true;
    abrirBtn.hidden = false;
  }

  function saludar() {
    var ab = P.estaAbierto();
    var hola = "¡Hola! 👟 Soy el asistente de " + (N.nombre || "la tienda") + ".\n" +
      (ab === false ? "Ahora estamos cerrados, pero puedes dejar tu pedido igual.\n" : "") +
      "Te ayudo con tallas, stock, despachos y a encontrar tu par.";
    mensajes.push({ role: "assistant", content: hola, opciones: OP_INICIO.map(function (k) { return OP[k].t; }) });
    pintarTodo();
  }

  function burbuja(m) {
    var html = '<div class="burbuja burbuja--' + (m.role === "user" ? "yo" : "bot") + '">' + esc(m.content) + "</div>";
    if (m.productos && m.productos.length) {
      html += '<div class="chat-productos">' + m.productos.map(function (id) {
        var p = P.producto(id);
        if (!p) return "";
        var tallas = P.tallas(p).filter(function (x) { return P.stockTalla(p, x) > 0; });
        return '<button class="chat-producto" type="button" data-chat-producto="' + esc(p.id) + '">' +
          '<img src="' + esc(P.foto(p)) + '" alt="" width="400" height="300" loading="lazy">' +
          '<span class="chat-producto-datos"><b>' + esc(p.nombre) + "</b>" +
          "<small>" + (tallas.length ? "Tallas " + tallas.join(", ") : "Talla única") + "</small></span>" +
          '<span class="chat-producto-precio">' + plata(p.precio) + "</span></button>";
      }).join("") + "</div>";
    }
    return html;
  }

  function pintarTodo() {
    mensajesEl.innerHTML = mensajes.map(burbuja).join("");
    var ultimo = mensajes[mensajes.length - 1];
    pintarOpciones(ultimo && ultimo.role === "assistant" ? (ultimo.opciones || []) : []);
    abajo();
  }

  function pintarOpciones(lista) {
    var extra = [OP.mas.t, OP.bolsa.t, OP.humano.t];
    var todas = (lista || []).slice(0, 12).concat(extra);
    opcionesEl.innerHTML = todas.map(function (x) {
      return '<button class="chat-opcion" type="button" data-chat-op="' + esc(x) + '">' + esc(x) + "</button>";
    }).join("");
  }

  function abajo() { mensajesEl.scrollTop = mensajesEl.scrollHeight; }

  function tocarOpcion(texto) {
    if (texto === OP.mas.t) {
      agregarRespuesta({
        texto: "Estos son los temas que manejo. Toca el que quieras, o escríbeme tu pregunta 🙂",
        opciones: OP_MAS.filter(function (k) { return !OP[k].a; }).map(function (k) { return OP[k].t; })
      });
      return;
    }
    if (texto === OP.bolsa.t) { P.abrirPedido(); return; }
    if (texto === OP.humano.t) {
      window.open(P.enlaceWsp("¡Hola! Tengo una consulta sobre los zapatos 👟"), "_blank", "noopener");
      return;
    }
    if (texto === OP.reiniciar.t) {
      mensajes = [];
      guardar();
      saludar();
      return;
    }
    preguntar(texto.replace(/^[^\w¿¡áéíóúñ]+/i, "").trim());
  }

  function escribiendo(si) {
    var el = $(".escribiendo-fila", mensajesEl);
    if (si && !el) {
      var d = document.createElement("div");
      d.className = "burbuja burbuja--bot escribiendo-fila";
      d.innerHTML = '<span class="escribiendo"><i></i><i></i><i></i></span>';
      mensajesEl.appendChild(d);
      abajo();
    } else if (!si && el) {
      el.remove();
    }
  }

  function agregarRespuesta(r) {
    mensajes.push({
      role: "assistant",
      content: r.texto,
      productos: r.productos || [],
      opciones: r.opciones || []
    });
    guardar();
    pintarTodo();
  }

  function preguntar(texto) {
    if (!texto || ocupado) return;
    mensajes.push({ role: "user", content: texto });
    guardar();
    pintarTodo();
    ocupado = true;
    enviarBtn.disabled = true;
    escribiendo(true);

    var terminar = function (r) {
      escribiendo(false);
      ocupado = false;
      enviarBtn.disabled = false;
      agregarRespuesta(r);
    };

    /* Primero contesta el catálogo. Lo que sale de aquí es exacto: precios,
       tallas, despacho y políticas salen tal cual están publicados, y además
       es instantáneo y no gasta nada. La IA queda para lo que el guion no
       supo responder. */
    var local = responderBasico(texto);
    if (!modoIA || !local.generica) {
      setTimeout(function () { terminar(local); }, 320);
      return;
    }

    var cuerpo = {
      mensajes: mensajes.filter(function (m) { return m.role === "user" || m.role === "assistant"; })
        .map(function (m) { return { role: m.role, content: m.content }; }),
      carrito: P.resumenBolsa()
    };

    fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cuerpo)
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, status: r.status, d: d }; });
    }).then(function (res) {
      if (res.ok && res.d && res.d.texto) {
        terminar({ texto: res.d.texto, productos: res.d.productos, opciones: res.d.opciones });
        return;
      }
      // Sin IA configurada (o error): se queda la respuesta del catálogo
      if (res.status === 503 || res.status === 404 || res.status === 405) modoIA = false;
      terminar(local);
    }).catch(function () {
      terminar(local);
    });
  }

  /* ---------- Arranque ---------- */
  function iniciar() {
    crear();
    var guardados = leer();
    if (guardados && guardados.length) {
      mensajes = guardados.filter(function (m) { return m && m.role && typeof m.content === "string"; });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();

  /* Por si se quiere abrir el chat desde otro botón de la página */
  window.abrirAsistente = function (pregunta) {
    if (!caja) return;
    abrir();
    if (pregunta) preguntar(pregunta);
  };
})();
