import React from 'react';
import { FormattedMessage } from 'react-intl';

/**
 * This is an extension for Xcratch.
 */

import iconURL from './entry-icon.png';
import insetIconURL from './inset-icon.png';
const version = 'v1.0.0';
const translations =
{
    "en": {
        "cameraselector.entry.name": "CameraSelector",
        "cameraselector.entry.description": `Select the camera. (${version})`
    },
    "ja": {
        "cameraselector.entry.name": "CameraSelector",
        "cameraselector.entry.description": `カメラを選択する。 (${version})`
    },
    "ja-Hira": {
        "cameraselector.entry.name": "CameraSelector",
        "cameraselector.entry.description": `カメラを選択する。 (${version})`
    }
}

const entry = {
    name: (
        <FormattedMessage
            defaultMessage="CameraSelector"
            description="Name for the 'CameraSelector' extension"
            id="cameraselector.entry.name"
        />
    ),
    extensionId: 'cameraselector',
    extensionURL: null,
    collaborator: 'TFabWorks',
    iconURL: iconURL,
    insetIconURL: insetIconURL,
    description: (
        <FormattedMessage
            defaultMessage="Select the camera."
            description="Description for the 'CameraSelector' extension"
            id="cameraselector.entry.description"
        />
    ),
    featured: true,
    disabled: false,
    bluetoothRequired: false,
    internetConnectionRequired: false,
    helpLink: 'https://tfabworks.github.io/xcx-cameraselector/',
    translationMap: translations
};

export { entry }; // loadable-extension needs this line.
export default entry;
