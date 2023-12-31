#!/bin/bash
set -e -o pipefail
REPO_ROOT=$(cd "$(dirname "$0")/.." && pwd)

# can set from environment
SCRATCH_GUI=${SCRATCH_GUI:-"$REPO_ROOT/scratch-gui"}
SCRATCH_VM=${SCRATCH_VM:-"$REPO_ROOT/scratch-vm"}
# check scratch-gui and scratch-vm
if [[ ! -d $SCRATCH_GUI ]] || [[ ! -d $SCRATCH_VM ]]; then
  [[ ! -d $SCRATCH_GUI ]] && echo "SCRATCH_GUI is not directory: $SCRATCH_GUI" >&2
  [[ ! -d $SCRATCH_VM ]] && echo "SCRATCH_VM is not directory: $SCRATCH_VM" >&2
  echo "Please first run 'npm run setup-scratch'" >&2
  exit 1
fi

# build options
ENTRY="$REPO_ROOT/src/entry"
BLOCK="$REPO_ROOT/src/block"
OUTPUT="$REPO_ROOT/dist"
# get extensionId
EXTENSION_ID=$(grep -m1 extensionId "$ENTRY"/index.jsx | perl -pe's/.*extensionId\W?\s*:\s*(\W)(\w+)\1.*/$2/')

npx --yes xcratch-build \
  --module="$EXTENSION_ID" \
  --gui="$SCRATCH_GUI" \
  --vm="$SCRATCH_VM" \
  --entry="$ENTRY" \
  --block="$BLOCK" \
  --output="$OUTPUT"
