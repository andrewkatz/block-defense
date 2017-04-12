const Z_OFFSET = 20;
const SHOT_DELAY = 200;
const RANGE = 200;

export const TOWER_TYPE = {
  brown: 0,
  blue: 1
};

class Tower {
  constructor(game, group, type) {
    this.game = game;
    this.group = group;
    this.type = type;

    this.sprite = this.game.add.isoSprite(0, 0, 0, 'block-blue', 0, group);
    this.sprite.scale.setTo(0.4);
    this.sprite.anchor.setTo(0.5, 0);
    this.game.physics.isoArcade.enable(this.sprite);

    this.lastShot = this.game.time.now;
  }

  getPosition() {
    return { x: this.sprite.isoX, y: this.sprite.isoY, z: this.sprite.isoZ };
  }

  setPosition(position) {
    this.sprite.isoX = position.x;
    this.sprite.isoY = position.y;
    this.sprite.isoZ = position.z + Z_OFFSET;
  }

  canShoot() {
    return this.game.time.now > this.lastShot + SHOT_DELAY;
  }

  shoot() {
    this.lastShot = this.game.time.now;
  }

  inRange(object) {
    return this.distanceToObject(object) < RANGE;
  }

  distanceToObject(object) {
    const dx = this.sprite.isoX - object.isoX;
    const dy = this.sprite.isoY - object.isoY;
    const dz = this.sprite.isoZ - object.isoZ;

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
}

export default Tower;
