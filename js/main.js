//@requires configuration.js
//@requires utils.js
//@requires classes.js
//@requires input-manager.js
//@requires player.js
//@requires scene.js
var canvas = document.querySelector('canvas'),
    context = canvas.getContext('2d'),
    input = new InputManager(),
    scene = new Scene(context, input),
    lastTime = Date.now();

var player = new Player();
player.setForce(new Force(DOWN, 9.8), 'gravity');
scene.add(player);


canvas.width = Configuration.width;
canvas.height = Configuration.height;

function addKeyboardEvents () {
  document.addEventListener('keydown', function(event) {
    input.setKey(event, true);
  });

  document.addEventListener('keyup', function(event) {
    input.setKey(event, false);
  });
}

function mainLoop () {
  var now = Date.now();
  var dt = (now - lastTime) / 1000.0;
  scene.update(dt);
  scene.draw(context);

  lastTime = now;
  window.requestAnimationFrame(mainLoop.bind(this));
}

addKeyboardEvents();
mainLoop();