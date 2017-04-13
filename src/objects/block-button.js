import TextFactory from 'helpers/text-factory';

const ALPHA_DISABLED = 0.4;
const ALPHA_ENABLED = 1;
const ALPHA_TIME = 500;

class BlockButton {
  constructor(game, options) {
    this.game = game;
    this.x = options.x;
    this.y = options.y;
    this.icon = options.icon;
    this.cost = options.cost;
    this.onTap = options.onTap;
    this.selected = false;

    this._buildButton();
    this._buildIcon();
    this._buildText();
  }

  deselect() {
    this.selected = false;
    this._updateFrames();
  }

  disable() {
    this.button.input.enabled = false;
    this._updateAlpha(ALPHA_DISABLED);
  }

  enable() {
    this.button.input.enabled = true;
    this._updateAlpha(ALPHA_ENABLED);
  }

  isEnabled() {
    return this.button.inputEnabled;
  }

  _buildButton() {
    this.button = this.game.add.button(
      this.x,
      this.y,
      'button',
      this._onTapButton,
      this,
      1,
      0,
      2
    );
    this.button.input.enabled = false;
    this.button.alpha = ALPHA_DISABLED;
  }

  _buildIcon() {
    this.iconSprite = this.game.add.sprite(this.x + 13, this.y + 10, this.icon);
    this.iconSprite.scale.setTo(0.25);
    this.iconSprite.alpha = ALPHA_DISABLED;
  }

  _buildText() {
    this.buttonText = TextFactory.build(this.game, {
      text: `${this.cost}`,
      x: this.x + 68,
      y: this.y + 26,
      size: 14
    });
    this.buttonText.anchor.setTo(0.5);
    this.buttonText.alpha = ALPHA_DISABLED;
  }

  _onTapButton() {
    this.onTap();
    this.selected = !this.selected;
    this._updateFrames();
  }

  _updateFrames() {
    const frames = this.selected ? [4, 3, 5] : [1, 0, 2];
    this.button.setFrames(...frames);
  }

  _updateAlpha(alpha) {
    this.game.add.tween(this.button).to({ alpha: alpha }, ALPHA_TIME).start();
    this.game.add.tween(this.buttonText).to({ alpha: alpha }, ALPHA_TIME).start();
    this.game.add.tween(this.iconSprite).to({ alpha: alpha }, ALPHA_TIME).start();
  }
}

export default BlockButton;
