#!/bin/bash
set -e -o pipefail
REPO_ROOT=$(cd "$(dirname "$0")/.." && pwd)

# can set from environment
SCRATCH_GUI=${SCRATCH_GUI:-"$REPO_ROOT/scratch-gui"}
SCRATCH_VM=${SCRATCH_VM:-"$REPO_ROOT/scratch-vm"}

# setup scratch-gui and scratch-vm
if [[ ! -d $SCRATCH_GUI ]]; then
  #SCRATCH_GUI_REPO=https://github.com/llk/scratch-gui.git
  SCRATCH_GUI_REPO=https://github.com/scratchfoundation/scratch-gui
  git clone --depth 1 "$SCRATCH_GUI_REPO" "$SCRATCH_GUI"
fi &
if [[ ! -d $SCRATCH_VM ]]; then
  #SCRATCH_VM_REPO=https://github.com/llk/scratch-vm.git
  SCRATCH_VM_REPO=https://github.com/scratchfoundation/scratch-vm
  git clone --depth 1 "$SCRATCH_VM_REPO" "$SCRATCH_VM"
fi &
wait

# prevent node_modules from leaking into the parent directory
mkdir -p "$SCRATCH_GUI/node_modules"
mkdir -p "$SCRATCH_VM/node_modules"

# npm install and link
if [[ ! -d "$SCRATCH_GUI/node_modules/scratch-vm" ]]; then
  # npm install
  (cd "$SCRATCH_GUI" && npm install) &
  (cd "$SCRATCH_VM" && npm install) &
  wait
  # npm link
  (cd "$SCRATCH_VM" && npm link) && 
  (cd "$SCRATCH_GUI" && npm link scratch-vm)
fi

