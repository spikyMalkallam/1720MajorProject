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
let sf = 0.0032111853208671277;
let locked = false;

let cellestialBodies = [];
let trajectories = [];


let camera = {
  xOffset: -966,
  yOffset: -473,
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
    gravity = ((((6.67 * 10)**-11) * body.mass * bodyArray.mass)/seperation**2)**1; //Adjust gravity strength
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
  body.velocityVector.x += body.accelerationVector.x*400;
  body.velocityVector.y += body.accelerationVector.y*400;
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
    if (body == mars) {
      stroke(255, 133, 96);
      fill(255, 133, 96);
    }
    if (body == sun) {
      noFill();
      stroke("white");
      ellipse((body.pos.x*sf)-camera.xOffset, (body.pos.y*sf)-camera.yOffset,(27938*2)*sf);
      ellipse((body.pos.x*sf)-camera.xOffset, (body.pos.y*sf)-camera.yOffset,(38938*2)*sf);
      ellipse((body.pos.x*sf)-camera.xOffset, (body.pos.y*sf)-camera.yOffset,(58430*2)*sf);
      ellipse((body.pos.x*sf)-camera.xOffset, (body.pos.y*sf)-camera.yOffset,(76030*2)*sf);
      ellipse((body.pos.x*sf)-camera.xOffset, (body.pos.y*sf)-camera.yOffset,(86680*2)*sf);
      ellipse((body.pos.x*sf)-camera.xOffset, (body.pos.y*sf)-camera.yOffset,(99430*2)*sf);
      ellipse((body.pos.x*sf)-camera.xOffset, (body.pos.y*sf)-camera.yOffset,(109430*2)*sf);
      ellipse((body.pos.x*sf)-camera.xOffset, (body.pos.y*sf)-camera.yOffset,(129430*2)*sf);
      stroke("orange");
      fill("yellow");
    }
    if (body == earth) {
      stroke("green");
      fill("green");
    }
    //if (body == moon) {
      //stroke("grey");
     // fill("grey");
    //}
    if (body == mercury) {
      stroke(144, 138, 140);
      fill(144, 138, 140);
    }
    if (body == venus) {
      stroke(238, 229, 220);
      fill(238, 229, 220);
    }
    if (body == jupiter) {
      stroke(185, 147, 85);
      fill(185, 147, 85);
    }
    if (body == saturn) {
      stroke(202, 162, 110);
      fill(202, 162, 110);
    }
    if (body == uranus) {
      stroke(138, 157, 168);
      fill(138, 157, 168);
    }
    if (body == neptune) {
      stroke(95, 115, 159);
      fill(95, 115, 159);
    }
    //Velocity Vector
    //line((body.pos.x*sf)-camera.xOffset, (body.pos.y*sf)-camera.yOffset,((body.pos.x*sf)-camera.xOffset)+body.velocityVector.x, ((body.pos.y*sf)-camera.yOffset)+body.velocityVector.y)
    ellipse((body.pos.x*sf)-camera.xOffset, (body.pos.y*sf)-camera.yOffset, (body.diameter/30)*sf);
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

  mercury = new cellestialBody("Mercury", 1000, 27938, (3.285*10**23),48790);
  cellestialBodies.push(mercury);

  venus = new cellestialBody("Venus", 1000,38938,(4.867*10**24),32104);
  cellestialBodies.push(venus);

  earth = new cellestialBody("Earth", 1000,58430,(6*10**24),73710);
  cellestialBodies.push(earth);

  //moon = new cellestialBody("Moon", 1000,108064,(7.35*10**22),17370);
  //cellestialBodies.push(moon);

  mars = new cellestialBody("Mars", 1000,76030,(6.39*10**23),67790);
  cellestialBodies.push(mars);

  jupiter = new cellestialBody("Jupiter", 1000,86680,(1.898**10*27),139820);
  cellestialBodies.push(jupiter);

  saturn = new cellestialBody("Saturn", 1000,99430,(5.683*10**26),116460);
  cellestialBodies.push(saturn);

  uranus = new cellestialBody("Uranus", 1000,109430,(8.681*10**25),50724);
  cellestialBodies.push(uranus);

  neptune = new cellestialBody("Neptune", 1000,129430,(1.024*10**26),49244);
  cellestialBodies.push(neptune);

  //Putting each planet into Orbit
  setVelocity(mercury, -4950000,0);
  setVelocity(venus, -4200000,0);
  setVelocity(earth, -3425000.2222 ,0);
  //setVelocity(moon, -2227220.2222,0);
  setVelocity(mars, -3000000,0);
  setVelocity(jupiter, -2830000,0);
  setVelocity(saturn, -2630000,0);
  setVelocity(uranus, -2500000,0);
  setVelocity(neptune, -2299000,0);
}

function draw() {
  background("black");
  drawBodies();
  updatePositions();
  if (locked) {
    camera.xOffset = getPosX(earth)*sf - width/2;
    camera.yOffset = getPosY(earth)*sf - height/2;
    sf = 0.12116306925716806;
  }
  console.log(camera.xOffset+", "+camera.yOffset);
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
