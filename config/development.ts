import { Config, calculateLanePositions, calculateNumberRanges } from "./types";

export const developmentConfig: Config = {
  game: {
    timer: 60, // 開発時は長めに設定
    canvasWidth: 800,
    canvasHeight: 600,
    backgroundColor: "#fff",
  },
  lanes: {
    count: 3,
    positions: calculateLanePositions(3, 800, 50),
    numberRanges: calculateNumberRanges(3, 10, 99),
    wordTimer: 15, // 開発時は長めに設定
  },
  ui: {
    fontSize: {
      small: "20px",
      medium: "24px",
      large: "32px",
      xlarge: "48px",
    },
    colors: {
      background: "#000",
      text: "#fff",
      active: "#0f0",
      inactive: "#333",
      success: "#0f0",
      danger: "#f00",
      neutral: "#666",
    },
    positions: {
      timer: { x: 16, y: 16 },
      score: { x: 16, y: 56 },
      startButton: { x: 400, y: 500 },
      retryButton: { x: 400, y: 500 },
      gameOver: { x: 400, y: 200 },
      lane: {
        number: 120,
        word: 200,
        input: 280,
        timer: 360,
      },
    },
  },
  words: [
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
  ],
}