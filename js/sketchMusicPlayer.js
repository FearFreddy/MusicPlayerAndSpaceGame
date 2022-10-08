var start = false;

var canvasA;

var xs = [];  // For the line waveform, to connect with the last line
var ys = [];

var zufall = 3;

var amp;

var timeout = false;
var colorTimeout = false;

var hitProgressButton = false;

var songProgress = 0;

var can1mouseX;
var can1mouseY;

var amountOfForms = 600;

var stars = [];

var LENGTH_STARS = 100;

//CANVAS 1
var sketch = function(can1){

  can1.setup = function () {
    canvasA = can1.createCanvas(window.innerWidth /1.14, window.innerHeight);
    canvasA.class('canvasP5');
    canvasA.parent('canvasContainer');
    amp = new p5.Amplitude();

    canvasA.mousePressed(checkButtonHit);
    canvasA.mouseReleased(newProgress);

    for(var i = 0; i < LENGTH_STARS;i++) {
      stars[i] = new Star();
    }

  };

  can1.draw = function () {

    can1.clear();

    can1.strokeWeight(0);

    if (start == true) {

              for(var i = 0; i < stars.length; i++){

                  switch(colorMix) {
                    case 0:
                        can1.fill(0,0,random(50,255));
                        break;
                    case 1:
                        var randomYellow = random(50,255);
                        can1.fill(random(100,255), random(50,220), 0);
                    break;
                  }

                  can1.ellipse(stars[i].x, stars[i].y, stars[i].diameter, stars[i].diameter);
              }

              var windowWidth = canvasA.width;
              var windowHeight = canvasA.height;
              var vol = amp.getLevel();

              if(vol > averagePeak + 0.05 && timeout == false) {
                timeout = true;
                changeRandom();
              }

              if(vol > averagePeak + 0.1 && colorTimeout == false) {
                colorTimeout = true;
                changeColor();
              }

              switch(colorMix) {
                case 0:
                    can1.fill(0,0,100,60);
                    can1.stroke(0,0,80,60);
                    break;
                case 1:
                    can1.fill(71,	35,	0,80);
                    can1.stroke(71,	35,	0,80);
                    break;
                }


              var diam = map(vol,0,1,10,windowHeight);

              can1.ellipse(windowWidth * 1.5 / 2, windowHeight/2,windowWidth / 15, diam * 0.4);
              can1.ellipse(windowWidth * 0.5 / 2, windowHeight/2,windowWidth / 15, diam * 0.4);
              can1.ellipse(windowWidth * 1.4 / 2, windowHeight/2,windowWidth / 12, diam * 0.7);
              can1.ellipse(windowWidth * 0.6 / 2, windowHeight/2,windowWidth / 12, diam * 0.7);
              can1.ellipse(windowWidth * 1.3 / 2, windowHeight/2,windowWidth / 8, diam);
              can1.ellipse(windowWidth * 0.7 / 2, windowHeight/2,windowWidth / 8, diam);
              can1.ellipse(windowWidth / 2, windowHeight/2,windowWidth / 3, diam * 1.5);

              can1.stroke(255,255,255,50);
              can1.strokeWeight(3);
              can1.line(0,windowHeight / 2, windowWidth,windowHeight / 2);

          
          for(var i = 1; i< amountOfForms;i++) {

              if(colorMix == 0) {
                    if (i % zufall == 2 || i % zufall == 3) {
                        can1.fill(155,random(70,85),0,110);
                        can1.stroke(155,random(70,85), 0,110);
                    }
                    else {
                        can1.fill(0,0,random(50,155),110);
                        can1.stroke(0,0,random(50,155),110);
                    }
              }

              else {
                    if (i % zufall == 2) {
                        var randYellow = random(200,255);
                        can1.fill(randYellow,randYellow,0,90);
                        can1.stroke(randYellow,randYellow,0,90);

                    }
                    else {
                        can1.fill(random(50,250),random(0,100),0,110);
                        can1.stroke(random(50,250), random(0,100),0,110);
                    }
              }

              var x = map(i,0,amountOfForms,50,windowWidth-50);
              var y = 1.342;
              y = windowHeight / 5 + (peaks[i] + 1.3) * windowHeight / 5  + random(0,10);

              ///////// RANDOM FORM (ELLIPSE; LINE; QUAD)

              if (zufall > 8) {

                    var randSize = random(5,10);
                    can1.ellipse(x,y, randSize + vol*5,randSize + vol*5);

              }

              else if (zufall < 6) {

                    can1.strokeWeight(3);

                    if (y > windowHeight / 2) {
                      ys[i] = y +vol*20;
                    }
                    else {
                      ys[i] = y -vol*20;
                    }

                    xs[i] = x;
                  
                    can1.line(xs[i-1],ys[i-1],x,y+ vol*5);


              }

              else {
                    can1.quad(x, y, x + random(3,8), y + random(3,8), x + random(10,15), y, x, y + random(-5,5));
              }


          }

          


    }

        // PROGRESS CIRCLE 

              if(amountOfSongs > 0) {

                    can1.fill(0,0,0);
                    can1.stroke(255,255,255);
                    can1.strokeWeight(2);
                    can1mouseX = can1.mouseX;
                    can1mouseY = can1.mouseY;

                      if(musicPlaying) {
                        recalculateProgress();
                        articleSwapped = false;
                      }
                      can1.ellipse(songProgress, windowHeight / 2, 20);


                      if (mouseIsPressed && hitProgressButton == true) {
                          can1.stroke(125,125,125);
                          can1.ellipse(can1mouseX,windowHeight / 2, 20);
                      }
              }
  };

};

