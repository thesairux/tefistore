#!/usr/bin/env python3
"""
Dibujos de ejemplo para el catálogo (img/catalogo/*.svg).

Lee catalogo.js y crea un dibujo por producto, con la forma ("forma") y el primer color
de cada modelo. Son dibujos de relleno: cuando tengas las fotos reales de la tienda,
guárdalas en img/catalogo/ y cambia la ruta de "foto" en catalogo.js.

Uso:  python3 herramientas/imagenes.py
"""
import json
import pathlib
import re

RAIZ = pathlib.Path(__file__).resolve().parent.parent
SALIDA = RAIZ / "img" / "catalogo"


def leer_catalogo():
    txt = (RAIZ / "catalogo.js").read_text(encoding="utf-8")
    ini = txt.index("{", txt.index("window.CATALOGO"))
    return json.loads(txt[ini:txt.rindex("}") + 1])


def rgb(hx):
    hx = hx.lstrip("#")
    return tuple(int(hx[i:i + 2], 16) for i in (0, 2, 4))


def hexa(c):
    return "#%02x%02x%02x" % tuple(max(0, min(255, round(v))) for v in c)


def mezclar(a, b, t):
    return hexa([x + (y - x) * t for x, y in zip(rgb(a), rgb(b))])


def luz(hx):
    r, g, b = rgb(hx)
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255


def paleta(color):
    """Del color del modelo saca los tonos del dibujo: cuerpo, sombra, suela y detalle."""
    claro = luz(color) > 0.72
    return {
        "cuerpo": color,
        "alto": mezclar(color, "#ffffff", 0.30 if not claro else 0.55),
        "sombra": mezclar(color, "#000000", 0.22 if not claro else 0.10),
        "suela": mezclar(color, "#000000", 0.55) if not claro else "#3c3b45",
        "detalle": "#ffffff" if not claro else "#3c3b45",
        # Con colores muy claros (blanco, nude) el fondo se tiñe de gris para que la silueta se vea
        "fondo1": mezclar(color, "#ffffff", 0.86) if not claro else "#eae7ef",
        "fondo2": mezclar(color, "#ffffff", 0.70) if not claro else "#d5d0de",
    }


# Cada forma devuelve el dibujo (sin fondo). Lienzo de 400 x 300, suelo en y = 252.
def zapatilla(p):
    return f'''
  <path d="M52 214 C46 176 52 142 70 126 C80 117 93 120 97 133 C101 146 110 153 126 159 L151 128 C159 118 171 118 179 128 C197 150 215 167 241 179 C281 197 322 203 352 207 C362 208 364 212 358 214 Z" fill="{p['cuerpo']}"/>
  <path d="M179 128 C197 150 215 167 241 179 C281 197 322 203 352 207 C362 208 364 212 358 214 H214 C206 186 194 152 179 128 Z" fill="{p['alto']}" opacity=".45"/>
  <path d="M52 214 C46 176 52 142 70 126 C80 117 93 120 97 133 C86 148 80 176 82 214 Z" fill="{p['sombra']}"/>
  <g stroke="{p['detalle']}" stroke-width="5" stroke-linecap="round" opacity=".9" fill="none">
    <path d="M139 150 L166 142"/><path d="M152 168 L180 160"/><path d="M166 186 L194 178"/>
  </g>
  <path d="M120 212 C156 202 196 186 230 164 L242 182 C208 204 166 220 126 230 Z" fill="{p['detalle']}" opacity=".85"/>
  <path d="M300 200 C322 203 342 205 356 208 C362 209 363 212 358 214 H300 Z" fill="{p['alto']}" opacity=".8"/>
  <path d="M46 210 H360 C372 210 378 220 374 230 C370 240 356 246 338 246 H80 C56 246 44 238 42 228 C40 218 40 210 46 210 Z" fill="{p['suela']}"/>
  <path d="M50 226 H370" stroke="{p['cuerpo']}" stroke-width="3" opacity=".35"/>
'''


def bota(p):
    return f'''
  <path d="M72 212 V80 C72 66 82 58 98 58 H146 C160 58 170 66 170 80 V148 C186 168 210 181 244 189 C290 199 330 203 352 207 C360 208 360 212 352 214 H74 Z" fill="{p['cuerpo']}"/>
  <path d="M170 148 C186 168 210 181 244 189 C290 199 330 203 352 207 C360 208 360 212 352 214 H206 C202 190 190 166 170 148 Z" fill="{p['alto']}" opacity=".45"/>
  <path d="M72 58 H170 V80 H72 Z" fill="{p['alto']}" opacity=".65"/>
  <path d="M72 80 H170 V88 H72 Z" fill="{p['sombra']}"/>
  <path d="M72 212 V80 H100 V212 Z" fill="{p['sombra']}" opacity=".45"/>
  <g stroke="{p['detalle']}" stroke-width="4.5" stroke-linecap="round" opacity=".8" fill="none">
    <path d="M106 112 H156"/><path d="M106 134 H156"/><path d="M106 156 H156"/><path d="M106 178 H156"/>
  </g>
  <path d="M60 210 H358 C370 210 376 219 372 228 C368 237 354 242 336 242 H76 C62 242 56 236 56 228 C56 220 54 210 60 210 Z" fill="{p['suela']}"/>
  <path d="M62 240 H134 C140 240 142 244 142 248 C142 251 139 252 134 252 H70 C62 252 58 249 58 245 C58 242 58 240 62 240 Z" fill="{p['suela']}"/>
'''


