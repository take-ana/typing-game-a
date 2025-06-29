import Phaser from "phaser";
import { Lane } from "../Lane";

export class MainScene extends Phaser.Scene {
  private words: string[];
  private score: number;
  private timeRemaining: number;
  private gameActive: boolean;
  private lanes: Lane[];
  private activeLane: number;
  private timerText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
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
    this.lanes = [];
    this.activeLane = 0;
  }

  create(): void {
    this.events.on('laneTimerExpired', this.endGame, this);

    this.timerText = this.add.text(16, 16, `Time: ${this.timeRemaining}`, {
      fontSize: "32px",
      backgroundColor: "#000",
    });
    this.scoreText = this.add.text(16, 56, `Score: ${this.score}`, {
      fontSize: "32px",
      backgroundColor: "#000",
    });

    this.createLanes();

    // Start ボタン
    this.startButton = this.add
      .text(400, 500, "Start", { fontSize: "40px", backgroundColor: "#0f0" })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => this.startGame());

    // Retry ボタン
    this.retryButton = this.add
      .text(400, 500, "Retry", { fontSize: "40px", backgroundColor: "#f00" })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => this.startGame())
      .setVisible(false);

    // キーボード入力
    this.input.keyboard?.on("keydown", (event: KeyboardEvent) => this.handleKey(event), this);
  }

  private createLanes(): void {
    const lanePositions = [200, 400, 600];
    const numberRanges = [
      [10, 39],
      [40, 69],
      [70, 99],
    ];

    for (let i = 0; i < 3; i++) {
      const x = lanePositions[i];
      const [min, max] = numberRanges[i];
      const laneNumber = Phaser.Math.Between(min, max);

      const lane = new Lane(this, x, laneNumber, this.words);
      this.lanes.push(lane);
    }

    this.highlightActiveLane();
  }

  private highlightActiveLane(): void {
    this.lanes.forEach((lane, index) => {
      if (index === this.activeLane) {
        lane.activate();
      } else {
        lane.deactivate();
      }
    });
  }

  private startGame(): void {
    this.score = 0;
    this.timeRemaining = 10;
    this.gameActive = true;
    this.activeLane = 0;
    this.startButton.setVisible(false);
    this.retryButton.setVisible(false);

    if (this.gameOverText) {
      this.gameOverText.setVisible(false);
    }

    this.scoreText.setText(`Score: ${this.score}`);
    this.timerText.setText(`Time: ${this.timeRemaining}`);

    this.lanes.forEach((lane) => {
      lane.pickWord();
    });

    this.highlightActiveLane();

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



  private handleKey(event: KeyboardEvent): void {
    if (!this.gameActive) return;

    if (event.key.length === 1 && /\d/.test(event.key)) {
      const typedNumber = parseInt(event.key);
      for (let i = 0; i < this.lanes.length; i++) {
        const lane = this.lanes[i];
        if (lane.number.toString().includes(event.key)) {
          if (lane.number.toString() === typedNumber.toString()) {
            this.switchToLane(i);
            return;
          }
          if (lane.number.toString().startsWith(event.key)) {
            this.switchToLane(i);
            return;
          }
        }
      }
    }

    const currentLane = this.lanes[this.activeLane];
    if (event.key === "Backspace") {
      currentLane.inputText = currentLane.inputText.slice(0, -1);
    } else if (event.key.length === 1 && /[a-zA-Z]/.test(event.key)) {
      if (currentLane.currentWord[currentLane.inputText.length] === event.key) {
        currentLane.inputText += event.key;
      }
    }
    currentLane.inputTextObj.setText(currentLane.inputText);

    if (currentLane.inputText === currentLane.currentWord) {
      this.score++;
      this.scoreText.setText(`Score: ${this.score}`);
      currentLane.pickWord();
    }
  }

  private switchToLane(laneIndex: number): void {
    this.lanes[this.activeLane].clearInput();
    this.activeLane = laneIndex;
    this.highlightActiveLane();
  }

  private endGame(): void {
    this.gameActive = false;
    this.timerEvent.remove(false);

    this.lanes.forEach((lane) => {
      lane.cleanup();
    });

    this.gameOverText = this.add
      .text(400, 200, "Game Over", {
        fontSize: "48px",
        backgroundColor: "#f00",
      })
      .setOrigin(0.5);
    this.retryButton.setVisible(true);
  }
}
