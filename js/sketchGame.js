// CANVAS / SYSTEM VARIABLES

var start3 = false;

var canvasC;
var can3mouseX;
var can3mouseY;
var randomX;
var randomY;

var volume;

var pieProgress = 0;

// GAME VARIABLES / ARRAYS

var balls = [];
var enemies = [];
var asteroids = [];
var mousePositions = [];

var points = 0;
var shield = false;
var newDot = true;

var avoidEnemyCreating = false;
var avoidAsteroidCreating = false;
var shotFired = false;
var showExplosion = false;
var gameIsPaused = false;

var explosionX;
var explosionY;
var explosionRadius = 250;
var explosionTimeout;

var ufoImage;
var ufoEnemyImage;
var explosionImage;
var asteroidImage;

var globalAcceleration = 0;

var frameCountTemp = 0;
var lastCount = 30;

//CANVAS 3
var sketch3 = function(can3){

  can3.preload = function() {
        ufoEnemyImage = loadImage('img/ufo 2.png');
        ufoImage = loadImage('img/ufo.png');
        explosionImage = loadImage('img/explosion.png')
        asteroidImage = loadImage('img/asteroid.png');
  }

  can3.setup = function () {

        canvasC = can3.createCanvas(window.innerWidth / 1.14, window.innerHeight / 1.3);
        canvasC.class('canvasP5');
        canvasC.parent('canvasContainer3');

        canvasC.mousePressed(fireShot);

        for (var c = 0; c < window.innerWidth / 15; c++) {
          balls.push(new Ball());
        }

        frameRate(60);
  };

  can3.draw = function () {

    if(activeArticle == 2) {

    //COLLECT VOLUME OF THE AND SONG MOUSE POSITIONS

          volume = amp.getLevel();

          can3mouseX = can3.mouseX;
          can3mouseY = can3.mouseY;


          if(can3mouseX < 18) {
            can3mouseX = 18;
          }

          if(can3mouseX > canvasC.width - 18) {
            can3mouseX = canvasC.width - 18;
          }

          if(can3mouseY < 18) {
            can3mouseY = 18;
          }

          if(can3mouseY > canvasC.height - 18) {
            can3mouseY = canvasC.height - 18;
          }

    // CLEAR THE CANVAS

              can3.clear();

      //LINES TO MARK THE CANVAS AREA

              can3.stroke(255,255,255);
              can3.strokeWeight(2);

              can3.line(0,0,canvasC.width,0);
              can3.line(0,canvasC.height,canvasC.width,canvasC.height);
              can3.line(0,0,0,canvasC.height);
              can3.line(canvasC.width,0,canvasC.width,canvasC.height);

      //CHECK IF GAME IS STARTED (PLAYER HAS TO PRESS THE PLAYBUTTON)

      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      if(start3 == true) {

          // RESPAWN POINT FOR THE BALLS IF THEY LEAVE THE CANVAS AREA

                can3.fill(0,0,0,0); can3.stroke(255,255,255);  can3.strokeWeight(10);

                can3.ellipse(canvasC.width / 2,canvasC.height / 2, 100 + 50 * volume);


          // LOADING PIE FOR EXPLOSION BREAK TIME

                if(shotFired == true) {
                  can3.fill(215,0,0); can3.strokeWeight(0);

                  can3.arc(canvasC.width / 2,canvasC.height / 2, 80, 80, 0, pieProgress, PIE);
                }
                else {
                  can3.fill(0,215,0); can3.strokeWeight(3);

                  can3.ellipse(canvasC.width / 2,canvasC.height / 2,80,80);
                }


          // NEW DOT IF PREVIOUS ONE GOT COLLECTED

                can3.strokeWeight(3); can3.fill(0,0,0); can3.stroke(255,255,255);

                if(newDot == true) {
                    randomX = random(0 + 30,canvasC.width - 30);
                    randomY = random(0 + 30,canvasC.height - 30);
                    newDot = false;
                }
                
                can3.ellipse(randomX,randomY,40,40);

          

          //CREATE NEW ENEMY EVERY 4 POINTS AND NEW ASTEROID VEIL EVERY 15 POINTS

                if(points % 4 == 0 && avoidEnemyCreating == false && points != 0) {
                    enemies.push(new Enemy());
                    enemies[enemies.length - 1].accelerate();
                    globalAcceleration = globalAcceleration + 0.005;
                    avoidEnemyCreating = true;
                }

                if(points % 15 == 0 && avoidAsteroidCreating == false && points != 0) {
                    for(var i=0;i < 8; i++) {
                        asteroids.push(new Asteroid());
                    }
                    avoidAsteroidCreating = true;
                }

          // CHECK FOR EVERY POSSIBLE COLLISION

                checkHit();

          //UPDATE POINTS

                upperRightButton.html(points);

      }

      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



        // DRAW ALL THE BALLS AND ALL THE ENEMIES

            //BALLS

              for (var c = 0; c < balls.length; c++) {

                        can3.strokeWeight(0);

                        if(balls[c].color == 1) {
                            can3.fill(random(50,125),random(10,55),0,550);
                        }
                        else {
                            can3.fill(0,0,random(50,155),550);
                        }

                        balls[c].changeVelocity();
                        can3.ellipse(balls[c].x, balls[c].y,balls[c].diameter,balls[c].diameter);

                        if(balls[c].delete == true) {
                            balls.splice(c,1);
                        }

              }

            //ENEMIES

              for(var i = 0; i < enemies.length; i++) {
                        enemies[i].changeVelocity();
                        can3.fill(0,0,0,0);
                        can3.stroke(random(155,255),0,0);
                        can3.strokeWeight(3);
                        can3.imageMode(CENTER);
                        can3.ellipse(enemies[i].x, enemies[i].y,enemies[i].diameter,enemies[i].diameter);
                        can3.image(ufoEnemyImage,enemies[i].x, enemies[i].y,enemies[i].diameter,enemies[i].diameter);                    

                        if(enemies[i].delete == true) {
                                enemies.splice(i,1);
                        }

              }

            //ASTEROIDS

              for(var i = 0; i < asteroids.length; i++) {
                        asteroids[i].changeVelocity();
                        can3.fill(0,0,0,0);
                        can3.stroke(random(155,255),0,0);
                        can3.strokeWeight(3);
                        can3.imageMode(CENTER);
                        can3.ellipse(asteroids[i].x, asteroids[i].y,asteroids[i].diameter,asteroids[i].diameter);
                        can3.image(asteroidImage,asteroids[i].x, asteroids[i].y,asteroids[i].diameter,asteroids[i].diameter);
                        
                        if(asteroids[i].delete == true) {
                                asteroids.splice(i,1);
                        }

              }


            // EXPLOSION IMAGE

                if (showExplosion == true) {
                  can3.fill(random(100,170),0,0);
                  can3.image(explosionImage,explosionX,explosionY,explosionRadius,explosionRadius);
                }


            // COLOR CHANGES ON MOUSEDOT ON SPECIFIC ACTIONS

                if (shield == false){
                  can3.strokeWeight(2); can3.stroke(255,50,0);  can3.fill(255,150,50);

                }
                else {
                  can3.fill(random(0,255),random(0,255),random(0,255)); can3.strokeWeight(0);
                  
                  can3.ellipse(can3mouseX,can3mouseY,43,43);
                }


            // VEIL BEHIND THE PLAYER AND THE SPACESHIP IMAGE FOR THE PLAYER

            //VEIL

                mousePositions.push(can3mouseX);
                mousePositions.push(can3mouseY);

                if(mousePositions.length > 9) {
                  mousePositions.splice(0,2);
                }
                can3.ellipse(mousePositions[0],mousePositions[1],window.innerWidth / 75,window.innerWidth / 75);
                can3.ellipse(mousePositions[2],mousePositions[3],window.innerWidth / 75,window.innerWidth / 75);
                can3.ellipse(mousePositions[4],mousePositions[5],window.innerWidth / 75,window.innerWidth / 75);
                can3.ellipse(mousePositions[6],mousePositions[7],window.innerWidth / 75,window.innerWidth / 75);
                can3.ellipse(mousePositions[8],mousePositions[9],window.innerWidth / 75,window.innerWidth / 75);


            //SPACESHIP 

                if(can3mouseX > canvasC.width - 10) {
                    if(window.innerWidth > 1000) {
                        can3.image(ufoImage,canvasC.width -10,can3mouseY,window.innerWidth / 50,window.innerWidth / 50);
                    }
                    else can3.image(ufoImage,canvasC.width -10,can3mouseY,20,20);
                  
                }
                else if (can3mouseX < 10) {
                    if(window.innerWidth > 1000) {
                        can3.image(ufoImage,10,can3mouseY,window.innerWidth / 50,window.innerWidth / 50);
                    }
                    else can3.image(ufoImage,10,can3mouseY,20,20);
                }
                else {
                    can3.imageMode(CENTER);
                    if(window.innerWidth > 1000) {
                        can3.image(ufoImage,can3mouseX,can3mouseY,window.innerWidth / 50,window.innerWidth / 50);
                    }
                    else can3.image(ufoImage,can3mouseX,can3mouseY,20,20);
                }

      }


  };

};

