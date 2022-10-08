// Container and other elements
var canvas1;
var canvas2;
var canvas3;

var articles = [];
var activeArticle = 0;

var everythingContainer;
var notificationP;

var playlistWindow;
var helpWindow;
var helpWindowText;
var listElements = [];
var emptyListElement;     //At the beginning

var colorMix = 0;

// GUI-Elements
var buttonLeft;
var buttonRight;
var playButton;
var upperRightButton;
var shuffleButton;
var helpButton;
var popUp;
var clickedElement;
var popUpClose;
var popUpDeleteSong;
var popUpPlaySong;

var dropZone;
var dropZoneP;
var droppedSoundFile;
var fileButton;

//Sound-Elements
var Sounds = [];
var backupSounds = [];
var shuffleOrder = [];
var activeSong = 0;
var amountOfSongs = 0;
var nextSongButton;
var previousSongButton;
var pauseButton;

var songsInPlaylist = [];
var backupSongsInPlaylist = [];

var peaks = [];
var averagePeak = 0;

// Boolean
var swapInProgress = false;
var newSongDragged = false;
var playlistDisplayed = false;
var helpWindowDisplayed = false;
var musicPlaying = false;
var shuffleIt = false;
var articleSwapped = false;

var compare;


function setup() {

      noCanvas();

      document.getElementById('selectedFile').addEventListener('change', handleFileSelect, false);

      // MAKE CONTENT APPEAR AFTER LOADING THE PAGE

      //Notification Banner
      notificationP = select('#notification');

      //Container around everything
      // body = select('body');
      everythingContainer = select('#everythingContainer');
      everythingContainer.style("display" , "block");
      everythingContainer.style("animation" , "Ani4 0.8s linear");

      contentContainer = select('#contentContainer');

      //Playlist and Help-Windows
      playlistWindow = select('#playlistWindow');
      helpWindow = select('#helpWindow');
      helpWindowText = select('#helpWindowText');
      emptyListElement = select('#emptyElement');

      // SET SOUND

      nextSongButton = select('#nextSong');
      previousSongButton = select('#previousSong');
      pauseButton = select('#pauseSong');
      shuffleButton = select('#shuffleButton');

      shuffleButton.mousePressed(shuffleSongs);
      nextSongButton.mousePressed(nextSong);
      previousSongButton.mousePressed(previousSong)
      pauseButton.mousePressed(playOrPauseSong);

      // CANVAS HANDLING + PUSHING IT IN ARTICLES ARRAY

      canvas1 = select('#canvasContainer');
      articles.push(canvas1);

      canvas2 = select('#canvasContainer2');
      articles.push(canvas2);

      canvas3 = select('#canvasContainer3');
      articles.push(canvas3);

      //  DROPZONE HANDLING

      dropZone = select('#dropZone');
      dropZoneP = select('#dropZoneP');
      fileButton = select('#fileButton');
      dropZone.dragOver(highlight);
      dropZone.dragLeave(unhighlight);
      dropZone.drop(gotFile, unhighlight);

      //  NAVI HANDLING

      buttonLeft = select('#naviLeft');
      buttonRight = select('#naviRight');
      buttonLeft.mousePressed(articlePrev);
      buttonRight.mousePressed(articleNext);

      upperRightButton = select('#upperRightButton');
      upperRightButton.mousePressed(upperRightButtonClick);

      helpButton = select('#helpButton');
      helpButton.mousePressed(helpWindowDisplay);

      popUp = select('#popUpMenu');
      popUpClose = select('#close');
      popUpClose.mouseClicked(closePopUpMenu);
      popUpDeleteSong = select('#delete');
      popUpDeleteSong.mouseClicked(deleteSong);
      popUpPlaySong = select('#play');
      popUpPlaySong.mousePressed(playSongFromPlaylist);

      initArticle();
}


