import BlockButton from 'objects/block-button';
import { COLOR } from 'helpers/color';
import Creep, { CREEP_TYPE } from 'objects/creep';
import Map from 'objects/map';
import LEVEL from 'maps/level-01';
import TextFactory from 'helpers/text-factory';
import Tower from 'objects/tower';

const BULLET_SPEED = 300;
const CREEP_SPAWN_DELAY = 700;
const INITIAL_CREDITS = 30;
const NUM_BULLETS = 400;
const NUM_CREEPS = 5;
const WAVE_DELAY = 2000;

class PlayState extends Phaser.State {
  create() {
    this.level = LEVEL;

    this.map = new Map({
      game: this.game,
      level: this.level,
      offset: { x: 0, y: 0, z: 0 }
    });

    this.surfaceLayerGroup = this.game.add.group();
    this.creeps = [];
    this.towers = [];

    this.map.creepPath((path) => {
      this.path = path;
      this._nextWave();
    });

    this.selectionMode = false;
    this.spawningWave = true;
    this.cursorPos = new Phaser.Plugin.Isometric.Point3();

    this._addBulletGroup();
    this._addBottomPanel();
    this._addTopPanel();

    this.game.input.onTap.add(this._onTap, this);
  }

  _collapseMap() {
    this.map.collapse();
  }

  _addBottomPanel() {
    this.game.add.sprite(0, this.game.world.height - 72, 'gradient');
    this._addButtons();
    this._addCreditsLabel();
  }

  _addCreditsLabel() {
    this.credits = 0;
    this.creditsLabel = TextFactory.build(this.game, {
      x: this.game.world.width - 24,
      y: this.game.world.height - 12,
      text: `${this.credits}`,
      color: COLOR.white
    });
    this.creditsLabel.anchor.setTo(1, 1);
    this._changeCredits(INITIAL_CREDITS);
  }

  _addButtons() {
    const button1 = new BlockButton(this.game, {
      x: 12,
      y: this.game.world.height - 60,
      icon: 'block-brown',
      cost: 10,
      onTap: () => {
        this.selectionMode = !this.selectionMode;
      }
    });
    const button2 = new BlockButton(this.game, {
      x: 120,
      y: this.game.world.height - 60,
      icon: 'block-blue',
      cost: 30,
      onTap: () => {
        this.selectionMode = !this.selectionMode;
      }
    });

    this.buttons = [
      button1,
      button2
    ];
  }

  _addBulletGroup() {
    this.bulletGroup = this.game.add.group();

    for (let i = 0; i < NUM_BULLETS; i++) {
      const bullet = this.game.add.isoSprite(0, 0, 0, 'pixel', 0, this.bulletGroup);
      bullet.anchor.setTo(0.5);
      this.game.physics.isoArcade.enable(bullet);
      bullet.kill();
    }
  }

  _addTopPanel() {
    const panelBackground = this.game.add.sprite(0, 72, 'gradient');
    panelBackground.scale.setTo(1, -1);
    this._addWaveLabel();
  }

  _addWaveLabel() {
    this.wave = 0;
    this.waveLabel = TextFactory.build(this.game, {
      x: this.game.world.centerX,
      y: 12,
      text: `WAVE ${this.wave}`,
      color: COLOR.white
    });
    this.waveLabel.anchor.setTo(0.5, 0);
    this.waveLabel.alpha = 0;
  }

  _nextWave() {
    this.creeps = [];

    this.wave++;
    this.waveLabel.text = `WAVE ${this.wave}`;
    this.game.add.tween(this.waveLabel).to({ alpha: 1 }, 2000).start();

    const creepType = this.wave % 2 === 1 ? CREEP_TYPE.walking : CREEP_TYPE.floating;
    const numCreeps = NUM_CREEPS + this.wave;

    for (let i = 0; i < numCreeps; i++) {
      this.game.time.events.add(
        i * CREEP_SPAWN_DELAY,
        this._spawnCreep,
        this,
        this.path,
        creepType
      );
    }

    this.game.time.events.add(numCreeps * CREEP_SPAWN_DELAY, this._doneSpawning, this);
  }

  _spawnCreep(path, creepType) {
    const creep = new Creep(this.game, this.surfaceLayerGroup, creepType, this.wave);
    creep.spawn(this.map, path);
    this.creeps.push(creep);
  }

  _doneSpawning() {
    this.spawningWave = false;
  }

