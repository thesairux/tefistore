/* =========================================================================
   Tefi Store — la página
   Todo lo que se ve sale de catalogo.js. Este archivo arma el catálogo, la ficha
   de cada zapato, la bolsa y el mensaje que se envía por WhatsApp.
   No hay que editarlo para cambiar productos, precios ni datos de la tienda.
   ========================================================================= */
(function () {
  "use strict";

  var C = window.CATALOGO || {};
  var N = C.negocio || {};
  var GUARDADO = "tefistore-bolsa-v1";

  /* ---------- Ayudas ---------- */
  function $(sel, raiz) { return (raiz || document).querySelector(sel); }
  function $$(sel, raiz) { return Array.prototype.slice.call((raiz || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function plata(n) { return "$" + String(Math.round(n || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
  function sinTildes(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }
  function leer(clave) { try { return JSON.parse(localStorage.getItem(clave) || "null"); } catch (e) { return null; } }
  function guardar(clave, valor) { try { localStorage.setItem(clave, JSON.stringify(valor)); } catch (e) { /* sin almacenamiento */ } }
  function enRuta(obj, ruta) {
    return String(ruta).split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, obj);
  }

  /* ---------- Productos ---------- */
  var PRODUCTOS = [];       // en el orden del catálogo
  var PORID = {};
  (C.secciones || []).forEach(function (sec) {
    (sec.categorias || []).forEach(function (cat) {
      (cat.productos || []).forEach(function (p) {
        if (p.disponible === false) return;
        p._seccion = sec.id; p._seccionNombre = sec.nombre;
        p._categoria = cat.id; p._categoriaNombre = cat.nombre;
        p._nombre = sinTildes([p.nombre, p.marca, cat.nombre].join(" "));
        p._busca = sinTildes([p.nombre, p.marca, p.detalle, p.material, sec.nombre, cat.nombre,
          (p.colores || []).map(function (c) { return c.nombre; }).join(" ")].join(" "));
        PRODUCTOS.push(p);
        PORID[p.id] = p;
      });
    });
  });

  function tallasDe(p) { return p.tallaUnica ? [] : Object.keys(p.tallas || {}); }
  function stockTalla(p, t) { return Math.max(0, parseInt((p.tallas || {})[t], 10) || 0); }
  function stockTotal(p) {
    if (p.tallaUnica) return Math.max(0, parseInt(p.stock, 10) || 0);
    return tallasDe(p).reduce(function (a, t) { return a + stockTalla(p, t); }, 0);
  }
  function hayStock(p) { return stockTotal(p) > 0; }
  function descuento(p) {
    if (!p.precioAntes || p.precioAntes <= p.precio) return 0;
    return Math.round((1 - p.precio / p.precioAntes) * 100);
  }
  function fotoDe(p) { return p.foto || "img/catalogo/_sinfoto.svg"; }
  function etiquetaDe(p) {
    if (!hayStock(p)) return { clase: "agotado", texto: "Agotado" };
    var e = (p.etiquetas || [])[0];
    if (e === "oferta" || descuento(p) >= 10) return { clase: "oferta", texto: "-" + (descuento(p) || 10) + "%" };
    if (e === "nuevo") return { clase: "nuevo", texto: "Nuevo" };
    if (e === "ultimos" || stockTotal(p) <= 2) return { clase: "ultimos", texto: "Últimos pares" };
    return null;
  }

  /* Todas las tallas del catálogo, ordenadas, para el filtro */
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
    return { fecha: x.year + "-" + x.month + "-" + x.day, dia: dia, hora: x.hour + ":" + x.minute, min: (+x.hour % 24) * 60 + +x.minute };
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

  /* ---------- WhatsApp ---------- */
  function enlaceWsp(texto) {
    var n = String(N.whatsapp || "").replace(/\D/g, "");
    return "https://wa.me/" + n + (texto ? "?text=" + encodeURIComponent(texto) : "");
  }

  /* =======================================================================
     Textos y datos fijos
     ======================================================================= */
  function datoDe(clave) {
    switch (clave) {
      case "sector-ciudad": return [N.sector, N.ciudad].filter(Boolean).join(", ");
      case "direccion-ciudad": return [N.direccion, N.ciudad].filter(Boolean).join(", ");
      case "pagos": return (N.pagos || []).join(" · ");
      case "instagram": return N.instagram ? "@" + N.instagram : "";
      default: return N[clave] || "";
    }
  }
  function rellenarFijos() {
    $$("[data-texto]").forEach(function (el) {
      var v = enRuta(C.textos || {}, el.getAttribute("data-texto"));
      if (v) el.textContent = v;
    });
    $$("[data-dato]").forEach(function (el) {
      var v = datoDe(el.getAttribute("data-dato"));
      if (v) el.textContent = v;
    });
    $$("[data-si]").forEach(function (el) {
      var clave = el.getAttribute("data-si");
      var hay = clave === "horario" ? !!C.horario : clave === "pagos" ? (N.pagos || []).length : !!N[clave];
      if (hay) el.removeAttribute("hidden"); else el.setAttribute("hidden", "");
    });
    $$("[data-wsp]").forEach(function (a) {
      a.href = enlaceWsp("¡Hola " + (N.nombre || "") + "! Tengo una consulta sobre los zapatos 👟");
    });
    var ig = $("[data-instagram]");
    if (ig && N.instagram) ig.href = "https://instagram.com/" + N.instagram;
    var fb = $("[data-facebook]");
    if (fb && N.facebook) fb.href = N.facebook;

    document.title = (N.nombre || "Tienda") + " | " + (N.rubro || "") + " — pide por WhatsApp";

    // Mapa
    var mapa = $("[data-mapa]");
    if (mapa && N.mapa) mapa.href = N.mapa;
    var marco = $("[data-mapa-embed]");
    if (marco) {
      var busqueda = N.mapaBusqueda || [N.direccion, N.ciudad, "Chile"].filter(Boolean).join(", ");
      if (busqueda) marco.src = "https://www.google.com/maps?q=" + encodeURIComponent(busqueda) + "&output=embed";
      else marco.closest(".mapa-marco").removeChild(marco);
    }

    // Estado (abierto / cerrado) en la portada
    var sello = $("[data-estado-tienda]");
    if (sello) {
      var ab = estaAbierto();
      if (ab === null) { sello.setAttribute("hidden", ""); }
      else {
        sello.removeAttribute("hidden");
        sello.textContent = ab ? "Tienda abierta ahora" : "Cerrado ahora · pide igual y te respondemos al abrir";
        if (ab) sello.removeAttribute("data-cerrado"); else sello.setAttribute("data-cerrado", "");
      }
    }

    // Ventajas de la portada
    var vent = $("[data-ventajas]");
    if (vent) {
      var items = [];
      if (N.envioGratisDesde) items.push(["camion", "Despacho gratis sobre " + plata(N.envioGratisDesde)]);
      else if ((N.envios || []).length) items.push(["camion", "Despacho a todo Chile"]);
      if (N.retiroEnTienda) items.push(["tienda", "Retiro gratis en la tienda"]);
      if (N.cambios) items.push(["cambio", "Cambio de talla"]);
      var SVGV = {
        camion: '<path d="M3 7h11v8H3zM14 10h4l3 3v2h-7z"/><circle cx="7" cy="17" r="1.8"/><circle cx="17.5" cy="17" r="1.8"/>',
        tienda: '<path d="M4 10v9h16v-9"/><path d="M3 6h18l-1.5 4h-15Z"/>',
        cambio: '<path d="M20 10a8 8 0 1 0-2.3 5.7L20 18"/><path d="M20 10h-5"/>'
      };
      vent.innerHTML = items.map(function (x) {
        return '<li><svg class="icono" viewBox="0 0 24 24" aria-hidden="true">' + SVGV[x[0]] + "</svg>" + esc(x[1]) + "</li>";
      }).join("");
    }

    // Horario largo
    var hl = $("[data-horario-largo]");
    if (hl && C.horario) {
      var hoy = DIAS[ahora().dia];
      hl.innerHTML = "<b>Horario</b>" + ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"].map(function (d) {
        var v = C.horario[d] || "cerrado";
        return '<span class="horario-dia' + (d === hoy ? " horario-dia--hoy" : "") + '"><span>' + DIAS_TXT[d] + "</span><span>" +
          esc(v === "cerrado" ? "Cerrado" : v) + "</span></span>";
      }).join("");
    }

    // Envíos
    var env = $("[data-envios]");
    if (env) {
      var filas = (N.envios || []).map(function (e) {
        return "<li><span>" + esc(e.nombre) + (e.detalle ? "<small>" + esc(e.detalle) + "</small>" : "") + "</span><b>" + plata(e.precio) + "</b></li>";
      });
      if (N.retiroEnTienda) filas.unshift("<li><span>Retiro en la tienda" + (N.notaRetiro ? "<small>" + esc(N.notaRetiro) + "</small>" : "") + "</span><b>Gratis</b></li>");
      env.innerHTML = filas.join("");
      if (N.envioGratisDesde) {
        var p = document.createElement("p");
        p.className = "envio-gratis";
        p.textContent = "Despacho gratis en compras sobre " + plata(N.envioGratisDesde) + ".";
        env.parentNode.appendChild(p);
      }
    }

    // Tabla de tallas
    var guia = $("[data-guia-tallas]");
    if (guia) {
      guia.innerHTML = (C.guiaTallas || []).map(function (f) {
        return "<tr><td>" + esc(f.talla) + "</td><td>" + esc(f.cm) + " cm</td><td>" + esc(f.us) + "</td></tr>";
      }).join("");
      if (!(C.guiaTallas || []).length) $("#tallas").setAttribute("hidden", "");
    }
  }

  /* =======================================================================
     Destacados de la portada
     ======================================================================= */
  function pintarDestacados() {
    var caja = $("[data-destacados]");
    if (!caja) return;
    var lista = PRODUCTOS.filter(function (p) { return p.destacado && p.foto && hayStock(p); }).slice(0, 4);
    if (!lista.length) { caja.setAttribute("hidden", ""); return; }
    caja.innerHTML = lista.map(function (p) {
      return '<button class="destacado" type="button" data-ver="' + esc(p.id) + '">' +
        '<span class="destacado-foto"><img src="' + esc(fotoDe(p)) + '" alt="' + esc(p.nombre) + '" loading="lazy" width="400" height="300"></span>' +
        '<span class="destacado-texto"><b>' + esc(p.nombre) + "</b><span>" + plata(p.precio) + "</span></span></button>";
    }).join("");
  }

  /* =======================================================================
     Catálogo: filtros y rejilla
     ======================================================================= */
  var filtro = { seccion: "", categoria: "", talla: "", texto: "", orden: "destacados" };

  function pintarSecciones() {
    var caja = $("[data-secciones]");
    if (!caja) return;
    var secs = (C.secciones || []).filter(function (s) {
      return PRODUCTOS.some(function (p) { return p._seccion === s.id; });
    });
    caja.innerHTML = ['<button class="pildora" type="button" data-seccion="" aria-pressed="true">Todo</button>']
      .concat(secs.map(function (s) {
        return '<button class="pildora" type="button" data-seccion="' + esc(s.id) + '" aria-pressed="false">' + esc(s.nombre) + "</button>";
      })).join("");
  }

  function pintarCategorias() {
    var caja = $("[data-categorias]");
    if (!caja) return;
    var sec = (C.secciones || []).filter(function (s) { return s.id === filtro.seccion; })[0];
    var cats = sec ? (sec.categorias || []).filter(function (c) {
      return PRODUCTOS.some(function (p) { return p._categoria === c.id; });
    }) : [];
    if (cats.length < 2) { caja.innerHTML = ""; caja.setAttribute("hidden", ""); return; }
    caja.removeAttribute("hidden");
    caja.innerHTML = ['<button class="pildora" type="button" data-categoria="" aria-pressed="' + (filtro.categoria ? "false" : "true") + '">Todas</button>']
      .concat(cats.map(function (c) {
        return '<button class="pildora" type="button" data-categoria="' + esc(c.id) + '" aria-pressed="' +
          (filtro.categoria === c.id ? "true" : "false") + '">' + esc(c.nombre) + "</button>";
      })).join("");
  }

  function pintarFiltroTallas() {
    var caja = $("[data-filtro-tallas]");
    if (!caja) return;
    // solo las tallas que existen en lo que se está mirando
    var base = PRODUCTOS.filter(function (p) {
      return (!filtro.seccion || p._seccion === filtro.seccion) && (!filtro.categoria || p._categoria === filtro.categoria);
    });
    var hay = {};
    base.forEach(function (p) { tallasDe(p).forEach(function (t) { hay[t] = true; }); });
    var tallas = TODAS_TALLAS.filter(function (t) { return hay[t]; });
    if (!tallas.length) { caja.closest(".filtro-tallas").setAttribute("hidden", ""); filtro.talla = ""; return; }
    caja.closest(".filtro-tallas").removeAttribute("hidden");
    if (filtro.talla && tallas.indexOf(filtro.talla) < 0) filtro.talla = "";
    caja.innerHTML = ['<button class="pildora pildora--auto" type="button" data-talla="" aria-pressed="' + (filtro.talla ? "false" : "true") + '">Todas</button>']
      .concat(tallas.map(function (t) {
        return '<button class="pildora" type="button" data-talla="' + esc(t) + '" aria-pressed="' +
          (filtro.talla === t ? "true" : "false") + '">' + esc(t) + "</button>";
      })).join("");
  }

  function filtrados() {
    var txt = sinTildes(filtro.texto).trim();
    var lista = PRODUCTOS.filter(function (p) {
      if (filtro.seccion && p._seccion !== filtro.seccion) return false;
      if (filtro.categoria && p._categoria !== filtro.categoria) return false;
      if (filtro.talla && stockTalla(p, filtro.talla) <= 0) return false;
      if (txt && p._busca.indexOf(txt) < 0) return false;
      return true;
    });
    var o = filtro.orden;
    if (o === "precio-asc") lista.sort(function (a, b) { return a.precio - b.precio; });
    else if (o === "precio-desc") lista.sort(function (a, b) { return b.precio - a.precio; });
    else if (o === "nombre") lista.sort(function (a, b) { return sinTildes(a.nombre).localeCompare(sinTildes(b.nombre)); });
    else lista.sort(function (a, b) {
      var s = (hayStock(b) ? 1 : 0) - (hayStock(a) ? 1 : 0);
      if (s) return s;
      return (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0);
    });
    return lista;
  }

  function tarjeta(p) {
    var et = etiquetaDe(p);
    var tallas = tallasDe(p);
    var dcto = descuento(p);
    return '<button class="tarjeta' + (hayStock(p) ? "" : " tarjeta--agotada") + '" type="button" data-ver="' + esc(p.id) + '">' +
      '<span class="tarjeta-foto">' +
        (et ? '<span class="cinta cinta--' + et.clase + '">' + esc(et.texto) + "</span>" : "") +
        '<img src="' + esc(fotoDe(p)) + '" alt="' + esc(p.nombre) + '" loading="lazy" width="400" height="300">' +
      "</span>" +
      '<span class="tarjeta-cuerpo">' +
        (p.marca ? '<span class="tarjeta-marca">' + esc(p.marca) + "</span>" : "") +
        '<span class="tarjeta-nombre">' + esc(p.nombre) + "</span>" +
        '<span class="tarjeta-precios"><span class="tarjeta-precio">' + plata(p.precio) + "</span>" +
          (dcto ? '<span class="tarjeta-antes">' + plata(p.precioAntes) + "</span>" : "") + "</span>" +
        (tallas.length
          ? '<span class="tarjeta-tallas">' + tallas.map(function (t) {
              return '<span class="talla-mini' + (stockTalla(p, t) > 0 ? "" : " talla-mini--no") + '">' + esc(t) + "</span>";
            }).join("") + "</span>"
          : '<span class="tarjeta-tallas"><span class="talla-mini">Talla única</span></span>') +
        '<span class="tarjeta-pie">' +
          '<span class="tarjeta-elegir">' + (hayStock(p) ? "Elegir talla" : "Consultar") +
            '<svg class="icono" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>' +
          ((p.colores || []).length
            ? '<span class="tarjeta-colores">' + p.colores.slice(0, 4).map(function (c) {
                return '<span class="punto-color" style="background:' + esc(c.hex) + '" title="' + esc(c.nombre) + '"></span>';
              }).join("") + "</span>"
            : "") +
        "</span>" +
      "</span></button>";
  }

  function pintarLista() {
    var caja = $("[data-lista]");
    if (!caja) return;
    var lista = filtrados();
    var cuenta = $("[data-cuenta]");
    if (cuenta) {
      cuenta.textContent = lista.length === 0 ? "" :
        lista.length + (lista.length === 1 ? " modelo" : " modelos") +
        (filtro.talla ? " con talla " + filtro.talla : "") +
        (filtro.texto ? ' para "' + filtro.texto + '"' : "");
    }
    if (!lista.length) {
      caja.innerHTML = '<div class="vacio"><b>No encontramos nada con eso</b>' +
        "<p>Prueba con otra palabra o quita el filtro de talla. También puedes escribirnos y lo buscamos.</p>" +
        '<a class="boton boton--wsp" data-wsp href="' + esc(enlaceWsp("Hola, busco un modelo que no veo en la página")) + '" target="_blank" rel="noopener">Preguntar por WhatsApp</a></div>';
      return;
    }
    caja.innerHTML = lista.map(tarjeta).join("");
  }

  function pintarCupones() {
    var caja = $("[data-cupones]");
    var sec = $("#cupones");
    if (!caja || !sec) return;
    var hoy = ahora().fecha;
    var lista = (C.cupones || []).filter(function (c) {
      if (!c || c.activo === false || c.visible === false) return false;
      if (c.desde && hoy < c.desde) return false;
      if (c.hasta && hoy > c.hasta) return false;
      return true;
    });
    if (!lista.length) { sec.setAttribute("hidden", ""); return; }
    sec.removeAttribute("hidden");
    caja.innerHTML = lista.map(function (c) {
      return '<li class="cupon"><span class="cupon-valor">' + (c.tipo === "monto" ? plata(c.valor) : c.valor + "%") + "</span>" +
        '<span class="cupon-datos"><span class="cupon-codigo">' + esc(c.codigo) + "</span>" +
        '<span class="cupon-detalle">' + esc(c.detalle || (c.minimo ? "Compra mínima " + plata(c.minimo) : "")) + "</span></span>" +
        '<button class="boton" type="button" data-usar-cupon="' + esc(c.codigo) + '">Usar cupón</button></li>';
    }).join("");
  }

  /* =======================================================================
     Ficha del producto
     ======================================================================= */
  var ficha = { producto: null, talla: "", color: "", cantidad: 1, error: false };

  function abrirFicha(id) {
    var p = PORID[id];
    if (!p) return;
    var tallas = tallasDe(p);
    var disponibles = tallas.filter(function (t) { return stockTalla(p, t) > 0; });
    ficha = {
      producto: p,
      talla: p.tallaUnica ? "única" : (disponibles.length === 1 ? disponibles[0] : ""),
      color: (p.colores || []).length ? p.colores[0].nombre : "",
      cantidad: 1,
      error: false
    };
    pintarFicha();
    var dlg = $("[data-ficha]");
    if (dlg && !dlg.open) dlg.showModal();
  }

  function pintarFicha() {
    var p = ficha.producto;
    if (!p) return;
    var cuerpo = $("[data-ficha-cuerpo]");
    var dcto = descuento(p);
    var tallas = tallasDe(p);
    var agotado = !hayStock(p);

    var html = '<div class="ficha-foto"><img src="' + esc(fotoDe(p)) + '" alt="' + esc(p.nombre) + '" width="400" height="300"></div>' +
      '<div class="ficha-texto">' +
        (p.marca ? '<span class="ficha-marca">' + esc(p.marca) + "</span>" : "") +
        '<h2 id="ficha-titulo">' + esc(p.nombre) + "</h2>" +
        '<div class="ficha-precios"><span class="ficha-precio">' + plata(p.precio) + "</span>" +
          (dcto ? '<span class="ficha-antes">' + plata(p.precioAntes) + '</span><span class="ficha-dcto">-' + dcto + "%</span>" : "") + "</div>" +
        (p.detalle ? '<p class="ficha-detalle">' + esc(p.detalle) + "</p>" : "") +
        (p.material ? '<p class="ficha-dato">Material: ' + esc(p.material) + "</p>" : "") +
      "</div>";

    if (agotado) {
      html += '<div class="grupo"><div class="grupo-titulo"><b>Sin stock por ahora</b></div>' +
        '<p class="nota-chica">Este modelo se nos acabó. Escríbenos y te avisamos apenas llegue, o te mostramos algo parecido.</p></div>';
    } else if (tallas.length) {
      html += '<div class="grupo"><div class="grupo-titulo"><b>Elige tu talla</b>' +
        (ficha.error && !ficha.talla ? '<span class="error">Falta elegir la talla</span>' : '<span><a href="#tallas" data-cerrar-ir>Ver guía de tallas</a></span>') +
        '</div><div class="opciones-tallas">' +
        tallas.map(function (t) {
          var s = stockTalla(p, t);
          return '<button class="talla" type="button" data-talla-op="' + esc(t) + '"' +
            (s > 0 ? "" : " disabled") + ' aria-pressed="' + (ficha.talla === t ? "true" : "false") + '">' + esc(t) +
            (s > 0 && s <= 2 ? "<small>queda" + (s === 1 ? " 1" : "n 2") + "</small>" : "") + "</button>";
        }).join("") + "</div></div>";
    }

    if (!agotado && (p.colores || []).length > 1) {
      html += '<div class="grupo"><div class="grupo-titulo"><b>Color</b></div><div class="opciones-colores">' +
        p.colores.map(function (c) {
          return '<button class="color-op" type="button" data-color-op="' + esc(c.nombre) + '" aria-pressed="' +
            (ficha.color === c.nombre ? "true" : "false") + '"><i style="background:' + esc(c.hex) + '"></i>' + esc(c.nombre) + "</button>";
        }).join("") + "</div></div>";
    }

    if (!agotado) {
      html += '<div class="grupo"><div class="grupo-titulo"><b>Cantidad</b></div>' +
        '<div class="cantidad"><button type="button" data-cant="-" aria-label="Quitar uno">−</button>' +
        "<span>" + ficha.cantidad + "</span>" +
        '<button type="button" data-cant="+" aria-label="Agregar uno">+</button></div></div>';
    }

    cuerpo.innerHTML = html;

    var boton = $("[data-confirmar]");
    if (agotado) {
      boton.textContent = "Consultar por WhatsApp";
      boton.className = "boton boton--grande boton--wsp";
    } else {
      boton.textContent = "Agregar a la bolsa · " + plata(p.precio * ficha.cantidad);
      boton.className = "boton boton--grande";
    }
  }

  function confirmarFicha() {
    var p = ficha.producto;
    if (!p) return;
    if (!hayStock(p)) {
      window.open(enlaceWsp("Hola, ¿tendrán de nuevo " + p.nombre + "?"), "_blank", "noopener");
      return;
    }
    if (!ficha.talla) {
      ficha.error = true;
      pintarFicha();
      var g = $(".opciones-tallas");
      if (g) g.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }
    agregar(p.id, ficha.talla, ficha.color, ficha.cantidad);
    var dlg = $("[data-ficha]");
    if (dlg && dlg.open) dlg.close();
  }

  /* =======================================================================
     Bolsa (carrito)
     ======================================================================= */
  var bolsa = leer(GUARDADO) || { lineas: [], entrega: "", cupon: "", nombre: "", direccion: "", comentario: "" };
  if (!Array.isArray(bolsa.lineas)) bolsa.lineas = [];

  function guardarBolsa() { guardar(GUARDADO, bolsa); }
  function claveLinea(id, talla, color) { return id + "|" + (talla || "") + "|" + (color || ""); }

  function topeStock(p, talla) {
    return p.tallaUnica ? stockTotal(p) : stockTalla(p, talla);
  }

  function agregar(id, talla, color, cantidad) {
    var p = PORID[id];
    if (!p || !hayStock(p)) return false;
    if (!talla) talla = p.tallaUnica ? "única" : "";
    if (!p.tallaUnica && (!talla || stockTalla(p, talla) <= 0)) return false;
    if (!color && (p.colores || []).length) color = p.colores[0].nombre;
    cantidad = Math.max(1, parseInt(cantidad, 10) || 1);

    var clave = claveLinea(id, talla, color);
    var linea = bolsa.lineas.filter(function (l) { return l.clave === clave; })[0];
    var tope = Math.max(1, topeStock(p, talla));
    if (linea) linea.cantidad = Math.min(tope, linea.cantidad + cantidad);
    else bolsa.lineas.push({ clave: clave, id: id, talla: talla, color: color, cantidad: Math.min(tope, cantidad) });

    guardarBolsa();
    actualizarBolsa();
    avisar(p.nombre + (p.tallaUnica ? "" : " talla " + talla) + " en tu bolsa ✓");
    return true;
  }

  function quitar(clave) {
    bolsa.lineas = bolsa.lineas.filter(function (l) { return l.clave !== clave; });
    guardarBolsa();
    actualizarBolsa();
    pintarPedido();
  }

  function cambiarCantidad(clave, delta) {
    var l = bolsa.lineas.filter(function (x) { return x.clave === clave; })[0];
    if (!l) return;
    var p = PORID[l.id];
    var tope = p ? Math.max(1, topeStock(p, l.talla)) : 9;
    l.cantidad = Math.min(tope, Math.max(1, l.cantidad + delta));
    guardarBolsa();
    actualizarBolsa();
    pintarPedido();
  }

  function lineasVivas() {
    return bolsa.lineas.filter(function (l) { return PORID[l.id]; });
  }
  function cuentaBolsa() {
    return lineasVivas().reduce(function (a, l) { return a + l.cantidad; }, 0);
  }
  function subtotal() {
    return lineasVivas().reduce(function (a, l) { return a + PORID[l.id].precio * l.cantidad; }, 0);
  }

  function entregaElegida() {
    var envios = N.envios || [];
    if (bolsa.entrega === "retiro" && N.retiroEnTienda) return { tipo: "retiro", nombre: "Retiro en la tienda", precio: 0 };
    var e = envios.filter(function (x) { return x.nombre === bolsa.entrega; })[0];
    if (e) return { tipo: "envio", nombre: e.nombre, precio: e.precio, detalle: e.detalle };
    return null;
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
    return { cupon: c };
  }

  function montoCupon() {
    if (!bolsa.cupon) return 0;
    var r = buscarCupon(bolsa.cupon);
    if (!r.cupon) return 0;
    var c = r.cupon;
    var m = c.tipo === "monto" ? c.valor : Math.round(subtotal() * c.valor / 100);
    if (c.tope) m = Math.min(m, c.tope);
    return Math.min(m, subtotal());
  }

  function costoEnvio() {
    var e = entregaElegida();
    if (!e || e.tipo === "retiro") return 0;
    if (N.envioGratisDesde && subtotal() - montoCupon() >= N.envioGratisDesde) return 0;
    return e.precio || 0;
  }

  function total() { return Math.max(0, subtotal() - montoCupon()) + costoEnvio(); }

  function actualizarBolsa() {
    var n = cuentaBolsa();
    $$("[data-contador]").forEach(function (el) { el.textContent = n; });
    var boton = $(".boton-pedido");
    if (boton) boton.setAttribute("aria-label", "Mi bolsa, " + n + (n === 1 ? " producto" : " productos"));
    var barra = $("[data-barra]");
    if (barra) {
      if (n > 0) barra.removeAttribute("hidden"); else barra.setAttribute("hidden", "");
      var t = $("[data-barra-total]");
      if (t) t.textContent = plata(total());
    }
  }

  var avisoTimer = null;
  function avisar(texto) {
    var el = $("[data-aviso]");
    if (!el) return;
    el.textContent = texto;
    el.setAttribute("data-visible", "");
    clearTimeout(avisoTimer);
    avisoTimer = setTimeout(function () { el.removeAttribute("data-visible"); }, 2600);
  }

  function pintarPedido() {
    var cuerpo = $("[data-pedido-cuerpo]");
    var pie = $("[data-pedido-pie]");
    if (!cuerpo || !pie) return;
    var lineas = lineasVivas();
    var cuenta = $("[data-pedido-cuenta]");
    if (cuenta) cuenta.textContent = lineas.length ? "(" + cuentaBolsa() + ")" : "";

    if (!lineas.length) {
      cuerpo.innerHTML = '<div class="pedido-vacio"><b>Tu bolsa está vacía</b><p>Elige un modelo del catálogo y su talla para empezar.</p></div>';
      pie.innerHTML = '<button class="boton boton--linea boton--bloque" type="button" data-cerrar>Ver el catálogo</button>';
      return;
    }

    var html = lineas.map(function (l) {
      var p = PORID[l.id];
      var detalles = [];
      if (!p.tallaUnica) detalles.push("Talla " + l.talla);
      if (l.color) detalles.push(l.color);
      return '<div class="linea-pedido">' +
        '<span class="linea-foto"><img src="' + esc(fotoDe(p)) + '" alt="" width="400" height="300"></span>' +
        '<span class="linea-datos"><b>' + esc(p.nombre) + "</b>" +
          (detalles.length ? "<span>" + esc(detalles.join(" · ")) + "</span>" : "") +
          '<span class="cantidad" style="margin-top:4px">' +
            '<button type="button" data-linea-menos="' + esc(l.clave) + '" aria-label="Quitar uno">−</button>' +
            "<span>" + l.cantidad + "</span>" +
            '<button type="button" data-linea-mas="' + esc(l.clave) + '" aria-label="Agregar uno">+</button>' +
          "</span>" +
        "</span>" +
        '<span class="linea-lado"><span class="linea-precio">' + plata(p.precio * l.cantidad) + "</span>" +
          '<button class="quitar" type="button" data-quitar="' + esc(l.clave) + '">Quitar</button></span>' +
        "</div>";
    }).join("");

    // Entrega
    var opciones = [];
    if (N.retiroEnTienda) {
      opciones.push({ valor: "retiro", nombre: "Retiro en la tienda", detalle: N.notaRetiro || [N.direccion, N.ciudad].filter(Boolean).join(", "), precio: 0 });
    }
    (N.envios || []).forEach(function (e) {
      opciones.push({ valor: e.nombre, nombre: "Despacho · " + e.nombre, detalle: e.detalle || "", precio: e.precio });
    });
    if (opciones.length) {
      var gratis = N.envioGratisDesde && subtotal() - montoCupon() >= N.envioGratisDesde;
      html += '<div class="bloque"><b>¿Cómo lo recibes?</b><div class="entregas">' +
        opciones.map(function (o) {
          var libre = o.precio === 0 || gratis;
          return '<button class="entrega" type="button" data-entrega="' + esc(o.valor) + '" aria-pressed="' +
            (bolsa.entrega === o.valor ? "true" : "false") + '">' +
            '<span class="entrega-marca"></span>' +
            '<span class="entrega-datos"><b>' + esc(o.nombre) + "</b>" + (o.detalle ? "<small>" + esc(o.detalle) + "</small>" : "") + "</span>" +
            '<span class="entrega-precio' + (libre ? " entrega-precio--gratis" : "") + '">' + (libre ? "Gratis" : plata(o.precio)) + "</span></button>";
        }).join("") + "</div>";
      if (N.envioGratisDesde && !gratis) {
        html += '<p class="nota-chica">Te faltan ' + plata(N.envioGratisDesde - (subtotal() - montoCupon())) + " para el despacho gratis.</p>";
      }
      html += "</div>";
    }

    // Datos
    html += '<div class="bloque"><b>Tus datos</b>' +
      '<div class="campo"><label for="c-nombre">Nombre</label><input id="c-nombre" type="text" data-campo="nombre" value="' + esc(bolsa.nombre) + '" placeholder="Tu nombre" autocomplete="name"></div>' +
      (bolsa.entrega && bolsa.entrega !== "retiro"
        ? '<div class="campo"><label for="c-dir">Dirección de despacho</label><input id="c-dir" type="text" data-campo="direccion" value="' + esc(bolsa.direccion) + '" placeholder="Calle, número, depto, comuna" autocomplete="street-address"></div>'
        : "") +
      '<div class="campo"><label for="c-com">Comentario (opcional)</label><textarea id="c-com" data-campo="comentario" placeholder="Ej: si no está la talla 38, avísenme la 39">' + esc(bolsa.comentario) + "</textarea></div>" +
      "</div>";

    // Cupón
    if ((C.cupones || []).length) {
      var r = bolsa.cupon ? buscarCupon(bolsa.cupon) : null;
      html += '<div class="bloque"><b>¿Tienes un cupón?</b>' +
        '<div class="cupon-fila"><input type="text" data-cupon-texto value="' + esc(bolsa.cupon) + '" placeholder="CÓDIGO" autocomplete="off">' +
        '<button class="boton" type="button" data-aplicar-cupon>' + (bolsa.cupon && r && r.cupon ? "Quitar" : "Aplicar") + "</button></div>" +
        (r ? '<p class="cupon-aviso ' + (r.cupon ? "cupon-aviso--ok" : "cupon-aviso--mal") + '">' +
          (r.cupon ? "Cupón " + esc(r.cupon.codigo) + " aplicado: −" + plata(montoCupon()) : esc(r.error)) + "</p>" : "") +
        "</div>";
    }

    // Totales
    var envio = costoEnvio();
    var e = entregaElegida();
    html += '<div class="totales">' +
      '<div class="total-fila"><span>Productos</span><span>' + plata(subtotal()) + "</span></div>" +
      (montoCupon() ? '<div class="total-fila total-fila--dcto"><span>Cupón ' + esc(bolsa.cupon.toUpperCase()) + "</span><span>−" + plata(montoCupon()) + "</span></div>" : "") +
      (e ? '<div class="total-fila"><span>' + esc(e.tipo === "retiro" ? "Retiro en tienda" : "Despacho") + "</span><span>" + (envio ? plata(envio) : "Gratis") + "</span></div>" : "") +
      '<div class="total-fila total-fila--grande"><span>Total</span><span>' + plata(total()) + "</span></div>" +
      "</div>";

    cuerpo.innerHTML = html;

    var falta = opciones.length && !bolsa.entrega;
    pie.innerHTML = '<button class="boton boton--wsp boton--grande boton--bloque" type="button" data-enviar>' +
      '<svg class="icono" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 19.5 5.6 16A8 8 0 1 1 8.4 18.6Z"/><path d="M9.2 8.6c.3 2.7 2.4 5 5.2 5.6l1.2-1.3-1.8-1-1 .7c-.9-.5-1.7-1.3-2.2-2.2l.7-1-1-1.8Z"/></svg>' +
      "Enviar pedido por WhatsApp</button>" +
      '<p class="nota-chica">' + (falta ? "Primero elige cómo lo recibes. " : "") +
      "Te confirmamos stock y total antes de que pagues. Nada se cobra desde la página.</p>";
  }

  function textoPedido() {
    var lineas = lineasVivas();
    if (!lineas.length) return "";
    var l = [];
    l.push("¡Hola " + (N.nombre || "") + "! Quiero hacer este pedido 👟");
    l.push("");
    lineas.forEach(function (x) {
      var p = PORID[x.id];
      var det = [];
      if (!p.tallaUnica) det.push("talla " + x.talla);
      if (x.color) det.push(x.color);
      l.push("• " + p.nombre + (det.length ? " (" + det.join(", ") + ")" : "") +
        " x" + x.cantidad + " — " + plata(p.precio * x.cantidad));
    });
    l.push("");
    l.push("Productos: " + plata(subtotal()));
    if (montoCupon()) l.push("Cupón " + bolsa.cupon.toUpperCase() + ": −" + plata(montoCupon()));
    var e = entregaElegida();
    if (e) {
      l.push((e.tipo === "retiro" ? "Retiro en la tienda" : "Despacho a " + e.nombre) + ": " + (costoEnvio() ? plata(costoEnvio()) : "gratis"));
    }
    l.push("TOTAL: " + plata(total()));
    l.push("");
    if (bolsa.nombre) l.push("Nombre: " + bolsa.nombre);
    if (e && e.tipo !== "retiro" && bolsa.direccion) l.push("Dirección: " + bolsa.direccion);
    if (bolsa.comentario) l.push("Comentario: " + bolsa.comentario);
    return l.join("\n");
  }

  function enviarPedido() {
    var lineas = lineasVivas();
    if (!lineas.length) return;
    var opciones = (N.retiroEnTienda ? 1 : 0) + (N.envios || []).length;
    if (opciones && !bolsa.entrega) {
      avisar("Elige cómo lo recibes 🙂");
      var caja = $(".entregas");
      if (caja) caja.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }
    window.open(enlaceWsp(textoPedido()), "_blank", "noopener");
  }

  /* =======================================================================
     Eventos
     ======================================================================= */
  function escuchar() {
    document.addEventListener("click", function (ev) {
      var el, t = ev.target;

      if ((el = t.closest("[data-ver]"))) { abrirFicha(el.getAttribute("data-ver")); return; }

      if ((el = t.closest("[data-seccion]"))) {
        filtro.seccion = el.getAttribute("data-seccion");
        filtro.categoria = "";
        $$("[data-seccion]").forEach(function (b) { b.setAttribute("aria-pressed", b === el ? "true" : "false"); });
        pintarCategorias(); pintarFiltroTallas(); pintarLista();
        return;
      }
      if ((el = t.closest("[data-categoria]"))) {
        filtro.categoria = el.getAttribute("data-categoria");
        $$("[data-categoria]").forEach(function (b) { b.setAttribute("aria-pressed", b === el ? "true" : "false"); });
        pintarFiltroTallas(); pintarLista();
        return;
      }
      if ((el = t.closest("[data-talla]"))) {
        filtro.talla = el.getAttribute("data-talla");
        $$("[data-talla]").forEach(function (b) { b.setAttribute("aria-pressed", b === el ? "true" : "false"); });
        pintarLista();
        return;
      }

      if ((el = t.closest("[data-talla-op]"))) {
        ficha.talla = el.getAttribute("data-talla-op");
        ficha.error = false;
        var p = ficha.producto;
        if (p) ficha.cantidad = Math.min(ficha.cantidad, Math.max(1, topeStock(p, ficha.talla)));
        pintarFicha();
        return;
      }
      if ((el = t.closest("[data-color-op]"))) { ficha.color = el.getAttribute("data-color-op"); pintarFicha(); return; }
      if ((el = t.closest("[data-cant]"))) {
        var tope = ficha.producto ? Math.max(1, topeStock(ficha.producto, ficha.talla)) : 9;
        ficha.cantidad = Math.min(tope, Math.max(1, ficha.cantidad + (el.getAttribute("data-cant") === "+" ? 1 : -1)));
        pintarFicha();
        return;
      }
      if (t.closest("[data-confirmar]")) { confirmarFicha(); return; }
      if ((el = t.closest("[data-cerrar-ir]"))) {
        var dlg = t.closest("dialog");
        if (dlg) dlg.close();
        return;   // el enlace #tallas sigue su camino
      }

      if ((el = t.closest("[data-abrir-pedido]"))) { abrirPedido(); return; }
      if ((el = t.closest("[data-quitar]"))) { quitar(el.getAttribute("data-quitar")); return; }
      if ((el = t.closest("[data-linea-mas]"))) { cambiarCantidad(el.getAttribute("data-linea-mas"), 1); return; }
      if ((el = t.closest("[data-linea-menos]"))) { cambiarCantidad(el.getAttribute("data-linea-menos"), -1); return; }
      if ((el = t.closest("[data-entrega]"))) {
        bolsa.entrega = el.getAttribute("data-entrega");
        guardarBolsa(); actualizarBolsa(); pintarPedido();
        return;
      }
      if (t.closest("[data-aplicar-cupon]")) {
        var campo = $("[data-cupon-texto]");
        var codigo = campo ? campo.value.trim() : "";
        if (bolsa.cupon && buscarCupon(bolsa.cupon).cupon) bolsa.cupon = "";
        else bolsa.cupon = codigo;
        guardarBolsa(); actualizarBolsa(); pintarPedido();
        return;
      }
      if ((el = t.closest("[data-usar-cupon]"))) {
        bolsa.cupon = el.getAttribute("data-usar-cupon");
        guardarBolsa();
        var r = buscarCupon(bolsa.cupon);
        avisar(r.cupon ? "Cupón " + bolsa.cupon + " listo para tu pedido 🎟️" : r.error);
        actualizarBolsa(); abrirPedido();
        return;
      }
      if (t.closest("[data-enviar]")) { enviarPedido(); return; }

      if ((el = t.closest("[data-cerrar]"))) {
        var d = el.closest("dialog");
        if (d) d.close();
        return;
      }
    });

    document.addEventListener("input", function (ev) {
      var el = ev.target;
      if (el.matches("[data-buscar]")) {
        filtro.texto = el.value;
        pintarLista();
      }
      if (el.matches("[data-campo]")) {
        bolsa[el.getAttribute("data-campo")] = el.value;
        guardarBolsa();
      }
    });

    document.addEventListener("change", function (ev) {
      if (ev.target.matches("[data-orden]")) {
        filtro.orden = ev.target.value;
        pintarLista();
      }
    });

    // Cerrar las ventanas tocando fuera de la caja
    $$("dialog").forEach(function (dlg) {
      dlg.addEventListener("click", function (ev) {
        if (ev.target === dlg) dlg.close();
      });
    });
  }

  function abrirPedido() {
    pintarPedido();
    var dlg = $("[data-pedido]");
    if (dlg && !dlg.open) dlg.showModal();
  }

  /* =======================================================================
     Arranque
     ======================================================================= */
  function iniciar() {
    rellenarFijos();
    pintarDestacados();
    pintarSecciones();
    pintarCategorias();
    pintarFiltroTallas();
    pintarCupones();
    pintarLista();
    actualizarBolsa();
    escuchar();
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
    foto: fotoDe,
    tallas: tallasDe,
    stockTalla: stockTalla,
    stockTotal: stockTotal,
    hayStock: hayStock,
    estaAbierto: estaAbierto,
    enlaceWsp: enlaceWsp,
    abrirFicha: abrirFicha,
    abrirPedido: abrirPedido,
    agregar: agregar,
    resumenBolsa: function () {
      return lineasVivas().map(function (l) {
        var p = PORID[l.id];
        return p.nombre + (p.tallaUnica ? "" : " talla " + l.talla) + (l.color ? " " + l.color : "") + " x" + l.cantidad;
      }).join("; ");
    },
    totalBolsa: total,
    buscar: function (texto, max) {
      // Palabras que no aportan a la búsqueda ("busco unas botas de mujer" → "botas mujer")
      var RELLENO = " busco buscar quiero querria necesito ver tienen tiene tienes hay para con por del las los una unos unas alguna algun algo que cual cuales como esta este estos estas mas muy son sobre entre sin desde hasta tengo quisiera dame muestra mostrar ";
      var q = sinTildes(texto).replace(/[¿?¡!.,;:]/g, " ").trim();
      if (!q) return [];
      var palabras = q.split(/\s+/).filter(function (w) {
        return w.length > 2 && RELLENO.indexOf(" " + w + " ") < 0;
      });
      if (!palabras.length) return [];
      var puntuados = PRODUCTOS.map(function (p) {
        var n = 0;
        palabras.forEach(function (w) {
          var corta = w.length > 4 ? w.slice(0, -1) : w;              // plural: "botas" → "bota"
          if (p._nombre.indexOf(w) >= 0 || p._nombre.indexOf(corta) >= 0) n += 3;   // el nombre pesa más
          else if (p._busca.indexOf(w) >= 0 || p._busca.indexOf(corta) >= 0) n++;
        });
        return { p: p, n: n, stock: hayStock(p) ? 1 : 0 };
      }).filter(function (x) { return x.n > 0; });
      puntuados.sort(function (a, b) { return (b.n - a.n) || (b.stock - a.stock); });
      return puntuados.slice(0, max || 4).map(function (x) { return x.p; });
    }
  };
})();
