#!/bin/bash

echo "=========================================="
echo "GES Frontend Server"
echo "=========================================="
echo ""

cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    pnpm install
fi

echo "Starting frontend development server..."
echo "=========================================="
echo ""

pnpm dev
