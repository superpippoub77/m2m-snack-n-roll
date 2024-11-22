import React, { useEffect } from 'react';
import Phaser from 'phaser';
import MainScene from './MainScene';

const Game: React.FC = () => {
  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      physics: { default: 'arcade', arcade: { gravity: { y: 500, x: 0 } } },
      scene: [MainScene],
      parent: 'phaser-container',
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="phaser-container" />;
};

export default Game;
