import Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private currentMapKey: string = 'map1'; // Mappa iniziale

  constructor() {
    super('MainScene');
  }

  preload(): void {
    // Carica l'immagine del giocatore
    this.load.image('biscotto', './assets/images/biscotto.webp');

    // Carica la mappa e i tileset
    this.load.tilemapTiledJSON('map1', './assets/maps/map1.json');
    this.load.tilemapTiledJSON('map2', './assets/maps/map2.json');
    this.load.image('tiles', '/assets/images/tiles.webp');
  }

  create(): void {
    // Carica la mappa
    const map = this.make.tilemap({ key: this.currentMapKey });

    // Aggiungi il tileset
    const tileset = map.addTilesetImage('tiles', 'tiles');
    if (!tileset) {
      console.error('Errore: il tileset "tiles" non è stato trovato.');
      return;
    }

    // Crea i layer della mappa
    const backgroundLayer = map.createLayer('Background', tileset, 0, 0);
    const platformsLayer = map.createLayer('Platforms', tileset, 0, 0);
    
    // Gestione del layer "Platforms" che potrebbe essere null
    if (!platformsLayer) {
      console.error('Errore: il layer "Platforms" non è stato trovato nella mappa.');
      return;
    }
    platformsLayer.setCollisionByExclusion([-1]);

    // Crea il giocatore
    this.player = this.physics.add.sprite(100, 100, 'biscotto');
    this.player.setCollideWorldBounds(true);

    // Aggiungi la collisione tra il giocatore e le piattaforme
    this.physics.add.collider(this.player, platformsLayer);

    // Verifica e configura i controlli
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    } else {
      console.error('Errore: la tastiera non è stata inizializzata correttamente.');
      return;
    }

    // Imposta la telecamera per seguire il giocatore
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Cambia mappa con la barra spaziatrice
    this.input.keyboard.on('keydown-SPACE', () => this.switchMap());
  }

  update(): void {
    // Gestione movimento del giocatore
    if (this.cursors?.left?.isDown) {
      this.player.setVelocityX(-160);
    } else if (this.cursors?.right?.isDown) {
      this.player.setVelocityX(160);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors?.up?.isDown && this.player.body.blocked.down) {
      this.player.setVelocityY(-330);
    }
  }

  private switchMap(): void {
    // Cambia mappa tra 'map1' e 'map2'
    this.currentMapKey = this.currentMapKey === 'map1' ? 'map2' : 'map1';

    // Verifica prima di riavviare la scena
    if (!this.cache.tilemap.has(this.currentMapKey)) {
      console.error(`Errore: la mappa "${this.currentMapKey}" non è nella cache.`);
      return;
    }

    // Riavvia la scena con la nuova mappa
    this.scene.restart();
  }
}