function Star(){

    this.x = random(5, canvasA.width - 5);
    this.y = random(-10,canvasA.height);
    this.diameter = floor(random(2,5));

    this.resetBubblePositions = function() {
      this.x = random(35, canvasA.width - 35);
      this.y = random(10,canvasA.height);
    };


}

function playOrPauseSong() {

  if(amountOfSongs > 0) {

      if(Sounds[activeSong].isPlaying() == true) {
        Sounds[activeSong].pause();
        pauseButton.attribute('src', 'img/play.png');
        musicPlaying = false;
      }
      else {
        Sounds[activeSong].play();
        pauseButton.attribute('src', 'img/pause.png');
        musicPlaying = true;
      }

  }

}

function nextSong() {

  if(amountOfSongs > 0) {

      Sounds[activeSong].stop();
      console.log(activeSong);
    
          if (activeSong < amountOfSongs - 1) {
              if (Sounds[activeSong + 1].isLoaded() == true) {

                  Sounds[activeSong + 1].setVolume(1);
                  Sounds[activeSong + 1].play();
                  activeSong++;                 
              }

          }

          else {
            activeSong = 0;
            Sounds[activeSong].setVolume(1);
            Sounds[activeSong].play();           
          }

          musicPlaying = true;
          pauseButton.attribute('src', 'img/pause.png')

  }

}

function previousSong() {

  if(amountOfSongs > 0) {

      Sounds[activeSong].stop();

          if(activeSong > 0) {
            Sounds[activeSong - 1].setVolume(1);
            Sounds[activeSong - 1].play();
            activeSong--;
          }
          else {
            Sounds[Sounds.length - 1].play();
            activeSong = Sounds.length - 1;
          }

          musicPlaying = true;
          pauseButton.attribute('src', 'img/pause.png');

  }
}

function checkButtonHit() {

  if(musicPlaying == true) {

      var distance = dist(can1mouseX,can1mouseY,songProgress,windowHeight / 2);

      if(distance < 15) {
          hitProgressButton = true;
      }
  }
}

function newProgress() {

  if(musicPlaying == true && hitProgressButton == true) {

      hitProgressButton = false;
      var newTime = map(can1mouseX,0,canvasA.width,0, Sounds[activeSong].duration());
      Sounds[activeSong].jump(newTime);
      pauseButton.attribute('src', 'img/pause.png');
  }
}

function recalculateProgress() {
  var currentTime = Sounds[activeSong].currentTime()  * 1.09;
  songProgress = map(currentTime,0,Sounds[activeSong].duration(), 0, canvasA.width);
  if(Sounds[activeSong].isPlaying() == true) {
      setTimeout(recalculateProgress,50);
  }
}

function changeRandom() {
    zufall = floor(random(2,11));
    setTimeout(timeoutSet,2000);
}

function changeColor() {
  if(colorMix == 1) {
    colorMix = 0;
  }
  else  {
    colorMix = 1;
  }
  setTimeout(colortimeoutSet,3000);
}

function timeoutSet() {
  timeout = false;
}

function colortimeoutSet() {
  colorTimeout = false;
}


new p5(sketch, 'canvasContainer');
