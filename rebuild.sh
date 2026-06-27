#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")/source"
npm install
npm run build
cp -R dist/* ../
echo "Production site rebuilt at repository root."
