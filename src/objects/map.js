import EasyStar from 'easystarjs';

const BLOCK_WIDTH = 64;
const COLLAPSE_DELAY = 1500;
const COLLAPSE_SPEED = 1000;
const COLLAPSE_Z = -500;
const SCALE = 0.5;

const BLOCKS = [
  'block-gray',
  'block-stone'
];

class Map {
  constructor(options) {
    this.game = options.game;
    this.level = options.level;
    this.offset = options.offset;

    this._build();
    this._initPathfinder();
  }

  creepPath(callback) {
    this.pathfinder.findPath(
      this.level.start.y,
      this.level.start.x,
      this.level.end.y,
      this.level.end.x,
      path => callback(path)
    );
    this.pathfinder.calculate();
  }

  worldPosition(x, y) {
    const xPos = this.offset.x + (x * BLOCK_WIDTH * SCALE);
    const yPos = this.offset.y + (y * BLOCK_WIDTH * SCALE);
    return { x: xPos, y: yPos, z: this.offset.z };
  }

  convertPathPosition(pathX, pathY) {
    return this.worldPosition(pathY, pathX);
  }

  getSelectedPos(selectionMode, cursorPos) {
    if (!selectionMode) {
      return null;
    }

    let selectedPos = null;

    for (let x = 0; x < this.level.tiles.length; x++) {
      for (let y = 0; y < this.level.tiles[x].length; y++) {
        const sprite = this.sprites[x][y];
        const withinX = sprite.isoX <= cursorPos.x &&
          sprite.isoX + BLOCK_WIDTH * SCALE >= cursorPos.x;
        const withinY = sprite.isoY <= cursorPos.y &&
          sprite.isoY + BLOCK_WIDTH * SCALE >= cursorPos.y;

        if (withinX && withinY) {
          sprite.alpha = 0.5;
          selectedPos = { x: x, y: y };
        } else {
          sprite.alpha = 1;
        }
      }
    }

    this.game.canvas.style.cursor = selectedPos ? 'pointer' : 'default';
    return selectedPos;
  }

  clearTileSelection() {
    for (let x = 0; x < this.level.tiles.length; x++) {
      for (let y = 0; y < this.level.tiles[x].length; y++) {
        const sprite = this.sprites[x][y];
        sprite.alpha = 1;
      }
    }

    this.game.canvas.style.cursor = 'default';
  }

  collapse() {
    for (let x = 0; x < this.level.tiles.length; x++) {
      for (let y = 0; y < this.level.tiles[x].length; y++) {
        const sprite = this.sprites[x][y];
        const randomDelay = this.game.rnd.integerInRange(0, COLLAPSE_DELAY);
        const randomSpeed = this.game.rnd.integerInRange(0, COLLAPSE_SPEED);
        this.game.time.events.add(randomDelay, this._collapseSprite, this, sprite, randomSpeed);
      }
    }
  }

  _collapseSprite(sprite, speed) {
    this.game.add.tween(sprite).to({ isoZ: COLLAPSE_Z, alpha: 0 }, speed).start();
  }

  _build() {
    this.floorGroup = this.game.add.group();
    this.sprites = [];

    for (let x = 0; x < this.level.tiles.length; x++) {
      this.sprites[x] = [];

      for (let y = 0; y < this.level.tiles[x].length; y++) {
        const image = BLOCKS[this.level.tiles[x][y]];
        const pos = this.worldPosition(x, y);
        const sprite = this.game.add.isoSprite(
          pos.x,
          pos.y,
          this.level.tiles[x][y] === 1 ? pos.z - 7 : pos.z,
          image,
          0,
          this.floorGroup
        );
        sprite.scale.setTo(SCALE);
        sprite.anchor.setTo(0.5, 0);
        this.sprites[x][y] = sprite;
      }
    }
  }

  _initPathfinder() {
    this.pathfinder = new EasyStar.js();
    this.pathfinder.setGrid(this.level.tiles);
    this.pathfinder.setAcceptableTiles([1]);
  }
}

export default Map;
