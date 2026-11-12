/* =========================================================================
   Tefi Store — la página
   Todo lo que se ve sale de catalogo.js. Este archivo arma el menú, la portada,
   el catálogo, la ficha de cada zapato, el carrito y el checkout, y al final
   escribe el pedido en WhatsApp. No hay que editarlo para cambiar productos.

   Direcciones (lo que va después del # en la barra del navegador):
     #/              portada
     #/catalogo      todo el catálogo
     #/c/botines     una categoría
     #/p/<id>        la ficha de un producto
     #/favoritos     lo que el cliente guardó
     #/checkout      los datos del pedido
   ========================================================================= */
(function () {
  "use strict";

  var C = window.CATALOGO || {};
  var N = C.negocio || {};
  var LLAVE_CARRITO = "tefistore-carrito-v2";
  var LLAVE_DATOS = "tefistore-datos-v1";
  var LLAVE_FAVORITOS = "tefistore-favoritos-v1";

  /* ---------- Ayudas ---------- */
  function $(sel, raiz) { return (raiz || document).querySelector(sel); }
  function $$(sel, raiz) { return Array.prototype.slice.call((raiz || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function plata(n) { return "$" + String(Math.round(n || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
  function sinTildes(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function leer(k, porDefecto) { try { return JSON.parse(localStorage.getItem(k)) || porDefecto; } catch (e) { return porDefecto; } }
  function guardar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sin almacenamiento */ } }
  function enRuta(obj, ruta) { return String(ruta).split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, obj); }

  var SVG = {
    flecha: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    izq: '<path d="M15 6l-6 6 6 6"/>',
    der: '<path d="M9 6l6 6-6 6"/>',
    wsp: '<path d="M4.5 19.5 5.6 16A8 8 0 1 1 8.4 18.6Z"/><path d="M9.2 8.6c.3 2.7 2.4 5 5.2 5.6l1.2-1.3-1.8-1-1 .7c-.9-.5-1.7-1.3-2.2-2.2l.7-1-1-1.8Z"/>',
    bolsa: '<path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    corazon: '<path d="M12 20s-7-4.3-7-9.3A4 4 0 0 1 12 8a4 4 0 0 1 7 2.7c0 5-7 9.3-7 9.3Z"/>',
    basura: '<path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13"/>',
    ok: '<path d="M5 13l4 4L19 7"/>',
    talla: '<path d="M3 9.5h18v5H3Z"/><path d="M7 9.5v3M11 9.5v3M15 9.5v3M19 9.5v3"/>',
    camion: '<path d="M3 7h11v8H3zM14 10h4l3 3v2h-7z"/><circle cx="7" cy="17" r="1.8"/><circle cx="17.5" cy="17" r="1.8"/>',
    tienda: '<path d="M4 10v9h16v-9"/><path d="M3 6h18l-1.5 4h-15Z"/>',
    no: '<circle cx="12" cy="12" r="8"/><path d="M9 9l6 6M15 9l-6 6"/>',
    aviso: '<path d="M12 4 2.8 20h18.4Z"/><path d="M12 10v4M12 17.2v.1"/>'
  };
  function ico(n, clase) { return '<svg class="' + (clase || "icono") + '" viewBox="0 0 24 24" aria-hidden="true">' + SVG[n] + "</svg>"; }

  /* ---------- Productos ---------- */
  var PRODUCTOS = [];
  var PORID = {};
  var CATEGORIAS = (C.categorias || []).filter(function (c) { return c && c.id; });
  /* "tallas" se puede escribir como "35-40", como lista o con el stock de cada talla.
     Adentro siempre queda un objeto {talla: pares}, donde null = disponible sin contar pares. */
  function normalizarTallas(p) {
    var t = p.tallas;
    if (typeof t === "string" || Array.isArray(t)) {
      var lista = [];
      if (typeof t === "string") {
        var m = /^\s*(\d+)\s*(?:-|a|al)\s*(\d+)\s*$/.exec(t);
        if (m) for (var i = +m[1]; i <= +m[2]; i++) lista.push(String(i));
        else lista = t.split(/[,;\s]+/).filter(Boolean);
      } else {
        lista = t.map(String);
      }
      var o = {};
      lista.forEach(function (x) { o[x] = null; });
      t = o;
    }
    p.tallas = t || {};
  }

  CATEGORIAS.forEach(function (cat) {
    (cat.productos || []).forEach(function (p) {
      if (p.disponible === false) return;
      normalizarTallas(p);
      p._cat = cat.id;
      p._catNombre = cat.nombre;
      p._nombre = sinTildes([p.nombre, cat.nombre].join(" "));
      p._busca = sinTildes([p.nombre, p.detalle, p.descripcion, p.material, cat.nombre,
        (p.colores || []).map(function (c) { return c.nombre; }).join(" ")].join(" "));
      PRODUCTOS.push(p);
      PORID[p.id] = p;
    });
  });

  function fotos(p) { return (p && p.fotos && p.fotos.length) ? p.fotos : ["img/catalogo/_sinfoto.svg"]; }
  function foto(p) { return fotos(p)[0]; }
  function tallasDe(p) { return p.tallaUnica ? [] : Object.keys(p.tallas || {}); }
  var SIN_CONTAR = 10;   // tope por talla cuando la tienda no lleva la cuenta de pares
  function stockTalla(p, t) {
    var v = (p.tallas || {})[t];
    if (v === null || v === undefined && t in (p.tallas || {})) return SIN_CONTAR;
    return Math.max(0, parseInt(v, 10) || 0);
  }
  function stockContado(p, t) { return typeof (p.tallas || {})[t] === "number"; }
  function stockTotal(p) {
    if (p.tallaUnica) return Math.max(0, parseInt(p.stock, 10) || 0);
    return tallasDe(p).reduce(function (a, t) { return a + stockTalla(p, t); }, 0);
  }
  function hayStock(p) { return stockTotal(p) > 0; }
  function descuento(p) {
    if (!p.precioAntes || p.precioAntes <= p.precio) return 0;
    return Math.round((1 - p.precio / p.precioAntes) * 100);
  }
  function etiqueta(p) {
    if (!hayStock(p)) return { clase: "agotado", texto: "Agotado" };
    var e = (p.etiquetas || [])[0];
    if (e === "oferta" || descuento(p) >= 10) return { clase: "oferta", texto: "-" + (descuento(p) || 10) + "%" };
    if (e === "nuevo") return { clase: "nuevo", texto: "Nuevo" };
    if (e === "ultimos" || stockTotal(p) <= 2) return { clase: "ultimos", texto: "Últimos pares" };
    return null;
  }
  var TODAS_TALLAS = (function () {
    var set = {};
    PRODUCTOS.forEach(function (p) { tallasDe(p).forEach(function (t) { set[t] = true; }); });
    return Object.keys(set).sort(function (a, b) { return parseFloat(a) - parseFloat(b); });
  })();

  /* ---------- Horario ---------- */
  var DIAS = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
  var DIAS_TXT = { lunes: "Lunes", martes: "Martes", miercoles: "Miércoles", jueves: "Jueves", viernes: "Viernes", sabado: "Sábado", domingo: "Domingo" };
  function ahora() {
    var x = {};
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Santiago", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hourCycle: "h23"
    }).formatToParts(new Date()).forEach(function (p) { x[p.type] = p.value; });
    var dia = new Date(Date.UTC(+x.year, +x.month - 1, +x.day)).getUTCDay();
    return { fecha: x.year + "-" + x.month + "-" + x.day, dia: dia, min: (+x.hour % 24) * 60 + +x.minute };
  }
  function rangos(txt) {
    return String(txt || "").split(",").map(function (s) { return /(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/.exec(s); })
      .filter(Boolean).map(function (m) {
        var a = +m[1] * 60 + +m[2], b = +m[3] * 60 + +m[4];
        if (b <= a) b += 1440;
        return [a, b];
      });
  }
  function estaAbierto() {
    if (!C.horario || C.horarioConfirmado === false) return null;
    var t = ahora();
    if ((C.diasCerrados || []).indexOf(t.fecha) >= 0) return false;
    var ayer = rangos(C.horario[DIAS[(t.dia + 6) % 7]]);
    if (ayer.some(function (r) { return r[1] > 1440 && t.min < r[1] - 1440; })) return true;
    return rangos(C.horario[DIAS[t.dia]]).some(function (r) { return t.min >= r[0] && t.min < r[1]; });
  }
  function enlaceWsp(texto) {
    return "https://wa.me/" + String(N.whatsapp || "").replace(/\D/g, "") + (texto ? "?text=" + encodeURIComponent(texto) : "");
  }

  /* =======================================================================
     Carrito, favoritos y datos del cliente
     ======================================================================= */
  var carrito = leer(LLAVE_CARRITO, []);
  if (!Array.isArray(carrito)) carrito = [];
  var datos = leer(LLAVE_DATOS, {}) || {};
  var favoritos = leer(LLAVE_FAVORITOS, []) || [];
  ["nombre", "telefono", "correo", "entrega", "region", "comuna", "direccion", "referencia", "cupon"].forEach(function (k) {
    if (typeof datos[k] !== "string") datos[k] = "";
  });
  if (!datos.entrega) datos.entrega = "envio";

  function guardarCarrito() { guardar(LLAVE_CARRITO, carrito); }

  /* El carrito queda guardado en el navegador: si mientras tanto cambió el stock en catalogo.js,
     se ajustan las cantidades (o se saca la línea) para no pedir pares que ya no están. */
  function revisarCarrito() {
    var antes = carrito.length;
    var cambio = false;
    carrito = carrito.filter(function (l) {
      var p = PORID[l.id];
      if (!p || !hayStock(p)) return false;
      var max = tope(p, l.talla);
      if (max <= 0) return false;
      if (l.cantidad > max) { l.cantidad = max; cambio = true; }
      return true;
    });
    if (cambio || carrito.length !== antes) guardarCarrito();
  }
  function guardarDatos() { guardar(LLAVE_DATOS, datos); }
  function clave(id, talla) { return id + "|" + (talla || ""); }
  function lineas() { return carrito.filter(function (l) { return PORID[l.id]; }); }
  function cuenta() { return lineas().reduce(function (a, l) { return a + l.cantidad; }, 0); }
  function subtotal() { return lineas().reduce(function (a, l) { return a + PORID[l.id].precio * l.cantidad; }, 0); }
  function tope(p, talla) { return p.tallaUnica ? stockTotal(p) : stockTalla(p, talla); }

  function agregar(id, talla, cantidad) {
    var p = PORID[id];
    if (!p || !hayStock(p)) return false;
    if (p.tallaUnica) talla = "única";
    if (!talla || (!p.tallaUnica && stockTalla(p, talla) <= 0)) return false;
    cantidad = Math.max(1, parseInt(cantidad, 10) || 1);
    var k = clave(id, talla);
    var l = carrito.filter(function (x) { return x.clave === k; })[0];
    var max = Math.max(1, tope(p, talla));
    if (l) l.cantidad = Math.min(max, l.cantidad + cantidad);
    else carrito.push({ clave: k, id: id, talla: talla, cantidad: Math.min(max, cantidad) });
    guardarCarrito();
    refrescarCarrito();
    avisar(p.nombre + (p.tallaUnica ? "" : " · talla " + talla) + " en tu carrito");
    return true;
  }
  function quitar(k) {
    carrito = carrito.filter(function (l) { return l.clave !== k; });
    guardarCarrito();
    refrescarCarrito();
  }
  function cambiarCantidad(k, delta) {
    var l = carrito.filter(function (x) { return x.clave === k; })[0];
    if (!l) return;
    var p = PORID[l.id];
    var max = p ? Math.max(1, tope(p, l.talla)) : 9;
    l.cantidad = Math.min(max, Math.max(1, l.cantidad + delta));
    guardarCarrito();
    refrescarCarrito();
  }
  function esFavorito(id) { return favoritos.indexOf(id) >= 0; }
  function cambiarFavorito(id) {
    if (esFavorito(id)) favoritos = favoritos.filter(function (x) { return x !== id; });
    else favoritos = favoritos.concat([id]);
    guardar(LLAVE_FAVORITOS, favoritos);
    avisar(esFavorito(id) ? "Guardado en favoritos ♥" : "Lo sacamos de favoritos");
    return esFavorito(id);
  }

  /* ---------- Despacho y cupones ---------- */
  function zonaDe(region, comuna) {
    var envios = N.envios || [];
    var c = sinTildes(comuna).trim(), r = sinTildes(region).trim();
    var porComuna = c && envios.filter(function (e) {
      return (e.comunas || []).some(function (x) { return sinTildes(x) === c; });
    })[0];
    if (porComuna) return porComuna;
    var porRegion = r && envios.filter(function (e) {
      return (e.regiones || []).some(function (x) { return sinTildes(x) === r; });
    })[0];
    if (porRegion) return porRegion;
    return envios.filter(function (e) { return (e.regiones || []).indexOf("*") >= 0; })[0] || null;
  }
  function zonaActual() {
    if (datos.entrega === "retiro") return null;
    return zonaDe(datos.region, datos.comuna);
  }
  function buscarCupon(codigo) {
    var hoy = ahora().fecha;
    var c = (C.cupones || []).filter(function (x) {
      return x && x.activo !== false && String(x.codigo).toUpperCase() === String(codigo || "").trim().toUpperCase();
    })[0];
    if (!c) return { error: "Ese código no existe." };
    if (c.desde && hoy < c.desde) return { error: "Este cupón todavía no empieza." };
    if (c.hasta && hoy > c.hasta) return { error: "Este cupón ya venció." };
    if (c.minimo && subtotal() < c.minimo) return { error: "Es para compras sobre " + plata(c.minimo) + "." };
    if (c.tipo === "envio" && datos.entrega === "retiro") return { error: "Ese cupón es para despacho a domicilio." };
    return { cupon: c };
  }
  function cuponActivo() {
    if (!datos.cupon) return null;
    var r = buscarCupon(datos.cupon);
    return r.cupon || null;
  }
  function porPagar() { return !!N.envioPorPagar && datos.entrega !== "retiro"; }
  function envioBase() {
    if (porPagar()) return 0;
    var z = zonaActual();
    if (!z) return 0;
    return z.precio || 0;
  }
  /* Texto del despacho en el resumen y en las tarjetas de entrega */
  function textoEnvio() {
    if (datos.entrega === "retiro") return "Gratis";
    if (porPagar()) return "Por pagar";
    if (envioGratisPorMonto() || descuentoEnvio() > 0) return "Gratis";
    var z = zonaActual();
    return z && z.precio ? plata(z.precio) : "Según zona";
  }
  function envioGratisPorMonto() {
    if (porPagar()) return false;
    return !!(N.envioGratisDesde && subtotal() - descuentoProductos() >= N.envioGratisDesde);
  }
  function descuentoProductos() {
    var c = cuponActivo();
    if (!c || c.tipo === "envio") return 0;
    var m = c.tipo === "monto" ? c.valor : Math.round(subtotal() * c.valor / 100);
    if (c.tope) m = Math.min(m, c.tope);
    return Math.min(m, subtotal());
  }
  function costoEnvio() {
    if (datos.entrega === "retiro") return 0;
    if (envioGratisPorMonto()) return 0;
    var c = cuponActivo();
    if (c && c.tipo === "envio") return 0;
    return envioBase();
  }
  function descuentoEnvio() {
    var c = cuponActivo();
    if (!c || c.tipo !== "envio" || datos.entrega === "retiro" || envioGratisPorMonto()) return 0;
    return envioBase();
  }
  function total() { return Math.max(0, subtotal() - descuentoProductos()) + costoEnvio(); }

  /* =======================================================================
     Avisos
     ======================================================================= */
  var avisoTimer = null;
  function avisar(texto) {
    var el = $("[data-aviso]");
    if (!el) return;
    el.textContent = texto;
    el.setAttribute("data-visible", "");
    clearTimeout(avisoTimer);
    avisoTimer = setTimeout(function () { el.removeAttribute("data-visible"); }, 2600);
  }

  /* =======================================================================
     Trozos de HTML que se repiten
     ======================================================================= */
  function tarjeta(p) {
    var et = etiqueta(p);
    var d = descuento(p);
    var tallas = tallasDe(p).filter(function (t) { return stockTalla(p, t) > 0; });
    var contadas = tallas.some(function (t) { return stockContado(p, t); });
    var seguidas = tallas.length > 2 && tallas.every(function (t, i) {
      return i === 0 || +t === +tallas[i - 1] + 1;
    });
    var textoTallas = !tallas.length ? "Sin stock"
      : (!contadas && seguidas) ? "Tallas " + tallas[0] + " a la " + tallas[tallas.length - 1]
      : "Tallas " + tallas.join(", ");
    return '<a class="tarjeta' + (hayStock(p) ? "" : " tarjeta--agotada") + '" href="#/p/' + esc(p.id) + '">' +
      '<span class="tarjeta-foto">' +
        (et ? '<span class="cinta cinta--' + et.clase + '">' + esc(et.texto) + "</span>" : "") +
        '<img src="' + esc(foto(p)) + '" alt="' + esc(p.nombre) + '" loading="lazy" width="400" height="300">' +
      "</span>" +
      '<span class="tarjeta-nombre">' + esc(p.nombre) + "</span>" +
      '<span class="tarjeta-precios"><span class="tarjeta-precio">' + plata(p.precio) + "</span>" +
        (d ? '<span class="tarjeta-antes">' + plata(p.precioAntes) + "</span>" : "") + "</span>" +
      '<span class="tarjeta-tallas">' + (p.tallaUnica ? "Talla única" : textoTallas) + "</span>" +
      "</a>";
  }

  /* =======================================================================
     Cosas fijas: menú, pie, datos de la tienda
     ======================================================================= */
  function datoDe(k) {
    switch (k) {
      case "sector-ciudad-region": return [N.sector, N.ciudad, N.region ? "Región de " + N.region : ""].filter(Boolean).join(", ");
      case "pagos": return (N.pagos || []).join(" · ");
      case "instagram": return N.instagram ? "@" + N.instagram : "";
      default: return N[k] || "";
    }
  }
  function armarFijos() {
    $$("[data-texto]").forEach(function (el) {
      var v = enRuta(C.textos || {}, el.getAttribute("data-texto"));
      if (v) el.textContent = v;
    });
    $$("[data-dato]").forEach(function (el) {
      var v = datoDe(el.getAttribute("data-dato"));
      if (v) el.textContent = v;
    });
    $$("[data-si]").forEach(function (el) {
      var k = el.getAttribute("data-si");
      var hay = k === "horario" ? !!C.horario : k === "pagos" ? (N.pagos || []).length : !!N[k];
      if (hay) el.removeAttribute("hidden"); else el.setAttribute("hidden", "");
    });
    $$("[data-wsp]").forEach(function (a) {
      a.href = enlaceWsp("¡Hola " + (N.nombre || "") + "! Tengo una consulta 👟");
    });
    var ig = $("[data-instagram]");
    if (ig && N.instagram) ig.href = "https://instagram.com/" + N.instagram;
    var fb = $("[data-facebook]");
    if (fb && N.facebook) fb.href = N.facebook;

    // Anuncio de arriba
    var an = $("[data-anuncio]");
    if (an && (C.anuncio || []).length) {
      an.innerHTML = C.anuncio.map(function (x) { return "<span>" + esc(x) + "</span>"; }).join("");
      an.removeAttribute("hidden");
    }

    // Menú (arriba, móvil y pie)
    var enlaces = [{ h: "#/", t: "Inicio" }].concat(CATEGORIAS.map(function (c) {
      return { h: "#/c/" + c.id, t: c.nombre };
    }));
    var menu = $("[data-menu]");
    if (menu) menu.innerHTML = enlaces.map(function (e) { return '<a href="' + e.h + '">' + esc(e.t) + "</a>"; }).join("");
    var mm = $("[data-menu-movil-lista]");
    if (mm) {
      mm.innerHTML = enlaces.concat([{ h: "#/favoritos", t: "Favoritos" }]).map(function (e) {
        return '<a href="' + e.h + '">' + esc(e.t) + ico("flecha") + "</a>";
      }).join("");
    }
    var pc = $("[data-pie-categorias]");
    if (pc) {
      pc.innerHTML = CATEGORIAS.map(function (c) {
        return '<li><a href="#/c/' + esc(c.id) + '">' + esc(c.nombre) + "</a></li>";
      }).concat(['<li><a href="#/favoritos">Favoritos</a></li>']).join("");
    }

    // Horario
    var hl = $("[data-horario-largo]");
    if (hl && C.horario) {
      var hoy = DIAS[ahora().dia];
      hl.innerHTML = "<b>Horario</b>" + ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"].map(function (d) {
        var v = C.horario[d] || "cerrado";
        return '<span class="horario-dia' + (d === hoy ? " horario-dia--hoy" : "") + '"><span>' + DIAS_TXT[d] +
          "</span><span>" + esc(v === "cerrado" ? "Cerrado" : v) + "</span></span>";
      }).join("");
    }
    var et = $("[data-envios-texto]");
    if (et) {
      et.textContent = (N.envios || []).map(function (e) { return e.nombre + " " + plata(e.precio); }).join(" · ") +
        (N.envioGratisDesde ? ". Gratis sobre " + plata(N.envioGratisDesde) + "." : "");
    }

    // Mapa
    var mapa = $("[data-mapa]");
    if (mapa && N.mapa) mapa.href = N.mapa;
    var marco = $("[data-mapa-embed]");
    if (marco) {
      var q = N.mapaBusqueda || [N.direccion, N.ciudad, "Chile"].filter(Boolean).join(", ");
      if (q) marco.src = "https://www.google.com/maps?q=" + encodeURIComponent(q) + "&output=embed";
    }

    // Guía de tallas
    var guia = $("[data-guia-tallas]");
    if (guia) {
      guia.innerHTML = (C.guiaTallas || []).map(function (f) {
        return "<tr><td>" + esc(f.talla) + "</td><td>" + esc(f.cm) + " cm</td><td>" + esc(f.us) + "</td></tr>";
      }).join("");
    }

    document.title = (N.nombre || "Tienda") + " | " + (N.rubro || "") + " — envíos a todo Chile";
  }

  /* -----------------------------------------------------------------------
     Ventanas de información: las políticas y el despacho se leen aquí,
     igual que la guía de tallas, sin sacar a nadie de la página.
     ----------------------------------------------------------------------- */
  function cerrarVentanas() {
    $$("dialog.ventana").forEach(function (d) { if (d.open) d.close(); });
  }
  function lineasEnvio() {
    var l = (N.envios || []).map(function (e) {
      return "<li><b>" + esc(e.nombre) + "</b><span>" +
        (N.envioPorPagar ? "Por pagar" : plata(e.precio || 0)) +
        (e.detalle ? " · " + esc(e.detalle) : "") + "</span></li>";
    });
    if (N.retiroEnTienda) {
      l.push("<li><b>" + esc(N.nombreRetiro || "Retiro en la tienda") + "</b><span>Gratis" +
        (N.notaRetiro ? " · " + esc(N.notaRetiro) : "") + "</span></li>");
    }
    return '<ul class="info-lista">' + l.join("") + "</ul>";
  }
  function abrirInfo(que, indice) {
    var dlg = $("[data-ventana-info]");
    if (!dlg) return;
    var pol = N.politicas || [];
    var titulo = "Información", cuerpo = "";
    if (que === "politica" && pol[+indice]) {
      titulo = pol[+indice].titulo || "Políticas de compra";
      cuerpo = "<p>" + esc(pol[+indice].texto) + "</p>";
    } else if (que === "despacho") {
      titulo = "Despacho y retiro";
      cuerpo = (N.envioPorPagar
        ? '<p class="texto-suave">Todos los envíos son por pagar: el despacho lo pagas al recibirlo, directo al transporte, así que no se suma al total del pedido.</p>'
        : "") + lineasEnvio();
    } else {
      titulo = "Políticas de compra";
      cuerpo = '<ul class="info-lista">' + pol.map(function (x) {
        return "<li>" + (x.titulo ? "<b>" + esc(x.titulo) + "</b>" : "") +
          "<span>" + esc(x.texto) + "</span></li>";
      }).join("") + "</ul>";
    }
    cuerpo += '<p class="info-wsp">¿Te queda alguna duda? <a href="' +
      esc(enlaceWsp("Hola, tengo una duda sobre " + titulo.toLowerCase())) +
      '" target="_blank" rel="noopener">Pregúntanos por WhatsApp</a>.</p>';
    $("[data-info-titulo]").textContent = titulo;
    $("[data-info-cuerpo]").innerHTML = cuerpo;
    cerrarVentanas();
    dlg.showModal();
  }

  /* =======================================================================
     Vista: inicio
     ======================================================================= */
  var slide = 0, slideTimer = null;

  function armarPortada() {
    var caja = $("[data-portada]");
    var slides = (C.portada || []).filter(function (s) { return s && s.titulo; });
    if (!caja || !slides.length) { if (caja) caja.setAttribute("hidden", ""); return; }
    caja.innerHTML = slides.map(function (s, i) {
      return '<div class="portada-slide"' + (i === 0 ? " data-activa" : "") + '>' +
        '<div class="portada-texto">' +
          '<h1 class="portada-titulo">' + esc(s.titulo) + "</h1>" +
          (s.bajada ? '<p class="portada-bajada">' + esc(s.bajada) + "</p>" : "") +
          (s.boton ? '<div><a class="enlace-flecha" href="' + esc(s.enlace || "#/catalogo") + '">' + esc(s.boton) + ico("flecha") + "</a></div>" : "") +
        "</div>" +
        '<div class="portada-foto"><img src="' + esc(s.foto || "") + '" alt="" ' + (i === 0 ? '' : 'loading="lazy" ') + 'width="1332" height="904"></div>' +
      "</div>";
    }).join("") +
      (slides.length > 1
        ? '<div class="portada-puntos">' + slides.map(function (s, i) {
            return '<button class="portada-punto" type="button" data-slide="' + i + '"' + (i === 0 ? ' aria-current="true"' : "") +
              ' aria-label="Ver la imagen ' + (i + 1) + '"></button>';
          }).join("") + "</div>"
        : "");
    if (slides.length > 1) {
      clearInterval(slideTimer);
      // cuánto dura cada imagen, configurable desde el panel (entre 2 y 20 segundos)
      var seg = Math.min(20, Math.max(2, parseFloat(C.portadaSegundos) || 4));
      slideTimer = setInterval(function () { verSlide(slide + 1); }, seg * 1000);
    }
  }
  function verSlide(i) {
    var caja = $("[data-portada]");
    if (!caja) return;
    var ss = $$(".portada-slide", caja);
    if (!ss.length) return;
    slide = (i + ss.length) % ss.length;
    ss.forEach(function (el, n) {
      if (n === slide) el.setAttribute("data-activa", ""); else el.removeAttribute("data-activa");
    });
    $$(".portada-punto", caja).forEach(function (b, n) {
      if (n === slide) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current");
    });
  }

  function armarInicio() {
    var dest = PRODUCTOS.filter(function (p) { return p.destacado && hayStock(p); }).slice(0, 3);
    if (!dest.length) dest = PRODUCTOS.filter(hayStock).slice(0, 3);
    var cajaD = $("[data-destacados]");
    if (cajaD) cajaD.innerHTML = dest.map(tarjeta).join("");

    var T = C.temporada || {};
    var cajaT = $("[data-temporada]");
    if (cajaT && T.titulo) {
      cajaT.innerHTML = '<div class="temporada-grilla">' +
        '<div class="temporada-foto"><img src="' + esc(T.foto || "") + '" alt="" loading="lazy" width="1100" height="820"></div>' +
        '<div class="temporada-texto">' +
          (T.etiqueta ? '<span class="temporada-etiqueta">' + esc(T.etiqueta) + "</span>" : "") +
          '<h2 class="temporada-titulo">' + esc(T.titulo) + "</h2>" +
          (T.bajada ? '<p class="temporada-bajada">' + esc(T.bajada) + "</p>" : "") +
          (T.boton ? '<a class="boton" href="' + esc(T.enlace || "#/catalogo") + '">' + esc(T.boton) + "</a>" : "") +
        "</div></div>";
      cajaT.removeAttribute("hidden");
    }

    var mos = $("[data-mosaico]");
    if (mos) {
      mos.innerHTML = CATEGORIAS.map(function (c) {
        var p = (c.productos || []).filter(function (x) { return x.disponible !== false; })[0];
        var f = c.foto || (p ? foto(p) : "");
        return '<a href="#/c/' + esc(c.id) + '">' +
          (f ? '<img src="' + esc(f) + '" alt="" loading="lazy" width="400" height="300">' : "") +
          "<b>" + esc(c.nombre) + "</b></a>";
      }).join("");
    }

    var pasos = $("[data-pasos]");
    if (pasos) {
      pasos.innerHTML = (C.pasos || []).map(function (x, i) {
        return "<li><div class=\"pasos-cab\"><span class=\"pasos-ico\">" + ico(x.icono || "bolsa") + "</span>" +
          '<span class="pasos-num">' + ("0" + (i + 1)).slice(-2) + "</span></div>" +
          "<h3>" + esc(x.titulo) + "</h3><p>" + esc(x.texto) + "</p></li>";
      }).join("");
      if (!(C.pasos || []).length) pasos.closest(".pasos").setAttribute("hidden", "");
    }

    // Las políticas solo viven en el pie: cada una abre su ventana con el detalle
    var politicas = N.politicas || [];
    var piePol = $("[data-pie-politicas]");
    if (piePol) {
      piePol.innerHTML = politicas.map(function (x, i) {
        return '<li><button class="pie-enlace" type="button" data-ventana="politica" data-pol="' + i + '">' +
          esc(x.titulo || x.texto) + "</button></li>";
      }).join("");
    }

    var hoy = ahora().fecha;
    var cupones = (C.cupones || []).filter(function (c) {
      return c && c.activo !== false && c.visible !== false &&
        !(c.desde && hoy < c.desde) && !(c.hasta && hoy > c.hasta);
    });
    var bloque = $("[data-cupones-bloque]");
    var lista = $("[data-cupones]");
    if (bloque && lista) {
      if (!cupones.length) bloque.setAttribute("hidden", "");
      else {
        bloque.removeAttribute("hidden");
        lista.innerHTML = cupones.map(function (c) {
          return '<div class="cupon"><span class="cupon-valor">' + (c.tipo === "monto" ? plata(c.valor) : c.tipo === "envio" ? "Envío" : c.valor + "%") + "</span>" +
            '<span class="cupon-datos"><span class="cupon-codigo">' + esc(c.codigo) + "</span>" +
            '<span class="cupon-detalle">' + esc(c.detalle || (c.minimo ? "Compra mínima " + plata(c.minimo) : "")) + "</span></span>" +
            '<button class="boton" type="button" data-usar-cupon="' + esc(c.codigo) + '">Usar cupón</button></div>';
        }).join("");
      }
    }
  }

  /* =======================================================================
     Vista: catálogo
     ======================================================================= */
  var filtro = { categoria: "", talla: "", texto: "", orden: "destacados", favoritos: false };

  function filtrados() {
    var txt = sinTildes(filtro.texto).trim();
    var lista = PRODUCTOS.filter(function (p) {
      if (filtro.favoritos && !esFavorito(p.id)) return false;
      if (filtro.categoria && p._cat !== filtro.categoria) return false;
      if (filtro.talla && stockTalla(p, filtro.talla) <= 0) return false;
      if (txt && p._busca.indexOf(txt) < 0 && p._nombre.indexOf(txt) < 0) return false;
      return true;
    });
    var o = filtro.orden;
    if (o === "precio-asc") lista.sort(function (a, b) { return a.precio - b.precio; });
    else if (o === "precio-desc") lista.sort(function (a, b) { return b.precio - a.precio; });
    else if (o === "nombre") lista.sort(function (a, b) { return sinTildes(a.nombre).localeCompare(sinTildes(b.nombre)); });
    else lista.sort(function (a, b) {
      var s = (hayStock(b) ? 1 : 0) - (hayStock(a) ? 1 : 0);
      return s || (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0);
    });
    return lista;
  }

  function pintarCatalogo() {
    var vista = $('[data-vista="catalogo"]');
    var cat = CATEGORIAS.filter(function (c) { return c.id === filtro.categoria; })[0];
    var titulo = filtro.favoritos ? "Favoritos" : cat ? cat.nombre : (enRuta(C.textos, "catalogo.titulo") || "Catálogo");
    var bajada = filtro.favoritos ? "Los modelos que guardaste con el corazón." : (enRuta(C.textos, "catalogo.bajada") || "");

    // las tallas que existen en lo que se está mirando
    var base = PRODUCTOS.filter(function (p) {
      return (!filtro.categoria || p._cat === filtro.categoria) && (!filtro.favoritos || esFavorito(p.id));
    });
    var hay = {};
    base.forEach(function (p) {
      tallasDe(p).forEach(function (x) { if (stockTalla(p, x) > 0) hay[x] = true; });
    });
    var tallas = TODAS_TALLAS.filter(function (x) { return hay[x]; });
    if (filtro.talla && tallas.indexOf(filtro.talla) < 0) filtro.talla = "";

    var lista = filtrados();
    vista.innerHTML =
      '<div class="contenedor">' +
        '<div class="cat-cab"><h1 class="titulo">' + esc(titulo) + "</h1>" +
          (bajada ? '<p class="cat-bajada">' + esc(bajada) + "</p>" : "") + "</div>" +
        '<div class="filtros">' +
          '<div class="filtro-tipos"><span class="filtro-rotulo">Tipo de zapato</span>' +
            '<div class="pildoras">' +
            '<button class="pildora" type="button" data-tipo="" aria-pressed="' + (filtro.categoria ? "false" : "true") + '">Todos</button>' +
            CATEGORIAS.map(function (c) {
              return '<button class="pildora" type="button" data-tipo="' + esc(c.id) + '" aria-pressed="' +
                (filtro.categoria === c.id ? "true" : "false") + '">' + esc(c.nombre) + "</button>";
            }).join("") + "</div></div>" +
          (tallas.length
            ? '<div class="filtro-tallas"><span class="filtro-rotulo">Buscar por talla</span>' +
              '<div class="pildoras pildoras--tallas">' +
              '<button class="pildora" type="button" data-talla="" aria-pressed="' + (filtro.talla ? "false" : "true") + '">Todas</button>' +
              tallas.map(function (x) {
                return '<button class="pildora" type="button" data-talla="' + esc(x) + '" aria-pressed="' +
                  (filtro.talla === x ? "true" : "false") + '">' + esc(x) + "</button>";
              }).join("") + "</div></div>"
            : "<div></div>") +
          '<div class="filtro-orden"><span class="filtro-rotulo">Ordenar</span>' +
            '<select data-orden aria-label="Ordenar el catálogo">' +
              ["destacados|Destacados", "precio-asc|Precio: de menor a mayor", "precio-desc|Precio: de mayor a menor", "nombre|Nombre (A-Z)"].map(function (o) {
                var v = o.split("|");
                return '<option value="' + v[0] + '"' + (filtro.orden === v[0] ? " selected" : "") + ">" + v[1] + "</option>";
              }).join("") +
            "</select></div>" +
        "</div>" +
        '<p class="cat-cuenta">' + (lista.length ? lista.length + (lista.length === 1 ? " modelo" : " modelos") +
          (filtro.talla ? " en talla " + esc(filtro.talla) : "") +
          (filtro.texto ? ' para "' + esc(filtro.texto) + '"' : "") : "") + "</p>" +
        '<div class="rejilla rejilla--4">' +
          (lista.length ? lista.map(tarjeta).join("")
            : '<div class="vacio"><b>No encontramos nada con eso</b>' +
              "<p>" + (filtro.talla ? "Prueba con otra talla o escríbenos: " : "Prueba con otra palabra o escríbenos: ") +
              "si no está acá, igual podemos buscarlo.</p>" +
              '<a class="boton boton--wsp" href="' + esc(enlaceWsp("Hola, busco un modelo que no veo en la página")) + '" target="_blank" rel="noopener">Preguntar por WhatsApp</a></div>') +
        "</div>" +
      "</div>" +
      '<div class="bloque"></div>';
  }

  /* =======================================================================
     Vista: producto
     ======================================================================= */
  var ficha = { id: "", talla: "", cantidad: 1, imagen: 0, error: false };

  function pintarProducto(id) {
    var vista = $('[data-vista="producto"]');
    var p = PORID[id];
    if (!p) {
      vista.innerHTML = '<div class="contenedor"><div class="vacio"><b>No encontramos ese modelo</b>' +
        '<p>Puede que ya no esté en el catálogo.</p><a class="boton" href="#/catalogo">Ver el catálogo</a></div></div>';
      return;
    }
    if (ficha.id !== id) {
      var disponibles = tallasDe(p).filter(function (t) { return stockTalla(p, t) > 0; });
      ficha = { id: id, talla: p.tallaUnica ? "única" : (disponibles.length === 1 ? disponibles[0] : ""), cantidad: 1, imagen: 0, error: false };
    }
    var ims = fotos(p);
    var colores = coloresDe(p);
    var d = descuento(p);
    var agotado = !hayStock(p);
    var tallas = tallasDe(p);
    var fav = esFavorito(p.id);

    var relacionados = PRODUCTOS.filter(function (x) {
      return x._cat === p._cat && x.id !== p.id && hayStock(x);
    }).slice(0, 4);

    vista.innerHTML =
      '<div class="contenedor">' +
        '<nav class="miga" aria-label="Dónde estás"><a href="#/">Inicio</a>' +
          '<span><a href="#/c/' + esc(p._cat) + '">' + esc(p._catNombre) + "</a></span>" +
          "<span>" + esc(p.nombre) + "</span></nav>" +

        '<div class="producto-grilla">' +
          "<div>" +
            '<div class="galeria-marco">' +
              '<img src="' + esc(ims[ficha.imagen] || ims[0]) + '" alt="' + esc(p.nombre) + '" width="1200" height="900" data-galeria-foto>' +
              (ims.length > 1
                ? '<button class="galeria-flecha galeria-flecha--izq" type="button" data-galeria="-1" aria-label="Foto anterior">' + ico("izq") + "</button>" +
                  '<button class="galeria-flecha galeria-flecha--der" type="button" data-galeria="1" aria-label="Foto siguiente">' + ico("der") + "</button>"
                : "") +
            "</div>" +
            (ims.length > 1
              ? '<p class="galeria-color" data-color-actual></p>' +
                '<div class="galeria-miniaturas">' + ims.map(function (f, i) {
                  var col = colores && colores[i] ? colores[i].nombre : "";
                  return '<button type="button" data-galeria-ir="' + i + '"' + (i === ficha.imagen ? ' aria-current="true"' : "") +
                    ' aria-label="' + esc(col ? "Ver el color " + col : "Ver la foto " + (i + 1)) + '"' +
                    (col ? ' title="' + esc(col) + '"' : "") + '>' +
                    '<img src="' + esc(f) + '" alt="" loading="lazy" width="400" height="300">' +
                    (col ? '<span class="miniatura-color">' + esc(col) + "</span>" : "") + "</button>";
                }).join("") + "</div>"
              : "") +
          "</div>" +

          "<div>" +
            '<h1 class="producto-titulo">' + esc(p.nombre) + "</h1>" +
            '<div class="producto-precios"><span class="producto-precio">' + plata(p.precio) + "</span>" +
              (d ? '<span class="producto-antes">' + plata(p.precioAntes) + '</span><span class="producto-dcto">-' + d + "%</span>" : "") + "</div>" +
            (p.detalle ? '<p class="producto-detalle">' + esc(p.detalle) + "</p>" : "") +

            (agotado
              ? '<div class="grupo"><div class="grupo-cab"><b>Sin stock por ahora</b></div>' +
                '<p class="texto-suave">Se nos acabó este modelo. Escríbenos y te avisamos apenas llegue.</p></div>'
              : tallas.length
                ? '<div class="grupo"><div class="grupo-cab"><b>Talla</b>' +
                  (ficha.error && !ficha.talla ? '<span class="error">Elige una talla</span>' : '<button class="enlace" type="button" data-abrir-tallas>Guía de tallas</button>') +
                  '</div><div class="tallas-fila">' +
                  tallas.map(function (t) {
                    var s = stockTalla(p, t);
                    return '<button class="talla" type="button" data-talla-op="' + esc(t) + '"' + (s > 0 ? "" : " disabled") +
                      ' aria-pressed="' + (ficha.talla === t ? "true" : "false") + '">' + esc(t) +
                      (stockContado(p, t) && s > 0 && s <= 2 ? "<small>" + (s === 1 ? "última" : "quedan 2") + "</small>" : "") + "</button>";
                  }).join("") + "</div>" +
                  (p.nota ? '<p class="aviso-horma">' + ico("aviso") + "<span>" + esc(p.nota) + "</span></p>" : "") + "</div>"
                : "") +

            (agotado ? "" :
              '<div class="grupo"><div class="grupo-cab"><b>Cantidad</b></div>' +
              '<div class="cantidad"><button type="button" data-cant="-" aria-label="Quitar uno">−</button>' +
              "<span>" + ficha.cantidad + "</span>" +
              '<button type="button" data-cant="+" aria-label="Agregar uno">+</button></div></div>') +

            '<div class="producto-acciones">' +
              (agotado
                ? '<a class="boton boton--wsp" href="' + esc(enlaceWsp("Hola, ¿tendrán de nuevo " + p.nombre + "?")) + '" target="_blank" rel="noopener">' + ico("wsp") + "Consultar por WhatsApp</a>"
                : '<button class="boton" type="button" data-agregar>' + ico("bolsa") + "Agregar al carrito</button>") +
              '<button class="boton boton--linea" type="button" data-favorito="' + esc(p.id) + '">' +
                '<svg class="icono" viewBox="0 0 24 24" aria-hidden="true"' + (fav ? ' fill="currentColor"' : "") + ">" + SVG.corazon + "</svg>" +
                (fav ? "Guardado en favoritos" : "Agregar a favoritos") + "</button>" +
            "</div>" +

            '<div class="acordeon">' +
              (p.descripcion ? detalle("Descripción", p.descripcion, true) : "") +
              (p.material || p.cuidados ? detalle("Material y cuidados", [p.material ? "Material: " + p.material : "", p.cuidados].filter(Boolean).join("\n")) : "") +
              ((N.politicas || []).length
                ? detalle("Políticas de compra", N.politicas.map(function (x) {
                    return "· " + (x.titulo ? x.titulo + ": " : "") + x.texto;
                  }).join("\n"))
                : N.cambios || N.garantia
                  ? detalle("Cambios y devoluciones", [N.cambios, N.garantia ? "Garantía: " + N.garantia : ""].filter(Boolean).join("\n"))
                  : "") +
              detalle("Despacho y retiro", [
                N.envioPorPagar ? "Todos los envíos son por pagar: el despacho lo pagas al recibirlo, directo al transporte." : ""
              ].concat((N.envios || []).map(function (e) {
                return "· " + e.nombre + ": " + (N.envioPorPagar ? "por pagar" : plata(e.precio || 0)) +
                  (e.detalle ? " (" + e.detalle + ")" : "");
              })).concat([
                N.envioGratisDesde && !N.envioPorPagar ? "· Despacho gratis en compras sobre " + plata(N.envioGratisDesde) + "." : "",
                N.retiroEnTienda ? "· " + (N.nombreRetiro || "Retiro en la tienda") + ": gratis. " + (N.notaRetiro || "") : ""
              ]).filter(Boolean).join("\n")) +
            "</div>" +
          "</div>" +
        "</div>" +

        (relacionados.length
          ? '<section class="relacionados"><div class="bloque-cab"><h2 class="titulo">También te puede gustar</h2>' +
            '<a class="enlace-flecha" href="#/c/' + esc(p._cat) + '">Ver ' + esc(p._catNombre) + ico("flecha") + "</a></div>" +
            '<div class="rejilla rejilla--4">' + relacionados.map(tarjeta).join("") + "</div></section>"
          : "") +
      "</div>";
    pintarColorActual();
  }

  /* Cambiar de foto no rehace la ficha entera: solo se cambia la imagen grande.
     Cuando el producto trae una foto por color, la galería dice cuál se está viendo. */
  function coloresDe(p) {
    var cs = p.colores || [], ims = fotos(p);
    return cs.length > 1 && cs.length === ims.length ? cs : null;
  }
  function pintarColorActual() {
    var p = PORID[ficha.id];
    var el = $("[data-color-actual]");
    if (!p || !el) return;
    var cs = coloresDe(p);
    el.innerHTML = cs && cs[ficha.imagen]
      ? '<span class="color-punto" style="background:' + esc(cs[ficha.imagen].hex || "#ddd") + '"></span>' +
        "Color: <b>" + esc(cs[ficha.imagen].nombre) + "</b>"
      : "Foto " + (ficha.imagen + 1) + " de " + fotos(p).length;
  }

  function verFoto(i) {
    var p = PORID[ficha.id];
    if (!p) return;
    var ims = fotos(p);
    ficha.imagen = (i + ims.length) % ims.length;
    var grande = $("[data-galeria-foto]");
    if (grande) grande.src = ims[ficha.imagen];
    $$("[data-galeria-ir]").forEach(function (b, n) {
      if (n === ficha.imagen) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current");
    });
    pintarColorActual();
  }

  function detalle(titulo, cuerpo, abierto) {
    return "<details" + (abierto ? " open" : "") + "><summary>" + esc(titulo) + "</summary>" +
      '<div class="acordeon-cuerpo">' + esc(cuerpo) + "</div></details>";
  }

  /* =======================================================================
     Carrito (panel lateral)
     ======================================================================= */
  var focoPrevio = null;
  function abrirCarrito() {
    focoPrevio = document.activeElement;
    pintarCarrito();
    $("[data-carrito]").removeAttribute("hidden");
    $("[data-velo]").removeAttribute("hidden");
    document.body.classList.add("sin-scroll");
    var cerrar = $("[data-cerrar-carrito]");
    if (cerrar) cerrar.focus();
  }
  function cerrarCarrito() {
    $("[data-carrito]").setAttribute("hidden", "");
    if ($("[data-menu-movil]").hasAttribute("hidden")) $("[data-velo]").setAttribute("hidden", "");
    document.body.classList.remove("sin-scroll");
    if (focoPrevio && document.contains(focoPrevio)) focoPrevio.focus();
    focoPrevio = null;
  }
  function refrescarCarrito() {
    var n = cuenta();
    var g = $("[data-contador]");
    if (g) { g.textContent = n; if (n) g.removeAttribute("hidden"); else g.setAttribute("hidden", ""); }
    var b = $("[data-abrir-carrito]");
    if (b) b.setAttribute("aria-label", "Mi carrito, " + n + (n === 1 ? " producto" : " productos"));
    if (!$("[data-carrito]").hasAttribute("hidden")) pintarCarrito();
    if (ruta().vista === "checkout") pintarResumen();
  }
  function pintarCarrito() {
    var cuerpo = $("[data-carrito-cuerpo]");
    var pie = $("[data-carrito-pie]");
    var ls = lineas();
    var cu = $("[data-carrito-cuenta]");
    if (cu) cu.textContent = cuenta() === 1 ? "1 producto" : cuenta() + " productos";

    if (!ls.length) {
      cuerpo.innerHTML = '<div class="carrito-vacio"><b>Tu carrito está vacío</b>' +
        "<p>Elige un modelo y su talla para empezar.</p>" +
        '<a class="boton" href="#/catalogo" data-cerrar-carrito>Ver el catálogo</a></div>';
      pie.innerHTML = "";
      return;
    }
    cuerpo.innerHTML = ls.map(function (l) {
      var p = PORID[l.id];
      return '<div class="linea">' +
        '<a class="linea-foto" href="#/p/' + esc(p.id) + '" data-cerrar-carrito><img src="' + esc(foto(p)) + '" alt="" width="400" height="300"></a>' +
        '<div class="linea-datos">' +
          '<a class="linea-nombre" href="#/p/' + esc(p.id) + '" data-cerrar-carrito>' + esc(p.nombre) + "</a>" +
          (p.tallaUnica ? "" : '<span class="linea-talla">Talla ' + esc(l.talla) + "</span>") +
          '<span class="linea-precio">' + plata(p.precio * l.cantidad) + "</span>" +
          '<span class="linea-abajo">' +
            '<span class="cantidad"><button type="button" data-menos="' + esc(l.clave) + '" aria-label="Quitar uno">−</button>' +
            "<span>" + l.cantidad + "</span>" +
            '<button type="button" data-mas="' + esc(l.clave) + '" aria-label="Agregar uno">+</button></span>' +
            '<button class="quitar" type="button" data-quitar="' + esc(l.clave) + '" aria-label="Quitar del carrito">' + ico("basura") + "</button>" +
          "</span>" +
        "</div></div>";
    }).join("");

    pie.innerHTML =
      '<div class="carrito-total"><span>Subtotal</span><b>' + plata(subtotal()) + "</b></div>" +
      '<p class="nota">El despacho y los cupones se calculan en el siguiente paso.</p>' +
      '<a class="boton boton--bloque" href="#/checkout" data-cerrar-carrito>Finalizar compra</a>' +
      '<button class="boton boton--linea boton--bloque" type="button" data-wsp-rapido>' + ico("wsp") + "Comprar por WhatsApp</button>";
  }

  /* =======================================================================
     Vista: checkout
     ======================================================================= */
  var erroresForm = {};

  function pintarCheckout() {
    var vista = $('[data-vista="checkout"]');
    var ls = lineas();
    if (!ls.length) {
      vista.innerHTML = '<div class="contenedor checkout"><div class="vacio"><b>Tu carrito está vacío</b>' +
        "<p>Agrega un par y volvemos a este paso.</p>" +
        '<a class="boton" href="#/catalogo">Ver el catálogo</a></div></div>';
      return;
    }
    var esEnvio = datos.entrega !== "retiro";
    var zona = zonaActual();
    var gratis = !porPagar() && (envioGratisPorMonto() || descuentoEnvio() > 0);

    function campo(id, etiqueta, tipo, k, extra) {
      var e = erroresForm[k];
      return '<div class="campo"><input id="' + id + '" type="' + tipo + '" data-campo="' + k + '" value="' + esc(datos[k]) +
        '" placeholder="' + esc(etiqueta) + '" aria-label="' + esc(etiqueta) + '"' + (e ? ' aria-invalid="true"' : "") +
        (extra || "") + ">" + (e ? '<p class="campo-error">' + esc(e) + "</p>" : "") + "</div>";
    }

    vista.innerHTML =
      '<div class="contenedor checkout">' +
        '<h1 class="titulo">Finalizar compra</h1>' +
        '<div class="checkout-grilla">' +
          "<form novalidate>" +
            '<div class="seccion-form"><b>Datos de contacto</b><div class="campos">' +
              campo("co-nombre", "Nombre completo", "text", "nombre", ' autocomplete="name"') +
              campo("co-tel", "Teléfono (WhatsApp)", "tel", "telefono", ' autocomplete="tel" inputmode="tel"') +
              campo("co-mail", "Correo electrónico", "email", "correo", ' autocomplete="email"') +
            "</div></div>" +

            '<div class="seccion-form"><b>Método de entrega</b><div class="entregas">' +
              '<button class="entrega" type="button" data-entrega="envio" aria-pressed="' + (esEnvio ? "true" : "false") + '">' +
                '<span class="entrega-marca"></span><span class="entrega-datos"><b>Envío a domicilio</b>' +
                "<small>Recibe en la dirección que indiques</small></span>" +
                '<span class="entrega-precio' + (gratis ? " entrega-precio--gratis" : "") + '" data-precio-envio>' +
                  textoEnvio() + "</span></button>" +
              (N.retiroEnTienda
                ? '<button class="entrega" type="button" data-entrega="retiro" aria-pressed="' + (esEnvio ? "false" : "true") + '">' +
                  '<span class="entrega-marca"></span><span class="entrega-datos"><b>' + esc(N.nombreRetiro || "Retiro en la tienda") + "</b>" +
                  "<small>" + esc(N.notaRetiro || "Coordinamos por WhatsApp") + "</small></span>" +
                  '<span class="entrega-precio entrega-precio--gratis">Gratis</span></button>'
                : "") +
            "</div></div>" +

            (esEnvio
              ? '<div class="seccion-form"><b>Dirección de envío</b><div class="campos campos--2">' +
                  '<div class="campo"><select data-campo="region" aria-label="Región"' + (erroresForm.region ? ' aria-invalid="true"' : "") + ">" +
                    '<option value="">Región</option>' +
                    (C.regiones || []).map(function (r) {
                      return '<option value="' + esc(r) + '"' + (datos.region === r ? " selected" : "") + ">" + esc(r) + "</option>";
                    }).join("") +
                  "</select>" + (erroresForm.region ? '<p class="campo-error">' + esc(erroresForm.region) + "</p>" : "") + "</div>" +
                  campo("co-comuna", "Comuna", "text", "comuna", ' autocomplete="address-level2"') +
                "</div>" +
                '<div class="campos" style="margin-top:12px">' +
                  campo("co-dir", "Dirección", "text", "direccion", ' autocomplete="street-address"') +
                  campo("co-ref", "Referencia (opcional)", "text", "referencia") +
                "</div>" +
                (zona ? '<p class="nota" style="margin-top:10px">Zona de despacho: <b>' + esc(zona.nombre) + "</b>" +
                  (zona.detalle ? " · " + esc(zona.detalle) : "") + "</p>" : "") +
                "</div>"
              : '<div class="seccion-form"><b>Retiro en la tienda</b>' +
                '<p class="texto-suave">' + esc([N.direccion, N.sector, N.ciudad].filter(Boolean).join(", ")) + "</p>" +
                '<p class="texto-suave">' + esc(N.notaRetiro || "") + "</p></div>") +
          "</form>" +

          '<aside class="resumen" data-resumen>' + resumenHtml() + "</aside>" +
        "</div>" +
      "</div>";
  }

  /* El resumen se dibuja aparte: así al escribir la comuna no se rehace el formulario entero. */
  function resumenHtml() {
    var ls = lineas();
    var esEnvio = datos.entrega !== "retiro";
    var zona = zonaActual();
    return "<b>Tu pedido</b>" +
      '<div class="resumen-lineas">' + ls.map(function (l) {
        var p = PORID[l.id];
        return '<div class="resumen-linea"><img src="' + esc(foto(p)) + '" alt="" width="400" height="300">' +
          "<div><b>" + esc(p.nombre) + "</b><small>" +
          (p.tallaUnica ? "" : "Talla " + esc(l.talla) + " · ") + "Cantidad " + l.cantidad + "</small></div>" +
          "<span>" + plata(p.precio * l.cantidad) + "</span></div>";
      }).join("") + "</div>" +
      cajaCupon() +
      '<div class="totales">' +
        '<div class="total-fila"><span>Productos</span><span>' + plata(subtotal()) + "</span></div>" +
        (descuentoProductos() ? '<div class="total-fila total-fila--dcto"><span>Cupón ' + esc(String(datos.cupon).toUpperCase()) +
          "</span><span>−" + plata(descuentoProductos()) + "</span></div>" : "") +
        '<div class="total-fila"><span>' + (esEnvio ? "Despacho" + (zona ? " · " + esc(zona.nombre) : "") : "Retiro") + "</span><span>" +
          (costoEnvio() ? plata(costoEnvio()) : esEnvio && porPagar() ? "Por pagar" : "Gratis") + "</span></div>" +
        (descuentoEnvio() ? '<div class="total-fila total-fila--dcto"><span>Cupón de despacho</span><span>−' + plata(descuentoEnvio()) + "</span></div>" : "") +
        '<div class="total-fila total-fila--grande"><span>Total</span><span>' + plata(total()) + "</span></div>" +
      "</div>" +
      '<button class="boton" type="button" data-enviar>' + ico("wsp") + "Enviar pedido por WhatsApp</button>" +
      '<p class="nota" style="margin-top:12px">' +
        (esEnvio && porPagar() ? "El envío se paga aparte, al recibirlo. " : "") +
        "Confirmamos tu talla y el total por WhatsApp. Desde la página no se cobra nada.</p>";
  }

  function pintarResumen() {
    var caja = $("[data-resumen]");
    if (caja) caja.innerHTML = resumenHtml();
    var precio = $("[data-precio-envio]");
    if (precio) {
      var libre = !porPagar() && (datos.entrega === "retiro" || envioGratisPorMonto() || descuentoEnvio() > 0);
      precio.textContent = textoEnvio();
      precio.classList.toggle("entrega-precio--gratis", libre);
    }
    var nota = $("[data-zona-nota]");
    if (nota) {
      var z = zonaActual();
      nota.innerHTML = z ? "Zona de despacho: <b>" + esc(z.nombre) + "</b>" + (z.detalle ? " · " + esc(z.detalle) : "") : "";
    }
  }

  function cajaCupon() {
    var r = datos.cupon ? buscarCupon(datos.cupon) : null;
    var puesto = !!(r && r.cupon);
    var hoy = ahora().fecha;
    var sugerencias = (C.cupones || []).filter(function (c) {
      return c && c.activo !== false && c.visible !== false && !puesto &&
        !(c.desde && hoy < c.desde) && !(c.hasta && hoy > c.hasta) && (!c.minimo || subtotal() >= c.minimo);
    }).slice(0, 2);

    return '<div class="cupon-caja"><label for="co-cupon">¿Tienes un cupón de descuento?</label>' +
      '<div class="cupon-fila">' +
        '<input id="co-cupon" type="text" data-cupon-texto value="' + esc(datos.cupon) + '" placeholder="Escribe tu código" autocomplete="off"' +
          (puesto ? " readonly" : "") + ">" +
        '<button class="boton' + (puesto ? " boton--linea" : "") + '" type="button" data-cupon-accion>' + (puesto ? "Quitar" : "Aplicar") + "</button>" +
      "</div>" +
      (r
        ? '<p class="cupon-aviso ' + (puesto ? "cupon-aviso--ok" : "cupon-aviso--mal") + '">' +
          (puesto ? ico("ok") + "Cupón " + esc(r.cupon.codigo) + " aplicado" : esc(r.error)) + "</p>"
        : "") +
      (sugerencias.length
        ? '<p class="cupon-sugerencia">Disponibles: ' + sugerencias.map(function (c) {
            return '<button type="button" data-usar-cupon="' + esc(c.codigo) + '">' + esc(c.codigo) + "</button>";
          }).join(" · ") + "</p>"
        : "") +
      "</div>";
  }

  function validarCheckout() {
    erroresForm = {};
    if (!datos.nombre.trim()) erroresForm.nombre = "Escribe tu nombre.";
    var tel = datos.telefono.replace(/\D/g, "");
    if (tel.length < 8) erroresForm.telefono = "Escribe tu teléfono de WhatsApp.";
    if (datos.correo.trim() && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(datos.correo.trim())) erroresForm.correo = "Revisa el correo.";
    if (datos.entrega !== "retiro") {
      if (!datos.region) erroresForm.region = "Elige tu región.";
      if (!datos.comuna.trim()) erroresForm.comuna = "Escribe tu comuna.";
      if (!datos.direccion.trim()) erroresForm.direccion = "Escribe tu dirección.";
    }
    return Object.keys(erroresForm).length === 0;
  }

  function textoPedido(corto) {
    var ls = lineas();
    if (!ls.length) return "";
    var l = [];
    l.push("¡Hola " + (N.nombre || "") + "! Quiero hacer este pedido 👟");
    l.push("");
    ls.forEach(function (x) {
      var p = PORID[x.id];
      l.push("• " + p.nombre + (p.tallaUnica ? "" : " · talla " + x.talla) + " x" + x.cantidad + " — " + plata(p.precio * x.cantidad));
    });
    l.push("");
    if (corto) {
      l.push("Subtotal: " + plata(subtotal()));
      l.push("");
      l.push("(Me falta elegir despacho y dejar mis datos)");
      return l.join("\n");
    }
    l.push("Productos: " + plata(subtotal()));
    if (descuentoProductos()) l.push("Cupón " + String(datos.cupon).toUpperCase() + ": −" + plata(descuentoProductos()));
    var zona = zonaActual();
    if (datos.entrega === "retiro") l.push((N.nombreRetiro || "Retiro en la tienda") + ": gratis");
    else l.push("Despacho" + (zona ? " (" + zona.nombre + ")" : "") + ": " +
      (costoEnvio() ? plata(costoEnvio()) : porPagar() ? "por pagar" : "gratis"));
    l.push("TOTAL: " + plata(total()));
    l.push("");
    l.push("Nombre: " + datos.nombre);
    l.push("Teléfono: " + datos.telefono);
    if (datos.correo) l.push("Correo: " + datos.correo);
    if (datos.entrega === "retiro") {
      l.push("Entrega: " + (N.nombreRetiro || "Retiro en la tienda"));
    } else {
      l.push("Entrega: envío a domicilio");
      l.push("Dirección: " + datos.direccion + ", " + datos.comuna + ", " + datos.region);
      if (datos.referencia) l.push("Referencia: " + datos.referencia);
    }
    return l.join("\n");
  }

  function enviarPedido() {
    if (!lineas().length) return;
    if (!validarCheckout()) {
      pintarCheckout();
      avisar("Falta completar algunos datos");
      var malo = $('[aria-invalid="true"]');
      if (malo) { malo.scrollIntoView({ block: "center", behavior: "smooth" }); malo.focus({ preventScroll: true }); }
      return;
    }
    window.open(enlaceWsp(textoPedido(false)), "_blank", "noopener");
  }

  /* =======================================================================
     Router
     ======================================================================= */
  function ruta() {
    var h = (location.hash || "").replace(/^#\/?/, "");
    var partes = h.split("/").filter(Boolean);
    if (!partes.length) return { vista: "inicio" };
    if (partes[0] === "catalogo") return { vista: "catalogo" };
    if (partes[0] === "favoritos") return { vista: "catalogo", favoritos: true };
    if (partes[0] === "c") return { vista: "catalogo", categoria: partes[1] || "" };
    if (partes[0] === "p") return { vista: "producto", id: partes[1] || "" };
    if (partes[0] === "checkout") return { vista: "checkout" };
    return { vista: "inicio" };
  }

  function pintarRuta(sinSubir) {
    var r = ruta();
    filtro.favoritos = !!r.favoritos;
    if (r.vista === "catalogo") filtro.categoria = r.categoria || "";
    if (r.vista !== "catalogo") filtro.texto = "";

    $$(".vista").forEach(function (v) {
      if (v.getAttribute("data-vista") === r.vista) v.removeAttribute("hidden");
      else v.setAttribute("hidden", "");
    });
    if (r.vista === "catalogo") pintarCatalogo();
    if (r.vista === "producto") pintarProducto(r.id);
    if (r.vista === "checkout") { erroresForm = {}; pintarCheckout(); }

    $$("[data-menu] a, [data-menu-movil-lista] a").forEach(function (a) {
      var activo = a.getAttribute("href") === (location.hash || "#/");
      if (activo) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    cerrarMenu();
    if (!$("[data-carrito]").hasAttribute("hidden")) cerrarCarrito();
    if (!sinSubir) window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });

    var p = r.vista === "producto" && PORID[r.id];
    document.title = (p ? p.nombre + " | " : r.vista === "checkout" ? "Finalizar compra | " : "") +
      (N.nombre || "Tienda") + (p || r.vista === "checkout" ? "" : " | " + (N.rubro || ""));
  }

  /* =======================================================================
     Menú, buscador y eventos
     ======================================================================= */
  function abrirMenu() {
    $("[data-menu-movil]").removeAttribute("hidden");
    $("[data-velo]").removeAttribute("hidden");
    $("[data-abrir-menu]").setAttribute("aria-expanded", "true");
    document.body.classList.add("sin-scroll");
    var cerrarM = $("[data-cerrar-menu]");
    if (cerrarM) cerrarM.focus();
  }
  function cerrarMenu() {
    var m = $("[data-menu-movil]");
    if (!m || m.hasAttribute("hidden")) return;
    m.setAttribute("hidden", "");
    $("[data-abrir-menu]").setAttribute("aria-expanded", "false");
    if ($("[data-carrito]").hasAttribute("hidden")) $("[data-velo]").setAttribute("hidden", "");
    document.body.classList.remove("sin-scroll");
  }
  function alternarBuscador(abrir) {
    var barra = $("[data-barra-buscador]");
    var boton = $("[data-abrir-buscador]");
    if (abrir) {
      barra.removeAttribute("hidden");
      boton.setAttribute("aria-expanded", "true");
      $("[data-buscar]").focus();
    } else {
      barra.setAttribute("hidden", "");
      boton.setAttribute("aria-expanded", "false");
    }
  }

  function escuchar() {
    document.addEventListener("click", function (ev) {
      var t = ev.target, el;

      if ((el = t.closest("[data-slide]"))) { verSlide(+el.getAttribute("data-slide")); clearInterval(slideTimer); return; }
      if ((el = t.closest("[data-abrir-menu]"))) { abrirMenu(); return; }
      if (t.closest("[data-cerrar-menu]")) { cerrarMenu(); return; }
      if (t.closest("[data-velo]")) { cerrarMenu(); cerrarCarrito(); return; }
      if (t.closest("[data-abrir-buscador]")) { alternarBuscador($("[data-barra-buscador]").hasAttribute("hidden")); return; }
      if (t.closest("[data-cerrar-buscador]")) { alternarBuscador(false); return; }
      if (t.closest("[data-abrir-carrito]")) { abrirCarrito(); return; }
      if (t.closest("[data-cerrar-carrito]")) { cerrarCarrito(); return; }

      if ((el = t.closest("[data-abrir-tallas]"))) { ev.preventDefault(); $("[data-ventana-tallas]").showModal(); return; }
      if (t.closest("[data-cerrar-ventana]")) { cerrarVentanas(); return; }
      if ((el = t.closest("[data-ventana]"))) {
        ev.preventDefault();
        abrirInfo(el.getAttribute("data-ventana"), el.getAttribute("data-pol"));
        return;
      }
      if ((el = t.closest("[data-ir-tienda]"))) {
        ev.preventDefault();
        location.hash = "#/";
        setTimeout(function () {
          var s = $("#tienda");
          if (s) s.scrollIntoView({ behavior: "smooth" });
        }, 60);
        return;
      }

      // Catálogo
      if ((el = t.closest("[data-talla]"))) {
        filtro.talla = el.getAttribute("data-talla");
        pintarCatalogo();
        return;
      }
      if ((el = t.closest("[data-tipo]"))) {
        var tipo = el.getAttribute("data-tipo");
        location.hash = tipo ? "#/c/" + tipo : "#/catalogo";
        return;
      }

      // Producto
      if ((el = t.closest("[data-talla-op]"))) {
        ficha.talla = el.getAttribute("data-talla-op");
        ficha.error = false;
        var p0 = PORID[ficha.id];
        if (p0) ficha.cantidad = Math.min(ficha.cantidad, Math.max(1, tope(p0, ficha.talla)));
        pintarProducto(ficha.id);
        return;
      }
      if ((el = t.closest("[data-cant]"))) {
        var p1 = PORID[ficha.id];
        var max = p1 ? Math.max(1, tope(p1, ficha.talla)) : 9;
        ficha.cantidad = Math.min(max, Math.max(1, ficha.cantidad + (el.getAttribute("data-cant") === "+" ? 1 : -1)));
        pintarProducto(ficha.id);
        return;
      }
      if ((el = t.closest("[data-galeria]"))) { verFoto(ficha.imagen + +el.getAttribute("data-galeria")); return; }
      if ((el = t.closest("[data-galeria-ir]"))) { verFoto(+el.getAttribute("data-galeria-ir")); return; }
      if (t.closest("[data-agregar]")) {
        var p2 = PORID[ficha.id];
        if (!p2) return;
        if (!ficha.talla) {
          ficha.error = true;
          pintarProducto(ficha.id);
          var g = $(".tallas-fila");
          if (g) g.scrollIntoView({ block: "center", behavior: "smooth" });
          return;
        }
        if (agregar(p2.id, ficha.talla, ficha.cantidad)) abrirCarrito();
        return;
      }
      if ((el = t.closest("[data-favorito]"))) { cambiarFavorito(el.getAttribute("data-favorito")); pintarProducto(ficha.id); return; }

      // Carrito
      if ((el = t.closest("[data-quitar]"))) { quitar(el.getAttribute("data-quitar")); return; }
      if ((el = t.closest("[data-mas]"))) { cambiarCantidad(el.getAttribute("data-mas"), 1); return; }
      if ((el = t.closest("[data-menos]"))) { cambiarCantidad(el.getAttribute("data-menos"), -1); return; }
      if (t.closest("[data-wsp-rapido]")) { window.open(enlaceWsp(textoPedido(true)), "_blank", "noopener"); return; }

      // Checkout
      if ((el = t.closest("[data-entrega]"))) {
        datos.entrega = el.getAttribute("data-entrega");
        guardarDatos();
        pintarCheckout();
        return;
      }
      if (t.closest("[data-cupon-accion]")) {
        var campo = $("[data-cupon-texto]");
        if (datos.cupon && buscarCupon(datos.cupon).cupon) datos.cupon = "";
        else datos.cupon = campo ? campo.value.trim() : "";
        guardarDatos();
        var res = datos.cupon ? buscarCupon(datos.cupon) : null;
        if (res && res.cupon) avisar("Cupón " + res.cupon.codigo + " aplicado");
        pintarResumen();
        return;
      }
      if ((el = t.closest("[data-usar-cupon]"))) {
        datos.cupon = el.getAttribute("data-usar-cupon");
        guardarDatos();
        var r2 = buscarCupon(datos.cupon);
        avisar(r2.cupon ? "Cupón " + datos.cupon + " listo para tu compra" : r2.error);
        if (ruta().vista === "checkout") pintarResumen();
        else if (lineas().length) location.hash = "#/checkout";
        return;
      }
      if (t.closest("[data-enviar]")) { enviarPedido(); return; }
    });

    document.addEventListener("input", function (ev) {
      var el = ev.target;
      if (el.matches("[data-buscar]")) {
        filtro.texto = el.value;
        filtro.favoritos = false;
        if (ruta().vista !== "catalogo") { location.hash = "#/catalogo"; }
        else pintarCatalogo();
        return;
      }
      if (el.matches("[data-campo]")) {
        var k = el.getAttribute("data-campo");
        datos[k] = el.value;
        guardarDatos();
        if (erroresForm[k]) {
          delete erroresForm[k];
          el.removeAttribute("aria-invalid");
          var e = el.parentNode.querySelector(".campo-error");
          if (e) e.remove();
        }
        if (k === "comuna" || k === "region") pintarResumen();
      }
    });

    document.addEventListener("change", function (ev) {
      var el = ev.target;
      if (el.matches("[data-orden]")) { filtro.orden = el.value; pintarCatalogo(); }
      if (el.matches('[data-campo="region"]') || el.matches('[data-campo="comuna"]')) pintarResumen();
    });

    document.addEventListener("keydown", function (ev) {
      if (ev.key !== "Escape") return;
      cerrarMenu();
      if (!$("[data-carrito]").hasAttribute("hidden")) cerrarCarrito();
      if (!$("[data-barra-buscador]").hasAttribute("hidden")) alternarBuscador(false);
    });

    $$("dialog.ventana").forEach(function (d) {
      d.addEventListener("click", function (ev) { if (ev.target === d) d.close(); });
    });

    window.addEventListener("hashchange", function () { pintarRuta(); });
  }

  /* =======================================================================
     Arranque
     ======================================================================= */
  function iniciar() {
    revisarCarrito();
    armarFijos();
    armarPortada();
    armarInicio();
    refrescarCarrito();
    escuchar();
    pintarRuta(true);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();

  /* Lo que usa el asistente (js/asistente.js) */
  window.paginaTienda = {
    datos: function () { return C; },
    productos: function () { return PRODUCTOS.slice(); },
    producto: function (id) { return PORID[id] || null; },
    plata: plata,
    sinTildes: sinTildes,
    foto: foto,
    tallas: tallasDe,
    stockTalla: stockTalla,
    stockContado: stockContado,
    stockTotal: stockTotal,
    hayStock: hayStock,
    estaAbierto: estaAbierto,
    enlaceWsp: enlaceWsp,
    abrirFicha: function (id) { location.hash = "#/p/" + id; },
    abrirPedido: abrirCarrito,
    agregar: agregar,
    resumenBolsa: function () {
      return lineas().map(function (l) {
        var p = PORID[l.id];
        return p.nombre + (p.tallaUnica ? "" : " talla " + l.talla) + " x" + l.cantidad;
      }).join("; ");
    },
    totalBolsa: total,
    buscar: function (texto, max) {
      var RELLENO = " busco buscar quiero querria necesito ver tienen tiene tienes hay para con por del las los una unos unas alguna algun algo que cual cuales como esta este estos estas mas muy son sobre entre sin desde hasta tengo quisiera dame muestra mostrar ";
      var q = sinTildes(texto).replace(/[¿?¡!.,;:]/g, " ").trim();
      if (!q) return [];
      var palabras = q.split(/\s+/).filter(function (w) { return w.length > 2 && RELLENO.indexOf(" " + w + " ") < 0; });
      if (!palabras.length) return [];
      var puntuados = PRODUCTOS.map(function (p) {
        var n = 0;
        palabras.forEach(function (w) {
          var corta = w.length > 4 ? w.slice(0, -1) : w;
          if (p._nombre.indexOf(w) >= 0 || p._nombre.indexOf(corta) >= 0) n += 3;
          else if (p._busca.indexOf(w) >= 0 || p._busca.indexOf(corta) >= 0) n++;
        });
        return { p: p, n: n, stock: hayStock(p) ? 1 : 0 };
      }).filter(function (x) { return x.n > 0; });
      puntuados.sort(function (a, b) { return (b.n - a.n) || (b.stock - a.stock); });
      return puntuados.slice(0, max || 4).map(function (x) { return x.p; });
    }
  };
})();
