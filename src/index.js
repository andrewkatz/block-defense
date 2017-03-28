import BootState from 'states/boot-state';
import LoadState from 'states/load-state';
import PlayState from 'states/play-state';

class Game extends Phaser.Game {
  constructor() {
    super(768, 768, Phaser.AUTO, 'content', null);

    this.state.add('boot', BootState, false);
    this.state.add('load', LoadState, false);
    this.state.add('play', PlayState, false);

    this.state.start('boot');
  }
}

new Game();
