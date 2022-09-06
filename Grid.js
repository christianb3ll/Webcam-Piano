class Grid {
    /////////////////////////////////
    constructor(_w, _h) {
        this.gridWidth = _w;
        this.gridHeight = _h;
        this.noteSize = 40;
        this.notePos = [];
        this.noteState = [];
        this.particles = [];

        // initalise grid structure and state and create string particle emitters
        for (var x=0;x<_w;x+=this.noteSize){
            var posColumn = [];
            var stateColumn = [];
            var particlesColumn = [];
            
            for (var y=0;y<_h;y+=this.noteSize){
                posColumn.push(createVector(x+this.noteSize/2,y+this.noteSize/2));
                particlesColumn.push(new Particles(x,y));
                stateColumn.push(0);
            }
            this.notePos.push(posColumn);
            this.particles.push(particlesColumn);
            this.noteState.push(stateColumn);
        }
    }
    /////////////////////////////////
    run(img) {
        img.loadPixels();
        this.findActiveNotes(img);
        this.drawActiveNotes(img);
        this.drawParticles();
        // Play the note if audio active
        if(playing) this.playActiveNotes(img);
    }
    /////////////////////////////////
    drawActiveNotes(img){
        // draw active notes
        fill(255);
        noStroke();
        for (var i=0;i<this.notePos.length;i++){
            for (var j=0;j<this.notePos[i].length;j++){
                var x = this.notePos[i][j].x;
                var y = this.notePos[i][j].y;
                if (this.noteState[i][j]>0) {
                    
                    // If Strings is acrtive - pluck the strings
                    if(strings) this.particles[i][j].pluck();
                    
                    var alpha = this.noteState[i][j] * 200;
                    var c1 = color(255,0,0,alpha);
                    var c2 = color(0,0,255,alpha);
                    var mix = lerpColor(c1, c2, map(i, 0, this.notePos.length, 0, 1));
                    fill(mix);
                    var s = this.noteState[i][j];
                    ellipse(x, y, this.noteSize*s, this.noteSize*s);
                }
                this.noteState[i][j]-=0.05;
                this.noteState[i][j]=constrain(this.noteState[i][j],0,1);
            }
        }
    }
    /////////////////////////////////
    findActiveNotes(img){
        for (var x = 0; x < img.width; x += 1) {
            for (var y = 0; y < img.height; y += 1) {
                var index = (x + (y * img.width)) * 4;
                var state = img.pixels[index + 0];
                if (state==0){ // if pixel is black (ie there is movement)
                    // find which note to activate
                    var screenX = map(x, 0, img.width, 0, this.gridWidth);
                    var screenY = map(y, 0, img.height, 0, this.gridHeight);
                    var i = int(screenX/this.noteSize);
                    var j = int(screenY/this.noteSize);
                    this.noteState[i][j] = 1;
                }
            }
        }
    }
    /////////////////////////////////
    playActiveNotes(img){
        for (var i=0;i<this.notePos.length;i++){
            for (var j=0;j<this.notePos[i].length;j++){
                var x = this.notePos[i][j].x;
                var y = this.notePos[i][j].y;
                if (this.noteState[i][j] > 0.8) {
                    
                    // Plays the active note. The notes x position determines the velocity
                    // the notes y position deteremines the note played
                    var note = floor(map(y, height, 0, 60, 127));
                    var velocity = map(x, 0, width, 0, 1);
                    polySynth.play(note, velocity, 0, 1);
                    
                }
            }
        }
    }
    /////////////////////////////////
    drawParticles(){
        // Draw the particles for each emitter
        for(var i = 0; i < this.particles.length; i++){
            for(var j = 0; j < this.particles[i].length; j++){
                this.particles[i][j].run();
            }
        }
    }

}
