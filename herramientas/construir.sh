#!/bin/sh
# Arma la carpeta dist/ con lo que se publica (Cloudflare Pages o Vercel).
# En Cloudflare: Build command «sh herramientas/construir.sh» y Build output directory «dist».
# Solo se copian los archivos de la página: los servidores (functions/ y lib/), las herramientas
# y el README no quedan a la vista de nadie.
set -e
rm -rf dist
mkdir -p dist
cp index.html admin.html catalogo.js favicon.svg robots.txt _headers site.webmanifest dist/
if [ -d fotos ]; then cp -r fotos dist/; fi
cp -r css js img dist/

# Los navegadores guardan el CSS y el JS por un día. Para que un cambio se vea al tiro,
# a cada archivo se le pega una marca que cambia con su contenido: así la dirección es
# distinta y el navegador lo baja de nuevo, sin perder la ventaja de la caché.
marca() { md5sum "$1" 2>/dev/null | cut -c1-8 || cksum "$1" | cut -d' ' -f1; }
for archivo in css/estilos.css js/tema.js js/app.js js/asistente.js catalogo.js; do
  [ -f "dist/$archivo" ] || continue
  v=$(marca "dist/$archivo")
  for pagina in dist/index.html dist/admin.html; do
    [ -f "$pagina" ] || continue
    sed -i "s|\"$archivo\"|\"$archivo?v=$v\"|g" "$pagina"
  done
done

echo "Listo: dist/ ($(find dist -type f | wc -l | tr -d ' ') archivos)"
