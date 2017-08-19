var game = new Phaser.Game(480, 320, Phaser.AUTO, null, {
  preload: preload,
  create: create,
  update: update
});

var ball;
var bar;
var bricks;
var newBrick;
var brickInfo;

function preload() {
  //Defining canvas
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  //Adding images
  game.load.image('background', 'images/background.png');
  game.load.image('ball', 'images/ball.png');
  game.load.image('bar', 'images/bar.png');
  game.load.image('brick', 'images/brick.png');
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  //Adding background
  game.add.image(0, 0, 'background');
  //Adding ball and its physics
  ball = game.add.sprite(game.world.width * 0.5, game.world.height - 25, 'ball');
  ball.anchor.set(0.5);
  game.physics.enable(ball, Phaser.Physics.ARCADE);
  ball.body.velocity.set(150, -150);
  ball.body.collideWorldBounds = true;
  ball.body.bounce.set(1);
  game.physics.arcade.checkCollision.down = false;
  ball.checkWorldBounds = true;
  ball.events.onOutOfBounds.add(function() {
    alert('BAM! Try again.');
    location.reload();
  }, this);
  //Adding bar and its physics
  bar = game.add.sprite(game.world.width * 0.5, game.world.height - 5, 'bar');
  bar.anchor.set(1, 1);
  bar.body.collideWorldBounds = true;
  game.physics.enable(bar, Phaser.Physics.ARCADE);
  bar.body.immovable = true;
  initBricks();

}

function update() {
  //Setting collisions
  game.physics.arcade.collide(ball, bar);
  bar.x = game.input.x || game.world.width * 0.5;
}

function initBricks() {
  brickInfo = {
    width: 50,
    height: 20,
    count: {
      row: 7,
      col: 3
    },
    offset: {
      top: 50,
      left: 60
    },
    padding: 10
  }
  bricks = game.add.group();
  for (c = 0; c < brickInfo.count.col; c++) {
    for (r = 0; r < brickInfo.count.row; r++) {
      var brickX = (r * (brickInfo.width + brickInfo.padding)) + brickInfo.offset.left;
      var brickY = (c * (brickInfo.height + brickInfo.padding)) + brickInfo.offset.top;
      newBrick = game.add.sprite(brickX, brickY, 'brick');
      game.physics.enable(newBrick, Phaser.Physics.ARCADE);
      newBrick.body.immovable = true;
      newBrick.anchor.set(0.5);
      bricks.add(newBrick);
    }
  }
}
