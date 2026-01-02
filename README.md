# typing-game-a

ブラウザで遊べるタイピングゲームです。

## 遊び方

Start ボタンを押してゲームを開始します。

3つのレーンに分かれており、異なる単語が並行で出題されます。
最初は左端が「アクティブ」なレーンです。アクティブなレーンの単語をタイプすると、スコアが加算されます。
レーンには数字が割り当てられており、それを入力することでアクティブなレーンを切り替えられます。
各レーンには独立のカウントダウンタイマーがついており、どれか一つでも時間が無くなるとゲームオーバーです。
時間内にできるだけ多くの単語をタイプしましょう。

ゲーム終了後に Retry ボタンで再挑戦できます。

## 構成図

大まかなファイル構成は下記です。 (Codex により出力)

```mermaid

flowchart TD
    %% Nodes
    indexHtml["index.html"]
    indexTsx["index.tsx"]
    appTsx["App.tsx"]

    subgraph components["components"]
        phaserGame["components/PhaserGame.tsx"]
        mainScene["components/scenes/main.ts"]
        lane["components/Lane.ts"]
    end

    subgraph config["config"]
        configEntry["config/config.ts"]
        devConfig["config/development.ts"]
        prodConfig["config/production.ts"]
        configTypes["config/types.ts"]
    end

    %% Edges (relations)
    indexHtml -->|script include| indexTsx
    indexTsx -->|ReactDOM.createRoot renders| appTsx
    appTsx -->|JSX composition| phaserGame
    phaserGame -->|passes as Phaser scene| mainScene
    phaserGame -->|uses for canvas settings| configEntry
    mainScene -->|instantiates per lane| lane
    mainScene -->|reads for timer/UI/lanes| configEntry
    lane -->|uses UI settings| configEntry
    configEntry -->|NODE_ENV != production| devConfig
    configEntry -->|NODE_ENV == production| prodConfig
    prodConfig -->|declares type| configTypes
    devConfig -->|declares type| configTypes

```
