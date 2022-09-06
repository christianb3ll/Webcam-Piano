class Particles {

    constructor(x,y){
        this.particles = [];
        this.lifespans = [];
        this.velocities = [];
        this.diam = 10;
        this.location = createVector(x + this.diam/2,y + this.diam/2);
        this.pluckStrength = 10;
    }
    
    run(){
        // Move the particles
        this.move();
        // Destroy particles that have exceeded their lifespan or that have
        // gone beyond the edge of the canvas
        for(var i = 0; i < this.particles.length; i++){
            if(this.lifespans[i] <= 0 || this.particles[i].x > 620){
                this.destroy(i);
                i--;
            }
            this.lifespans[i]--;
        }
        // Draw the particles
        this.draw();
    }
    
    // Create a particle and apply direction
    createParticle(direction){
        this.particles.push(createVector(this.location.x,this.location.y));
        this.lifespans.push(5);
        this.velocities.push(direction);
    }
    
    // Create a vibrating string of muliple particles
    pluck(){
        for(var i = 0; i < this.pluckStrength; i++){
            this.createParticle(createVector(random(-180,180), 1 ));
        }
    }
    
    // Draw the particles
    draw() {
        fill(255);
        for(var i =0; i < this.particles.length; i++){
            // Draw the particles - width shrinks based on lifespan
            ellipse(this.particles[i].x, this.particles[i].y, this.diam * this.lifespans[i], this.diam/2);
        }
    }
    
    //updates the location of all particles
    move(){
        for (var i=0; i<this.particles.length; i++){
            this.particles[i].y += this.velocities[i].y;
            this.particles[i].x += this.velocities[i].x;
        }
    }
    
    // Destroys the particle at a given index by removing it from the array
    destroy(index) {
        this.particles.splice(index,1);
        this.lifespans.splice(index,1);
        this.velocities.splice(index,1);
  }
}