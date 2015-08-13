function isFunction (obj) {
  return typeof obj === 'function';
}

var UP = new Vector(0, -1),
    DOWN = new Vector(0, 1),
    LEFT = new Vector(-1, 0),
    RIGHT = new Vector(1, 0);