const CREDIT_VALUE = 1;
const MOVE_TIME = 10;

export const CREEP_TYPE = {
  floating: 0,
  flyingAlt: 1,
  flying: 2,
  spikey: 3,
  swimming: 4,
  walking: 5
};

const CREEP_PROPERTIES = {};
CREEP_PROPERTIES[CREEP_TYPE.floating] = {
  health: 2,
  moveTime: 700,
  zOffset: 5
};
CREEP_PROPERTIES[CREEP_TYPE.walking] = {
  health: 1,
  moveTime: 600,
  zOffset: 7
};

class Creep {
  constructor(game, group, creepType, modifier) {
    this.game = game;
    this.group = group;

    this.creepType = creepType;
    this.modifier = modifier;

    this.sprite = this.game.add.isoSprite(0, 0, 0, 'enemies', 0, group);
    this.sprite.health = CREEP_PROPERTIES[this.creepType].health * this.modifier;
    this.sprite.alpha = 0;
    this.sprite.frameName = this._frame(1);
    this.sprite.anchor.setTo(0.5, 0.5);
    this.sprite.scale.setTo(0.5);

    const frames = [this._frame(1), this._frame(2), this._frame(3)];
    this.sprite.animations.add('move', frames, 10, true);
    this.game.physics.isoArcade.enable(this.sprite);
  }

  spawn(map, path) {
    this.path = path;
    this.map = map;

    const startPos = this.map.convertPathPosition(path[0].x, path[0].y);
    this.sprite.isoX = startPos.x;
    this.sprite.isoY = startPos.y;
    this.sprite.isoZ = startPos.z - CREEP_PROPERTIES[this.creepType].zOffset;

    this.sprite.animations.play('move');
    this.game.add.tween(this.sprite).to({ alpha: 1 }, 250).start();

    this.move(path.slice(1));
  }

  move(path) {
    if (path.length < 1) {
      this.game.add.tween(this.sprite).to({ alpha: 0 }, 250).start();
      this.game.time.events.add(250, this.die, this);
      return;
    }

    if (!this.alive()) {
      return;
    }

    const moveTime = CREEP_PROPERTIES[this.creepType].moveTime - (MOVE_TIME * (this.modifier - 1));
    const nextPos = this.map.convertPathPosition(path[0].x, path[0].y);
    this.game.add.tween(this.sprite).to({ isoX: nextPos.x, isoY: nextPos.y }, moveTime).start();
    this.game.time.events.add(moveTime, this.move, this, path.slice(1));
  }

  die() {
    this.sprite.kill();
  }

  alive() {
    return this.sprite.alive;
  }

  getCreditValue() {
    return CREDIT_VALUE * this.modifier;
  }

  _frameName() {
    switch (this.creepType) {
      case CREEP_TYPE.floating:
        return 'Floating';
      case CREEP_TYPE.flyingAlt:
        return 'FlyingAlt';
      case CREEP_TYPE.flying:
        return 'Flying';
      case CREEP_TYPE.spikey:
        return 'Spikey';
      case CREEP_TYPE.swimming:
        return 'Swimming';
      case CREEP_TYPE.walking:
        return 'Walking';
    }
  }

  _frame(number) {
    return `enemy${this._frameName()}_${number}.png`;
  }
}

export default Creep;
