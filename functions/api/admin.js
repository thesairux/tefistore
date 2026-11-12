/*
  Panel de administración: recibe los cambios del panel y los guarda en GitHub.

  Se configura en las variables del proyecto (Cloudflare: Settings → Variables and Secrets;
  Vercel: Settings → Environment Variables):
    ADMIN_PASSWORD  (obligatoria, como «Secret») contraseña del panel, de 12 caracteres o más.
                    No hay contraseña de fábrica: sin ella el panel no deja entrar a nadie.
    GITHUB_TOKEN    (obligatoria, como «Secret») clave de GitHub con permiso "Contents: Read and write"
                    sobre el repositorio de la página. Nunca se envía al navegador.
    GITHUB_REPO     "usuario/repositorio" (obligatoria en Cloudflare; en Vercel se deduce sola).
    ADMIN_USER      (opcional) usuario del panel. Si no existe: tefistore
    GITHUB_BRANCH   (opcional) rama donde se guardan los cambios. Si no existe: la publicada, o main

  El panel se abre en tu-pagina/admin y guarda catalogo.js. Las fotos que subas quedan en fotos/.
*/
import { json, sleep, ipDe, mismoSitio, leerJson, aBase64, deBase64, igualSeguro, limitador } from "../../lib/comun.js";
import { resumen as resumenEstadisticas } from "./estadisticas.js";

let ENV = {};

const USUARIO_POR_DEFECTO = "tefistore";
const ARCHIVO = "catalogo.js";
const MIN_CLAVE = 12;
const MAX_FOTO = 3.5 * 1024 * 1024;
const MAX_ARCHIVO = 900 * 1024;      // la API de GitHub entrega el archivo completo solo bajo 1 MB
const RUTA_FOTO = /^(img\/catalogo\/[\w.-]+\.(webp|jpg|png)|img\/[\w.-]+\.(webp|jpg|png)|fotos\/[a-z0-9-]{3,48}\.jpg)$/;
const FOTO_SUBIDA = /^fotos\/[a-z0-9-]{3,48}\.jpg$/;

const CABECERA = `/*
  CATÁLOGO DE TEFI STORE
  ======================
  Lo más fácil es editarlo desde el panel: tu-pagina/admin
  También se puede editar aquí: los precios van sin punto ni signo (22990), las tallas como
  "35-40" o { "35": 2, "36": 4 }, y cada elemento de una lista va separado por una coma.
  La explicación completa está en el README del repositorio.
*/
`;

/* ---------- entrar ---------- */
function usuarioEsperado() { return (ENV.ADMIN_USER || USUARIO_POR_DEFECTO).trim().toLowerCase(); }
function clavesOk(usuario, clave) {
  if (typeof usuario !== "string" || typeof clave !== "string" || !usuario || !clave) return false;
  const u = igualSeguro(usuario.trim().toLowerCase(), usuarioEsperado());
  const c = igualSeguro(clave, ENV.ADMIN_PASSWORD || "");
  return u && c && !!ENV.ADMIN_PASSWORD;
}

