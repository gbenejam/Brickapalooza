var game = new Phaser.Game(480, 320, Phaser.AUTO, null, {
  preload: preload,
  create: create,
  update: update
});

var ball;
var bar;
var level;
var bricks;
var newBrick;
var score = 0;
var scoreText;

function preload() {
  //Defining canvas
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  //Adding images
  game.load.image('ball', 'images/ball.png');
  game.load.image('powerup', 'images/ball.png');
  game.load.image('bar', 'images/bar.png');
  game.load.image('brick', 'images/brick.png');
  //Loading level
  game.load.text('level', 'levels/level.json');
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  //Adding background
  this.game.stage.backgroundColor = 0x4488cc;

  //Adding ball and its physics
  addBall();

  //Adding bar and its physics
  addBar();

  game.load.audio('song', ['audio/song.mp3']);

  // *true* param enables looping
  music = new Phaser.Sound(game,'song',1,true);

  music.play();

  scoreText = game.add.text(5, 5, 'Points: 0', { font: '18px Arial', fill: '#000000' });

  this.levelData = JSON.parse(this.game.cache.getText('level'));
  //Adding bricks
  initBricks();
}

function addBall() {
  ball = game.add.sprite(game.world.width * 0.5, game.world.height - 25, 'ball');
  ball.anchor.set(0.5);
  game.physics.enable(ball, Phaser.Physics.ARCADE);
  ball.body.velocity.set(150, -150);
  ball.body.collideWorldBounds = true;
  ball.body.bounce.set(1);
  game.physics.arcade.checkCollision.down = false;
  ball.checkWorldBounds = true;
  ball.events.onOutOfBounds.add(function() {
    alert('Try again.');
    location.reload();
  }, this);
}

function addBar() {
  bar = game.add.sprite(game.world.width * 0.5, game.world.height - 5, 'bar');
  game.physics.enable(bar, Phaser.Physics.ARCADE);
  bar.anchor.set(0.5, 1);
  bar.body.immovable = true;
}

function update() {
  //Setting collisions
  game.physics.arcade.collide(ball, bar, ballHitPaddle);
  game.physics.arcade.collide(ball, bricks, ballHitBrick);
  bar.x = game.input.x || game.world.width * 0.5;
}

function ballHitBrick(ball,brick) {
  brick.kill();
  score += 10;
  scoreText.setText('Points: ' + score);

  var bricks_alive = 0;
  for (i = 0; i < bricks.children.length; i++) {
      if (bricks.children[i].alive == true) {
        bricks_alive++;
      }
    }
    if (bricks_alive == 0) {
      alert('Congrats! You win');
      location.reload();
    }
}

function initBricks() {

  var brickInfo = this.levelData.platformData;

    bricks = game.add.group();
    for(c=0; c<brickInfo.count.col; c++) {
        for(r=0; r<brickInfo.count.row; r++) {
            var brickX = (r*(brickInfo.width+brickInfo.padding))+brickInfo.offset.left;
            var brickY = (c*(brickInfo.height+brickInfo.padding))+brickInfo.offset.top;
            newBrick = game.add.sprite(brickX, brickY, 'brick');
            game.physics.enable(newBrick, Phaser.Physics.ARCADE);
            newBrick.body.immovable = true;
            newBrick.anchor.set(0.5);
            bricks.add(newBrick);
        }
    }
}

function ballHitPaddle(ball, paddle) {
    ball.animations.play('wobble');
    ball.body.velocity.x = -1*5*(paddle.x-ball.x);
}
