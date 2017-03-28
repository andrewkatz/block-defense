import { COLOR } from 'helpers/color';

class TextFactory {
  static build(game, options) {
    const font = 'Press Start 2P';
    let color = COLOR.white;
    let size = 20;

    if (options.color) {
      color = options.color;
    }

    if (options.size) {
      size = options.size;
    }

    return game.add.text(options.x, options.y, options.text, {
      font: `${size}px '${font}'`,
      fill: color.toString()
    });
  }
}

export default TextFactory;
