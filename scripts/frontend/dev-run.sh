#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../../frontend"
exec pnpm dev