function draw() {

      if (newSongDragged == true && Sounds[amountOfSongs].isLoaded() == true) {

            amountOfSongs++;

            //Show Dropzone again and hide notification text

              dropZone.style("height","10%");

              notificationP.style("display", "none");
              dropZoneP.style("display" , "block");
              fileButton.style("display" , "block");

            // Collect playlist elements in an array

              listElements = selectAll('.listElements');

            //Give every element a listener

              for(var i = 0; i < amountOfSongs; i++) {
                  listElements[i].mouseClicked(openPopUpMenu);
              }

              newSongDragged = false;

      }

      // // Hover-Effect on Playbutton, realised with Distance-Method

      var d = dist(winMouseX,winMouseY,window.innerWidth / 2, window.innerHeight / 2);

      if (d < 100 && playButton) {
          playButton.position(window.innerWidth / 2 - random(window.innerWidth / 15,window.innerWidth / 17), window.innerHeight / 2 - random(window.innerWidth / 15,window.innerWidth / 17));
      }

      

      if (amountOfSongs > 0) {

          // PLAY THE NEXT SONG IF THE CURRENT ONE HAS ENDED (LITTLE CORRECTION NECESSARY BECAUSE CURRENTTIME FUNCTION IS NOT WORKING PROPERLY)

          if (Sounds[activeSong].currentTime() * 1.09 > Sounds[activeSong].duration() && amountOfSongs > 1) {
              nextSong();
          }
          else if(Sounds[activeSong].currentTime() * 1.09 > Sounds[activeSong].duration() && amountOfSongs == 1) {
              Sounds[activeSong].stop();
              pauseButton.attribute('src', 'play.png')   
              musicPlaying = false;  
          }

          // COLLECT THE PEAKS OF THE SONG FOR THE WAVEFORM

          if (musicPlaying == true) {

                peaks = Sounds[activeSong].getPeaks([1000]);

                for (var k = 0;k<1000;k++) {
                    averagePeak = averagePeak + peaks[k];
                }

                averagePeak = averagePeak / 1000;
                
          }

      }


}


//(UN)HIGHLIGHTING FUNCTION FOR THE DROPZONE

function highlight() {
    dropZone.style("background-color", "rgba(255,255,255,0.05)");
}

function unhighlight() {
    dropZone.style("background-color", "rgba(0,0,0,0)");
}

// FILE HANDLING FUNCTION


function handleFileSelect(evt) {

      var file = evt.target.files[0]; // File

      if(file != undefined && file != compare) {

        notificationP.style("display", "flex");
        notificationP.html("Song is loading...");
        dropZone.style("height","0");
        dropZoneP.style("display" , "none");
        fileButton.style("display" , "none");

        var mySound = loadSound(file);

        Sounds[amountOfSongs] = mySound;
        backupSounds[amountOfSongs] = mySound;

        songsInPlaylist[amountOfSongs] = createElement('li', file.name);
        songsInPlaylist[amountOfSongs].parent('playlist');
        songsInPlaylist[amountOfSongs].style("title", "Play now");
        songsInPlaylist[amountOfSongs].id("" + amountOfSongs);
        songsInPlaylist[amountOfSongs].class("listElements");

       backupSongsInPlaylist.push(songsInPlaylist[amountOfSongs].html());

        if(shuffleIt == true) {
            shuffleOrder[shuffleOrder.length - 1] = amountOfSongs;
        }

        emptyListElement.remove();

        newSongDragged = true;

        compare = file;
      }
}

// DROP FILE HANDLING FUNCTION

function gotFile(file) {

      notificationP.style("display", "flex");
      notificationP.html("Song is loading...");
      dropZone.style("height","0");
      dropZoneP.style("display" , "none");

      fileButton.style("display" , "none");

      var mySound = loadSound(file.data);

      Sounds[amountOfSongs] = mySound;
      backupSounds[amountOfSongs] = mySound;

      songsInPlaylist[amountOfSongs] = createElement('li', file.name);
      songsInPlaylist[amountOfSongs].parent('playlist');
      songsInPlaylist[amountOfSongs].style("title", "Play now");
      songsInPlaylist[amountOfSongs].id("" + amountOfSongs);
      songsInPlaylist[amountOfSongs].class("listElements");

      backupSongsInPlaylist.push(songsInPlaylist[amountOfSongs].html());

      if(shuffleIt == true) {
        shuffleOrder[shuffleOrder.length - 1] = amountOfSongs;
      }

      emptyListElement.remove();

      newSongDragged = true;

}

