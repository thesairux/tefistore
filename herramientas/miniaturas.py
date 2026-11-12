"""Crea la copia de 700 px de cada foto del catálogo (nombre-700.webp).

Esa copia es la que baja el navegador en las tarjetas chicas: pesa un cuarto y
el catálogo carga mucho más rápido. Correr desde la raíz del repositorio:

    python3 herramientas/miniaturas.py
"""
import pathlib

from PIL import Image

CARPETA = pathlib.Path(__file__).resolve().parent.parent / "img" / "catalogo"
ANCHO = 700


def main():
    hechas = 0
    for f in sorted(CARPETA.glob("*.webp")):
        if f.stem.endswith("-700"):
            continue
        destino = f.with_name(f.stem + "-700.webp")
        if destino.exists() and destino.stat().st_mtime >= f.stat().st_mtime:
            continue
        im = Image.open(f)
        if im.width <= ANCHO:
            continue
        im.resize((ANCHO, round(ANCHO * im.height / im.width)), Image.LANCZOS).save(
            destino, quality=82, method=6)
        hechas += 1
        print("hecha:", destino.name)
    print("listo:", hechas, "copias nuevas")


if __name__ == "__main__":
    main()
