#!/usr/bin/env bash
#
# Construit un bundle prêt pour la production de l'API leads (server/)
# dans deploy/api-bundle/.
#
# Ensuite : téléverse le CONTENU de deploy/api-bundle/ à la racine de ton
# application Node.js Hostinger (dist/, node_modules/, package.json, data/),
# puis redémarre l'app (hPanel → Node.js → Restart).
#
# Usage :  bash deploy/build-api-bundle.sh
#
set -euo pipefail

cd "$(dirname "$0")/.."
ROOT="$(pwd)"
OUT="$ROOT/deploy/api-bundle"

echo "==> Nettoyage de $OUT"
rm -rf "$OUT"
mkdir -p "$OUT/dist" "$OUT/data"

echo "==> Installation des dépendances de server/"
npm --prefix server ci

echo "==> Compilation TypeScript (server/ -> server/dist)"
npm --prefix server run build

echo "==> Assemblage du bundle"
cp -r "$ROOT/server/dist/." "$OUT/dist/"
cp "$ROOT/server/package.json" "$OUT/"
cp "$ROOT/server/package-lock.json" "$OUT/"
touch "$OUT/data/.gitkeep"

echo "==> Installation des dépendances de production DANS le bundle"
( cd "$OUT" && npm install --omit=dev --no-audit --no-fund )

echo
echo "-------------------------------------------------------------------"
echo " Bundle prêt : $OUT"
echo
echo " Contenu à téléverser à la racine de l'app Hostinger :"
ls -1 "$OUT"
echo
echo " Rappels :"
echo "  - NE PAS téléverser de fichier .env (les variables se mettent"
echo "    dans hPanel → Node.js → Environment variables)."
echo "  - Le dossier data/ doit rester accessible en écriture."
echo "  - Après upload : hPanel → Node.js → Restart  (ou  touch tmp/restart.txt)"
echo "-------------------------------------------------------------------"
