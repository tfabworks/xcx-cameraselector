import BlockType from '../../extension-support/block-type';
import ArgumentType from '../../extension-support/argument-type';
import Cast from '../../util/cast';
import translations from './translations.json';
import blockIcon from './block-icon.png';

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
    window.cameraselector = this // DEBUG

    if (runtime.formatMessage) {
      // Replace 'formatMessage' to a formatter which is used in the runtime.
      formatMessage = runtime.formatMessage;
    }

    /**
     * 利用可能なビデオデバイスリスト
     * @type {InputDeviceInfo[]}
     */
    this._videoDevices = []

    /**
     * 使用したいビデオデバイスの条件
     * @type {MediaTrackConstraints | {label?: string}}
     */
    this._desiredVideoTrackConstraints = {}

    // Video 関連の監視を開始する
    this._registerListeners()
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
              defaultValue: this._DEVICE_LABEL_DEFAULT,
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

  selectCamera(args) {
    const label = args.LIST || args.LABEL || ''
    const constraints = {}
    if (label && label !== this._DEVICE_LABEL_DEFAULT) {
      constraints.label = label
    }
    // label を元にデバイスを探す
    const dev = this._findVideoDevice(constraints)
    if (dev && dev.deviceId) {
      constraints.deviceId = dev.deviceId
    }
    this._desiredVideoTrackConstraints = constraints
    if (this.runtime.ioDevices.video.videoReady) {
      // 既存のビデオストリームを差し替える
      return this._openVideoStream(this._video)
    } else {
      // 自動的にカメラをONにする
      return this.runtime.ioDevices.video.enableVideo()
    }
  }

  getVideoDevicesMenu() {
    const defaultValues = [
      { text: this._DEVICE_LABEL_DEFAULT, value: this._DEVICE_LABEL_DEFAULT }
    ]
    // Constraints に対応するデバイスが見つからなかった場合に OverconstrainedError が発生する際の問題が未解決なので封印
    // if(navigator.mediaDevices.getSupportedConstraints().facingMode) {
    //   defaultValues.push(
    //     { text: this._DEVICE_LABEL_USER, value: this._DEVICE_LABEL_USER},
    //     { text: this._DEVICE_LABEL_ENVIRONMENT, value: this._DEVICE_LABEL_ENVIRONMENT}
    //   )
    // }
    const deviceValues = this._videoDevices.map(dev => ({
      text: dev.label,
      value: dev.label
    })).sort((a, b) => b.text < a.text)
    return defaultValues.concat(deviceValues)
  }

  /**
   * @private
   * @param {MediaTrackConstraints | {label?: string}} videoTrackConstraints
   * @returns {MediaDeviceInfo}
   */
  _findVideoDevice(videoTrackConstraints) {
    if (typeof videoTrackConstraints.deviceId !== "undefined" && videoTrackConstraints.deviceId !== "") {
      return this._videoDevices.find(dev => dev.deviceId === videoTrackConstraints.deviceId)
    }
    // label指定の場合は完全一致と先頭一致と部分一致をチェックする
    if (typeof videoTrackConstraints.label !== "undefined" && videoTrackConstraints.label !== "") {
      const dev =
        this._videoDevices.find(dev => dev.label === videoTrackConstraints.label) ||
        this._videoDevices.find(dev => dev.label.startsWith(videoTrackConstraints.label)) ||
        this._videoDevices.find(dev => dev.label.includes(videoTrackConstraints.label)) ||
        this._videoDevices.find(dev => dev.label.toLocaleLowerCase().includes(videoTrackConstraints.label.toLocaleLowerCase()))
      if (dev != null) {
        return dev
      }
    }
    return null
  }

  /**
   * @private
   */
  _registerListeners() {
    // mediaDevices の変化の監視
    navigator.permissions.query({ name: "camera" }).then(p => p.addEventListener('change', () => this._onChangeMediaDevice()))
    navigator.mediaDevices.addEventListener("devicechange", () => this._onChangeMediaDevice())
    this._onChangeMediaDevice()
    // VideoProvider の video プロパティの監視
    /** @private @type {HTMLVideoElement | null} */
    this._oldVideo = null
    /** @private @type {NodeJS.Timeout} */
    this._videoChangeWatchdogTimeout = setInterval(() => this._videoChangeWatchdog(), 200)
  }

  /**
   * Updates the list of available video devices.
   * @private
   */
  _onChangeMediaDevice() {
    navigator.mediaDevices.enumerateDevices()
      .catch(() => [])
      .then(devices => {
        this._videoDevices = devices.filter(d => d.kind === 'videoinput')
      })
      .then(() => {
        // 指定デバイスが見つかったならカメラを切り替える
        const dev = this._findVideoDevice(this._desiredVideoTrackConstraints)
        if (dev != null && dev.deviceId) {
          this._desiredVideoTrackConstraints = { deviceId: dev.deviceId }
          this._openVideoStream(this._video)
        }
      })
  }

  /**
   * runtime.ioDevices.video.provider の _video の変化を監視する
   * @private
   */
  _videoChangeWatchdog() {
    const oldVideo = this._oldVideo // instance value
    const newVideo = this._video // getter
    if (oldVideo !== newVideo) {
      this._oldVideo = newVideo
      this._onChangeVideoElement(oldVideo, newVideo)
    }
  }

  /**
   * video エレメントに変化があった際にカメラ選択機能を追従させる
   * @param {HTMLVideoElement | null} oldVideo
   * @param {HTMLVideoElement | null} newVideo
   */
  _onChangeVideoElement(oldVideo, newVideo) {
    console.log("_onChangeVideoElement", { oldVideo, newVideo })
    if (oldVideo != null) {
      this._closeVideoStream(oldVideo)
    }
    if (newVideo != null) {
      this._openVideoStream(newVideo)
    }
  }

  /**
   * @private
   * @param {HTMLVideoElement} video
   */
  _closeVideoStream(video) {
    if (video) {
      if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop())
      }
      video.src = ''
    }
  }


  /**
   *
   * @private
   * @param {HTMLVideoElement} video
   * @returns {Promise<MediaStream | null>}
   */
  _openVideoStream(video) {
    if (video == null) {
      return Promise.resolve(null)
    }
    const dev = this._findVideoDevice(this._desiredVideoTrackConstraints)
    if (dev && dev.deviceId) {
      if (dev.deviceId === this._deviceId) {
        // 現在使用中のビデオデバイスIDと同じなので何もしない
        return Promise.resolve(video.srcObject)
      }
      // デバイスIDがあるなら他の条件は不要
      this._desiredVideoTrackConstraints = { deviceId: dev.deviceId }
    }
    // 新しい stream を取得する前に既存の stream があれば閉じておく
    this._closeVideoStream(video)
    // video エレメントではなく VideoProvider._track が存在する場合はそれも閉じておく（vide.srcObject と一致しない場合がある）
    if (this._videoProvider && this._videoProvider._track) {
      this._videoProvider._track.stop()
    }
    return getUserMedia({
      audio: false,
      video: Object.assign({
        width: { min: 480, ideal: 640 },
        height: { min: 360, ideal: 480 }
      }, this._desiredVideoTrackConstraints)
    })
      .then(async (stream) => {
        try {
          video.srcObject = stream
        } catch (error) {
          video.src = window.URL.createObjectURL(stream);
        }
        // Needed for Safari/Firefox, Chrome auto-plays.
        await video.play();
        // runtime の VideoProvide が保持する track も差し替える
        this._videoProvider._track = stream.getTracks()[0]
        return stream
      })
  }

  /** @returns {VideoProvider | null} See https://github.com/scratchfoundation/scratch-gui/blob/develop/src/lib/video/video-provider.js */
  get _videoProvider() { return this.runtime.ioDevices.video.provider || null }

  /** @return {Omit<HTMLVideoElement, keyof HTMLElement> | null} VideoProvider に紐づいた video エレメント */
  get _video() { return this._videoProvider && this._videoProvider.video }

  /** @returns {MediaStreamTrack[]} 現在使用中のビデオトラック */
  get _tracks() { return this._video && this._video.srcObject && this._video.srcObject.getTracks() || [] }

  /** @returns {string | undefined} 現在使用中のビデオデバイスID */
  get _deviceId() { return ((this._tracks[0] && this._tracks[0].getCapabilities()) || {}).deviceId }

  /** @returns {InputDeviceInfo | undefined} 現在使用中のビデオデバイス */
  get _device() { return this._videoDevices.find(dev => dev.deviceId === this._deviceId) }

  /** @returns {string} デフォルトカメラを指すラベル */
  get _DEVICE_LABEL_DEFAULT() { return wrapZWSP(formatMessage({ id: 'cameraselector.deviceLabelDefault', default: translations.en['cameraselector.deviceLabelDefault'] })) }

  /** @returns {string} 前面カメラを指すラベル */
  get _DEVICE_LABEL_USER() { return wrapZWSP(formatMessage({ id: 'cameraselector.deviceLabelUser', default: translations.en['cameraselector.deviceLabelUser'] })) }

  /** @returns {string} 背面カメラを指すラベル */
  get _DEVICE_LABEL_ENVIRONMENT() { return wrapZWSP(formatMessage({ id: 'cameraselector.deviceLabelEnvironment', default: translations.en['cameraselector.deviceLabelEnvironment'] })) }

}

