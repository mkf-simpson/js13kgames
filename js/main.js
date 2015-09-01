//@requires configuration.js
//@requires utils.js
//@requires classes.js
//@requires scene.js
//@requires rectangle.js
//@requires solid.js
//@requires world.js

var canvas = document.querySelector('canvas'),
    context = canvas.getContext('2d'),
    scene = new Scene(context),
    lastTime = Date.now();

canvas.width = Configuration.width;
canvas.height = Configuration.height;

var solids = [
    new Solid({
        position: new Point(100, 20),
        size: new Size(40, 40),
        isHookable: true,
        isCollidable: true,
        color: 'blue'
    }),
    new Solid({
        position: new Point(360, 20),
        size: new Size(40, 40),
        isHookable: true,
        isCollidable: false
    }),
    new Solid({
        position: new Point(230, 80),
        size: new Size(40, 40),
        isHookable: false,
        isCollidable: true,
        color: 'grey'
    }),

    new Solid({
        position: new Point(-1000, 0),
        size: new Size(1002, Configuration.height),
        isHookable: true,
        isCollidable: true
    }),
    new Solid({
        position: new Point(0, -100),
        size: new Size(Configuration.width * 100, 102),
        isHookable: true,
        isCollidable: true
    }),
    new Solid({
        position: new Point(0, Configuration.height - 2),
        size: new Size(Configuration.width * 100, 100),
        isHookable: true,
        isCollidable: true
    })
];

var rectangle = new Rectangle({
    position: new Point(250, 140),
    size: new Size(15, 15),
    mass: 2,
    restitution: -0.6,
    friction: 0.8
});
rectangle.setForce(new Force(DOWN, 9.8), 'gravity');
scene.add(rectangle);

var hook = null,
    positions = [],
    hookPositions = [],
    slowMo = false;

var frameRate = 1 / 60,
    frameRateSlow = 1 / 240;

function mainLoop () {
    var newOffset = 0;
    if (rectangle.position.x + WORLD.offset.x > canvas.width * 0.6) {
        newOffset = rectangle.position.x + WORLD.offset.x - canvas.width * 0.6;
        WORLD.offset.x -= newOffset;
    }

    else if (rectangle.position.x + WORLD.offset.x < canvas.width * 0.4) {
        var oldOffset = WORLD.offset.x;

        WORLD.offset.x -= rectangle.position.x + WORLD.offset.x - canvas.width * 0.4;
        if (WORLD.offset.x > 0) {
            WORLD.offset.x = 0;
            context.setTransform(1, 0, 0, 1, 0, 0);
        } else {
            newOffset = rectangle.position.x + oldOffset - canvas.width * 0.4;
        }
    }

    if (hook && hook.isValid) {
        rectangle.setForce(new Force(Vector.fromPoints(rectangle.position, hook.position), WORLD.hookStrength), 'hook');
    }

    var Fx = -0.5 * rectangle.square() * WORLD.rho * Math.pow(rectangle.velocity.x, 3) / Math.abs(rectangle.velocity.x);
    var Fy = -0.5 * rectangle.square() * WORLD.rho * Math.pow(rectangle.velocity.y, 3) / Math.abs(rectangle.velocity.y);

    Fx = isNaN(Fx) ? 0 : Fx;
    Fy = isNaN(Fy) ? 0 : Fy;

    var currentFrameRate = slowMo ? frameRateSlow : frameRate;

    var ax = rectangle.forceVector().x + (Fx / rectangle.mass);
    var ay = rectangle.forceVector().y + (Fy / rectangle.mass);

    rectangle.velocity.x += ax / WORLD.rho * frameRate;
    rectangle.velocity.y += ay / WORLD.rho * frameRate;

    rectangle.position.x += rectangle.velocity.x * currentFrameRate * 100;
    rectangle.position.y += rectangle.velocity.y * currentFrameRate * 100;

    var restitution = rectangle.restitution,
        friction = rectangle.friction;

    var referencePoints = rectangle.referencePoints();
    context.translate(-newOffset, 0);
    context.clearRect(-WORLD.offset.x, 0, canvas.width - WORLD.offset.x, canvas.height);
    for (var i = 0, len = solids.length; i < len; i++) {
        solids[i].draw(context);

        if (!solids[i].isCollidable) {
            continue;
        }
        if (context.isPointInPath(referencePoints.top.x, referencePoints.top.y)) {
            rectangle.velocity.y *= restitution;
            rectangle.velocity.x *= friction;
            rectangle.position.y = solids[i].position.y + solids[i].size.height + rectangle.size.width;
        }
        if (context.isPointInPath(referencePoints.bottom.x, referencePoints.bottom.y)) {
            rectangle.velocity.y *= restitution;
            rectangle.velocity.x *= friction;
            rectangle.position.y = solids[i].position.y - rectangle.size.width;
        }
        if (context.isPointInPath(referencePoints.right.x, referencePoints.right.y)) {
            rectangle.velocity.x *= restitution;
            rectangle.velocity.y *= friction;
            rectangle.position.x = solids[i].position.x - rectangle.size.width - 1;
        }
        if (context.isPointInPath(referencePoints.left.x, referencePoints.left.y)) {
            rectangle.velocity.x *= restitution;
            rectangle.velocity.y *= friction;
            rectangle.position.x = solids[i].position.x + solids[i].size.width + rectangle.size.width + 1;
        }
    }
    if (hook !== null) {
        hook.draw(context, rectangle);
    }

    var trail;
    if (slowMo) {
        for (i = 0; i < positions.length; i++) {
            trail = new Rectangle({
                position: positions[i],
                color: 'rgba(255, 0, 0, ' + i / 10 + ')',
                size: rectangle.size
            });
            trail.draw(context);
        }
        if (positions.length == 5) {
            positions.shift();
        }
        positions.push(new Point(rectangle.position.x, rectangle.position.y));
        if (hook) {
            for (i = 0; i < hookPositions.length; i++) {
                trail = new Hook({
                    position: hookPositions[i],
                    color: 'rgba(0, 0, 0, ' + i / 10 + ')'
                });
                trail.draw(context, {position: positions[i]});
            }
            if (hookPositions.length == 5) {
                hookPositions.shift();
            }
            hookPositions.push({position: new Point(hook.position.x, hook.position.y)});
        }
    }

    var now = Date.now();
    scene.draw(context);

    lastTime = now;
    window.requestAnimationFrame(mainLoop.bind(this));
}

mainLoop();

var mouseDownEvent = 'ontouchstart' in document.documentElement ? 'touchstart' : 'mousedown';
document.addEventListener(mouseDownEvent, function (event) {
    event.preventDefault();
    var coordinates = mouseDownEvent === 'touchstart' ? event.touches[0] : event;
    hook = new Hook({
        to: new Point(Math.min(coordinates.pageX - canvas.offsetLeft - WORLD.offset.x, canvas.width - WORLD.offset.x), Math.min(coordinates.pageY - canvas.offsetTop, canvas.height)),
        from: rectangle.position
    });
    if (!hook.isValid) {
        hook = null;
    }
    console.log(hook);
});

var mouseUpEvent = 'ontouchend' in document.documentElement ? 'touchend' : 'mouseup';
document.addEventListener(mouseUpEvent, function (event) {
    hook = null;
    rectangle.removeForce('hook');
});