// PLAYLIST POP UP MENU HANDLING

function openPopUpMenu() {

    clickedElement = this.id();
    clickedElement = int(clickedElement);

    popUp.style("display", "block");
    popUp.position(winMouseX,winMouseY);

}

function closePopUpMenu() {
    popUp.hide();
}

//NEXT / PREVIOUS / CHANGE / PAUSE SONG FUNCTIONS


function playSongFromPlaylist() {
      Sounds[activeSong].stop();
      Sounds[clickedElement].play();
      pauseButton.attribute('src', 'img/pause.png');
      activeSong = clickedElement;
      musicPlaying = true;
      popUp.hide();
}

function deleteSong() {

    if(activeSong != clickedElement || Sounds[activeSong].isPlaying() == false) {

      amountOfSongs--;
      Sounds.splice(clickedElement,1);
      backupSounds.splice(clickedElement,1);
      popUp.hide();
      songsInPlaylist[clickedElement].remove();
      songsInPlaylist.splice(clickedElement,1);
      backupSongsInPlaylist.splice(clickedElement,1);

      if(shuffleIt == true) {

          for(var i; i<shuffleOrder.length;i++) {
            if(clickedElement == shuffleOrder[i]) {
              shuffleOrder.splice(i,1);
            }
          }

      }

        if(activeSong > clickedElement) {
           activeSong--; 
        }

        for(var i=0;i<songsInPlaylist.length;i++) {
          if(shuffleIt == false) {
              songsInPlaylist[i].id("" + i);
          } 
          else {
              songsInPlaylist[shuffleOrder[i]].id("" + i);
          }
        }
        
    }

    else {
        notificationP.html("Song playing right now");
        notificationP.style("display","flex");
        setTimeout(function hideNotification() {
          notificationP.hide();
        },800);

    }

}

function shuffleSongs() {

  if (amountOfSongs > 1) {

        Sounds[activeSong].stop();

        if(shuffleIt == false) {
            shuffleIt = true;
            shuffleButton.style("transform" , "rotate(180deg)");
            shuffleButton.style("border" , "1px solid orange");
            
            Sounds = shuffleMe(Sounds);

            for (var i=0; i < songsInPlaylist.length;i++){
                songsInPlaylist[i].html("" + backupSongsInPlaylist[shuffleOrder[i]]); 
            }
            
        }
        else {
          shuffleIt = false;
          shuffleButton.style("transform" , "rotate(0deg)");
          shuffleButton.style("border" , "none");

          for (var i=0; i < songsInPlaylist.length;i++){
                songsInPlaylist[i].html("" + backupSongsInPlaylist[i]); 
          }

          Sounds = backupSounds;
          console.log(Sounds.length);
          
        }

        activeSong = 0;
        
        Sounds[0].play();
        musicPlaying = true;

        pauseButton.attribute('src', 'img/pause.png');

  }
  
}

function shuffleMe(array) {

  var newArray = [];
  var randomIndex;
  var randomCollecter = [];
  var alreadyInThere = false;

  shuffleOrder.splice(0,shuffleOrder.length);

  for(var i=0;i < array.length;i++) {

      do {

        alreadyInThere = false;

        var randomNumber = random(0.00001,array.length);
        randomNumber = randomNumber - 0.00001;
        randomIndex = floor(randomNumber);
    

        for(var j =0; j < randomCollecter.length;j++) {
            if(randomCollecter[j] == randomIndex) {
              alreadyInThere = true;
            }
        }

      } 
      while(alreadyInThere);

      randomCollecter.push(randomIndex);
      shuffleOrder.push(randomIndex);

      newArray[i] = array[randomIndex];
  }

  return newArray;


}

