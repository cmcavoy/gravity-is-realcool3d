class CelestialObject {
  constructor(x, y, z, mass, size, stationary, color) {
    this.location = createVector(x,y, z);
    this.heading = 0; // Keep this in Radians
    this.velocity = createVector(0,0);
    this.gravforce = createVector(0,0);
    this.gravModifier = 0.005; // chill it out
    this.mass = mass;
    this.G = 1;
    this.size = size;
    this.stationary = stationary;
    this.previousLocation = this.location.copy();
    this.color = color;
  }
  
  gravity(obj) {
    let dir = obj.location.copy().sub(this.location);
    let r = dir.mag();
    let f = this.G * ((obj.mass * this.mass) / (r * r));
    this.gravforce = dir.copy().mult(f);
    this.gravforce.normalize();
    this.gravforce.mult(this.gravModifier);
    this.velocity.add(this.gravforce);
  }
  
  move() {
    this.previousLocation = this.location.copy();
    this.location.add(this.velocity);
  }
  
  addThrust(t, angle) {
    this.heading = angle;
    let thrustForce = createVector(0,-1);
    thrustForce.rotate(angle);
    //thrustForce.normalize();
    this.velocity.add(thrustForce);
  }
    
  update(objs) {
    for (let i=0; i<objs.length; i++) {
      let obj = objs[i];
      if (obj != this && obj.stationary && !this.stationary) {
        this.gravity(objs[i]);
      }
    }
    if (! this.stationary) {
      this.move();
    }
  }
  
  draw() {
    translate(0,0,0);
    translate(this.location.x, this.location.y, this.location.z);
    //rotateZ(frameCount * .01);
    fill(this.color);
    texture(img);
    sphere(this.size, 100, 100);
  }
}

p5.disableFriendlyErrors = true;

let planets = 1;
let ships = 2;
let particles = 0;

let universe = [];

let img;
let width;
let height;

function preload() {
  img = loadImage("https://cdn.glitch.com/75e46e32-1a41-433f-a7ad-e5e6ad6e976f%2FHipstamaticPhoto-603053477.650420.jpg?v=1581725277629");
}

function setup() {
  createCanvas(windowWidth - 40, windowHeight, WEBGL);
  width = windowWidth -40;
  height = windowHeight;
  background(0);
  stroke(0);
  fill(0);
  
  for (let i=0; i<planets; i++) {
    let x = 0;
    let y = 0;
    let z = 0;
    let p = new CelestialObject(x, y, z, 50, 75, true, [255, 255 , 255]);
    universe.push(p);
  }
  
  for (let i=0; i<ships; i++) {
    let m = i + 1; // modifier
    let x = 100 * m;
    let y = 100 * m;
    let z = 20 * m;
    let r = 255;
    let g = 255;
    let b = 255;
    let s = new CelestialObject(x, y, z, 10, 20, false, [r,g,b]);
    let heading;
    heading = HALF_PI / 2;
    s.addThrust(20000 * m, heading);
    universe.push(s);
  }

  for (let i=0; i<particles; i++) {
    let x = random(-width /2, width/2);
    let y = random(-height /2,height /2)
    let z = random(-100, 100);
    let r = 255;
    let g = 255;
    let b = 255;
    let s = new CelestialObject(x, y, z, 0, 2, false, [r,g,b]);
    let heading;
    //heading = HALF_PI / 2;
    //s.addThrust(3 * m, heading);
    universe.push(s);
  }
}

function draw() {
  clear();
  let fov = PI/3;
  let cameraZ = (height/2.0) / tan(fov/2.0);
  perspective(fov, width/height, cameraZ/10.0, cameraZ*10.0);
  directionalLight(250, 250, 250, 300, 10, -1); // r, g, b, x, y, x
  for (const i in universe) {
    universe[i].update(universe);
    universe[i].draw();
  }
}
