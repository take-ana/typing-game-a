import Phaser from "phaser";
import { Lane } from "../Lane";
import { gameConfig } from "../../config/config";

export class MainScene extends Phaser.Scene {
  private words: string[];
  private score: number;
  private timeRemaining: number;
  private gameActive: boolean;
  private lanes: Lane[];
  private activeLane: number;
  private numberInputSequence: string;
  private timerText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
  private startButton!: Phaser.GameObjects.Text;
  private retryButton!: Phaser.GameObjects.Text;
  private gameOverText!: Phaser.GameObjects.Text;
  private timerEvent!: Phaser.Time.TimerEvent;

  constructor() {
    super("MainScene");
    this.words = gameConfig.words;
    this.score = 0;
    this.timeRemaining = gameConfig.game.timer;
    this.gameActive = false;
    this.lanes = [];
    this.activeLane = 0;
    this.numberInputSequence = "";
  }

  create(): void {
    this.events.on('laneTimerExpired', () => this.endGame(), this);

    this.timerText = this.add.text(
      gameConfig.ui.positions.timer.x,
      gameConfig.ui.positions.timer.y,
      `Time: ${this.timeRemaining}`,
      {
        fontSize: gameConfig.ui.fontSize.large,
        backgroundColor: gameConfig.ui.colors.background,
      }
    );
    this.scoreText = this.add.text(
      gameConfig.ui.positions.score.x,
      gameConfig.ui.positions.score.y,
      `Score: ${this.score}`,
      {
        fontSize: gameConfig.ui.fontSize.large,
        backgroundColor: gameConfig.ui.colors.background,
      }
    );

    this.createLanes();

    // Start ボタン
    this.startButton = this.add
      .text(
        gameConfig.ui.positions.startButton.x,
        gameConfig.ui.positions.startButton.y,
        "Start",
        {
          fontSize: gameConfig.ui.fontSize.xlarge,
          backgroundColor: gameConfig.ui.colors.success,
        }
      )
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => this.startGame());

    // Retry ボタン
    this.retryButton = this.add
      .text(
        gameConfig.ui.positions.retryButton.x,
        gameConfig.ui.positions.retryButton.y,
        "Retry",
        {
          fontSize: gameConfig.ui.fontSize.xlarge,
          backgroundColor: gameConfig.ui.colors.danger,
        }
      )
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => this.startGame())
      .setVisible(false);

    // キーボード入力
    this.input.keyboard?.on("keydown", (event: KeyboardEvent) => this.handleKey(event), this);
  }

  private createLanes(): void {
    for (let i = 0; i < gameConfig.lanes.count; i++) {
      const x = gameConfig.lanes.positions[i];
      const [min, max] = gameConfig.lanes.numberRanges[i];
      const laneNumber = Phaser.Math.Between(min, max);

      const lane = new Lane(this, x, laneNumber, this.words, gameConfig.lanes.wordTimer);
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
    this.timeRemaining = gameConfig.game.timer;
    this.gameActive = true;
    this.activeLane = 0;
    this.numberInputSequence = "";
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
      this.numberInputSequence += event.key;
      
      for (let i = 0; i < this.lanes.length; i++) {
        const lane = this.lanes[i];
        if (lane.number.toString() === this.numberInputSequence) {
          this.switchToLane(i);
          this.numberInputSequence = "";
          return;
        }
      }
      
      if (this.numberInputSequence.length > 2 || !this.hasValidPrefix()) {
        this.numberInputSequence = event.key;
        
        for (let i = 0; i < this.lanes.length; i++) {
          const lane = this.lanes[i];
          if (lane.number.toString() === this.numberInputSequence) {
            this.switchToLane(i);
            this.numberInputSequence = "";
            return;
          }
        }
      }
      return;
    }

    const currentLane = this.lanes[this.activeLane];
    if (event.key === "Backspace") {
      this.numberInputSequence = "";
      currentLane.handleBackspace();
    } else if (event.key.length === 1 && /[a-zA-Z]/.test(event.key)) {
      this.numberInputSequence = "";
      currentLane.handleCharacterInput(event.key);
    }

    if (currentLane.isWordComplete()) {
      this.score++;
      this.scoreText.setText(`Score: ${this.score}`);
      currentLane.pickWord();
    }
  }

  private hasValidPrefix(): boolean {
    return this.lanes.some(lane => 
      lane.number.toString().startsWith(this.numberInputSequence)
    );
  }

  private switchToLane(laneIndex: number): void {
    this.lanes[this.activeLane].clearInput();
    
    // 切り替え元のレーンの数字をランダムに再選択
    const oldLane = this.lanes[this.activeLane];
    const [min, max] = gameConfig.lanes.numberRanges[this.activeLane];
    const newNumber = Phaser.Math.Between(min, max);
    oldLane.updateNumber(newNumber);
    
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
      .text(
        gameConfig.ui.positions.gameOver.x,
        gameConfig.ui.positions.gameOver.y,
        "Game Over",
        {
          fontSize: gameConfig.ui.fontSize.xlarge,
          backgroundColor: gameConfig.ui.colors.danger,
        }
      )
      .setOrigin(0.5);
    this.retryButton.setVisible(true);
  }
}
