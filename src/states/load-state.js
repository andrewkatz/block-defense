import ASSETS from 'assets';

class LoadState extends Phaser.State {
  preload() {
    this._addLabel();
    this._addProgressBar();
    this._loadAssets();
  }

  create() {
    this.game.state.start('menu');
  }

  _addLabel() {
    this.loadingLabel = this.game.add.text(
      this.game.world.centerX,
      this.game.world.centerY - 10,
      'LOADING',
      {
        font: `14px 'Rajdhani'`,
        fill: '#555555',
        fontWeight: 'bold'
      }
    );
    this.loadingLabel.anchor.setTo(0.5, 0.5);
  }

  _addProgressBar() {
    this.progressBar = this.game.add.sprite(
      this.game.world.centerX,
      this.game.world.centerY + 10,
      'progress-bar'
    );
    this.progressBar.anchor.setTo(0.5, 0.5);
    this.game.load.setPreloadSprite(this.progressBar);
  }

  _loadAssets() {
    ASSETS.images.forEach(image => this._loadImage(image));
    ASSETS.spritesheets.forEach(spritesheet => this._loadSpritesheet(spritesheet));
    ASSETS.audio.forEach(audio => this._loadAudio(audio));
    ASSETS.atlases.forEach(atlas => this._loadAtlas(atlas));
  }

  _loadImage(name) {
    this.game.load.image(name, `assets/${name}.png`);
  }

  _loadSpritesheet(spritesheet) {
    this.game.load.spritesheet(
      spritesheet.name,
      `assets/${spritesheet.name}.png`,
      spritesheet.width,
      spritesheet.height
    );
  }

  _loadAudio(audio) {
    this.game.load.audio(audio.name, audio.files.map(file => `assets/${file}`));
  }

  _loadAtlas(atlas) {
    this.game.load.atlas(
      atlas,
      `assets/${atlas}.png`,
      `assets/${atlas}.xml`,
      null,
      Phaser.Loader.TEXTURE_ATLAS_XML_STARLING
    );
  }
}

export default LoadState;
