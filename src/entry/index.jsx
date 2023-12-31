import React from 'react';
import { FormattedMessage } from 'react-intl';

import iconURL from './icon.png';
import insetIconURL from './icon-inset.png';
import translationsJson from './translations.json';

const _entry = {
    "name": "CameraSelector",
    "extensionId": "cameraselector",
    "_extensionURL": "https://tfabworks.github.io/xcx-cameraselector/cameraselector.mjs",
    "collaborator": "TFabWorks",
    "description": "Make the camera selectable. This is an extension to help with extensions that use all cameras.",
    "helpLink": "https://github.com/tfabworks/xcx-cameraselector",
    "featured": true,
    "disabled": false,
    "bluetoothRequired": false,
    "internetConnectionRequired": false,
    iconURL,
    insetIconURL,
}
// const defaultLang = 'ja'
// const FormattedMessageFixed = (props) => (<FormattedMessage {...props} />)
// const makeFormatMessage = (key) => FormattedMessageFixed({
//     id: `${key}`,
//     defaultMessage: (entryJson[key] || translationsJson[defaultLang] || key),
//     description: `${key} for ${entryJson.name} Blocks`
// })

// const entryJsx = {
//     ...entryJson,
//     iconURL,
//     insetIconURL,
//     translationMap: translationsJson,
//     name: makeFormatMessage('name'),
//     description: makeFormatMessage('description'),
// }

// console.log("entry", entryJsx)

// export const entry = entryJsx; // loadable-extension needs this line.
// export default entry;
export const entry = _entry
export default entry
