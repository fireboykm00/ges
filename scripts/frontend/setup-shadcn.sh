#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../../frontend"

# Install shadcn/ui and components
pnpm dlx shadcn@latest init -y || true
pnpm dlx shadcn@latest add button input label card table navigation-menu toast separator badge avatar form dropdown-menu select tabs textarea sheet dialog alert alert-dialog tooltip skeleton pagination toast switch checkbox radio-group breadcrumb accordion calendar popover progress toast || true