/**
 * 取得されたビデオデバイス一覧の label にマッチしないように ZWSP で囲む
 * @param {string} s
 * @returns {string}
 */
const wrapZWSP = s => '\u{200b}' + s + '\u{200b}'

/**
 * 同時実行を抑制した getUserMedia
 * @param {MediaStreamConstraints} constraints
 * @returns {Promise<MediaStream>}
 */
const getUserMedia = singleExecute(constraints => navigator.mediaDevices.getUserMedia(constraints), true)

/**
 * Takes a function (asynchronous or synchronous) and returns a wrapper function that ensures
 * the function is not executed concurrently. If the function is called again while it is already
 * executing, the behavior can be controlled with the queueLastCall option: if true, the
 * function will be re-executed with the last arguments after the current execution completes;
 * if false, the last call will be ignored.
 *
 * @template T The argument types of the function as a tuple.
 * @template R The return type of the function.
 * @param {(...args: T) => R | Promise<R>} func - The function (asynchronous or synchronous) to wrap.
 * @param {boolean} [queueLastCall=false] - Whether to re-execute the function with the last arguments after the current execution.
 * @returns {(...args: T) => Promise<R>} A wrapper function that manages execution.
 */
function singleExecute(func, queueLastCall = false) {
  let processing = false;
  let lastArgs = null;
  let pendingPromise = null;
  const asyncedFunc = async (...args) => func(...args)
  const singleExecutedFunc = async (...args) => {
    if (processing) {
      if (queueLastCall) {
        lastArgs = args;
      }
      return pendingPromise;
    }
    processing = true;
    pendingPromise = asyncedFunc(...args).finally(() => {
      processing = false;
      if (queueLastCall && lastArgs !== null) {
        const nextArgs = lastArgs;
        lastArgs = null;
        return singleExecutedFunc(...nextArgs)
      }
    })
    return pendingPromise
  }
  return singleExecutedFunc
};

export {
  ExtensionBlocks as default,
  ExtensionBlocks as blockClass
};
