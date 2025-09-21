#! /bin/bash

set -euo pipefail

cd "$(dirname "$0")/.." # projectRoot

if [ -n "$(git status --porcelain)" ]; then
  echo "Error: git should be clean at the start of this script."
  git --no-pager diff
  exit 1
fi

set -x
npm clean-install
npm run build
npm run lint
npm run test:ci
set +x

if [ -n "$(git status --porcelain)" ]; then
  echo "Error: git should be clean at the end of this script."
  git --no-pager diff
  exit 1
fi

echo ""
echo "All tests passed."