new p5(sketch3, 'canvasContainer3');

function Ball() {

    this.gotShot = false;
    this.delete = false;

    this.x = random(25,canvasC.width-25);
    this.y = random(25,canvasC.height-25);
    this.diameter = random(canvasC.height / 60,canvasC.height / 40);

    this.falldown = 1;
    
    this.color;

    if (this.x < canvasC.width /2) {
      this.color = 0;
    }
    else this.color = 1;

    this.resetPosition = function() {
        this.x = random(25,canvasC.width-25);
        this.y = random(25,canvasC.height-25);
    }


    this.changeVelocity = function() {

    // COLOR OF THE BALL (CHANGES AT THE MIDDLE OF THE SCREEN)

      if (this.x < canvasC.width /2) {
        this.color = 0;
      }
      else this.color = 1;

    // IF IT GOT HIT BY THE SHIELD OF THE PLAYER, IT WILL FALL DOWN

          if(this.gotShot == true) {
                this.y = this.y + this.falldown;
                if(this.y > canvasC.height) {
                    this.delete = true;
                }
                this.falldown = this.falldown + 2;
          }

    // IF NOT, IT WILL EITHER...

          else if (this.delete == false) {

    // ...RESPAWN IN THE MIDDLE, IF IT LEAVES THE CANVAS AREA OR...

                if (this.x > canvasC.width - 15 || this.x < 15) {
                    this.x = canvasC.width / 2;
                    this.y = canvasC.height / 2;
                }

    // ...JIGGLE RANDOMLY AND ACCORDING TO THE SONGS LOUDNESS (MORE, IF THE SONG IS LOUDER)

                else {
                    this.x = this.x + random(-2,2) * this.diameter / 3 * volume;
                }

    // ...SAME FOR THE Y-COORDINATE

                if (this.y > canvasC.height - 15 || this.y < 15) {
                    this.x = canvasC.width / 2;
                    this.y = canvasC.height / 2;
                }
                else {
                    this.y = this.y + random(-2,2) * this.diameter / 3 * volume;
                }

          }

       

    };


}

