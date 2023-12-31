# 設計
- `entry.jsx` このディレクトリ内のファイルを元に JSX Element を構築します。
- `entry.json` このファイルを元に JSX Element のプロパティが設定されます。
- `translations.json` に entry.json 用のキーを作ることで FormatMessage に差し替えられます。
- `index.js` JSX Element を exports します。

# Scratch3 への登録方法
`SCRATCH_GUI/src/lib/libraries/extensions/index.jsx` の default export に entry を追加します。
具体的には以下のようにな追記を行います。

```
import cameraselectorEntry from './cameraselector'; //追記部分1
export default [
    cameraselectorEntry, //追記部分2
```
