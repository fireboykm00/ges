#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../../backend"
exec mvn -DskipTests spring-boot:run
