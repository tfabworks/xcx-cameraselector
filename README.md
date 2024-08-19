# CameraSelector
The extension for [Xcratch](https://xcratch.github.io/)

Make the camera selectable. This is an extension to help with extensions that use all cameras.

この拡張はビデオ入力を利用する他の拡張と組み合わせて使います。
Scratch でビデオ入力を扱う場合、複数のカメラがある端末でも1つのカメラしか利用することが出来ません。
ですがこの拡張を使うと、端末で利用可能な全てのカメラ（フロントカメラやバックカメラなど）をビデオ入力デバイスとして選択して利用可能になります。

以下は、カメラセレクター拡張機能を使用した[サンプルプロジェクト](https://xcratch.github.io/editor/#https://tfabworks.github.io/xcx-cameraselector/projects/example.sb3)のスクリーンショットです。

![サンプルプロジェクト](./projects/capture1.jpg)


## ✨ What You Can Do With This Extension

Play [Example Project](https://xcratch.github.io/editor/#https://tfabworks.github.io/xcx-cameraselector/projects/example.sb3) to look at what you can do with "CameraSelector" extension.
<iframe src="https://xcratch.github.io/editor/player#https://tfabworks.github.io/xcx-cameraselector/projects/example.sb3" width="540px" height="460px" allow="camera"></iframe>

## How to Use in Xcratch

This extension can be used with other extension in [Xcratch](https://xcratch.github.io/).
1. Open [Xcratch Editor](https://xcratch.github.io/editor)
2. Click 'Add Extension' button
3. Select 'Extension Loader' extension
4. Type the module URL in the input field
```
https://tfabworks.github.io/xcx-cameraselector/dist/cameraselector.mjs
```

## Development

### Register on the local Xcratch

Run register script to install this extension on the local Xcratch for testing.

```sh
npm run register
```

### Bundle into a Module

Run build script to bundle this extension into a module file which could be loaded on Xcratch.

```sh
npm run build
```

## 🏠 Home Page

Open this page from [https://tfabworks.github.io/xcx-cameraselector/](https://tfabworks.github.io/xcx-cameraselector/)


## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/tfabworks/xcx-cameraselector/issues).
