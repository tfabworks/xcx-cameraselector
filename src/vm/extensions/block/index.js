import BlockType from '../../extension-support/block-type';
import ArgumentType from '../../extension-support/argument-type';
import Cast from '../../util/cast';
import translations from './translations.json';
import blockIcon from './block-icon.png';
import { setupSelectableVideoProvider, isSelectableVideoProvider } from './lib/selectable-video-provider';

const DEFAULT_VIDEO_LABEL = '\u{200b}Default\u{200b}';

/**
 * Formatter which is used for translation.
 * This will be replaced which is used in the runtime.
 * @param {object} messageData - format-message object
 * @returns {string} - message for the locale
 */
let formatMessage = messageData => messageData.defaultMessage;

/**
 * Setup format-message for this extension.
 */
const setupTranslations = () => {
  const localeSetup = formatMessage.setup();
  if (localeSetup && localeSetup.translations[localeSetup.locale]) {
    Object.assign(
      localeSetup.translations[localeSetup.locale],
      translations[localeSetup.locale]
    );
  }
};

const EXTENSION_ID = 'cameraselector';

/**
 * URL to get this extension as a module.
 * When it was loaded as a module, 'extensionURL' will be replaced a URL which is retrieved from.
 * @type {string}
 */
let extensionURL = 'https://tfabworks.github.io/xcx-cameraselector/dist/cameraselector.mjs';

/**
 * Scratch 3.0 blocks for example of Xcratch.
 */
class ExtensionBlocks {

  /**
   * @return {string} - the name of this extension.
   */
  static get EXTENSION_NAME() {
    return formatMessage({
      id: 'cameraselector.name',
      default: translations.en['cameraselector.name'],
      description: 'name of the extension'
    });
  }

  /**
   * @return {string} - the ID of this extension.
   */
  static get EXTENSION_ID() {
    return EXTENSION_ID;
  }

  /**
   * URL to get this extension.
   * @type {string}
   */
  static get extensionURL() {
    return extensionURL;
  }

  /**
   * Set URL to get this extension.
   * The extensionURL will be changed to the URL of the loading server.
   * @param {string} url - URL
   */
  static set extensionURL(url) {
    extensionURL = url;
  }

  /**
   * Construct a set of blocks for CameraSelector.
   * @param {Runtime} runtime - the Scratch 3.0 runtime.
   */
  constructor(runtime) {
    /**
     * The Scratch 3.0 runtime.
     * @type {Runtime}
     */
    this.runtime = runtime;
    window.runtime = runtime; // DEBUG

    if (runtime.formatMessage) {
      // Replace 'formatMessage' to a formatter which is used in the runtime.
      formatMessage = runtime.formatMessage;
    }
  }

  /**
   * @returns {object} metadata for this extension and its blocks.
   */
  getInfo() {
    setupTranslations();
    return {
      id: ExtensionBlocks.EXTENSION_ID,
      name: ExtensionBlocks.EXTENSION_NAME,
      extensionURL: ExtensionBlocks.extensionURL,
      blockIconURI: blockIcon,
      showStatusButton: false,
      blocks: [
        {
          opcode: 'selectCamera',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'cameraselector.selectCamera',
            default: translations.en['cameraselector.selectCamera'],
            description: 'select the video device'
          }),
          arguments: {
            LIST: {
              type: ArgumentType.STRING,
              defaultValue: DEFAULT_VIDEO_LABEL,
              menu: 'videoDevicesMenu',
            },
          },
        },
        // ラベル検索は混乱するので隠すことにした
        // {
        //   opcode: 'selectCameraWithLabel',
        //   blockType: BlockType.COMMAND,
        //   text: formatMessage({
        //     id: 'cameraselector.selectCameraWithLabel',
        //     default: translations.en['cameraselector.selectCameraWithLabel'],
        //     description: 'select the video device with label'
        //   }),
        //   arguments: {
        //     LABEL: {
        //       type: ArgumentType.STRING,
        //       defaultValue: formatMessage({
        //         id: "cameraselector.deviceName",
        //         default: "Device Name"
        //       }),
        //     },
        //   },
        // },
      ],
      menus: {
        videoDevicesMenu: {
          acceptReporters: true,
          items: 'getVideoDevicesMenu',
        },
      },
    };
  }

  selectCamera(args) {
    const label = args.LIST || args.LABEL || ''
    const descriptor = {}
    if(label && label !== DEFAULT_VIDEO_LABEL) {
      descriptor.label = label
    }
    this._getSelectableVideoProvider().setVideoDescriptor(descriptor)
      .then(() => {
        // 自動的にカメラをONにする
        return this.runtime.ioDevices.video.enableVideo().catch(()=>{})
      })
    // 対応するデバイスが見つからない場合に OverconstrainedError が発生する事がありますが、その対応が実装できていない事に注意が必要です。
    // 例えば MacbookPro は背面カメラをサポートしていないので {facingMode:{exact:"environment"}} を指定するとエラーが発生し現状では他のカメラに切り替えても復帰できなくなります。
    // if (label === "USER") {
    //   this._getSelectableVideoProvider().setVideoDescriptor({ facingMode: "user" });
    // } else if (label === "ENVIRONMENT") {
    //   this._getSelectableVideoProvider().setVideoDescriptor({ facingMode: { exact: "environment" } })
    // } else {
    // }
  }

  // ラベル検索は混乱するので隠すことにした
  // selectCameraWithLabel(args) {
  //   this.selectCamera(args)
  // }

  getVideoDevicesMenu() {
    const defaultValues = [
      { text: 'Default', value: DEFAULT_VIDEO_LABEL} // 既存のカメラ名に Default を含むものが選ばれないようゼロ幅スペース付きの値をデフォルト値として使用する
    ]
    // Constraints に対応するデバイスが見つからなかった場合に OverconstrainedError が発生する際の問題が未解決なので封印
    // if(navigator.mediaDevices.getSupportedConstraints().facingMode) {
    //   defaultValues.push(
    //     { text: "前面カメラ", value: "USER" },
    //     { text: "背面カメラ", value: "ENVIRONMENT" }
    //   )
    // }
    const deviceValues = this._getSelectableVideoProvider().videoDevices.map(dev => ({
      text: dev.label,
      value: dev.label
    })).sort((a, b) => b.text < a.text)
    return defaultValues.concat(deviceValues)
  }

  _getSelectableVideoProvider() {
    if (isSelectableVideoProvider(this.runtime.ioDevices.video.provider)) {
      return this.runtime.ioDevices.video.provider
    }
    return setupSelectableVideoProvider(this.runtime)
  }
}

export {
  ExtensionBlocks as default,
  ExtensionBlocks as blockClass
};
