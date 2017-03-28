class Color {
  constructor(hexString) {
    this.hexString = hexString;
  }

  toString() {
    return `#${this.hexString}`;
  }

  toHex() {
    return parseInt(this.hexString, 16);
  }
}

export const COLOR = {
  black: new Color('000000'),
  gray: new Color('555555'),
  red: new Color('bc2600'),
  white: new Color('ffffff')
};

export default Color;
