var systems;
var img;
var colors = ["#0000EF", "#00EF00", "#EF0000", "#00EFEF", "#EF00EF", "#EFEF00"];
var changeColor = 0;
var currentColor = 0;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  img = loadImage("assets/particle1.png");  // Load the image
  systems = [];
  this.p = new ParticleSystem(createVector(0, height));
  systems.push(p);
  this.p = new ParticleSystem(createVector(width, height));
  systems.push(p);
}

function draw() {
  background(colors[currentColor]);
  currentColor = changeColor == 9 ? int(random(0, 6)) : currentColor;
  changeColor = changeColor == 9 ? 0 : changeColor + 1;
  for (i = 0; i < systems.length; i++) {
    systems[i].run();
    systems[i].addParticle();
  }
  if (systems.length==0) {
    fill(255);
    textAlign(CENTER);
    textSize(32);
    text("click mouse to add particle systems", width/2, height/2);
  }
}

function mousePressed() {
  this.p = new ParticleSystem(createVector(mouseX, mouseY));
  systems.push(p);
}

// A simple Particle class
var Particle = function(position) {
  this.acceleration = createVector(0, 0.08);
  this.velocity = createVector(random(-5, 5), random(-15, -8));
  this.position = position.copy();
  this.size = random(50, 150);
  this.lifespan = 512.0;
  this.theta = 0.0;
};

Particle.prototype.run = function() {
  this.update();
  this.display();
};

// Method to update position
Particle.prototype.update = function(){
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.lifespan -= 2;
  this.theta += (this.velocity.x * this.velocity.mag()) / 10000.0;
};

// Method to display
Particle.prototype.display = function () {
  push();
  translate(this.position.x, this.position.y);
  rotate(this.theta);
  image(img, -this.size/2, -this.size/2, this.size, this.size);
  pop();
};

// Is the particle still useful?
Particle.prototype.isDead = function () {
  if (/*this.lifespan < 0 || */this.position.x < -50 || this.position.y < -50 || this.position.x > width + 50 || this.position.y > height + 50) {
    return true;
  } else {
    return false;
  }
};

var ParticleSystem = function (position) {
  this.origin = position.copy();
  this.particles = [];
};

ParticleSystem.prototype.addParticle = function () {
  // Add either a Particle or CrazyParticle to the system
  if (int(random(0,4)) == 0) {
    p = new Particle(this.origin);
    this.particles.push(p);
  }
};

ParticleSystem.prototype.run = function () {
  for (var i = this.particles.length - 1; i >= 0; i--) {
    var p = this.particles[i];
    p.run();
    if (p.isDead()) {
      this.particles.splice(i, 1);
    }
  }
};