const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
// const Cast = require('../../util/cast');
// const log = require('../../util/log');
const { setupSelectableVideoProvider, isSelectableVideoProvider } = require('./lib/selectable-video-provider');

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
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAkCAQAAABRNbCdAAAAAmJLR0QA/4ePzL8AAAAHdElNRQfnDB0MKA2K4MiqAAAEQUlEQVRIx+2VbVCUVRTHf8/ussDC7vAuIOJSqKCjvOTLooYEMmmgSEmWjDg56mS+M42OjdVobypTQwxEE02UNuMHpBpHU4ogEJnBkTEwnWiiKCfJRUCEQdaFPX0Alt1FpT7VB//32z3n/u695/6f88BDPdR/L8V1ogAtVfSPD9xjaRC/8S6xTrMa1zQtarVhro9RkfuBRgLKkEXbENje6xIdB6xFE11V1hvGfYH2syvRJfVbLtgmAN7CzdDj16u43lnF6MoMMrBhpYD+CNxslgmAAM7X9SaNVAz8xAmagRhysHGHE5ht4+9xT6Cj/MhjLTfpZRnryOVLjnIOwcZljPfInxD4ItkUUkwP8eRxhKu00DYSiwCEcrrwx8qakdLYVYPwBnonXCBrOMcBWrnJN+wnlOUuGyaoozxt+h7tLXutAbjEbM6goPcz6R3r4k8IFxi1RhOdTHPCXdIlH848W1zWEtlC8xjwK2JRCPBL2VJ85vRK9dDYgn76CbU/uD9edDvy5IZ7a+rPiQOGlOvdzOHUMPAkSSjMTigpqy/8dX6Pp9rhhO3UsoJ0FMCfHWioci3yELTP2nvEIzKINCrQwErCWL20uqTdKLijEUcnWHmPeEo5jZkE5lJAnQtPgB5D86bOBUt3KDUCsJncyVMbEURnmVm+ftoqk6EXGRtxckza5IY0yk7xFsdI/JkvJkU3hF7XCoKEX90UlQngS+pmD0EMt5fs+s4zlYyFeicg4iZTZYb4Cy4j/uzR0Ofyd8fOP6TvQzQyL1/QQDedj1qBiLrvCwsGdbgNahTnNjTI74Bra1JQLItvD+R/29bQtNDWuO8u5oXFvhoAr24VQ5ijNphK6/Zga5l+sGMygsCDupgbYace6cvvi0GRJ3oVQNR3VcAqch4L+gtRJKQt+aXDARA4XG71RF/RFN4mgs8NyTt9OxCVxH4sKqACUZbk6i0I4jlovJC4d2Pc116wYnnioVwjHMBEtdPI5iO2Ege8GZKWPb1SZ0WQkGvrFywD+JB3aNIm7Qo0K4IgWgnoiKxOeCvuE0+ZciV1c4lhHsc4ZD9XKxsp0m2LSs+aWxR+xcuKIIoE/5GWCQPDKQc5gpD9+Kxyn9vqkRfUyLAZdNYZFU8/me++m/oR4C/AU7uDb3gNqmQY5m2JOrXOBBUcH921lPOkUO+RlRz/QViLt0XjYA5FjOYN6fPswFa8SdrqNmIov86Zp9Of/dQ7ERvHsLevF7hIDJcGOqsaq1+b3BRnXtQV1zWnM1hwJ/hi1PvhNe72nqEiCd3lgK6hfp8fA2uMlTuuZN0xEc5l1o1/t+PU8gomQDTzd3nIpGuL9u8P9iWPfZy3Z73Oq/q1idsjf/CAZyghh6YHmeFP6rjJElIzF5RuiIHtQKVTxh5eJoNtfIbQMJG3RlVEia5Du5prY4X+R7rvL8CG9J9kMUM8/6+A/3/9DSQTr0bbrLc4AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIzLTEyLTI5VDEyOjI3OjAxKzAwOjAwzOSVLQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMy0xMi0yOVQxMjoyNzowMSswMDowML25LZEAAAAodEVYdGRhdGU6dGltZXN0YW1wADIwMjMtMTItMjlUMTI6NDA6MTMrMDA6MDC78MzDAAAAAElFTkSuQmCC';

const Message = {
  select_video_device: {
    ja: 'カメラを[LIST]に切り替える',
    'ja-Hira': 'かめらを[LIST]にきりかえる',
    en: 'Set camera to [LIST]',
    'zh-cn': '切换相机至[LIST]',
    'zh-tw': '切换相机至[LIST]',
  },
};

const AvailableLocales = ['en', 'ja', 'ja-Hira', 'zh-cn', 'zh-tw'];

class Scratch3CameraSelectorBlocks {

  constructor(runtime) {
    this.runtime = runtime;
    window.runtime = runtime;
  }

  getInfo() {
    const locale = 'ja';
    return {
      id: 'cameraselector',
      name: 'CameraSelector',
      extensionURL: extensionURL,
      blockIconURI: blockIconURI,
      blocks: [
        {
          opcode: 'selectCamera',
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

  selectCamera(args) {
    const deviceId = args.LIST || '';
    // 対応するデバイスが見つからない場合に OverconstrainedError が発生する事がありますが、その対応が実装できていない事に注意が必要です。
    // 例えば MacbookPro は背面カメラをサポートしていないので {facingMode:{exact:"environment"}} を指定するとエラーが発生し現状では他のカメラに切り替えても復帰できなくなります。
    if(deviceId == "USER") {
      this._getSelectableVideoProvider().setVideoDescriptor({facingMode:"user"});
      this.runtime.ioDevices.video.mirror = true
    } else if(deviceId == "ENVIRONMENT") {
      this._getSelectableVideoProvider().setVideoDescriptor({facingMode:{exact:"environment"}})
      this.runtime.ioDevices.video.mirror = false
    } else {
      this._getSelectableVideoProvider().mirror = this.runtime.ioDevices.video.mirror
      this._getSelectableVideoProvider().setVideoDescriptor({deviceId})
    }
  }

  getVideoDevicesMenu() {
    const defaultValues = [
      { text: "default", value: "" }
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
      value: dev.deviceId
    })).sort((a,b) => b.text < a.text)
    return defaultValues.concat(deviceValues)
  }

  _getSelectableVideoProvider() {
    if(isSelectableVideoProvider(this.runtime.ioDevices.video.provider)) {
      return this.runtime.ioDevices.video.provider
    }
    return setupSelectableVideoProvider(this.runtime)
  }
}

exports.blockClass = Scratch3CameraSelectorBlocks; // loadable-extension needs this line.
module.exports = Scratch3CameraSelectorBlocks;
