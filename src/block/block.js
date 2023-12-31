const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
// const Cast = require('../../util/cast');
// const log = require('../../util/log');
const replaceVideoProvider = require('./lib/SelectableVideoProvider').replaceVideoProvider;

/**
 * Formatter which is used for translating.
 * When it was loaded as a module, 'formatMessage' will be replaced which is used in the runtime.
 * @type {Function}
 */
const formatMessage = require('format-message');

/**
 * URL to get this extension as a module.
 * When it was loaded as a module, 'extensionURL' will be replaced a URL which is retrieved from.
 * @type {string}
 */
let extensionURL = 'https://tfabworks.github.io/cameraselector/cameraselector.mjs';

const HAT_TIMEOUT = 100;

const blockIconURI =
  'data:image/png;base64,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';

const Message = {
  select_video_device: {
    ja: 'カメラを[LIST]にする',
    'ja-Hira': 'かめらを[LIST]にする',
    en: 'Set camera to [LIST]',
    'zh-cn': '将摄像头设置为[LIST]',
    'zh-tw': '將攝像頭設置為[LIST]',
  },
};

const AvailableLocales = ['en', 'ja', 'ja-Hira', 'zh-cn', 'zh-tw'];

class Scratch3CameraSelectorBlocks {
  /**
   * @return {string} - the name of this extension.
   */
  static get EXTENSION_NAME() {
    return 'CameraSelector';
  }

  /**
   * @return {string} - the ID of this extension.
   */
  static get EXTENSION_ID() {
    return 'cameraselector';
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
   * extensionURL will be reset when the module is loaded from the web.
   * @param {string} url - URL
   */
  static set extensionURL(url) {
    extensionURL = url;
  }

  constructor(runtime) {
    this.runtime = runtime;
    this.videProvider = replaceVideoProvider(runtime)
    runtime.ioDevices.video.enableVideo().then(() => console.log(this.getVideoDevicesMenu()))
  }

  getInfo() {
    const locale = 'ja';
    return {
      id: Scratch3CameraSelectorBlocks.EXTENSION_ID,
      name: Scratch3CameraSelectorBlocks.EXTENSION_NAME,
      extensionURL: Scratch3CameraSelectorBlocks.extensionURL,
      blockIconURI: blockIconURI,
      blocks: [
        {
          opcode: 'switchCamera',
          blockType: BlockType.COMMAND,
          text: Message.select_video_device[locale],
          arguments: {
            LIST: {
              type: ArgumentType.STRING,
              defaultValue: 'default',
              menu: 'videoDevicesMenu',
            },
          },
        },
        {
          opcode: 'switchCamera',
          blockType: BlockType.COMMAND,
          text: Message.select_video_device[locale],
          arguments: {
            LIST: {
              type: ArgumentType.STRING,
              defaultValue: 'default',
              menu: 'videoDevicesMenu',
            },
          },
        },
      ],
      menus: {
        videoDevicesMenu: {
          acceptReporters: true,
          items: 'getVideoDevicesMenu',
        },
      },
    };
  }

  switchCamera(args) {
    const deviceId = args.LIST || '';
    console.log("switchCamera", args)
  }

  getVideoDevicesMenu() {
    const values = this.videProvider.videoDevices.map(dev => ({
      text: dev.label,
      value: dev.deviceId
    })).sort((a,b) => b.text < a.text)
    values.unshift({ text: "decault", value: "" })
    return values
  }
}

exports.blockClass = Scratch3CameraSelectorBlocks; // loadable-extension needs this line.
module.exports = Scratch3CameraSelectorBlocks;