/* ---------- GitHub ---------- */
function token() { return (ENV.GITHUB_TOKEN || "").trim(); }
function repo() {
  let full = (ENV.GITHUB_REPO || "").trim();
  if (!full && ENV.VERCEL_GIT_REPO_OWNER && ENV.VERCEL_GIT_REPO_SLUG) {
    full = ENV.VERCEL_GIT_REPO_OWNER + "/" + ENV.VERCEL_GIT_REPO_SLUG;
  }
  const branch = (ENV.GITHUB_BRANCH || ENV.CF_PAGES_BRANCH || ENV.VERCEL_GIT_COMMIT_REF || "main").trim();
  return { full, branch };
}
async function gh(ruta, opts = {}) {
  const r = repo();
  const res = await fetch(`https://api.github.com/repos/${r.full}${ruta}`, {
    method: opts.method || "GET",
    headers: {
      Authorization: `Bearer ${token()}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "panel-tefistore",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(opts.body ? { "Content-Type": "application/json" } : {})
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined
  });
  if (!res.ok) {
    const e = new Error("GitHub " + res.status);
    e.status = res.status;
    try {
      const d = await res.json();
      e.detalle = [d && d.message, (d && d.errors || []).map(x => x.message || x.code).join("; ")]
        .filter(Boolean).join(" — ").slice(0, 300);
    } catch (x) { /* sin detalle */ }
    throw e;
  }
  return res.status === 204 ? null : res.json();
}

function deCliente(codigo, estado) { return Object.assign(new Error(codigo), { cliente: codigo, estado: estado || 400 }); }

/* catalogo.js trae un comentario arriba y después "window.CATALOGO = { … };" */
const sinProto = (k, v) => (k === "__proto__" ? undefined : v);
async function leerPublicado() {
  let f;
  try {
    f = await gh(`/contents/${ARCHIVO}?ref=${encodeURIComponent(repo().branch)}`);
  } catch (e) {
    if (e.status === 404) return null;
    throw e;
  }
  if (!f || f.encoding !== "base64" || !f.content) throw deCliente("catalogo");
  try {
    const txt = deBase64(f.content);
    const ini = txt.indexOf("{", txt.indexOf("window.CATALOGO"));
    const datos = JSON.parse(txt.slice(ini, txt.lastIndexOf("}") + 1), sinProto);
    if (!datos || typeof datos !== "object" || Array.isArray(datos)) throw new Error("catalogo");
    return { datos, version: f.sha };
  } catch (e) {
    throw deCliente("catalogo");
  }
}

async function subirFoto(datos) {
  if (typeof datos !== "string") throw deCliente("foto");
  let inicio = "";
  try { inicio = atob(datos.slice(0, 8)); } catch (e) { inicio = ""; }
  const esJpeg = inicio.charCodeAt(0) === 0xff && inicio.charCodeAt(1) === 0xd8 && inicio.charCodeAt(2) === 0xff;
  const largo = Math.floor(datos.length * 3 / 4);
  if (!esJpeg || largo > MAX_FOTO) throw deCliente("foto");
  const blob = await gh("/git/blobs", { method: "POST", body: { content: datos, encoding: "base64" } });
  return blob.sha;
}

/* ---------- limpieza de lo que llega del panel ---------- */
const texto = (v, max) => (typeof v === "string" ? v.replace(/\r/g, "").slice(0, max || 400) : "");
const entero = (v, min, max) => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : 0;
};
const lista = v => (Array.isArray(v) ? v : []);
const bool = v => v === true;

function limpiarTallas(t) {
  if (typeof t === "string") {
    const s = t.trim();
    return /^\d{2}\s*(?:-|a|al)\s*\d{2}$/.test(s) || /^[\d\s,;]+$/.test(s) ? s.slice(0, 60) : "";
  }
  if (t && typeof t === "object" && !Array.isArray(t)) {
    const o = {};
    Object.keys(t).slice(0, 40).forEach(k => {
      if (/^\d{1,2}(\.5)?$/.test(k)) o[k] = t[k] === null ? null : entero(t[k], 0, 999);
    });
    return o;
  }
  return "";
}

function limpiarProducto(p) {
  if (!p || typeof p !== "object") return null;
  const id = texto(p.id, 60).toLowerCase().replace(/[^a-z0-9-]/g, "");
  if (!id) return null;
  const o = {
    id,
    nombre: texto(p.nombre, 90),
    precio: entero(p.precio, 0, 90000000),
    fotos: lista(p.fotos).map(f => texto(f, 160)).filter(f => RUTA_FOTO.test(f)).slice(0, 6),
    detalle: texto(p.detalle, 400),
    descripcion: texto(p.descripcion, 1200),
    material: texto(p.material, 120),
    cuidados: texto(p.cuidados, 400),
    nota: texto(p.nota, 200),
    colores: lista(p.colores).slice(0, 8).map(c => {
      const o = {
        nombre: texto(c && c.nombre, 40),
        hex: /^#[0-9a-fA-F]{6}$/.test(c && c.hex) ? c.hex : "#888888"
      };
      // cada color puede llevar su propio stock por talla
      if (c && c.tallas != null) {
        const tl = limpiarTallas(c.tallas);
        if (tl && (typeof tl !== "object" || Object.keys(tl).length)) o.tallas = tl;
      }
      return o;
    }).filter(c => c.nombre),
    etiquetas: lista(p.etiquetas).map(e => texto(e, 20)).filter(e => ["nuevo", "oferta", "ultimos"].includes(e)).slice(0, 2),
    tallas: limpiarTallas(p.tallas)
  };
  if (p.precioAntes) o.precioAntes = entero(p.precioAntes, 0, 90000000);
  if (bool(p.destacado)) o.destacado = true;
  if (p.disponible === false) o.disponible = false;
  if (bool(p.tallaUnica)) { o.tallaUnica = true; o.stock = entero(p.stock, 0, 9999); }
  if (!o.nombre || !o.precio) return null;
  return o;
}

function limpiarCatalogo(d) {
  if (!d || typeof d !== "object" || Array.isArray(d) || !Array.isArray(d.categorias)) throw deCliente("datos");
  const N = d.negocio && typeof d.negocio === "object" ? d.negocio : {};
  const limpio = {
    negocio: {
      nombre: texto(N.nombre, 60),
      rubro: texto(N.rubro, 60),
      whatsapp: texto(N.whatsapp, 20).replace(/\D/g, ""),
      whatsappVisible: texto(N.whatsappVisible, 30),
      instagram: texto(N.instagram, 40).replace(/[^\w.]/g, ""),
      facebook: texto(N.facebook, 200),
      correo: texto(N.correo, 120),
      direccion: texto(N.direccion, 160),
      sector: texto(N.sector, 60),
      ciudad: texto(N.ciudad, 60),
      region: texto(N.region, 60),
      mapa: texto(N.mapa, 400),
      mapaBusqueda: texto(N.mapaBusqueda, 200),
      retiroEnTienda: bool(N.retiroEnTienda),
      nombreRetiro: texto(N.nombreRetiro, 60),
      notaRetiro: texto(N.notaRetiro, 200),
      retiroComuna: texto(N.retiroComuna, 60),
      envioPorPagar: bool(N.envioPorPagar),
      envioGratisDesde: entero(N.envioGratisDesde, 0, 90000000),
      envios: lista(N.envios).slice(0, 12).map(e => {
        const z = { nombre: texto(e && e.nombre, 60), detalle: texto(e && e.detalle, 120) };
        if (e && e.precio) z.precio = entero(e.precio, 0, 900000);
        if (lista(e && e.comunas).length) z.comunas = lista(e.comunas).slice(0, 60).map(c => texto(c, 60)).filter(Boolean);
        if (lista(e && e.regiones).length) z.regiones = lista(e.regiones).slice(0, 20).map(c => texto(c, 60)).filter(Boolean);
        return z;
      }).filter(z => z.nombre),
      pagos: lista(N.pagos).slice(0, 10).map(p => texto(p, 60)).filter(Boolean),
      cambios: texto(N.cambios, 300),
      garantia: texto(N.garantia, 300),
      politicas: lista(N.politicas).slice(0, 12).map(p => ({
        titulo: texto(p && p.titulo, 60), texto: texto(p && p.texto, 400)
      })).filter(p => p.texto)
    },
    tema: {
      color: /^#[0-9a-fA-F]{6}$/.test(d.tema && d.tema.color) ? d.tema.color : "#6a1138",
      colorDestacado: /^#[0-9a-fA-F]{6}$/.test(d.tema && d.tema.colorDestacado) ? d.tema.colorDestacado : "#b98a3e"
    },
    anuncio: lista(d.anuncio).slice(0, 4).map(a => texto(a, 80)).filter(Boolean),
    horario: null,
    horarioConfirmado: false,
    diasCerrados: [],
    portada: lista(d.portada).slice(0, 6).map(s => ({
      titulo: texto(s && s.titulo, 80),
      bajada: texto(s && s.bajada, 200),
      foto: RUTA_FOTO.test(texto(s && s.foto, 160)) ? texto(s.foto, 160) : "",
      boton: texto(s && s.boton, 40),
      enlace: texto(s && s.enlace, 80)
    })).filter(s => s.titulo),
    temporada: d.temporada && typeof d.temporada === "object" ? {
      etiqueta: texto(d.temporada.etiqueta, 40),
      titulo: texto(d.temporada.titulo, 60),
      bajada: texto(d.temporada.bajada, 240),
      foto: RUTA_FOTO.test(texto(d.temporada.foto, 160)) ? texto(d.temporada.foto, 160) : "",
      boton: texto(d.temporada.boton, 40),
      enlace: texto(d.temporada.enlace, 80)
    } : {},
    textos: {},
    pasos: lista(d.pasos).slice(0, 4).map(p => ({
      icono: texto(p && p.icono, 20),
      titulo: texto(p && p.titulo, 60),
      texto: texto(p && p.texto, 300)
    })).filter(p => p.titulo),
    regiones: lista(d.regiones).slice(0, 30).map(r => texto(r, 60)).filter(Boolean),
    guiaTallas: lista(d.guiaTallas).slice(0, 20).map(g => ({
      talla: texto(g && g.talla, 6), cm: texto(g && g.cm, 8), us: texto(g && g.us, 8)
    })).filter(g => g.talla),
    cupones: lista(d.cupones).slice(0, 12).map(c => {
      const o = {
        codigo: texto(c && c.codigo, 24).toUpperCase().replace(/[^A-Z0-9]/g, ""),
        tipo: ["porcentaje", "monto", "envio"].includes(c && c.tipo) ? c.tipo : "porcentaje",
        valor: entero(c && c.valor, 0, 900000),
        detalle: texto(c && c.detalle, 120),
        activo: c ? c.activo !== false : true,
        visible: c ? c.visible !== false : true
      };
      if (c && c.minimo) o.minimo = entero(c.minimo, 0, 90000000);
      if (c && c.tope) o.tope = entero(c.tope, 0, 90000000);
      if (c && c.desde) o.desde = texto(c.desde, 10);
      if (c && c.hasta) o.hasta = texto(c.hasta, 10);
      return o;
    }).filter(c => c.codigo),
    // cuántos segundos dura cada imagen de la portada
    portadaSegundos: Math.min(20, Math.max(2, entero(d.portadaSegundos, 2, 20) || 4)),
    categorias: lista(d.categorias).slice(0, 20).map(c => ({
      id: texto(c && c.id, 40).toLowerCase().replace(/[^a-z0-9-]/g, ""),
      nombre: texto(c && c.nombre, 40),
      foto: RUTA_FOTO.test(texto(c && c.foto, 160)) ? texto(c.foto, 160) : "",
      productos: lista(c && c.productos).slice(0, 120).map(limpiarProducto).filter(Boolean)
    })).filter(c => c.id && c.nombre)
  };
  // los textos de cada sección se conservan tal cual (son cortos y los edita el panel)
  const T = d.textos && typeof d.textos === "object" ? d.textos : {};
  Object.keys(T).slice(0, 12).forEach(k => {
    const v = T[k];
    if (v && typeof v === "object" && !Array.isArray(v)) {
      limpio.textos[texto(k, 24)] = {
        titulo: texto(v.titulo, 80), bajada: texto(v.bajada, 300), destacado: texto(v.destacado, 60)
      };
    }
  });
  if (!limpio.categorias.length) throw deCliente("datos");
  const ids = new Set();
  limpio.categorias.forEach(c => c.productos.forEach(p => {
    while (ids.has(p.id)) p.id += "-2";
    ids.add(p.id);
  }));
  return limpio;
}

/* Fotos subidas desde el panel que el catálogo usa */
function fotosUsadas(d) {
  const usadas = new Set();
  const ver = f => { if (typeof f === "string" && f.startsWith("fotos/")) usadas.add(f); };
  (d.categorias || []).forEach(c => {
    ver(c.foto);
    (c.productos || []).forEach(p => (p.fotos || []).forEach(ver));
  });
  (d.portada || []).forEach(s => ver(s.foto));
  if (d.temporada) ver(d.temporada.foto);
  return usadas;
}

async function publicar(datos, fotos, versionQueTenia) {
  const limpio = limpiarCatalogo(datos);
  const cuerpo = CABECERA + "window.CATALOGO = " + JSON.stringify(limpio, null, 2) + ";\n";
  if (new TextEncoder().encode(cuerpo).length > MAX_ARCHIVO) throw deCliente("grande");
  const nuevas = lista(fotos).filter(f =>
    f && typeof f.path === "string" && FOTO_SUBIDA.test(f.path) && typeof f.sha === "string" && /^[0-9a-f]{40}$/.test(f.sha));
  const usadas = fotosUsadas(limpio);
  const rama = encodeURIComponent(repo().branch);

  // ¿cambió el catálogo desde que el panel lo cargó? Mejor avisar que pisarlo.
  if (versionQueTenia) {
    const ahora = await leerPublicado();
    if (ahora && ahora.version && ahora.version !== versionQueTenia) throw deCliente("desactualizado", 409);
  }

  // Si alguien empuja al repositorio justo en el medio, GitHub rechaza el
  // cambio; se vuelve a intentar con la rama ya movida.
  const ESPERAS = [0, 400, 900, 1800];
  for (let intento = 0; intento < ESPERAS.length; intento++) {
    if (ESPERAS[intento]) await sleep(ESPERAS[intento]);
    try {
      const ref = await gh(`/git/ref/heads/${rama}`);
      const shaCabeza = ref.object.sha;
      const cabeza = await gh(`/git/commits/${shaCabeza}`);
      const entradas = nuevas.filter(f => usadas.has(f.path)).map(f => ({ path: f.path, mode: "100644", type: "blob", sha: f.sha }));
      const blob = await gh("/git/blobs", { method: "POST", body: { content: aBase64(cuerpo), encoding: "base64" } });
      entradas.push({ path: ARCHIVO, mode: "100644", type: "blob", sha: blob.sha });
      // fotos subidas desde el panel que ya no usa el catálogo: se borran del repositorio
      const arbol = await gh(`/git/trees/${cabeza.tree.sha}?recursive=1`);
      (arbol.tree || []).forEach(t => {
        if (t.type === "blob" && t.path.startsWith("fotos/") && !usadas.has(t.path)) {
          entradas.push({ path: t.path, mode: "100644", type: "blob", sha: null });
        }
      });
      const nuevoArbol = await gh("/git/trees", { method: "POST", body: { base_tree: cabeza.tree.sha, tree: entradas } });
      const commit = await gh("/git/commits", {
        method: "POST",
        body: { message: "Cambios desde el panel de la tienda", tree: nuevoArbol.sha, parents: [shaCabeza] }
      });
      await gh(`/git/refs/heads/${rama}`, { method: "PATCH", body: { sha: commit.sha } });
      const pub = await leerPublicado();
      return pub && pub.version;
    } catch (e) {
      const choque = e.status === 409 || e.status === 422 || e.status >= 500;
      if (intento < ESPERAS.length - 1 && choque) continue;   // la rama cambió: se reintenta
      throw e;
    }
  }
}

/* ---------- límite de intentos ---------- */
const permitido = limitador(15 * 60 * 1000, 40);

function estado() {
  const r = repo();
  return {
    ok: true,
    clave: ENV.ADMIN_PASSWORD ? (ENV.ADMIN_PASSWORD.length >= MIN_CLAVE ? "configurada" : "DEMASIADO CORTA (mínimo 12)") : "FALTA",
    github: token() ? "configurado" : "FALTA",
    repositorio: r.full || "FALTA",
    rama: r.branch,
    usuario: usuarioEsperado()
  };
}

/* Qué significa cada respuesta de GitHub, en algo que se pueda accionar */
function porQueFallo(estado) {
  if (estado === 401) return "token-malo";
  if (estado === 403) return "token-sin-permiso";
  if (estado === 404) return "repo-no-encontrado";
  if (estado === 409 || estado === 422) return "conflicto";
  if (estado >= 500) return "github-caido";
  return "github";
}

/* Revisa el token sin escribir nada: que el repositorio exista, que el token
   pueda empujar cambios y que la rama esté donde se espera. */
async function probarGitHub() {
  const r = repo();
  const out = { repositorio: r.full, rama: r.branch };
  try {
    const info = await gh("");
    out.repoEncontrado = true;
    out.ramaPorOmision = info.default_branch;
    // OJO: info.permissions.push es el rol de la CUENTA en el repositorio, no
    // lo que el token tiene permitido. Un token de solo lectura igual lo ve
    // como true, así que no sirve para saber si se podrá guardar.
    out.cuentaEsDuena = !!(info.permissions && info.permissions.push);
  } catch (e) {
    out.repoEncontrado = false;
    out.puedeEscribir = false;
    out.falla = porQueFallo(e.status);
    out.codigo = e.status || 0;
    out.github = e.detalle || "";
    return out;
  }
  try {
    await gh(`/git/ref/heads/${encodeURIComponent(r.branch)}`);
    out.ramaEncontrada = true;
  } catch (e) {
    out.ramaEncontrada = false;
    out.github = e.detalle || "";
  }
  // Escritura de verdad: se crea un objeto suelto, sin commit ni rama que lo
  // apunte. No aparece en el historial y GitHub lo borra solo.
  try {
    await gh("/git/blobs", { method: "POST", body: { content: "prueba", encoding: "utf-8" } });
    out.puedeEscribir = true;
  } catch (e) {
    out.puedeEscribir = false;
    out.falla = porQueFallo(e.status);
    out.codigo = e.status || 0;
    out.github = e.detalle || "";
    out.aviso = e.status === 403
      ? "el token lee el repositorio pero no puede escribir: dale «Contents: Read and write» en GitHub"
      : "no se pudo comprobar la escritura";
  }
  return out;
}

export async function onRequest({ request, env }) {
  ENV = env || {};
  if (request.method === "GET") {
    const base = estado();
    if (new URL(request.url).searchParams.get("probar") !== "1" || !token() || !repo().full) return json(200, base);
    return json(200, Object.assign(base, { prueba: await probarGitHub() }));
  }
  if (request.method !== "POST") return json(405, { error: "metodo" });
  if (!mismoSitio(request)) return json(403, { error: "origen" });
  if (!/^application\/json\b/i.test(request.headers.get("Content-Type") || "")) return json(415, { error: "tipo" });
  if (!permitido(ipDe(request))) return json(429, { error: "limite" });

  let body;
  try { body = await leerJson(request, 8 * 1024 * 1024); } catch (e) { return json(400, { error: "datos" }); }
  body = body || {};

  if (!ENV.ADMIN_PASSWORD) return json(500, { error: "sin-clave" });
  if (ENV.ADMIN_PASSWORD.length < MIN_CLAVE) return json(500, { error: "clave-corta" });

  if (!clavesOk(body.usuario, body.clave)) {
    await sleep(1200);
    return json(401, { error: "acceso" });
  }
  if (!token() || !repo().full) return json(500, { error: "config" });

  try {
    if (body.accion === "entrar") {
      const pub = await leerPublicado();
      return json(200, { ok: true, catalogo: pub && pub.datos, version: pub && pub.version });
    }
    if (body.accion === "foto") return json(200, { ok: true, sha: await subirFoto(body.datos) });
    if (body.accion === "estadisticas") return json(200, await resumenEstadisticas(env, body.dias));
    if (body.accion === "publicar") {
      const version = await publicar(body.catalogo, body.fotos, body.version);
      return json(200, { ok: true, version });
    }
    return json(400, { error: "accion" });
  } catch (e) {
    if (e.cliente) return json(e.estado || 400, { error: e.cliente });
    console.error("admin:", e.message, e.detalle || "");
    return json(502, { error: porQueFallo(e.status), status: e.status || 0, github: e.detalle || "" });
  }
}