//ARTICLE CHANGE FUNCTIONS

function articlePrev() {

    if (swapInProgress == false) {

            if(activeArticle > 0) {
                 
                  activeArticle--;
                  stopArticleDraw(); 
                  swapInProgress = true;
             
            //Hide current article, start the animation and after 300ms, display previous article and remove all animations   

                  articles[activeArticle + 1].style("display","none");
                  buttonLeft.style("animation", "Ani2 0.3s linear");
                  contentContainer.style("animation", "Ani3 0.3s linear");
                  setTimeout(function() {
                    articles[activeArticle].style("display", "flex");
                    removeAnimation();
                    initArticle();
                  }, 300);
            }
    }
}

function articleNext() {

    if (swapInProgress == false) {

          if(activeArticle < 2) {

                activeArticle++;
                stopArticleDraw();
                swapInProgress = true;

          //Hide current article, start the animation and after 300ms, display previous article and remove all animations   

                articles[activeArticle - 1].style("display","none");
                buttonRight.style("animation", "Ani2 0.3s linear");
                contentContainer.style("animation", "Ani3 0.3s linear");
                setTimeout(function() {
                  articles[activeArticle].style("display", "flex");
                  removeAnimation();
                  initArticle();
                },300);
          }
    }
}

function initArticle() {
      if(activeArticle == 2) {
        playButton = createImg('img/orangeplaybutton.png');
        playButton.parent('everythingContainer');
        playButton.position(window.innerWidth / 2 - window.innerWidth / 16, window.innerHeight / 2 - window.innerWidth / 16);
        playButton.size(window.innerWidth / 8,window.innerWidth / 8);
        playButton.style("opacity", "0.5");
        playButton.style("z-index", "19");
        playButton.mousePressed(startArticleDraw);
      } else {
        startArticleDraw();
      }
}

//REMOVE ANIMATIONS FUNCTION

function removeAnimation() {
  buttonLeft.style("animation" , "none");
  buttonRight.style("animation" , "none");
  contentContainer.style("animation" , "none");
  if(playButton)
    playButton.style("animation" , "none");
  playlistWindow.style("animation" , "none");
  helpWindow.style("animation", "none");
  swapInProgress = false;
}

//FUNCTION CALLED ON WINDOW RESIZING

function windowResized() {
    canvasA.resize(window.innerWidth / 1.14, window.innerHeight );
    canvasB.resize(window.innerWidth / 1.14, window.innerHeight );
    canvasC.resize(window.innerWidth / 1.14, window.innerHeight / 1.3 );
    for (var i =0; i < bubbles.length;i++) {
        bubbles[i].resetBubblePositions();
    }

    for (var i =0; i < stars.length;i++) {
        stars[i].resetBubblePositions();
    }
    if(playButton) {
      playButton.position(window.innerWidth / 2 - window.innerWidth /16, window.innerHeight / 2 - window.innerWidth /16);
      playButton.size(window.innerWidth /8, window.innerWidth /8);
    }

    balls.splice(0,balls.length);
    for (var c = 0; c < window.innerWidth / 15; c++) {
          balls.push(new Ball());
    }
}

//START GAME FUNCTION

function startArticleDraw() {

  switch(activeArticle) {
    case 0:
        start = true;
        break;
    case 1:
        setTimeout(function startArticle() {
          start2 = true;
        },200);
        break;
    case 2:
        if(amountOfSongs > 0) {

              if(Sounds[activeSong].isPlaying() == false) {
                  Sounds[activeSong].play();
                  pauseButton.attribute('src', 'img/pause.png');
                  musicPlaying = true;

              }

              if(gameIsPaused == false) {
                canvasC.style("cursor", "none");
                buttonLeft.hide();
                buttonRight.hide();
                setTimeout(startMiniGame,1000);
              }
              else {
                setTimeout(keyPressed,1000);
              }

              playButton.hide();

        }

        else {
          textAnimation('Go back and drag a song!');
        }

        break;

  }
}

