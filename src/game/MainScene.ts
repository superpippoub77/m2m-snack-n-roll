import Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private currentMapKey: string = 'map1'; // Inizialmente la mappa è 'map1'

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
    this.load.image('tiles', '/assets/images/tiles.webp');
  }

  create(): void {
    // Verifica che la mappa corrente sia presente nella cache
    if (!this.cache.tilemap.has(this.currentMapKey)) {
      console.error(`Errore: la mappa con chiave "${this.currentMapKey}" non è stata trovata nella cache.`);
      return;
    }

    // Carica la mappa attuale
    const map = this.make.tilemap({ key: this.currentMapKey });

    // Controlla i layer disponibili nella mappa
    console.log('Layer disponibili nella mappa:', map.layers.map(layer => layer.name));

    // Aggiungi il tileset
    const tileset = map.addTilesetImage('tiles', 'tiles');
    if (!tileset) {
      console.error('Errore: il tileset "tiles" non è stato trovato nella mappa.');
      return;
    }

    // Crea i layer
    const backgroundLayer = map.createLayer('Background', tileset, 0, 0);
    const platformsLayer = map.createLayer('Platforms', tileset, 0, 0);

    if (!backgroundLayer) {
      console.warn('Il layer "Background" non è stato trovato nella mappa. Questo potrebbe essere normale.');
    }

    if (!platformsLayer) {
      console.error('Errore: il layer "Platforms" non è stato trovato nella mappa.');
      return;
    }

    // Configura la collisione per il layer delle piattaforme
    platformsLayer.setCollisionByExclusion([-1]);

    // Configura il sistema fisico del giocatore
    this.player = this.physics.add.sprite(100, 100, 'biscotto');
    this.player.setCollideWorldBounds(true);

    // Aggiungi la collisione tra il giocatore e le piattaforme
    this.physics.add.collider(this.player, platformsLayer);

    // Configura i controlli
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    } else {
      console.error('Errore: la tastiera non è stata inizializzata correttamente.');
    }

    // Aggiungi il cambio mappa al tasto SPACE
    this.input.keyboard?.on('keydown-SPACE', () => {
      this.switchMap();
    });
  }

  update(): void {
    // Gestione del movimento del giocatore
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

  private switchMap(): void {
    // Cambia la mappa tra 'map1' e 'map2'
    this.currentMapKey = this.currentMapKey === 'map1' ? 'map2' : 'map1';

    // Verifica prima di riavviare la scena
    if (!this.cache.tilemap.has(this.currentMapKey)) {
      console.error(`Errore: impossibile cambiare mappa. La mappa con chiave "${this.currentMapKey}" non è nella cache.`);
      return;
    }

    // Riavvia la scena con la nuova mappa
    this.scene.restart();
  }
}
