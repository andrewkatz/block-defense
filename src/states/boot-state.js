class BootState extends Phaser.State {
  preload() {
    this.game.load.image('progress-bar', 'assets/progress-bar.png');
  }

  create() {
    this.game.stage.backgroundColor = '#000';
    this.game.plugins.add(new Phaser.Plugin.Isometric(this.game, Phaser.Plugin.Isometric.CLASSIC));
    this.game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);
    this.game.iso.anchor.setTo(0.5, 0.25);
    this.game.time.advancedTiming = true;
    this.game.state.start('load');
  }
}

export default BootState;
