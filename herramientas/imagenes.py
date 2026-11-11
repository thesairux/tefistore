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
        # Contorno suave: con colores muy claros (blanco, nude) hace falta para que se vea la silueta
        "borde": mezclar(color, "#000000", 0.30) if claro else color,
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
  <path d="M88 232 V64 C88 54 96 48 108 48 H168 C180 48 188 54 188 64 V152 C200 172 224 186 258 194 C296 203 322 210 334 218 C342 223 341 230 332 232 Z" fill="{p['cuerpo']}"/>
  <path d="M188 152 C200 172 224 186 258 194 C296 203 322 210 334 218 C342 223 341 230 332 232 H206 C204 206 198 176 188 152 Z" fill="{p['alto']}" opacity=".40"/>
  <path d="M88 48 H188 V70 H88 Z" fill="{p['alto']}" opacity=".60"/>
  <path d="M88 70 H188 V78 H88 Z" fill="{p['sombra']}"/>
  <path d="M88 232 V78 H112 V232 Z" fill="{p['sombra']}" opacity=".35"/>
  <g stroke="{p['detalle']}" stroke-width="4.5" stroke-linecap="round" opacity=".85" fill="none">
    <path d="M118 102 H164"/><path d="M118 126 H164"/><path d="M118 150 H164"/><path d="M118 174 H164"/>
  </g>
  <path d="M82 230 H336 C346 230 350 236 347 242 C344 247 334 250 320 250 H96 C86 250 80 244 80 238 C80 233 78 230 82 230 Z" fill="{p['suela']}"/>
  <path d="M84 246 H146 C150 246 152 249 152 252 C152 255 150 256 146 256 H90 C83 256 80 253 80 250 C80 247 80 246 84 246 Z" fill="{p['suela']}"/>
'''


def taco(p):
    return f'''
  <path d="M106 148 C104 122 124 110 142 128 C158 144 172 166 196 186 C226 210 274 226 326 234 C340 236 346 240 344 244 L250 246 C206 242 172 230 148 214 C130 202 120 192 116 182 C108 170 105 160 106 148 Z" fill="{p['cuerpo']}"/>
  <path d="M232 212 C266 226 300 232 326 234 C340 236 346 240 344 244 L250 246 C226 244 206 240 190 234 Z" fill="{p['alto']}" opacity=".45"/>
  <path d="M106 148 C105 164 109 176 116 186 C108 180 102 168 101 156 C100 148 102 142 106 148 Z" fill="{p['sombra']}"/>
  <path d="M148 214 C172 230 206 242 250 246 L250 240 C210 236 176 226 152 210 Z" fill="{p['suela']}"/>
  <path d="M116 182 L146 206 L158 252 H132 Z" fill="{p['cuerpo']}"/>
  <path d="M134 196 L146 206 L158 252 H146 Z" fill="{p['sombra']}"/>
  <path d="M128 246 H164 C169 246 172 248 172 251 C172 254 169 255 164 255 H128 C123 255 121 254 121 251 C121 248 123 246 128 246 Z" fill="{p['suela']}"/>
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


def _bajo(p, detalle):
    """Base de los zapatos bajos: oxford, mocasín y balerina comparten la silueta."""
    return f'''
  <path d="M104 236 V192 C104 179 115 170 132 170 C148 170 159 179 165 193 C177 209 201 218 240 223 C282 228 310 230 324 233 C332 235 332 239 324 240 H108 Z" fill="{p['cuerpo']}"/>
  <path d="M165 193 C177 209 201 218 240 223 C282 228 310 230 324 233 C332 235 332 239 324 240 H214 C210 220 192 202 165 193 Z" fill="{p['alto']}" opacity=".38"/>
  <path d="M104 236 V192 C104 180 113 172 127 170 C117 184 113 210 114 236 Z" fill="{p['sombra']}"/>
  <path d="M132 170 C150 170 162 182 170 198 C154 186 134 183 116 187 C118 176 122 170 132 170 Z" fill="{p['sombra']}" opacity=".55"/>
{detalle}  <path d="M98 238 H330 C340 238 344 243 341 247 C338 251 328 253 314 253 H110 C100 253 96 249 96 245 C96 241 94 238 98 238 Z" fill="{p['suela']}"/>
  <path d="M100 250 H152 C156 250 158 253 158 256 C158 259 156 260 152 260 H106 C99 260 96 257 96 254 C96 251 96 250 100 250 Z" fill="{p['suela']}"/>
'''


def oxford(p):
    return _bajo(p, f'''  <path d="M166 196 C186 190 210 192 228 202 L224 214 C208 206 186 204 170 208 Z" fill="{p['sombra']}" opacity=".75"/>
  <g stroke="{p['detalle']}" stroke-width="4" stroke-linecap="round" opacity=".9" fill="none">
    <path d="M150 196 L172 202"/><path d="M146 207 L168 213"/>
  </g>
''')


def mocasin(p):
    return _bajo(p, f'''  <path d="M158 194 C186 189 216 196 236 210 L231 222 C211 210 185 206 163 210 Z" fill="{p['detalle']}" opacity=".85"/>
  <path d="M186 198 L190 215" stroke="{p['sombra']}" stroke-width="3" opacity=".5"/>
''')


def balerina(p):
    return _bajo(p, f'''  <path d="M150 192 C170 200 196 208 228 213 L226 221 C192 217 164 208 146 199 Z" fill="{p['sombra']}" opacity=".55"/>
  <path d="M198 196 c-8 -8 -20 -6 -20 3 0 7 9 9 15 5 6 4 15 2 15 -5 0 -9 -12 -11 -20 -3 Z" fill="{p['detalle']}" opacity=".9"/>
''')


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
    "sandalia": sandalia, "mocasin": mocasin, "oxford": oxford, "balerina": balerina, "accesorio": accesorio,
    "caja": caja, "frasco": frasco, "cordon": cordon,
}


def svg(forma, color, titulo):
    """Dibujo de catálogo: fondo blanco y sombra suave, para que combine con las fotos reales."""
    p = paleta(color)
    cuerpo = FORMAS.get(forma, zapatilla)(p)
    seguro = (titulo or "").replace("&", "y").replace("<", "").replace(">", "")
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" role="img" aria-label="{seguro}">
  <title>{seguro}</title>
  <defs>
    <radialGradient id="s" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#000" stop-opacity=".18"/>
      <stop offset="1" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="400" height="300" fill="#ffffff"/>
  <ellipse cx="204" cy="264" rx="148" ry="18" fill="url(#s)"/>
  <g stroke="{p['borde']}" stroke-width="1" stroke-linejoin="round">
{cuerpo}  </g>
</svg>
'''


def main():
    cat = leer_catalogo()
    SALIDA.mkdir(parents=True, exist_ok=True)
    hechos = 0
    for c in cat.get("categorias", []):
        for pr in c.get("productos", []):
            for foto in pr.get("fotos") or []:
                if not foto.endswith(".svg"):
                    continue          # las fotos reales no se tocan
                colores = pr.get("colores") or []
                color = colores[0]["hex"] if colores else "#8d8aa6"
                destino = RAIZ / foto
                destino.parent.mkdir(parents=True, exist_ok=True)
                destino.write_text(svg(pr.get("forma", "zapatilla"), color, pr.get("nombre", "")), encoding="utf-8")
                hechos += 1
    print(f"Listo: {hechos} dibujos en {SALIDA.relative_to(RAIZ)}/")


if __name__ == "__main__":
    main()
