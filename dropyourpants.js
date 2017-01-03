var systems;
var sound;
var img = [null, null, null];
var imgup, imgdown;
var colors = ["#0000DD", "#00DD00", "#DD0000", "#00DDDD", "#DD00DD", "#DDDD00"];
var changeColor = 0;
var currentColor = 0;
var running = 0;
var onOff = 0;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  sound   = loadSound('assets/sound.mp3');
  sound.setVolume(0.1);
  img[0]  = loadImage("assets/particle1.png");
  img[1]  = loadImage("assets/particle2.png");
  img[2]  = loadImage("assets/particle3.png");
  imgup   = loadImage("assets/pantsup.png");
  imgdown = loadImage("assets/pantsdown.png");
  systems = [];
  this.p = new ParticleSystem(createVector(0, height));
  systems.push(p);
  this.p = new ParticleSystem(createVector(width, height));
  systems.push(p);
  setTimeout(mousePressed, 1000);
}

function draw() {
  if (onOff) {
    background(colors[currentColor]);
    if (changeColor == 9) {
      var oldColor = currentColor;
      currentColor = int(random(0, 5));
      currentColor = currentColor >= oldColor ? currentColor + 1 : currentColor;
      changeColor = 0;
    } else {
      changeColor++;
    }
  } else {
    background(255);
  }
  for (i = 0; i < systems.length; i++) {
    systems[i].run();
    if (onOff) {systems[i].addParticle();}
  }
  if (onOff) {
    var randposx = random(-10, 10);
    var randposy = random(-10, 10);
    var randsize = random(-10, 10);
    image(imgdown, (width/2)-300+randposx, (height/2)-480+randposy, 540+randsize, 960+randsize);
  } else {
    text("drop your pants!", 0, 10);
    text("shoutout to mike vu for audio and\ndave for dropping his pants", 0, 50);
    image(imgup, (width/2)-270, (height/2)-480, 540, 960);
  }
}

function mousePressed() {
  if (running == 0){
    running = 1;
    setTimeout(turnOn, 700);
    setTimeout(turnOff, 10200);
    sound.play();
  }
}

function turnOn() {
  onOff = 1;
}

function turnOff() {
  onOff = 0;
  running = 0;
}

// A simple Particle class
var Particle = function(position) {
  this.acceleration = createVector(0, 0.5);
  this.velocity = createVector(random(-10, 10), random(-30, -15));
  this.position = position.copy();
  this.img = int(random(0, 3));
  this.size = random(50, 200);
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
  image(img[this.img], -this.size/2, -this.size/2, this.size, this.size);
  pop();
};

// Is the particle still useful?
Particle.prototype.isDead = function () {
  if (/*this.lifespan < 0 || */this.position.x < -50 || this.position.x > width + 50 || this.position.y > height + 50) {
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