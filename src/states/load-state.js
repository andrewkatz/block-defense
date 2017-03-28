import ASSETS from 'assets';

class LoadState extends Phaser.State {
  preload() {
    this._addLabel();
    this._addProgressBar();
    this._loadAssets();
  }

  create() {
    this.loadingLabel.kill();
    this.progressBar.kill();

    this.startLabel = this.game.add.text(
      this.game.world.centerX,
      this.game.world.centerY + 180,
      'PRESS SPACE TO START',
      {
        font: `10px 'Press Start 2P'`,
        fill: '#ffffff'
      }
    );
    this.startLabel.anchor.setTo(0.5, 0.5);

    const keyboard = this.game.input.keyboard;
    keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
    this.spacebar = keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.starting = false;

    this.autoStart = false;
  }

  update() {
    if (this.starting) {
      return;
    }

    if (this.spacebar.isDown || this.autoStart) {
      this.starting = true;
      this.startLabel.alpha = 0;
      this.game.time.events.add(1100, this._startGame, this);

      const bmd = this.game.add.bitmapData(this.game.world.width, this.game.world.height);
      bmd.ctx.beginPath();
      bmd.ctx.rect(0, 0, this.game.world.width, this.game.world.height);
      bmd.ctx.fillStyle = '#000';
      bmd.ctx.fill();
      this.titleBackdrop = this.game.world.create(0, 0, bmd);
      this.titleBackdrop.alpha = 0;
      this.game.add.tween(this.titleBackdrop).to({ alpha: 1 }, 1000).start();
    }
  }

  _startGame() {
    this.game.state.start('play');
  }

  _addLabel() {
    this.loadingLabel = this.game.add.text(
      this.game.world.centerX,
      this.game.world.centerY + 120,
      'LOADING',
      {
        font: `10px 'Press Start 2P'`,
        fill: '#ffffff'
      }
    );
    this.loadingLabel.anchor.setTo(0.5, 0.5);
  }

  _addProgressBar() {
    this.progressBar = this.game.add.sprite(
      this.game.world.centerX,
      this.game.world.centerY + 140,
      'progressBar'
    );
    this.progressBar.anchor.setTo(0.5, 0.5);
    this.game.load.setPreloadSprite(this.progressBar);
  }

  _loadAssets() {
    ASSETS.images.forEach(image => this._loadImage(image));
    ASSETS.spritesheets.forEach(spritesheet => this._loadSpritesheet(spritesheet));
    ASSETS.audio.forEach(audio => this._loadAudio(audio));
  }

  _loadImage(name) {
    this.game.load.image(name, `assets/${name}.png`);
  }

  _loadSpritesheet(name) {
    this.game.load.spritesheet(name, `assets/${name}.png`, 64, 64);
  }

  _loadAudio(audio) {
    this.game.load.audio(audio.name, audio.files.map(file => `assets/${file}`));
  }
}

export default LoadState;
