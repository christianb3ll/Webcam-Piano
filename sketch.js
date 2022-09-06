/*
In my sketch I have attempted to use a particle system to replicate strings on the screen which can be plucked on movement. I chose particles to do this as it was more suited to achieving the vibrating and randomized look that I wanted.

I have also implemented polysynth audio using the p5.js Sound Library.

*/

var video;
var prevImg;
var diffImg;
var currImg;
var thresholdSlider;
var threshold;
var grid;

var audioToggle
var playing;

var note;
var polySynth;

var strings;
var stringToggle;

function setup() {
    createCanvas(640 * 2, 480);
    pixelDensity(1);
    video = createCapture(VIDEO);
    video.hide();

    // Create and position the slider
    thresholdSlider = createSlider(0, 255, 50);
    thresholdSlider.position(20, 20);
    
    // Create and position the audio toggle button
    audioToggle = createButton('Audio On');
    audioToggle.position(200, 20);
    audioToggle.mousePressed(toggleAudio);
    
    // Create and position the string toggle button
    strings = false;
    stringToggle = createButton('String On');
    stringToggle.position(300, 20);
    stringToggle.mousePressed(toggleStrings);
    
    // Setup the grid
    grid = new Grid(640,480);
    
    // Create new polysynth class
    polySynth = new p5.PolySynth();
}

function draw() {
    background(0);
    image(video, 0, 0);

    currImg = createImage(video.width, video.height);
    currImg.copy(video, 0, 0, video.width, video.height, 0, 0, video.width, video.height);
    currImg.resize(160,0);
    currImg.filter(BLUR,3);

    diffImg = createImage(video.width, video.height);
    diffImg.resize(160,0);
    diffImg.loadPixels();

    threshold = thresholdSlider.value();

    if (typeof prevImg !== 'undefined') {
        prevImg.loadPixels();
        currImg.loadPixels();
        for (var x = 0; x < currImg.width; x += 1) {
            for (var y = 0; y < currImg.height; y += 1) {
                var index = (x + (y * currImg.width)) * 4;
                var redSource = currImg.pixels[index + 0];
                var greenSource = currImg.pixels[index + 1];
                var blueSource = currImg.pixels[index + 2];

                var redBack = prevImg.pixels[index + 0];
                var greenBack = prevImg.pixels[index + 1];
                var blueBack = prevImg.pixels[index + 2];

                var d = dist(redSource, greenSource, blueSource, redBack, greenBack, blueBack);

                if (d > threshold) {
                    diffImg.pixels[index + 0] = 0;
                    diffImg.pixels[index + 1] = 0;
                    diffImg.pixels[index + 2] = 0;
                    diffImg.pixels[index + 3] = 255;
                } else {
                    diffImg.pixels[index + 0] = 255;
                    diffImg.pixels[index + 1] = 255;
                    diffImg.pixels[index + 2] = 255;
                    diffImg.pixels[index + 3] = 255;
                }
            }
        }
    }
    diffImg.updatePixels();
    image(diffImg, 640, 0);

    noFill();
    stroke(255);
    text(threshold, 160, 35);
    
    // Store current image to prevImg
    prevImg = createImage(currImg.width, currImg.height);
    prevImg.copy(currImg, 0, 0, currImg.width, currImg.height, 0, 0, currImg.width, currImg.height);
    
    // Create the grid
    grid.run(diffImg);
}

function toggleAudio() {
    userStartAudio();
    if(playing){
        audioToggle.html('Audio On');
        playing = false;
    } else {
        audioToggle.html('Audio Off');
        playing = true;
    }
}

function toggleStrings(){
    if(strings){
        stringToggle.html('Strings On');
        strings = false;
    } else {
        stringToggle.html('Strings Off');
        strings = true;
    }
}

// faster method for calculating color similarity which does not calculate root.
// Only needed if dist() runs slow
function distSquared(x1, y1, z1, x2, y2, z2){
    var d = (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) + (z2-z1)*(z2-z1);
    return d;
}