  _onTap() {
    if (!this.selectionMode || !this.selectedPos) {
      return;
    }

    this.selectionMode = false;
    this.buttons.forEach(button => button.deselect());
    this.map.clearTileSelection();

    const tower = new Tower(this.game, this.surfaceLayerGroup);
    tower.setPosition(this.map.worldPosition(this.selectedPos.x, this.selectedPos.y));
    this.towers.push(tower);

    this._changeCredits(-30);
  }

  update() {
    this.game.iso.simpleSort(this.surfaceLayerGroup);
    this.game.iso.unproject(this.game.input.activePointer.position, this.cursorPos);
    this.selectedPos = this.map.getSelectedPos(this.selectionMode, this.cursorPos);

    this.game.physics.isoArcade.overlap(
      this.surfaceLayerGroup,
      this.bulletGroup,
      this._damageCreep,
      this._shouldDamageCreep,
      this
    );

    this.towers.forEach(tower => this._shoot(tower));
    this._updateMovingBullets();

    if (this._getLivingCreep().length === 0 && !this.spawningWave) {
      this.spawningWave = true;
      this.game.add.tween(this.waveLabel).to({ alpha: 0 }, WAVE_DELAY).start();
      this.game.time.events.add(WAVE_DELAY, this._nextWave, this);
    }
  }

  _getLivingCreep() {
    return this.creeps.filter(creep => creep.alive());
  }

  _damageCreep(creep, bullet) {
    creep.damage(1);
    if (!creep.alive) {
      this._changeCredits(bullet.creepTarget.getCreditValue());
    }

    bullet.kill();
  }

  _changeCredits(credits) {
    this.credits += credits;
    this.creditsLabel.text = `${this.credits}`;

    this.buttons.forEach((button) => {
      if (!button.isEnabled() && this.credits >= button.cost) {
        button.enable();
      }

      if (button.isEnabled && this.credits < button.cost) {
        button.disable();
      }
    });
  }

  _shouldDamageCreep(creep, bullet) {
    return bullet.creepTarget.sprite === creep;
  }

  _shoot(tower) {
    if (!tower.canShoot()) {
      return;
    }

    const creep = this._getClosestCreep(tower);
    if (!creep) {
      return;
    }

    if (!tower.inRange(creep.sprite)) {
      return;
    }

    this._spawnBullet(tower, creep);
    tower.shoot();
  }

  _getClosestCreep(tower) {
    let shortestDistance, closestCreep;

    this._getLivingCreep().forEach((creep) => {
      const distance = tower.distanceToObject(creep.sprite);

      if (!shortestDistance || distance < shortestDistance) {
        shortestDistance = distance;
        closestCreep = creep;
      }
    });

    return closestCreep;
  }

  _spawnBullet(tower, creepTarget) {
    const bullet = this.bulletGroup.getFirstDead();
    if (!bullet) {
      return false;
    }

    bullet.reset(0, 0);
    bullet.isoX = tower.sprite.isoX - 20;
    bullet.isoY = tower.sprite.isoY - 20;
    bullet.isoZ = creepTarget.sprite.isoZ;
    bullet.body.angularVelocity = 100;
    bullet.creepTarget = creepTarget;
  }

  _updateMovingBullets() {
    const livingCreep = this._getLivingCreep();

    this.bulletGroup.forEachAlive((bullet) => {
      if (!bullet.creepTarget.alive()) {
        if (livingCreep.length > 0) {
          bullet.creepTarget = livingCreep[0];
        } else {
          bullet.kill();
          return;
        }
      }

      this._moveToObject(bullet, bullet.creepTarget.sprite, BULLET_SPEED);
    });
  }

  _moveToObject(object, destination, speed) {
    if (speed === undefined) { speed = 100; }

    let angle = Math.atan2(destination.isoY - object.isoY, destination.isoX - object.isoX);
    object.body.velocity.x = Math.cos(angle) * speed;
    object.body.velocity.y = Math.sin(angle) * speed;

    angle = Math.atan2(destination.isoZ - object.isoZ, destination.isoX - object.isoX);
    object.body.velocity.z = Math.sin(angle) * speed;
  }

  render() {
    // this.game.debug.text(this.game.time.fps || '--', 2, 14, '#a7aebe');

    // this.bulletGroup.forEach(bullet => this.game.debug.body(bullet, null, true, true));
    // this.surfaceLayerGroup.forEach(creep => this.game.debug.body(creep, null, true, true));
  }
}

export default PlayState;
