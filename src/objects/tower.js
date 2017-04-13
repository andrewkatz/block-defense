import { BLOCK_SCALE, BLOCK_WIDTH } from 'objects/map';

const INITIAL_Z = 200;
const DROP_TIME = 300;

export const TOWER_TYPE = {
  brown: 0,
  blue: 1
};

const TOWER_PROPERTIES = {};
TOWER_PROPERTIES[TOWER_TYPE.brown] = {
  bullet: {
    angularVelocity: 100,
    scale: 1,
    speed: 300,
    tint: 0x5c4a46,
  },
  cost: 10,
  damage: 1,
  image: 'block-brown',
  name: 'Basic Brown Town Tower',
  range: 1,
  shotDelay: 200,
  zOffset: 20,
};
TOWER_PROPERTIES[TOWER_TYPE.blue] = {
  bullet: {
    angularVelocity: 200,
    scale: 1.1,
    speed: 500,
    tint: 0x318fdc,
  },
  cost: 30,
  damage: 3,
  image: 'block-blue',
  name: 'Lightning Tower',
  range: 4,
  shotDelay: 1000,
  zOffset: 20,
};
export { TOWER_PROPERTIES };

class Tower {
  constructor(game, group, type) {
    this.game = game;
    this.group = group;
    this.type = type;

    this.sprite = this.game.add.isoSprite(0, 0, 0, this.getImage(), 0, group);
    this.sprite.scale.setTo(0.4);
    this.sprite.anchor.setTo(0.5, 0);

    this.lastShot = this.game.time.now;
  }

  getPosition() {
    return { x: this.sprite.isoX, y: this.sprite.isoY, z: this.sprite.isoZ };
  }

  setPosition(position) {
    this.sprite.isoX = position.x;
    this.sprite.isoY = position.y;
    this.sprite.isoZ = INITIAL_Z;

    this.game.add.tween(this.sprite)
      .to({ isoZ: position.z + this.getZOffset() }, DROP_TIME, Phaser.Easing.Quadratic.Out, true)
      .start();
  }

  canShoot() {
    return this.game.time.now > this.lastShot + this.getShotDelay();
  }

  shoot() {
    this.lastShot = this.game.time.now;
  }

  inRange(object) {
    const range = this._getRealRange(this.getRange()) + this._getRealRange(1);
    return this.distanceToObject(object) < range;
  }

  distanceToObject(object) {
    const dx = this.sprite.isoX - object.isoX;
    const dy = this.sprite.isoY - object.isoY;
    const dz = this.sprite.isoZ - object.isoZ;

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  configureBullet(bullet) {
    bullet.tower = this;
    bullet.body.angularVelocity = this.getBulletAngularVelocity();
    bullet.scale.setTo(this.getBulletScale());
    bullet.tint = this.getBulletTint();
    bullet.speed = this.getBulletSpeed();
  }

  getProperties() {
    return TOWER_PROPERTIES[this.type];
  }

  getCost() {
    return this.getProperties().cost;
  }

  getRange() {
    return this.getProperties().range;
  }

  getShotDelay() {
    return this.getProperties().shotDelay;
  }

  getZOffset() {
    return this.getProperties().zOffset;
  }

  getDamage() {
    return this.getProperties().damage;
  }

  getImage() {
    return this.getProperties().image;
  }

  getBulletScale() {
    return this.getProperties().bullet.scale;
  }

  getBulletTint() {
    return this.getProperties().bullet.tint;
  }

  getBulletAngularVelocity() {
    return this.getProperties().bullet.angularVelocity;
  }

  getBulletSpeed() {
    return this.getProperties().bullet.speed;
  }

  getName() {
    return this.getProperties().name;
  }

  _getRealRange(range) {
    return range * BLOCK_SCALE * BLOCK_WIDTH;
  }
}

export default Tower;
