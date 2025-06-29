import Phaser from "phaser";

export class Lane {
  public number: number;
  public currentWord: string;
  public inputText: string;
  public wordTimer: number;
  public wordTimerEvent?: Phaser.Time.TimerEvent;
  public isActive: boolean;
  
  public numberText: Phaser.GameObjects.Text;
  public wordText: Phaser.GameObjects.Text;
  public inputTextObj: Phaser.GameObjects.Text;
  public wordTimerText: Phaser.GameObjects.Text;

  private scene: Phaser.Scene;
  private words: string[];

  constructor(
    scene: Phaser.Scene,
    x: number,
    number: number,
    words: string[]
  ) {
    this.scene = scene;
    this.number = number;
    this.currentWord = "";
    this.inputText = "";
    this.wordTimer = 3;
    this.isActive = false;
    this.words = words;

    this.numberText = scene.add
      .text(x, 120, number.toString(), {
        fontSize: "24px",
        backgroundColor: "#333",
        color: "#fff",
      })
      .setOrigin(0.5);

    this.wordText = scene.add
      .text(x, 200, "", { fontSize: "32px", backgroundColor: "#000" })
      .setOrigin(0.5);

    this.inputTextObj = scene.add
      .text(x, 280, "", { fontSize: "32px", backgroundColor: "#000" })
      .setOrigin(0.5);

    this.wordTimerText = scene.add
      .text(x, 360, "", { fontSize: "20px", backgroundColor: "#666" })
      .setOrigin(0.5);
  }

  public activate(): void {
    this.isActive = true;
    this.numberText.setStyle({
      backgroundColor: "#0f0",
      color: "#000",
    });
  }

  public deactivate(): void {
    this.isActive = false;
    this.numberText.setStyle({
      backgroundColor: "#333",
      color: "#fff",
    });
  }

  public pickWord(): void {
    this.currentWord = Phaser.Utils.Array.GetRandom(this.words);
    this.wordText.setText(this.currentWord);
    this.inputText = "";
    this.inputTextObj.setText("");
    this.wordTimer = 3;
    this.wordTimerText.setText(`${this.wordTimer}s`);

    if (this.wordTimerEvent) {
      this.wordTimerEvent.remove(false);
    }

    this.wordTimerEvent = this.scene.time.addEvent({
      delay: 1000,
      callback: () => this.onTimerTick(),
      callbackScope: this,
      loop: true,
    });
  }

  private onTimerTick(): void {
    this.wordTimer--;
    this.wordTimerText.setText(`${this.wordTimer}s`);
    if (this.wordTimer <= 0) {
      this.scene.events.emit('laneTimerExpired');
    }
  }

  public clearInput(): void {
    this.inputText = "";
    this.inputTextObj.setText("");
  }

  public cleanup(): void {
    if (this.wordTimerEvent) {
      this.wordTimerEvent.remove(false);
    }
    this.wordText.setText("");
    this.inputTextObj.setText("");
    this.wordTimerText.setText("");
  }
}
