import Phaser from "phaser";
import { gameConfig } from "../config/config";

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
  private wordTimerDuration: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    number: number,
    words: string[],
    wordTimer = 10
  ) {
    this.scene = scene;
    this.number = number;
    this.currentWord = "";
    this.inputText = "";
    this.wordTimer = wordTimer;
    this.wordTimerDuration = wordTimer;
    this.isActive = false;
    this.words = words;

    this.numberText = scene.add
      .text(x, gameConfig.ui.positions.lane.number, number.toString(), {
        fontSize: gameConfig.ui.fontSize.medium,
        backgroundColor: gameConfig.ui.colors.inactive,
        color: gameConfig.ui.colors.text,
      })
      .setOrigin(0.5);

    this.wordText = scene.add
      .text(x, gameConfig.ui.positions.lane.word, "", {
        fontSize: gameConfig.ui.fontSize.large,
        backgroundColor: gameConfig.ui.colors.background,
      })
      .setOrigin(0.5);

    this.inputTextObj = scene.add
      .text(x, gameConfig.ui.positions.lane.input, "", {
        fontSize: gameConfig.ui.fontSize.large,
        backgroundColor: gameConfig.ui.colors.background,
      })
      .setOrigin(0.5);

    this.wordTimerText = scene.add
      .text(x, gameConfig.ui.positions.lane.timer, "", {
        fontSize: gameConfig.ui.fontSize.small,
        backgroundColor: gameConfig.ui.colors.neutral,
      })
      .setOrigin(0.5);
  }

  public activate(): void {
    this.isActive = true;
    this.numberText.setStyle({
      backgroundColor: gameConfig.ui.colors.active,
      color: gameConfig.ui.colors.background,
    });
  }

  public deactivate(): void {
    this.isActive = false;
    this.numberText.setStyle({
      backgroundColor: gameConfig.ui.colors.inactive,
      color: gameConfig.ui.colors.text,
    });
  }

  public pickWord(): void {
    this.currentWord = Phaser.Utils.Array.GetRandom(this.words);
    this.wordText.setText(this.currentWord);
    this.inputText = "";
    this.inputTextObj.setText("");
    this.wordTimer = this.wordTimerDuration;
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

  public handleCharacterInput(char: string): boolean {
    if (this.currentWord[this.inputText.length] === char) {
      this.inputText += char;
      this.inputTextObj.setText(this.inputText);
      return true;
    }
    return false;
  }

  public handleBackspace(): void {
    this.inputText = this.inputText.slice(0, -1);
    this.inputTextObj.setText(this.inputText);
  }

  public isWordComplete(): boolean {
    return this.inputText === this.currentWord;
  }

  public matchesNumber(digit: string): boolean {
    return this.number.toString().includes(digit);
  }

  public exactlyMatchesNumber(digit: string): boolean {
    return this.number.toString() === digit;
  }

  public startsWithNumber(digit: string): boolean {
    return this.number.toString().startsWith(digit);
  }

  public updateNumber(newNumber: number): void {
    this.number = newNumber;
    this.numberText.setText(newNumber.toString());
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
