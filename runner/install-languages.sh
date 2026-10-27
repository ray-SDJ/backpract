#!/usr/bin/env bash
# Installs the language runtimes BackPract sends to Piston. Versions must match
# LANGUAGE_MAP in lib/piston.ts. Usage: ./install-languages.sh [piston-url]
set -euo pipefail

PISTON_URL="${1:-http://localhost:2000}"

# Piston package name / version (C# runs on mono; gcc provides C and C++)
PACKAGES=(
  "java 15.0.2"
  "mono 6.12.0"
  "go 1.16.2"
  "rust 1.68.2"
  "gcc 10.2.0"
)

for package in "${PACKAGES[@]}"; do
  read -r language version <<<"$package"
  echo "Installing $language $version..."
  curl -fsS -X POST "$PISTON_URL/api/v2/packages" \
    -H "Content-Type: application/json" \
    -d "{\"language\":\"$language\",\"version\":\"$version\"}"
  echo
done

echo "Installed runtimes:"
curl -fsS "$PISTON_URL/api/v2/runtimes"
echo