def taco(p):
    return f'''
  <path d="M106 136 C132 148 152 164 178 184 C216 212 274 232 340 243 C352 245 358 248 356 251 L248 252 C204 250 174 242 148 226 C132 214 122 206 119 196 C105 180 101 158 106 136 Z" fill="{p['cuerpo']}"/>
  <path d="M232 216 C270 231 308 239 340 243 C352 245 358 248 356 251 L248 252 C228 251 212 249 198 246 Z" fill="{p['alto']}" opacity=".5"/>
  <path d="M106 136 C104 158 109 178 119 196 C112 190 104 176 101 160 C99 148 101 140 106 136 Z" fill="{p['sombra']}"/>
  <path d="M148 226 C174 242 204 250 248 252 L248 246 C206 244 176 236 152 222 Z" fill="{p['suela']}"/>
  <path d="M119 196 L146 214 L157 252 H132 Z" fill="{p['cuerpo']}"/>
  <path d="M136 206 L146 214 L157 252 H146 Z" fill="{p['sombra']}"/>
  <path d="M128 246 H162 C167 246 169 248 169 250 C169 252 167 253 162 253 H128 C123 253 121 252 121 250 C121 248 123 246 128 246 Z" fill="{p['suela']}"/>
'''


def sandalia(p):
    return f'''
  <path d="M132 214 C142 180 174 160 212 162 C250 164 274 186 280 214 L256 214 C250 194 234 182 211 181 C186 180 166 194 157 214 Z" fill="{p['cuerpo']}"/>
  <path d="M212 162 C250 164 274 186 280 214 L256 214 C250 194 234 182 211 181 Z" fill="{p['alto']}" opacity=".5"/>
  <path d="M286 214 C286 198 296 188 312 188 L314 206 C306 206 303 209 303 214 Z" fill="{p['cuerpo']}"/>
  <path d="M102 214 C96 186 104 164 124 154 L134 172 C122 180 116 194 120 214 Z" fill="{p['cuerpo']}"/>
  <path d="M118 152 H142 C147 152 149 156 149 160 C149 165 147 167 142 167 H118 C113 167 111 165 111 160 C111 156 113 152 118 152 Z" fill="{p['sombra']}"/>
  <path d="M64 214 H340 C354 214 360 222 356 231 C352 240 338 246 320 246 H90 C68 246 58 238 56 229 C54 220 56 214 64 214 Z" fill="{p['suela']}"/>
  <path d="M70 216 H336 C344 216 348 220 348 226 C348 232 342 236 334 236 H80 C70 236 66 231 66 225 C66 220 66 216 70 216 Z" fill="{p['cuerpo']}" opacity=".92"/>
'''


def mocasin(p):
    return f'''
  <path d="M58 212 C54 180 70 154 104 146 C128 140 148 148 166 162 L192 182 C210 194 238 200 274 204 C318 209 342 208 354 211 C360 213 358 216 352 216 H60 Z" fill="{p['cuerpo']}"/>
  <path d="M192 182 C210 194 238 200 274 204 C318 209 342 208 354 211 C360 213 358 216 352 216 H216 C214 202 204 190 192 182 Z" fill="{p['alto']}" opacity=".45"/>
  <path d="M58 212 C54 180 70 154 104 146 C96 164 90 188 90 212 Z" fill="{p['sombra']}"/>
  <path d="M112 152 C138 146 160 156 180 174 C156 166 130 166 108 176 Z" fill="{p['sombra']}" opacity=".8"/>
  <path d="M148 176 C176 170 206 176 226 190 L220 204 C200 192 174 188 152 194 Z" fill="{p['detalle']}" opacity=".9"/>
  <path d="M50 212 H358 C370 212 376 221 372 230 C368 239 354 244 336 244 H78 C56 244 46 237 44 228 C42 219 44 212 50 212 Z" fill="{p['suela']}"/>
  <path d="M52 242 H120 C126 242 128 246 128 249 C128 251 126 252 120 252 H62 C54 252 50 249 50 246 C50 243 48 242 52 242 Z" fill="{p['suela']}"/>
'''


