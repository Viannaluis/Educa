#!/usr/bin/env bash
# Compila e sobe a API (porta 8080 ou variável PORT)
set -euo pipefail
cd "$(dirname "$0")"
./build.sh
exec java -cp out br.edu.escola.Main "$@"
