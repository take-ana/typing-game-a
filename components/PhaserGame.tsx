import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import { MainScene } from "./scenes/main"; // 先ほどの main.ts でエクスポートした MainScene
import { gameConfig } from "../config/config";

const PhaserGame: React.FC = () => {
  const gameContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gameContainer.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: gameConfig.game.canvasWidth,
      height: gameConfig.game.canvasHeight,
      parent: gameContainer.current,
      scene: MainScene,
      backgroundColor: gameConfig.game.backgroundColor,
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div ref={gameContainer} className={`w-[${gameConfig.game.canvasWidth}px] h-[${gameConfig.game.canvasHeight}px]`}>
        {/* Phaser がここにゲームを描画します */}
      </div>
    </div>
  );
};

export default PhaserGame;
