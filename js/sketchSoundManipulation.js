var start2 = false;

var LENGTH = 50;

var canvasB;


var bubbles = [];

var amplitude;

var volumeLevel = 0;

var myFilter;

var can2mouseX, can2mouseY;

var filterEllipses = [];

var soundEffects = [];

var drum, snare, hat, special;

var drumPlaying = false;
var snarePlaying = false;
var hatPlaying = false;
var specialPlaying = false;

var myKey;


//CANVAS 2
var sketch2 = function(can2){

  can2.preload = function() {
    drum = loadSound('audio/Kick.wav');
    snare = loadSound('audio/Snare2.wav');
    hat = loadSound('audio/Hat.WAV');
    special = loadSound('audio/Special.wav');
    pianoC = loadSound('audio/pianoC.mp3');
    pianoC2 = loadSound('audio/pianoC2.mp3');
    pianoD = loadSound('audio/pianoD.mp3');
    pianoD2 = loadSound('audio/pianoD2.mp3');
    pianoE = loadSound('audio/pianoE.mp3');
    pianoF = loadSound('audio/pianoF.mp3');
    pianoF2 = loadSound('audio/pianoF2.mp3');
    pianoG = loadSound('audio/pianoG.mp3');
    pianoG2 = loadSound('audio/pianoG2.mp3');
    pianoA = loadSound('audio/pianoA.mp3');
    pianoA2 = loadSound('audio/pianoA2.mp3');
    pianoH = loadSound('audio/pianoH.mp3');
  }


  can2.setup = function () {

    canvasB = can2.createCanvas(window.innerWidth / 1.14, window.innerHeight);
    canvasB.class('canvasP5');
    canvasB.parent('canvasContainer2');

    amplitude = new p5.Amplitude();

    myFilter = new p5.LowPass();

    myFilter2 = new p5.HighPass();

    myFilter3 = new p5.LowPass();

    myFft = new p5.FFT();

    myReverb = new p5.Reverb();

    soundEffects.push(pianoC);
    soundEffects.push(pianoC2);
    soundEffects.push(pianoD);
    soundEffects.push(pianoD2);
    soundEffects.push(pianoE);
    soundEffects.push(pianoF);
    soundEffects.push(pianoF2);
    soundEffects.push(pianoG);
    soundEffects.push(pianoG2);
    soundEffects.push(pianoH);
    soundEffects.push(pianoA);
    soundEffects.push(pianoA2);

  };

  can2.draw = function () {
      can2.clear();
      
      if (start2 == true) {

          can2mouseX = can2.mouseX;
          can2mouseY = can2.mouseY;

          can2.stroke(255,255,255);
          can2.strokeWeight(1);

          can2.fill(0,0,0,0);
          
          if(amountOfSongs > 0 && can2mouseX > 0 && can2mouseY > 0 && can2mouseX < canvasB.width && can2mouseY < canvasB.height) {
              
              mouseOverFilterCanvas();

              can2.fill(can2mouseY * 0.1,can2mouseY * 0.05,can2mouseX * 0.1, 100);

          }

          else{
              myFilter3.set(20000, 5);
              myFilter2.set(20000, 5);
              filterEllipses.splice(0,filterEllipses.length);
              
          }


          volumeLevel = amp.getLevel();

          can2.strokeWeight(0);

          can2.fill(can2mouseY * 0.2,can2mouseY * 0.15,can2mouseX * 0.2, 100);

          can2.fill

          var spectrum = myFft.analyze();

          can2.noStroke();

          for (var i = 0; i< spectrum.length; i = i + 3){
              var x = map(i, 0, spectrum.length, 0, canvasB.width * 1.3);
              var h = canvasB.height - map(spectrum[i], 0, 255, canvasB.height, 0);
              can2.rect(x, 0, canvasB.width/spectrum.length, h);
          }

          can2.stroke(255,255,255);  can2.strokeWeight(10);


          can2.ellipse(canvasB.width / 2,canvasB.height / 2, canvasB.width / 15 + 100 * volumeLevel);

      }

      else {
        myFilter3.set(20000, 5);
        myFilter2.set(20000, 5);
      }
    };


};


function mouseOverFilterCanvas() {

  var freq = map(can2mouseY, 0, canvasB.height, 20, 20000);

  var freq2 = map(can2mouseY,0,canvasB.height,1000,20);

  Sounds[activeSong].disconnect();

  if(mouseIsPressed) {
    Sounds[activeSong].connect(myFilter2);
  }
  else{
    Sounds[activeSong].connect(myFilter3);
  }
  
  myFilter3.set(freq, 5);
  myFilter2.set(freq2, 5);
}


