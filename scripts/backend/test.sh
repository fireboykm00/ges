#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../../backend"

# Run tests with H2 profile
mvn -Dspring.profiles.active=test test
