import TextFactory from 'helpers/text-factory';

class PlayState extends Phaser.State {
  create() {
    TextFactory.build(this.game, {
      x: this.game.world.centerX,
      y: this.game.world.centerY,
      text: 'hi'
    });
  }

  update() {
  }
}

export default PlayState;
