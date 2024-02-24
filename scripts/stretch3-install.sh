#!/bin/sh

## Install script for https://stretch3.github.io/
## execute `sh ./xcx-cameraselector/scripts/stretch3-install.sh`
## suppoesed dir configuration:
##  scratch-gui
##      - xcx-cameraselector

LF=$(printf '\\\012_')
LF=${LF%_}
EXTENSION_NAME=CameraSelector
EXTENSION_REP=xcx-cameraselector
EXTENSION_ID=cameraselector
COLLABORATOR="TFabWorks"
EXTENSION_DESCRIPTION="Select the camera."

### register it as a builtin extenstion
mkdir -p node_modules/scratch-vm/src/extensions/${EXTENSION_ID}
cp ${EXTENSION_REP}/dist/${EXTENSION_ID}.mjs node_modules/scratch-vm/src/extensions/${EXTENSION_ID}/
mv node_modules/scratch-vm/src/extension-support/extension-manager.js node_modules/scratch-vm/src/extension-support/extension-manager.js_orig
sed -e "s|class ExtensionManager {|builtinExtensions['${EXTENSION_ID}'] = () => {${LF}    const formatMessage = require('format-message');${LF}    const ext = require('../extensions/${EXTENSION_ID}/${EXTENSION_ID}.mjs');${LF}    const blockClass = ext.blockClass;${LF}    blockClass.formatMessage = formatMessage;${LF}    return blockClass;${LF}};${LF}${LF}class ExtensionManager {|g" node_modules/scratch-vm/src/extension-support/extension-manager.js_orig > node_modules/scratch-vm/src/extension-support/extension-manager.js


### copy entry files
mkdir -p src/lib/libraries/extensions/${EXTENSION_ID}
cp ${EXTENSION_REP}/src/gui/lib/libraries/extensions/entry/index.jsx src/lib/libraries/extensions/${EXTENSION_ID}/index.jsx
cp ${EXTENSION_REP}/src/gui/lib/libraries/extensions/entry/entry-icon.png src/lib/libraries/extensions/${EXTENSION_ID}/
cp ${EXTENSION_REP}/src/gui/lib/libraries/extensions/entry/inset-icon.png src/lib/libraries/extensions/${EXTENSION_ID}/

### insert it to the library
mv src/lib/libraries/extensions/index.jsx src/lib/libraries/extensions/index.jsx_orig
sed -e "s|^export default \[$|import ${EXTENSION_ID}Entry from './${EXTENSION_ID}/index.jsx';${LF}${LF}export default [${LF}    ${EXTENSION_ID}Entry,|g" src/lib/libraries/extensions/index.jsx_orig > src/lib/libraries/extensions/index.jsx