def accesorio(p):
    return f'''
  <path d="M136 116 C136 88 156 70 182 70 C208 70 228 88 228 116" fill="none" stroke="{p['cuerpo']}" stroke-width="12" stroke-linecap="round"/>
  <path d="M100 112 H298 C308 112 316 120 317 130 L330 234 C332 246 323 256 311 256 H115 C103 256 94 246 96 234 L100 112 Z" fill="{p['cuerpo']}"/>
  <path d="M240 112 H298 C308 112 316 120 317 130 L330 234 C332 246 323 256 311 256 H252 Z" fill="{p['sombra']}" opacity=".45"/>
  <path d="M98 144 H326" stroke="{p['alto']}" stroke-width="10" opacity=".7"/>
  <circle cx="213" cy="196" r="25" fill="none" stroke="{p['detalle']}" stroke-width="8" opacity=".85"/>
'''


def caja(p):
    return f'''
  <path d="M74 118 L200 86 L326 118 L326 134 L200 166 L74 134 Z" fill="{p['alto']}"/>
  <path d="M74 134 L200 166 L200 252 L74 220 Z" fill="{p['cuerpo']}"/>
  <path d="M326 134 L200 166 L200 252 L326 220 Z" fill="{p['sombra']}"/>
  <path d="M74 118 L200 86 L326 118 L200 150 Z" fill="{p['cuerpo']}"/>
  <path d="M152 168 L248 144 L248 164 L152 188 Z" fill="{p['detalle']}" opacity=".85"/>
'''


def frasco(p):
    return f'''
  <path d="M166 74 H234 C240 74 244 79 244 85 V104 H156 V85 C156 79 160 74 166 74 Z" fill="{p['sombra']}"/>
  <path d="M142 104 H258 C272 104 282 115 282 128 V226 C282 240 272 250 258 250 H142 C128 250 118 240 118 226 V128 C118 115 128 104 142 104 Z" fill="{p['cuerpo']}"/>
  <path d="M212 104 H258 C272 104 282 115 282 128 V226 C282 240 272 250 258 250 H212 Z" fill="{p['sombra']}" opacity=".45"/>
  <rect x="140" y="140" width="120" height="66" rx="10" fill="{p['detalle']}" opacity=".9"/>
  <path d="M140 122 H260" stroke="{p['alto']}" stroke-width="8" opacity=".7"/>
'''


def cordon(p):
    return f'''
  <path d="M120 230 C60 196 90 112 160 118 C214 122 226 182 180 196 C140 208 124 170 150 152" fill="none" stroke="{p['cuerpo']}" stroke-width="16" stroke-linecap="round"/>
  <path d="M232 92 C300 92 336 148 310 196 C290 232 240 240 208 216" fill="none" stroke="{p['cuerpo']}" stroke-width="16" stroke-linecap="round"/>
  <path d="M150 152 C168 140 196 136 214 148" fill="none" stroke="{p['alto']}" stroke-width="14" stroke-linecap="round"/>
  <rect x="100" y="216" width="34" height="18" rx="8" transform="rotate(16 117 225)" fill="{p['sombra']}"/>
  <rect x="196" y="206" width="34" height="18" rx="8" transform="rotate(-12 213 215)" fill="{p['sombra']}"/>
'''


FORMAS = {
    "zapatilla": zapatilla, "bota": bota, "taco": taco,
    "sandalia": sandalia, "mocasin": mocasin, "accesorio": accesorio,
    "caja": caja, "frasco": frasco, "cordon": cordon,
}


def svg(forma, color, titulo):
    p = paleta(color)
    cuerpo = FORMAS.get(forma, zapatilla)(p)
    seguro = (titulo or "").replace("&", "y").replace("<", "").replace(">", "")
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" role="img" aria-label="{seguro}">
  <title>{seguro}</title>
  <defs>
    <linearGradient id="f" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="{p['fondo1']}"/>
      <stop offset="1" stop-color="{p['fondo2']}"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#f)"/>
  <ellipse cx="206" cy="262" rx="150" ry="16" fill="#000" opacity=".10"/>
{cuerpo}</svg>
'''


def main():
    cat = leer_catalogo()
    SALIDA.mkdir(parents=True, exist_ok=True)
    hechos = 0
    for sec in cat.get("secciones", []):
        for c in sec.get("categorias", []):
            for pr in c.get("productos", []):
                foto = pr.get("foto") or ""
                if not foto.endswith(".svg"):
                    continue
                colores = pr.get("colores") or []
                color = colores[0]["hex"] if colores else "#8d8aa6"
                destino = RAIZ / foto
                destino.parent.mkdir(parents=True, exist_ok=True)
                destino.write_text(svg(pr.get("forma", "zapatilla"), color, pr.get("nombre", "")), encoding="utf-8")
                hechos += 1
    print(f"Listo: {hechos} dibujos en {SALIDA.relative_to(RAIZ)}/")


if __name__ == "__main__":
    main()
