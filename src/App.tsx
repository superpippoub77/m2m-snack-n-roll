import React from 'react';
import Game from './game/Game';

const App: React.FC = () => {
  // useEffect(() => {
  //   // Crea il gioco quando il componente viene montato
  //   const gameConfig: Phaser.Types.Core.GameConfig = {
  //     type: Phaser.AUTO,
  //     width: 800,
  //     height: 600,
  //     physics: {
  //       default: 'arcade',
  //       arcade: {
  //         gravity: { y: 500, x: 0 }, // Gravità per il movimento
  //       },
  //     },
  //     scene: MainScene, // Usa la scena principale
  //   };

  //   new Phaser.Game(gameConfig); // Crea il gioco

  //   return () => {
  //     // Distruggi il gioco quando il componente viene smontato
  //     //Phaser.Game.GlobalSceneManager.destroy();
  //   };
  // }, []);

  return <Game />
};

export default App;