function stopArticleDraw() {

  drum.stop();
  snare.stop();
  hat.stop();
  special.stop();
  pianoC.stop();
  pianoC2.stop();
  pianoD.stop();
  pianoD2.stop();
  pianoE.stop();
  pianoF.stop();
  pianoF2.stop();
  pianoG.stop();
  pianoG2.stop();
  pianoA.stop();
  pianoA2.stop();
  pianoH.stop();

  if(playButton) {
    playButton.hide();
  }

  start = false;
  start2 = false;
  start3 = false;

  //Remove all kinds of windows

  playlistWindow.style("display","none");
  helpWindow.style("display","none");
  helpWindowDisplayed = false;
  playlistDisplayed = false;

  //Specific actions for specific articles

  switch(activeArticle) {
      case 0:
          upperRightButton.html("<img src='img/burger.png' class='icons'/>");
          dropZone.style("display", "flex");
          articleSwapped = true; 
          break;
      case 1:
          upperRightButton.html("<img src='img/burger.png' class='icons'/>");
          dropZone.style("display", "flex");
          break;
      case 2:
          upperRightButton.html(points);
          dropZone.style("display", "none");
          break;

    }

}


function upperRightButtonClick() {
  
  if (activeArticle == 0 || activeArticle == 1) {
      if(playlistDisplayed == false && helpWindowDisplayed == false) {
          playlistWindow.style("display","block");
          playlistWindow.style("animation" , "Ani6 0.7s linear");
          playlistDisplayed = true;
      }
      else {
          playlistWindow.style("display","none");
          popUp.hide();
          playlistDisplayed = false;
          removeAnimation();
      }
  }
}

function helpWindowDisplay() {

      if (playlistDisplayed == false && helpWindowDisplayed == false) {
        helpWindow.style("display","block");
        helpWindow.style("animation" , "Ani6 0.7s linear");
        helpWindowDisplayed = true;
        if(playButton)
          playButton.style("z-index", "1");
      }
      else {
        helpWindowDisplayed = false;
        helpWindow.style("display", "none");
        if(playButton)
          playButton.style("z-index", "19");
        removeAnimation();
      }

      switch(activeArticle){
        case 0:
          helpWindowText.html("Drag your songs into the dropzone one at a time. </br> </br> A click on the burger icon in the top right corner displays the playlist of all your dropped songs. </br> </br> If there is at least 2 songs, you can shuffle the playlist by clicking the shuffle button in the bottom left corner. </br> </br> Songs can be started, paused and changed with the buttons in the bottom right corner.");
          break;
        case 1:
          helpWindowText.html("In this window, you can filter the currently played song by only using your mouse. </br> Try moving the mouse to the top and bottom of the screen and see what happens! </br> Clicking and holding the left mouse button will change the type of the applied filter.<br /> <br /> Furthermore, you can play the piano and some drums if you want. The piano keys are located on your keyboard from letters q to u (white keys) and numbers 2 to 7 (black keys). Drums and percussions are on the letters a, s, d and f.  ");
          break;
        case 2:
          helpWindowText.html("Welcome to Space Chase! </br> </br> Start the game by clicking the playbutton. You have one second to place the mouse somewhere between the circles, then the game is starting. </br> </br> You must not touch any of the circles except the black one with the white stroke, which you have to collect to get one point. After you collect it, it's going to pop up somewhere else. </br> </br> At some point of the game enemies are going to fly in and chase you down. Avoid contact with them. </br> You can use an explosion by clicking your left mousebutton, but only once every couple of seconds, so be wise. The explosion is going to kill all enemies and circles in close range. </br> The green circle at the bottom is telling you that the explosion is ready to be fired. </br> </br> For every 10 collected points, you get a shield which protects you once </br> </br> For extra difficulty, put music on! </br> </br> If a circle leaves the screen then, it's going to be respawned inside the circle in the middle.");
          break;
      }

}