function mousePositionObject(x,y) {
   this.myX = x;
   this.myY = y;

   this.getX = function() {
      return this.myX;
   }

   this.getY = function() {
      return this.myY;
   }


}

function Bubble(){

    this.x = can2mouseX;
    this.y = can2mouseY;
    this.diameter = floor(random(5,9));
    this.direction = floor(random(0,4));

    this.changePosition  = function() {

      if(this.direction == 0) {
        this.y = this.y - volumeLevel * 2 + random(-5,5);
      
        this.x = this.x - volumeLevel * 2 + random(-5,5);
      }
      else if(this.direction == 1) {
        this.y = this.y - volumeLevel * 2 + random(-5,5);
      
        this.x = this.x + volumeLevel * 2 + random(-5,5);
      }
      else if(this.direction == 2) {
        this.y = this.y + volumeLevel * 2 + random(-5,5);
      
        this.x = this.x - volumeLevel * 2 + random(-5,5);
      }
      else if(this.direction == 3) {
        this.y = this.y + volumeLevel * 2 + random(-5,5)
      
        this.x = this.x + volumeLevel * 2 + random(-5,5);
      }

      


    };

    this.resetBubblePositions = function() {
      this.x = random(35, canvasB.width - 35);
      this.y = random(10,canvasB.height);
    };


}

function keyReleased() {

  if(activeArticle == 1 && start2 == true) {

    bubbles.push(new Bubble());

    var panning = map(can2mouseX,0,canvasB.width,-1.0,1.0);

    myFilter.set(400,5);

    switch(key){
        case 'a':
        case 'A':
          drum.setVolume(0.5);
          drum.pan(panning);
          drum.play();
          drumPlaying = true;
          break;
        case 's':
        case 'S':
          snare.setVolume(0.6);
          snare.pan(panning);
          snare.play();
          snarePlaying = true;
          break;
        case 'd':
        case 'D':
          hat.setVolume(0.4);
          hat.pan(panning);
          hat.play();
          hatPlaying = true;
          break;
        case 'f':
        case 'F':
          special.setVolume(0.8);
          special.pan(panning);
          special.play();
          specialPlaying = true;
          break;
        case 'q':
        case 'Q':
          pianoC.disconnect();
          pianoC.setVolume(0.4);
          pianoC.pan(panning);
          pianoC.play();
          pianoC.connect(myFilter);
          break;
        case 'w':
        case 'W':
          pianoD.disconnect();
          pianoD.setVolume(0.4);
          pianoD.pan(panning);
          pianoD.play();
          pianoD.connect(myFilter);
          break;
        case 'e':
        case 'E':
          pianoE.disconnect();
          pianoE.setVolume(0.4);
          pianoE.pan(panning);
          pianoE.play();
          pianoE.connect(myFilter);
          break;
        case 'r':
        case 'R':
          pianoF.disconnect();
          pianoF.setVolume(0.4);
          pianoF.pan(panning);
          pianoF.play();
          pianoF.connect(myFilter);
          break;
        case 't':
        case 'T':
          pianoG.disconnect();
          pianoG.setVolume(0.4);
          pianoG.pan(panning);
          pianoG.play();
          pianoG.connect(myFilter);
          break;
        case 'z':
        case 'Z':
          pianoA.disconnect();
          pianoA.setVolume(0.4);
          pianoA.pan(panning);
          pianoA.play();
          pianoA.connect(myFilter);
          break;
        case 'u':
        case 'U':
          pianoH.disconnect();
          pianoH.setVolume(0.4);
          pianoH.pan(panning);
          pianoH.play();
          pianoH.connect(myFilter);
          break;
        case '2':
        case '"':
          pianoC2.disconnect();
          pianoC2.setVolume(0.4);
          pianoC2.pan(panning);
          pianoC2.play();
          pianoC2.connect(myFilter);
          break;
        case '3':
        case '§':
          pianoD2.disconnect();
          pianoD2.setVolume(0.4);
          pianoD2.pan(panning);
          pianoD2.play();
          pianoD2.connect(myFilter);
          break;
        case '5':
        case '%':
          pianoF2.disconnect();
          pianoF2.setVolume(0.4);
          pianoF2.pan(panning);
          pianoF2.play();
          pianoF2.connect(myFilter);
          break;
        case '6':
        case '&':
          pianoG2.disconnect();
          pianoG2.setVolume(0.4);
          pianoG2.pan(panning);
          pianoG2.play();
          pianoG2.connect(myFilter);
          break;
        case '7':
        case '/':
          pianoA2.disconnect();
          pianoA2.setVolume(0.4);
          pianoA2.pan(panning);
          pianoA2.play();
          pianoA2.connect(myFilter);
          break;


      }
    }

    return false;



}



new p5(sketch2 , 'canvasContainer2');
