#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../../"

mkdir -p frontend/public/api
cp -f docs/api/openapi.yaml frontend/public/api/openapi.yaml

echo "[+] Copied docs/api/openapi.yaml -> frontend/public/api/openapi.yaml"