import Phaser from "phaser";

export class MainScene extends Phaser.Scene {
  private words: string[];
  private score: number;
  private timeRemaining: number;
  private gameActive: boolean;
  private currentWord: string;
  private inputText: string;
  private timerText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
  private wordText!: Phaser.GameObjects.Text;
  private inputTextObj!: Phaser.GameObjects.Text;
  private startButton!: Phaser.GameObjects.Text;
  private retryButton!: Phaser.GameObjects.Text;
  private gameOverText!: Phaser.GameObjects.Text;
  private timerEvent!: Phaser.Time.TimerEvent;

  constructor() {
    super("MainScene");
    this.words = [
      "apple",
      "banana",
      "cherry",
      "dragon",
      "elephant",
      "forest",
      "guitar",
      "happiness",
      "island",
      "jazz",
      "keyboard",
      "lemon",
      "mountain",
      "notebook",
      "ocean",
      "python",
      "quantum",
      "rainbow",
      "sunshine",
      "treasure",
    ];
    this.score = 0;
    this.timeRemaining = 10;
    this.gameActive = false;
    this.currentWord = "";
    this.inputText = "";
  }

  create(): void {
    // テキストオブジェクト
    this.timerText = this.add.text(16, 16, `Time: ${this.timeRemaining}`, {
      fontSize: "32px",
      backgroundColor: "#000",
    });
    this.scoreText = this.add.text(16, 56, `Score: ${this.score}`, {
      fontSize: "32px",
      backgroundColor: "#000",
    });
    this.wordText = this.add
      .text(400, 200, "", { fontSize: "48px", backgroundColor: "#000" })
      .setOrigin(0.5);
    this.inputTextObj = this.add
      .text(400, 300, "", { fontSize: "48px", backgroundColor: "#000" })
      .setOrigin(0.5);

    // Start ボタン
    this.startButton = this.add
      .text(400, 400, "Start", { fontSize: "40px", backgroundColor: "#0f0" })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => this.startGame());

    // Retry ボタン
    this.retryButton = this.add
      .text(400, 400, "Retry", { fontSize: "40px", backgroundColor: "#f00" })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => this.startGame())
      .setVisible(false);

    // キーボード入力
    this.input.keyboard?.on("keydown", (event: KeyboardEvent) => this.handleKey(event), this);
  }

  private startGame(): void {
    this.score = 0;
    this.timeRemaining = 10;
    this.gameActive = true;
    this.startButton.setVisible(false);
    this.retryButton.setVisible(false);

    if (this.gameOverText) {
      this.gameOverText.setVisible(false);
    }

    this.scoreText.setText(`Score: ${this.score}`);
    this.timerText.setText(`Time: ${this.timeRemaining}`);
    this.pickWord();

    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: () => this.onSecond(),
      callbackScope: this,
      loop: true,
    });
  }

  private onSecond(): void {
    this.timeRemaining--;
    this.timerText.setText(`Time: ${this.timeRemaining}`);
    if (this.timeRemaining <= 0) {
      this.endGame();
    }
  }

  private pickWord(): void {
    this.currentWord = Phaser.Utils.Array.GetRandom(this.words);
    this.wordText.setText(this.currentWord);
    this.inputText = "";
    this.inputTextObj.setText("");
  }

  private handleKey(event: KeyboardEvent): void {
    if (!this.gameActive) return;
    if (event.key === "Backspace") {
      this.inputText = this.inputText.slice(0, -1);
    } else if (event.key.length === 1) {
      if (this.currentWord[this.inputText.length] === event.key) {
        this.inputText += event.key;
      }
    }
    this.inputTextObj.setText(this.inputText);

    if (this.inputText === this.currentWord) {
      this.score++;
      this.scoreText.setText(`Score: ${this.score}`);
      this.pickWord();
    }
  }

  private endGame(): void {
    this.gameActive = false;
    this.timerEvent.remove(false);
    this.wordText.setText("");
    this.inputTextObj.setText("");
    this.gameOverText = this.add
      .text(400, 200, "Game Over", {
        fontSize: "48px",
        backgroundColor: "#f00",
      })
      .setOrigin(0.5);
    this.retryButton.setVisible(true);
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game",
  scene: MainScene,
  backgroundColor: "#fff",
};

window.onload = () => {
  new Phaser.Game(config);
};
