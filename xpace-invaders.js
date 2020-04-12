// To see it in action copy and paste the code below into https://editor.p5js.org/

var canvasSize = {
  width: 600,
  height: 400,
};

var player = {
  x: canvasSize.width / 2,
  y: canvasSize.height,
};

var bulletSize = 5;
var enemySize = 20;

var bullets = [];
var bulletColor = true;

var level = 0;
var enemies = [];

var lastTime = null;
var lives = 3;
var isDead = false;
var isInitial = true;

function setup() {
  createCanvas(canvasSize.width, canvasSize.height);
  setFrameRate(30);
  lastTime = millis();
  insertEnemy();
}

function draw() {

  // Tela inicial
  if (isInitial) {
    push();
    textSize(32);
    background(220);
    fill(0, 102, 153);
    text('Xpace Invaders', 40, 60);

    fill(0, 0, 0);
    textSize(20);
    text('Arrow keys to move', 40, 100);
    text('Space key to shoot', 40, 120);
    text('Press space to start', 40, 140);
    noLoop();
    pop();
    return;
  }

  update();
  clear();
  background(220);
  drawPlayer();
  drawEnemies();
  drawBullets();

  push();
  fill(color(255, 0, 0));
  if (lives) {
    text('❤️'.repeat(lives), 10, 20);
  } else {
    isDead = true;
    text('💀', 10, 20);
    fill(0, 0, 0);
    textSize(20);
    text('Game over! Press space to restart', 60, 80);
    noLoop();
  }
  pop();

}

function drawBullets() {
  push();

  // Anima cor do tiro
  if (bulletColor) {
    fill(color(255, 0, 0));
  } else {
    fill(color(255, 255, 0));
  }
  bulletColor = !bulletColor;

  bullets.forEach(function(bullet) {
    square(bullet.x, bullet.y, bulletSize);
  });

  pop();
}

function mousePressed() {
  bullets.push({ x: player.x, y: player.y });
}

function keyPressed() {
  var SPACE_CODE = 32;
  if (keyCode == SPACE_CODE) {
    if (isInitial) {
      isInitial = false;
      loop();
      return;
    }

    if (isDead) {
      isDead = false;
      enemies = [];
      bullets = [];
      lives = 3;
      loop();
      return;
    }

    bullets.push({ x: player.x, y: player.y });
  }

}

function drawEnemies() {
  push();
  fill(color(100, 100, 255));

  enemies.forEach(function(enemy) {
    square(enemy.x, enemy.y, enemySize);
  });

  pop();
}

function drawPlayer() {
  var x = player.x;
  var y = player.y;
  var width = 20;
  var height = 20;
  rectMode(CENTER);
  push();
  translate(x, y);
  rect(0, 0, width, height);
  fill(255, 0, 0)
  rect(0, -width/2, width/4, height/4);
  pop();
}

function updateBullets() {
  // movimenta tiros
  bullets.forEach(function (bullet, index) {
    bullet.y -= 10;

    // remove tiro se ja saiu da tela
    if (bullet.y < 0) {
      bullets.splice(index, 1);
    }
  });
}

function insertEnemy() {
  enemies.push({
    x: random(0, canvasSize.width),
    y: 0,
  });
}

function updateEnemies() {
  var currentTime = millis();

  // Insere inimigo a cada 2 segundos
  if (currentTime - lastTime > 2000) {
    lastTime = currentTime;
    insertEnemy();
  }

  // aumenta a velocidade dos inimigos a cada 10 segundos
  var speed = max(1, max(floor(lastTime / 10000), 10));
  // Movimenta inimigos
  enemies.forEach(function (enemy, index) {
    enemy.y += 1 * speed;


    // verifica se foi atingido
    bullets.forEach(function (bullet, bIndex) {
      var isColliding = rectCollision(
        enemy.x, enemy.y, enemySize, enemySize,
        bullet.x, bullet.y, bulletSize, bulletSize
      );

      if (isColliding) {
        enemies.splice(index, 1);
        bullets.splice(bIndex, 1);
      }
    });

    if (enemy.y > canvasSize.height) {
      enemies.splice(index, 1);
      lives = max(0, lives - 1);
    }
  });
}

function update() {
  updateEnemies();
  updateBullets();

  var speed = 12;

  // Movimenta o personagem verificando os limites da tela
  if (keyIsDown(DOWN_ARROW)) {
    // limite embaixo
    player.y = min(canvasSize.height, player.y + speed);
  }

  if (keyIsDown(UP_ARROW)) {
    player.y = max(canvasSize.height * 0.75, player.y - speed);
  }

  if (keyIsDown(LEFT_ARROW)) {
    player.x = max(0, player.x - speed);
  }

  if (keyIsDown(RIGHT_ARROW)) {
    player.x = min(canvasSize.width, player.x + speed);
  }
}

function rectCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
  // verifica colisão de retangulos
  if (x1 + w1 >= x2 &&
      x1 <= x2 + w2 &&
      y1 + h1 >= y2 &&
      y1 <= y2 + h2) {
        return true;
  }
  return false;
}