function Enemy() {

    this.gotShot = false;
    this.delete = false;

    this.speed = 0.05;
    this.diameter = random(50,60);
    this.falldown = 1;
    
    this.x = random(-500,500);
      if(this.x < 0) {
          this.y = random(0,500);
      }
      else this.y = random(-200,0);

    
    this.changeVelocity = function() {

          if(this.gotShot == true) {
                this.y = this.y + this.falldown;
                if(this.y > canvasC.height) {
                  this.delete = true;
                }
                this.falldown = this.falldown + 2;
          }

          else if (this.gotShot == false) {
                this.x = this.x + ((can3mouseX - this.x)  * this.speed) + random(-2,2);
                this.y = this.y + ((can3mouseY - this.y)  * this.speed) + random(-2,2);

          }

         

    };

    this.accelerate = function() {
        this.speed = this.speed + globalAcceleration;
    };


}

function Asteroid() {
    this.x = -20;
    this.randomXspeed = random(16,20);
    this.y = -20;
    this.randomYspeed = random(1.04,1.07);
    this.diameter = random(20,40);
    this.gravity = 1;
    this.gotShot = false;
    this.delete = false;
    this.falldown = 1;

    this.changeVelocity = function() {

        if(this.gotShot == true) {
            this.y = this.y + this.falldown;
            this.falldown = this.falldown + 2;
        }
        else if(this.gotShot == false) {
            this.x = this.x + this.randomXspeed;
            this.y = this.y + this.gravity;
            this.gravity = this.gravity * this.randomYspeed
        }

        if(this.x > canvasC.width || this.y > canvasC.height) {
          this.delete = true;
        }
    };


}


function fireShot() {

    if(shotFired == false && start3 == true) {

          shotFired = true;

    // CHECK THE BALLS IN CLOSE RANGE AND SET THEIR gotShot TO TRUE

              for (var i =0; i < balls.length; i++) {

                  var ballsDistance = dist(can3mouseX,can3mouseY,balls[i].x,balls[i].y);
              
                  if(ballsDistance < 80) {
                      balls[i].gotShot = true;
                  }

              }

    // CHECK THE ENEMYS IN CLOSE RANGE AND SET THEIR gotShot TO TRUE

              for (var i =0; i < enemies.length; i++) {

                  var enemiesDistance = dist(can3mouseX,can3mouseY,enemies[i].x,enemies[i].y);
              
                  if(enemiesDistance < 100) {
                      enemies[i].gotShot = true;
                  }

              }

    // CHECK THE ASTEROIDS IN CLOSE RANGE AND SET THEIR gotShot TO TRUE

              for (var i =0; i < asteroids.length; i++) {

                  var asteroidDistance = dist(can3mouseX,can3mouseY,asteroids[i].x,asteroids[i].y);
              
                  if(asteroidDistance < 100) {
                      asteroids[i].gotShot = true;
                  }

              }


          showExplosion = true;
          explosionCoordinates();

    } 
}

