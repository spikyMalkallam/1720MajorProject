function arrayRemove(arr, value) { 
    
  return arr.filter(function(ele){ 
      return ele != value; 
  });
}

window.addEventListener("wheel", function(e) {
  if (e.deltaY > 0)
    sf *= 0.95;
  else
    sf *= 1.05;
});

//One pixel = 1000km
//Weight in kg
//Force in Newtons
//Velocity in m/(s/30)
//Diameter in km

let gravity = 0;
let angle = 0;
let seperation = 0;
let sf = 1;
let locked = false;

let cellestialBodies = [];
let trajectories = [];

let camera = {
  xOffset: 500,
  yOffset: 500,
  zoom: 0
}

class cellestialBody {
  constructor(name,x,y,mass,diameter) {
    //Name of the body
    this.name = name;
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
    //Acceleration of object
    this.accelerationVector = createVector(0, 0);
    //Velocity of object
    this.velocityVector = createVector(0, 0);
  }
}

function setPosition(body, x, y) {
  body.pos.x = x;
  body.pos.y = y;
}

function setAcceleration(body, x ,y) {
  body.accelerationVector.x = x;
  body.accelerationVector.y = y;
}

function setVelocity(body, x, y) {
  body.velocityVector.x = x;
  body.velocityVector.y = y;
}

function getPosX(body) {
  return body.pos.x;
}

function getPosY(body) {
  return body.pos.y;
}

let equalise1 = 0;
let equalise2 = 1;
function angleBetween(point1, point2) {
  angle = degrees(Math.atan((point2.y-point1.y)/(point2.x-point1.x)));
  if (point1.x < point2.x) {
    angle = -90-(90-angle)
  }
  return angle;
}
function getForces(body) {
  body.accelerationVector = createVector(0,0);  
  for (let bodyArray of cellestialBodies) {
    if (body == bodyArray) {
      continue;
    }
    angleMode(DEGREES);
    seperation = (dist(body.pos.x, body.pos.y, bodyArray.pos.x, bodyArray.pos.y));
    gravity = ((((6.67 * 10)**-11) * body.mass * bodyArray.mass)/seperation**2)**1.1;
    angle = angleBetween(createVector(body.pos.x, body.pos.y),createVector(bodyArray.pos.x, bodyArray.pos.y));
    seperationV = createVector((Math.sin(angle)*seperation), (Math.cos(angle)*seperation))
    body.forceVector = createVector(0,0);
    body.forceVector.x += Math.cos(angle*(Math.PI/180))*gravity;
    body.forceVector.y += Math.sin(angle*(Math.PI/180))*gravity;
    //Converting to force velcity, divided by thirty to adjust from m/s to m/(s/30) 
    //********************CHANGE BACK TO 30 FOR REAL TIME***************************                                                
    body.accelerationVector.x += (body.forceVector.x/body.mass)*-1;
    body.accelerationVector.y += (body.forceVector.y/body.mass)*-1;


  }
  text(angle, earth.pos.x, earth.pos.y+120);
  body.velocityVector.x += body.accelerationVector.x*100;
  body.velocityVector.y += body.accelerationVector.y*100;
}

function updatePositions() {
  for (let body of cellestialBodies) {
    getForces(body);
    //Velocity is in m so must be divided by a million to convert to 1000km
    body.pos.x += (body.velocityVector.x)/100000;
    body.pos.y += (body.velocityVector.y)/100000;
  }
}

let mousePosX = 0;
let mousePosY = 0;

function mousePressed() {
  mousePosX = mouseX;
  mousePosY = mouseY;
  mouseOffX = camera.xOffset;
  mouseOffy = camera.yOffset;
}

function mouseDragged() {
  camera.xOffset = ((mouseX)-mousePosX)*-1+mouseOffX;
  camera.yOffset = ((mouseY)-mousePosY)*-1+mouseOffy;
}

function drawBodies() {
  for (let body of cellestialBodies) {
    ellipse((body.pos.x*sf)-camera.xOffset, (body.pos.y*sf)-camera.yOffset, (body.diameter/100)*sf);
  }
}

function preload() {
  // load any assets (images, sounds, etc.) here
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  
  sun = new cellestialBody("Sun", 1000, 0,(1.989*10**30),696340);
  cellestialBodies.push(sun);
  moon = new cellestialBody("Moon", 1000,150064,(7.35*10**22),17370);
  cellestialBodies.push(moon);
  setAcceleration(moon, 0, 0);
  earth = new cellestialBody("Earth", 1000,148680,(6*10**24),63710);
  cellestialBodies.push(earth);
  mars = new cellestialBody("Mars", 1000,227900,(6.39*10**23),6779);
  cellestialBodies.push(mars);

  setVelocity(earth, -800000,0);
  setVelocity(moon, -800000,0);
  setVelocity(mars, -800000,0);
}

function draw() {
  background("black");
  fill("black");
  stroke("white");
  color("white");

  color("white");
  fill("white");
  drawBodies();
  updatePositions();
  if (locked) {
    camera.xOffset = getPosX(earth)*sf - width/2;
    camera.yOffset = getPosY(earth)*sf - height/2;
    sf = 0.12116306925716806;
  }
  //console.log(camera.xOffset+", "+camera.yOffset);
  //console.log(getPosX(earth)+", "+getPosY(earth));
  console.log(sf);
}

///function mouseDragged() {
  //camera.xOffset = mouseX-mousePos.x;
  //camera.yOffset = mouseY-mousePos.y;
//}

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
  if (key === "l") {
    locked = !locked;
  }
}
