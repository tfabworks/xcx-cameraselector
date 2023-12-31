#!/bin/bash
set -e -o pipefail
REPO_ROOT=$(cd "$(dirname "$0")/.." && pwd)

# can set from environment
SCRATCH_GUI=${SCRATCH_GUI:-"$REPO_ROOT/scratch-gui"}

# 先に setup-scratch と register を実行しておく
"$REPO_ROOT/scripts/setup-scratch.sh"
"$REPO_ROOT/scripts/register.sh"

cd "$SCRATCH_GUI"
# `npm run start` would also work, but modify config
if [[ -n $DEV_SERVER_OPTS ]]; then
  # shellcheck disable=SC2086
  npx webpack-dev-server $DEV_SERVER_OPTS
else
  npm run start
fi