function explosionCoordinates() {
  explosionX = can3mouseX;
  explosionY = can3mouseY;
  lastCount = frameCount - 1;
  explosion();
}

function explosion() {

  frameCountTemp = frameCount - lastCount;

  if(gameIsPaused == false) {

      pieProgress = pieProgress + 0.01 * frameCountTemp;

      if(explosionRadius > 30 || pieProgress < 6.28) {
        
        if(explosionRadius < 30) {
          showExplosion = false;
        }
        else {
          explosionRadius = explosionRadius - 6 * frameCountTemp;
        }

        lastCount = frameCount;
        explosionTimeout = setTimeout(explosion,15);
      }
      else {
        explosionRadius = 250;
        shotFired = false;
        pieProgress = 0;
      }
  }

  
}

function checkHit() {

    //////////////////////////////////////////////////////// Check, if player collected a dot //////////////////////

      var distanceToDot = dist(randomX,randomY, can3mouseX,can3mouseY);

          if (distanceToDot < 40) {
              points++;
              newDot = true;

              avoidEnemyCreating = false;
              avoidAsteroidCreating = false;

              if (points % 10 == 0 && shield == false) {
                  textAnimation('Shield activated');
                  shield = true;
              }

          }

    //////////////////////////////////////////////////////// Check, if player collided with ball //////////////////////

    for (var c = 0; c < balls.length; c++) {

      var distanceToBalls = dist(can3mouseX,can3mouseY,balls[c].x,balls[c].y);

          if (distanceToBalls < (balls[c].diameter/2 + 15) && balls[c].gotShot == false) {

              if(shield === true) {
                  textAnimation('Shield gone');
                  balls[c].gotShot = true;

                  setTimeout(function deactivateShield() {
                    shield = false;
                  },500);
              }
              else {
                stopMiniGame();               
              }

          }

    }

    //////////////////////////////////////////////////////// Check, if player collided with enemy //////////////////////

    for (var c = 0; c < enemies.length; c++) {

      var distanceToEnemys = dist(can3mouseX,can3mouseY,enemies[c].x,enemies[c].y);

      if (distanceToEnemys < (enemies[c].diameter/2) && enemies[c].gotShot == false) {

            if(shield === true) {
              enemies[c].gotShot = true;
              textAnimation('Shield gone');

                setTimeout(function deactivateShield() {
                  shield = false;
                },500);
            }

            else {
                stopMiniGame();
            }

      }
    }

    //////////////////////////////////////////////////////// Check, if player collided with asteroid //////////////////////

    for (var c = 0; c < asteroids.length; c++) {

      var distanceToAsteroids = dist(can3mouseX,can3mouseY,asteroids[c].x,asteroids[c].y);

      if (distanceToAsteroids < (asteroids[c].diameter/2 + 10) && asteroids[c].gotShot == false) {
            if(shield === true) {
              asteroids[c].gotShot = true;
              textAnimation('Shield gone');

                setTimeout(function deactivateShield() {
                  shield = false;
                },500);
            }

            else {
                stopMiniGame();
            }

      }
    }
}

function textAnimation(text) {

    if(activeArticle == 2) {
        notificationP.html(text);
        notificationP.style("display", "flex");
        setTimeout(function removeNotificationAnimation() {
          notificationP.style("display" , "none");
        },1000);
    }
}

function startMiniGame() {

      notificationP.style("display", "none");
      canvasC.style("opacity", "1");
      
      shield = false;
      enemyCreated = false;
      shotFired = false;
      showExplosion = false;
      explosionRadius = 250;
      points = 0;
      newDot = true;
      pieProgress = 0;

      start3 = true;
}

function stopMiniGame(){
    canvasC.style("cursor", "auto");
    clearTimeout(explosionTimeout);
    textAnimation('Game over, try again');
    canvasC.style("opacity", "0.4");
    balls.splice(0,balls.length);
    enemies.splice(0,enemies.length);
    start3 = false;
    playButton.show();
    buttonLeft.style("display", "flex");
    buttonRight.style("display", "flex");
    globalAcceleration = 0;

    for (var c = 0; c < window.innerWidth / 12; c++) {
          balls.push(new Ball());
    }
}

function keyPressed() {

      if(activeArticle == 2 && keyCode == ENTER) {

        if(start3 == true) {
            start3 = false;
            buttonLeft.style("display", "flex");
            buttonRight.style("display", "flex");
            textAnimation('Game paused');
            canvasC.style("opacity", "0.4");
            canvasC.style("cursor", "auto");
            playButton.show();
            gameIsPaused = true;
            newDot = true;
        }  
        else {
            start3 = true;
            buttonLeft.hide();
            buttonRight.hide();
            playButton.hide();
            canvasC.style("opacity", "1");
            canvasC.style("cursor", "none");
            gameIsPaused = false;
            explosion();
        }
      }
}
