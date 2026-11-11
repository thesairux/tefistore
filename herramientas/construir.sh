#!/bin/sh
# Arma la carpeta dist/ con lo que se publica (Cloudflare Pages o Vercel).
# En Cloudflare: Build command «sh herramientas/construir.sh» y Build output directory «dist».
# Solo se copian los archivos de la página: los servidores (functions/ y lib/), las herramientas
# y el README no quedan a la vista de nadie.
set -e
rm -rf dist
mkdir -p dist
cp index.html catalogo.js favicon.svg robots.txt _headers site.webmanifest dist/
cp -r css js img dist/
echo "Listo: dist/ ($(find dist -type f | wc -l | tr -d ' ') archivos)"
