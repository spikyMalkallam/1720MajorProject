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

let cellestialBodies = [];
let trajectories = [];

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

function angleBetween(point1, point2) {
  return degrees(Math.atan((point2.y-point1.y)/(point2.x-point1.x)));
}
function getForces(body) {
  body.accelerationVector = createVector(0,0);  
  for (let bodyArray of cellestialBodies) {
    if (body == bodyArray) {
      continue;
    }
    angleMode(DEGREES);
    seperation = (dist(body.pos.x, body.pos.y, bodyArray.pos.x, bodyArray.pos.y));
    gravity = (((6.67 * 10)**-11) * body.mass * bodyArray.mass)/seperation**2;
    
    det = createVector(body.pos.x, body.pos.y)

    angle = angleBetween(createVector(body.pos.x, body.pos.y),createVector(bodyArray.pos.x, bodyArray.pos.y));

    seperationV = createVector((Math.sin(angle)*seperation), (Math.cos(angle)*seperation))
    body.forceVector = createVector(0,0);
    body.forceVector.x += Math.cos(angle*(Math.PI/180))*gravity;
    body.forceVector.y += Math.sin(angle*(Math.PI/180))*gravity;
    //console.log(body.forceVector.x);
    //console.log(body.forceVector.y);
    //console.log(seperation);
    //Converting to force velcity, divided by thirty to adjust from m/s to m/(s/30) 
    //********************CHANGE BACK TO 30 FOR REAL TIME***************************                                                
    body.accelerationVector.x += (body.forceVector.x/body.mass)*-1;
    body.accelerationVector.y += (body.forceVector.y/body.mass)*-1;
    console.log(body.name+body.forceVector.x);
    //
    //console.log(body.pos.x/3);
  }
  text("Gravitation pull on moon: "+gravity+"N", earth.pos.x, earth.pos.y+100);
  text("Angle of moon to earth: "+angle, earth.pos.x, earth.pos.y+120);
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
  frameRate(60);

  moon = new cellestialBody("Moon", 892,116,(7.35*10**22),17370);
  cellestialBodies.push(moon);
  setAcceleration(moon, 0, 0);
  earth = new cellestialBody("Earth", 892,500,(6*10**24),63710);
  cellestialBodies.push(earth);
  
  setVelocity(moon, 35230,0);
}

function draw() {
  background("black");
  //noFill();
  fill("black");
  stroke("white");
  color("white");
  ellipse(earth.pos.x, earth.pos.y, 384*2);
  color("white");
  fill("white");
  drawBodies();
  updatePositions();
  text("Moon x velocity: "+moon.velocityVector.x, 400, 400);
  text("Moon y velocity: "+moon.velocityVector.y, 400, 450);
  text("Moon x acceleration: "+moon.accelerationVector.x, 400, 420);
  text("Moon y acceleration: "+moon.accelerationVector.y, 400, 470);
  //Velocity Vector of the moon
  line(moon.pos.x, moon.pos.y,moon.pos.x+moon.velocityVector.x,moon.pos.y+moon.velocityVector.y)
  
  //text("Moon gravity: "+moon.accelerationVector.y, earth.pos.x, earth.pos.y+140);
  //text("Moon gravity: "+moon.accelerationVector.y, earth.pos.x, earth.pos.y+160);
  line(moon.pos.x, moon.pos.y, earth.pos.x, earth.pos.y);
  trajectories.push(moon.pos.x, moon.pos.y, 10); 
  for (i = 0; i < trajectories.length; i += 3) {
    fill("orange");
    ellipse(trajectories[i], trajectories[i+1], trajectories[i+2]);
  }
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