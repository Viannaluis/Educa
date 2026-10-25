#!/usr/bin/env bash
# Compila o projeto (Java 17+) em ./out
set -euo pipefail
cd "$(dirname "$0")"
rm -rf out && mkdir out
javac -Xlint:all -d out $(find src/main -name '*.java')
echo "Compilado em ./out"
