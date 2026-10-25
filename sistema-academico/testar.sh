#!/usr/bin/env bash
# Compila (inclusive os testes) e executa o teste de integração
set -euo pipefail
cd "$(dirname "$0")"
rm -rf out-test && mkdir out-test
javac -Xlint:all -d out-test $(find src -name '*.java')
java -cp out-test br.edu.escola.TesteIntegracao
