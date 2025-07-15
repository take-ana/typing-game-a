export interface Config {
  game: {
    timer: number;
    canvasWidth: number;
    canvasHeight: number;
    backgroundColor: string;
  };
  lanes: {
    count: number;
    positions: number[];
    numberRanges: [number, number][];
    wordTimer: number;
  };
  ui: {
    fontSize: {
      small: string;
      medium: string;
      large: string;
      xlarge: string;
    };
    colors: {
      background: string;
      text: string;
      active: string;
      inactive: string;
      success: string;
      danger: string;
      neutral: string;
    };
    positions: {
      timer: { x: number; y: number };
      score: { x: number; y: number };
      startButton: { x: number; y: number };
      retryButton: { x: number; y: number };
      gameOver: { x: number; y: number };
      lane: {
        number: number;
        word: number;
        input: number;
        timer: number;
      };
    };
  };
  words: string[];
}

export function calculateLanePositions(count: number, canvasWidth: number, spacing: number): number[] {
  const totalWidth = canvasWidth - spacing * 2;
  const laneSpacing = totalWidth / (count + 1);
  return Array.from({ length: count }, (_, i) => spacing + laneSpacing * (i + 1));
}

export function calculateNumberRanges(count: number, start: number = 10, end: number = 99): [number, number][] {
  const total = end - start + 1;
  const rangeSize = Math.floor(total / count);
  
  return Array.from({ length: count }, (_, i) => {
    const rangeStart = start + i * rangeSize;
    const rangeEnd = i === count - 1 ? end : rangeStart + rangeSize - 1;
    return [rangeStart, rangeEnd] as [number, number];
  });
}

export function validateConfig(config: Config): boolean {
  return (
    config.lanes.count > 0 &&
    config.lanes.positions.length === config.lanes.count &&
    config.lanes.numberRanges.length === config.lanes.count &&
    config.game.timer > 0 &&
    config.lanes.wordTimer > 0 &&
    config.words.length > 0
  );
}