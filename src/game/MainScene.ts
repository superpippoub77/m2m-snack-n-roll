import Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private currentMapKey: string = 'map1';  // Inizialmente la mappa è 'map1'

  constructor() {
    super('MainScene');
  }

  preload(): void {
    // Carica l'immagine per il giocatore
    this.load.image('biscotto', './assets/images/biscotto.webp');

    // Carica entrambe le mappe
    this.load.tilemapTiledJSON('map1', './assets/maps/map1.json');
    this.load.tilemapTiledJSON('map2', './assets/maps/map2.json');
    
    // Carica l'immagine per il tileset
    this.load.image('tiles', '/assets/tiles.png');
  }

  create(): void {
    // Carica la mappa attuale (in base alla variabile currentMapKey)
    const map = this.make.tilemap({ key: this.currentMapKey });

    // Aggiungi il tileset
    const tileset = map.addTilesetImage('tiles', 'tiles');

    // Verifica se il tileset è null e se non lo è, crea i layer
    if (tileset) {
      const backgroundLayer = map.createLayer('Background', tileset, 0, 0);
      const platformsLayer = map.createLayer('Platforms', tileset, 0, 0);

      // Verifica che il layer 'Platforms' non sia null
      if (platformsLayer) {
        // Imposta la collisione per il layer delle piattaforme
        platformsLayer.setCollisionByExclusion([-1]);
        this.physics.add.collider(this.player, platformsLayer);
      } else {
        console.error('Il layer "Platforms" non è stato trovato nella mappa.');
      }
    } else {
      console.error('Tileset non trovato');
    }

    // Aggiungi il giocatore
    this.player = this.physics.add.sprite(100, 100, 'biscotto');
    this.player.setCollideWorldBounds(true);

    // Configura i controlli (verifica se la tastiera è presente)
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    } else {
      console.error('La tastiera non è stata inizializzata correttamente');
    }

    // Aggiungi un modo per cambiare mappa, ad esempio premendo il tasto 'SPACE'
    this.input.keyboard?.on('keydown-SPACE', () => {
      this.switchMap();
    });
  }

  update(): void {
    // Gestisci il movimento del giocatore
    if (this.cursors.left?.isDown) {
      this.player.setVelocityX(-160);
    } else if (this.cursors.right?.isDown) {
      this.player.setVelocityX(160);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.up?.isDown && this.player.body.blocked.down) {
      this.player.setVelocityY(-330);
    }
  }

  // Funzione per cambiare mappa
  private switchMap(): void {
    // Cambia la mappa tra 'map1' e 'map2'
    this.currentMapKey = this.currentMapKey === 'map1' ? 'map2' : 'map1';

    // Riavvia la scena con la nuova mappa
    this.scene.restart();
  }
}
