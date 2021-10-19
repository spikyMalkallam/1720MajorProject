function arrayRemove(arr, value) { 
    
  return arr.filter(function(ele){ 
      return ele != value; 
  });
}

//One pixel = 1000km
//Weight in kg
//Force in Newtons
//Velocity in m/(s/30)
//Diameter in km

let gravity = 0;
let angle = 0;
let seperation = 0;

cellestialBodies = [];

class cellestialBody {
  constructor(x,y,mass,diameter) {
    //Position of body
    this.pos = createVector(x, y);
    //Weight of the body
    this.mass = mass;
    //Diameter of the body
    this.diameter = diameter;
    //Density of the body
    this.density = mass/((4/3)*PI*((diameter/2)**3));
    //Force on the body
    this.forceVector = createVector(0, 0);
    //Velocity of object
    this.velocityVector = createVector(0, 0);
  }
}

function angleBetween(point1, point2) {
  return degrees(Math.atan((point2.y-point1.y)/(point2.x-point1.x)));
}
function getForces(body) {
  for (let bodyArray of cellestialBodies) {
    if (body == bodyArray) {
      continue;
    }
    seperation = (dist(body.pos.x, body.pos.y, bodyArray.pos.x, bodyArray.pos.y));
    gravity = (((6.67 * 10)**-11) * body.mass * bodyArray.mass)/seperation**2;
    angle = angleBetween(createVector(body.pos.x, body.pos.y),createVector(bodyArray.pos.x, bodyArray.pos.y));
    body.forceVector = createVector(0,0);
    body.forceVector.x += Math.sin(angle)*gravity;
    body.forceVector.y += Math.cos(angle)*gravity;
    //console.log(body.forceVector.x);
    //console.log(body.forceVector.y);
    //console.log(seperation);
    //Converting to force velcity, divided by thirty to adjust from m/s to m/(s/30) 
    //********************CHANGE BACK TO 30 FOR REAL TIME***************************  <here>                                                    
    body.velocityVector.x = (Math.sqrt((body.forceVector.x*seperation)/(body.mass/2)))/30;
    body.velocityVector.y = (Math.sqrt((body.forceVector.y*seperation)/(body.mass/2)))/30;
    //
    console.log((body.velocityVector.x)/1000000);
    console.log(body.pos.x);
  }
}

function updatePositions() {
  for (let body of cellestialBodies) {
    getForces(body);
    //Velocity is in m so must be divided by a million to convert to 1000km
    body.pos.x += (body.velocityVector.x)/1000000;
    body.pos.y += (body.velocityVector.y)/1000000;
  }
}

function drawBodies() {
  for (let body of cellestialBodies) {
    ellipse(body.pos.x, body.pos.y, (body.diameter/1000));
  }
}

function preload() {
  // load any assets (images, sounds, etc.) here
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  moon = new cellestialBody(500,500,(7.35*10**22),17370);
  cellestialBodies.push(moon);
  earth = new cellestialBody(884,500,(6*10**24),63710);
  cellestialBodies.push(earth);
  frameRate(30);
}

function draw() {
  angleMode(DEGREES);
  background("black");
  updatePositions();
  drawBodies();
}

// when you hit the spacebar, what's currently on the canvas will be saved (as
// a "thumbnail.png" file) to your downloads folder. this is a good starting
// point for the final thumbnail of your project (this allows us to make a
// showcase of everyone's work like we did for the nametag assignment).
//
// remember that you need to resize the file to 1280x720, and you will probably
// want to delete this bit for your final submission.
function keyTyped() {
  if (key === " ") {
    saveCanvas("thumbnail.png");
  }
}