/*
  Analítica de la tienda: cuenta visitas, clics y pedidos por día.

  NO guarda nada de la persona: ni IP, ni nombre, ni teléfono, ni qué compró
  cada una. Solo contadores por día y cuántas veces se vio o se agregó cada
  modelo. Con eso se arman las estadísticas del panel.

  Necesita una base de datos D1 de Cloudflare conectada como «DB». Sin ella la
  página funciona igual: no se cuenta nada y el panel explica cómo activarla.
  Los pasos están en el README.
*/
import { json, ipDe, leerJson, limitador, mismoSitio } from "../../lib/comun.js";

const ZONA = "America/Santiago";
/* Lo que se puede contar. Cualquier otra cosa se ignora. */
const TIPOS = ["visita", "wsp", "asistente", "ver", "agregar", "abrir", "enviar"];
const COLUMNAS = ["visita", "wsp", "asistente", "agregar", "abrir", "enviar"];
const MAX_INGRESO = 90000000;
/* Un visitante no puede inflar los números: 60 eventos cada 10 minutos */
const permitido = limitador(10 * 60 * 1000, 60);

export function hoy() {
  const x = {};
  new Intl.DateTimeFormat("en-CA", { timeZone: ZONA, year: "numeric", month: "2-digit", day: "2-digit" })
    .formatToParts(new Date()).forEach(p => { x[p.type] = p.value; });
  return `${x.year}-${x.month}-${x.day}`;
}

export function hayBase(env) {
  return !!(env && env.DB && typeof env.DB.prepare === "function");
}

let preparada = false;
async function preparar(db) {
  if (preparada) return;
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS dias (
      fecha TEXT PRIMARY KEY, visita INTEGER DEFAULT 0, wsp INTEGER DEFAULT 0,
      asistente INTEGER DEFAULT 0, agregar INTEGER DEFAULT 0, abrir INTEGER DEFAULT 0,
      enviar INTEGER DEFAULT 0, ingresos INTEGER DEFAULT 0)`),
    db.prepare(`CREATE TABLE IF NOT EXISTS modelos (
      fecha TEXT, id TEXT, ver INTEGER DEFAULT 0, agr INTEGER DEFAULT 0,
      PRIMARY KEY (fecha, id))`)
  ]);
  preparada = true;
}

/* ---------- anotar un evento (lo llama la página) ---------- */
export async function anotar(env, tipo, id, monto) {
  if (!hayBase(env) || TIPOS.indexOf(tipo) < 0) return;
  const db = env.DB;
  await preparar(db);
  const f = hoy();
  const ordenes = [];

  if (tipo === "ver" || tipo === "agregar") {
    const col = tipo === "ver" ? "ver" : "agr";
    // se acepta solo lo que se parece a un id de producto; cualquier otra cosa
    // se descarta entera, para que la lista no se llene de basura
    const limpio = String(id || "");
    if (/^[a-z0-9][a-z0-9-]{1,48}$/.test(limpio)) {
      ordenes.push(db.prepare(
        `INSERT INTO modelos (fecha, id, ${col}) VALUES (?1, ?2, 1)
         ON CONFLICT(fecha, id) DO UPDATE SET ${col} = ${col} + 1`
      ).bind(f, limpio));
    }
  }
  if (COLUMNAS.indexOf(tipo) >= 0) {
    ordenes.push(db.prepare(
      `INSERT INTO dias (fecha, ${tipo}) VALUES (?1, 1)
       ON CONFLICT(fecha) DO UPDATE SET ${tipo} = ${tipo} + 1`
    ).bind(f));
  }
  if (tipo === "enviar") {
    const plata = Math.max(0, Math.min(MAX_INGRESO, Math.round(Number(monto) || 0)));
    if (plata) {
      ordenes.push(db.prepare(
        `INSERT INTO dias (fecha, ingresos) VALUES (?1, ?2)
         ON CONFLICT(fecha) DO UPDATE SET ingresos = ingresos + ?2`
      ).bind(f, plata));
    }
  }
  if (ordenes.length) await db.batch(ordenes);
}

/* ---------- leer el resumen (lo llama el panel, ya autenticado) ---------- */
export async function resumen(env, dias) {
  if (!hayBase(env)) return { configurado: false };
  const db = env.DB;
  await preparar(db);
  const n = Math.max(1, Math.min(365, Math.round(Number(dias) || 30)));
  const desde = new Date(Date.now() - (n - 1) * 86400000).toISOString().slice(0, 10);

  const [porDia, verMas, agrMas] = await Promise.all([
    db.prepare("SELECT * FROM dias WHERE fecha >= ?1 ORDER BY fecha").bind(desde).all(),
    db.prepare("SELECT id, SUM(ver) AS n FROM modelos WHERE fecha >= ?1 GROUP BY id HAVING n > 0 ORDER BY n DESC LIMIT 8").bind(desde).all(),
    db.prepare("SELECT id, SUM(agr) AS n FROM modelos WHERE fecha >= ?1 GROUP BY id HAVING n > 0 ORDER BY n DESC LIMIT 8").bind(desde).all()
  ]);

  // se rellenan los días sin movimiento, para que el gráfico no tenga huecos
  const mapa = {};
  (porDia.results || []).forEach(r => { mapa[r.fecha] = r; });
  const lista = [];
  for (let i = n - 1; i >= 0; i--) {
    const f = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    const r = mapa[f] || {};
    lista.push({
      fecha: f,
      visita: r.visita || 0, wsp: r.wsp || 0, asistente: r.asistente || 0,
      agregar: r.agregar || 0, abrir: r.abrir || 0, enviar: r.enviar || 0,
      ingresos: r.ingresos || 0
    });
  }
  return {
    configurado: true,
    dias: lista,
    ver: (verMas.results || []).map(r => ({ id: r.id, n: r.n })),
    agr: (agrMas.results || []).map(r => ({ id: r.id, n: r.n }))
  };
}

/* ---------- la página manda los eventos aquí ---------- */
export async function onRequestPost({ request, env }) {
  if (!mismoSitio(request)) return json(403, { error: "origen" });
  if (!hayBase(env)) return json(200, { ok: true, contado: false });
  if (!permitido(ipDe(request))) return json(429, { error: "limite" });
  let body;
  try { body = await leerJson(request, 2000); } catch (e) { return json(400, { error: "datos" }); }
  const eventos = Array.isArray(body && body.eventos) ? body.eventos.slice(0, 10) : [];
  try {
    for (const e of eventos) await anotar(env, e && e.tipo, e && e.id, e && e.monto);
  } catch (err) {
    console.error("estadisticas:", err.message);
    return json(200, { ok: true, contado: false });   // nunca molestar al cliente
  }
  return json(200, { ok: true, contado: true });
}

export async function onRequestGet({ env }) {
  return json(200, { ok: true, base: hayBase(env) ? "conectada" : "FALTA (la analítica está apagada)" });
}
