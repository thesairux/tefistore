/* =========================================================================
   Tefi Store — asistente (el chat de abajo a la derecha)

   Con la IA configurada (ANTHROPIC_API_KEY en las variables del proyecto, ver
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
    talla: { t: "📏 No sé mi talla", q: "¿Cómo sé qué talla soy?" },
    mujer: { t: "👠 Para mujer", q: "Ver zapatos de mujer" },
    hombre: { t: "👞 Para hombre", q: "Ver zapatos de hombre" },
    ninos: { t: "🧒 Para niños", q: "Ver zapatos de niños" },
    zapatillas: { t: "👟 Zapatillas", q: "Ver zapatillas" },
    ofertas: { t: "🏷️ Ofertas", q: "¿Qué está en oferta?" },
    envio: { t: "🚚 Despacho", q: "¿Cuánto cuesta el despacho?" },
    pagos: { t: "💳 Formas de pago", q: "¿Cómo puedo pagar?" },
    cambios: { t: "🔄 Cambios", q: "¿Puedo cambiar la talla?" },
    horario: { t: "🕒 Horario", q: "¿A qué hora abren?" },
    ubicacion: { t: "📍 Dónde están", q: "¿Dónde están ubicados?" },
    cupones: { t: "🎟️ Cupones", q: "¿Tienen cupones?" },
    comprar: { t: "❓ ¿Cómo compro?", q: "¿Cómo hago un pedido?" },
    bolsa: { t: "🛍️ Mi bolsa", a: "bolsa" },
    humano: { t: "💬 Hablar con alguien", a: "wsp" },
    reiniciar: { t: "🔄 Empezar de nuevo", a: "reiniciar" }
  };
  var OP_INICIO = ["talla", "zapatillas", "ofertas", "envio"];
  var OP_MAS = ["mujer", "hombre", "ninos", "cambios", "pagos", "horario", "ubicacion", "cupones", "comprar", "humano", "reiniciar"];

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

    if (hay("que talla soy", "mi talla", "no se mi talla", "guia de talla", "como se mi talla", "medir")) {
      var g = (C.guiaTallas || []).slice(0, 4).map(function (x) { return x.cm + " cm → talla " + x.talla; }).join("\n");
      return {
        texto: "Fácil: párate sobre una hoja con el talón pegado a la pared y marca hasta tu dedo más largo. Mide en centímetros y compara:\n" +
          g + "\n…la tabla completa está en «Guía de tallas». Si quedas entre dos, elige la más grande 🙂",
        opciones: ["¿Tienen la 38?", "Ver zapatillas"]
      };
    }

    if (hay("despacho", "envio", "envian", "delivery", "llega a", "despachan")) {
      var e = (N.envios || []).map(function (x) {
        return "• " + x.nombre + ": " + plata(x.precio) + (x.detalle ? " (" + x.detalle + ")" : "");
      }).join("\n");
      return {
        texto: "Despachamos así:\n" + e +
          (N.envioGratisDesde ? "\nY sobre " + plata(N.envioGratisDesde) + " el despacho es gratis 🚚" : "") +
          (N.retiroEnTienda ? "\nTambién puedes retirar gratis en la tienda." : ""),
        opciones: ["¿Dónde están?", "¿Cómo pago?"]
      };
    }

    if (hay("retiro", "retirar", "pasar a buscar")) {
      return {
        texto: "Sí, puedes retirar gratis en " + [N.direccion, N.ciudad].filter(Boolean).join(", ") + ". " + (N.notaRetiro || ""),
        opciones: ["¿A qué hora abren?", "Ver el catálogo"]
      };
    }

    if (hay("pago", "pagar", "cuota", "transferencia", "debito", "credito", "efectivo")) {
      return {
        texto: "Puedes pagar con: " + (N.pagos || []).join(", ") + ".\nEl pago lo coordinamos por WhatsApp; desde la página no se cobra nada.",
        opciones: ["¿Cuánto es el despacho?", "¿Cómo compro?"]
      };
    }

    if (hay("cambio", "cambiar", "devol", "garantia", "no me queda")) {
      return {
        texto: (N.cambios || "Puedes cambiar la talla en la tienda.") + (N.garantia ? "\nGarantía: " + N.garantia : ""),
        opciones: ["¿Dónde están?", "Hablar por WhatsApp"]
      };
    }

    if (hay("horario", "hora abren", "a que hora", "abierto", "cerrado", "atienden")) {
      var ab = P.estaAbierto();
      return {
        texto: (ab === true ? "Estamos abiertos ahora 🙌\n" : ab === false ? "Ahora estamos cerrados, pero deja tu pedido igual y te respondemos al abrir.\n" : "") + horarioTexto(),
        opciones: ["¿Dónde están?", "Ver el catálogo"]
      };
    }

    if (hay("donde estan", "direccion", "ubica", "llegar", "local", "tienda queda")) {
      return {
        texto: "Estamos en " + [N.direccion, N.sector, N.ciudad, N.region].filter(Boolean).join(", ") + ".\nEn la página, más abajo, está el mapa para llegar.",
        opciones: ["¿A qué hora abren?", "¿Hacen despacho?"]
      };
    }

    if (hay("cupon", "descuento", "codigo", "promo")) {
      var cu = (C.cupones || []).filter(function (c) { return c && c.activo !== false && c.visible !== false; });
      if (!cu.length) return { texto: "Por ahora no tengo cupones activos, pero siempre hay modelos en oferta 👀", opciones: ["¿Qué está en oferta?"] };
      return {
        texto: "Sí 🎟️\n" + cu.map(function (c) {
          return "• " + c.codigo + ": " + (c.tipo === "monto" ? plata(c.valor) + " menos" : c.valor + "% de descuento") +
            (c.minimo ? " (compra mínima " + plata(c.minimo) + ")" : "");
        }).join("\n") + "\nSe escribe en «Mi bolsa», antes de enviar el pedido.",
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

    if (hay("como compro", "como pido", "hacer un pedido", "como funciona", "comprar")) {
      return {
        texto: "Es rápido:\n1. Elige el modelo y toca su talla.\n2. Agrégalo a «Mi bolsa».\n3. Elige despacho o retiro y envía el pedido por WhatsApp.\nAhí confirmamos stock y total, y recién después pagas 🙂",
        opciones: ["Ver el catálogo", "¿Cuánto es el despacho?"]
      };
    }

    if (hay("hola", "buenas", "buenos dias", "buenas tardes", "buenas noches") && q.length < 25) {
      return { texto: "¡Hola! 👟 Soy el asistente de " + (N.nombre || "la tienda") + ". ¿Buscas algo en especial o te ayudo a encontrar tu talla?", opciones: ["No sé mi talla", "Ver zapatillas"] };
    }

    if (hay("gracias", "muchas gracias")) {
      return { texto: "¡De nada! Cualquier cosa me preguntas 🙌", opciones: ["Ver el catálogo", "Mi bolsa"] };
    }

    if (hay("recomienda", "recomendacion", "mas vendido", "que me recomiendas", "lo mejor")) {
      var dest = P.productos().filter(function (p) { return p.destacado && P.hayStock(p); }).slice(0, 4);
      return { texto: "Estos son los que más salen 👟", productos: ids(dest), opciones: ["¿Tienen la 40?", "¿Qué está en oferta?"] };
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
      texto: "Uf, con eso no te puedo ayudar bien desde aquí 😅 Pero escríbenos por WhatsApp (" + (N.whatsappVisible || "") + ") y te respondemos al tiro.\nTambién te puedo contar de tallas, despachos, pagos o cambios.",
      opciones: ["¿Cómo sé mi talla?", "¿Cuánto es el despacho?", "Hablar por WhatsApp"]
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
    var extra = [OP.bolsa.t, OP.humano.t];
    var todas = (lista || []).slice(0, 3).concat(extra);
    opcionesEl.innerHTML = todas.map(function (x) {
      return '<button class="chat-opcion" type="button" data-chat-op="' + esc(x) + '">' + esc(x) + "</button>";
    }).join("");
  }

  function abajo() { mensajesEl.scrollTop = mensajesEl.scrollHeight; }

  function tocarOpcion(texto) {
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

    if (!modoIA) {
      setTimeout(function () { terminar(responderBasico(texto)); }, 320);
      return;
    }

    var cuerpo = {
      mensajes: mensajes.filter(function (m) { return m.role === "user" || m.role === "assistant"; })
        .map(function (m) { return { role: m.role, content: m.content }; }),
      bolsa: P.resumenBolsa()
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
      // Sin IA configurada (o error): de aquí en adelante respondemos con el catálogo
      if (res.status === 503 || res.status === 404 || res.status === 405) modoIA = false;
      var r = responderBasico(texto);
      if (res.status === 429) r = { texto: "Uf, muchas preguntas seguidas 😅 Espera un momentito y volvemos. Si es urgente, escríbenos por WhatsApp.", opciones: ["Hablar por WhatsApp"] };
      terminar(r);
    }).catch(function () {
      terminar(responderBasico(texto));
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
