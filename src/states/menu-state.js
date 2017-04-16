import TextFactory from 'helpers/text-factory';
import Classic from 'maps/classic';
import StraightShot from 'maps/straight-shot';

class MenuState extends Phaser.State {
  create() {
    this.titleLabel = TextFactory.build(this.game, {
      text: 'BLOCK DEFENSE'
    });
    this.chooseAMapLabel = TextFactory.build(this.game, {
      text: 'Choose a map',
      y: 30,
      size: 16
    });

    this.classicLabel = TextFactory.build(this.game, {
      text: Classic.name,
      x: this.game.world.centerX,
      y: this.game.world.centerY - 50,
      size: 50
    });
    this.classicLabel.anchor.setTo(0.5, 1);
    this.classicLabel.inputEnabled = true;
    this.classicLabel.input.useHandCursor = true;
    this.classicLabel.events.onInputDown.add(this._clickedLabel, this);
    this.classicLabel.events.onInputOver.add(this._hoverLabel, this);
    this.classicLabel.events.onInputOut.add(this._outLabel, this);

    this.straightShotLabel = TextFactory.build(this.game, {
      text: StraightShot.name,
      x: this.game.world.centerX,
      y: this.game.world.centerY + 50,
      size: 50
    });
    this.straightShotLabel.anchor.setTo(0.5, 1);
    this.straightShotLabel.inputEnabled = true;
    this.straightShotLabel.input.useHandCursor = true;
    this.straightShotLabel.events.onInputDown.add(this._clickedLabel, this);
    this.straightShotLabel.events.onInputOver.add(this._hoverLabel, this);
    this.straightShotLabel.events.onInputOut.add(this._outLabel, this);
  }

  _clickedLabel(label) {
    if (label === this.classicLabel) {
      this._selectMap(Classic);
    } else if (label === this.straightShotLabel) {
      this._selectMap(StraightShot);
    }
  }

  _hoverLabel(label) {
    label.alpha = 0.8;
  }

  _outLabel(label) {
    label.alpha = 1;
  }

  _selectMap(map) {
    this.game.level = map;
    this.game.state.start('play');
  }
}

export default MenuState;
