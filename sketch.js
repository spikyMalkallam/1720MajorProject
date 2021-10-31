//Scroll Wheel Recorder
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
let launched = false;

let cellestialBodies = [];
let trajectories = [];


let camera = {
  xOffset: -966,
  yOffset: -473,
}

class cellestialBody {
  constructor(name,x,y,mass,diameter,type) {
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
    //
    this.type = type;
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

function changeMassPostive(body) {
  body.mass += body.mass/10;
}

function changeMassNegative(body) {
  body.mass -= body.mass/10;
  if (body.mass < 0) {
    body.mass = 0;
  }
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
    //seperationV = createVector((Math.sin(angle)*seperation), (Math.cos(angle)*seperation))
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

let unPressed = [77, 78, 80];
let pressed = [164, 167, 171];

let button1 = [77, 78, 80];
let button1Pressed = false;
let button2 = [77, 78, 80];
let button2Pressed = false;
let button3 = [77, 78, 80];
let button3Pressed = false;
let button4 = [77, 78, 80];
let button4Pressed = false;

let planetSelected = null;

function mousePressed() {
  //Button Detection
  if(mouseX > (width/1.067853170189099+width/30)-width/26/2 && mouseX < (width/1.067853170189099+width/30)+width/26/2 &&
    mouseY < (height/10+height/15)+width/26/2 && mouseY > (height/10+height/15)-width/26/2) 
    {
      console.log("1");
      button1Pressed = !button1Pressed;
      button2Pressed = false;
      button3Pressed = false;
      button4Pressed = false;
  };
  if(mouseX > (width/1.067853170189099+width/30)-width/26/2 && mouseX < (width/1.067853170189099+width/30)+width/26/2 &&
    mouseY < (height/10+height/15+height/5.7)+width/26/2 && mouseY > (height/10+height/15+height/5.7)-width/26/2) 
    {
      console.log("1");
      button2Pressed = !button2Pressed;
      button1Pressed = false;
      button3Pressed = false;
      button4Pressed = false;
  };
  if(mouseX > (width/1.067853170189099+width/30)-width/26/2 && mouseX < (width/1.067853170189099+width/30)+width/26/2 &&
    mouseY < (height/10+height/15+(height/5.5)*2)+width/26/2 && mouseY > (height/10+height/15+(height/5.5)*2)-width/26/2) 
    {
      console.log("1");
      button3Pressed = !button3Pressed;
      button1Pressed = false;
      button2Pressed = false;
      button4Pressed = false;
  };
  if(mouseX > (width/1.067853170189099+width/30)-width/26/2 && mouseX < (width/1.067853170189099+width/30)+width/26/2 &&
    mouseY < (height/10+height/15+(height/5.4)*3)+width/26/2 && mouseY > (height/10+height/15+(height/5.4)*3)-width/26/2) 
    {
      console.log("1");
      button4Pressed = !button4Pressed;
      button1Pressed = false;
      button2Pressed = false;
      button3Pressed = false;
  };


  for (let body of cellestialBodies) {
    if (mouseX > (((body.pos.x*sf)-camera.xOffset)-(body.diameter/30/2)*sf) && mouseX < (((body.pos.x*sf)-camera.xOffset)+(body.diameter/30/2)*sf) &&
        mouseY < (((body.pos.y*sf)-camera.yOffset)+(body.diameter/30/2)*sf) && mouseY > (((body.pos.y*sf)-camera.yOffset)-(body.diameter/30/2)*sf)) {
          if (button1Pressed || button2Pressed) {
          console.log("Plamet");
          planetSelected = body;
          }
        }
  }
  //ellipse((((earth.pos.x*sf)-camera.xOffset)-(earth.diameter/30/2)*sf), (((earth.pos.y*sf)-camera.yOffset)+(earth.diameter/30/2)*sf), 10);
  //ellipse((((earth.pos.x*sf)-camera.xOffset)+(earth.diameter/30/2)*sf), (((earth.pos.y*sf)-camera.yOffset)-(earth.diameter/30/2)*sf), 10);



  mousePosX = mouseX;
  mousePosY = mouseY;
  mouseOffX = camera.xOffset;
  mouseOffy = camera.yOffset;
  //console.log(width/mouseX+", "+height/mouseY);
}

function mouseReleased() {
  planetSelected = null;
}

function mouseDragged() {
  camera.xOffset = ((mouseX)-mousePosX)*-1+mouseOffX;
  camera.yOffset = ((mouseY)-mousePosY)*-1+mouseOffy;
  //if (launched) {
    //launchVector.x = mousePosX - mouseX;
   //launchVector.y = mousePosY - mouseY;
  //}
}

let bodyMomentumX;
let bodyMomentumY;
let removeBodies = [];

function collisionDetection() {
  for (let body of cellestialBodies) {
    for (let body2 of cellestialBodies) {
      if (body == body2) {
        continue;
      }
      if (dist(body.pos.x,body.pos.y,body2.pos.x,body2.pos.y) <= ((body.diameter/30)/2)+((body2.diameter/30)/2)) {
        if (body.type == "star") {
          removeBodies.push(body2)
        }
        //console.log("We got a hit between " +body.name+" and "+body2.name);
        //console.log(body.name+": x momentum: "+(body.velocityVector.x*body.mass)/body2.mass+" y momentum: "+(body.velocityVector.y*body.mass)/body2.mass);
        //console.log(body2.name+": x momentum: "+body2.velocityVector.x*body2.mass+" y momentum: "+body2.velocityVector.y*body2.mass);
        bodyMomentumX = (body.velocityVector.x*body.mass);
        bodyMomentumY = (body.velocityVector.y*body.mass);
        body2.velocityVector.x = (bodyMomentumX)/body2.mass;
        body2.velocityVector.y = (bodyMomentumY)/body2.mass;
      }
    }
  }
  for (let bod of removeBodies) {
    cellestialBodies = (removeVal(cellestialBodies, bod));
  }
}

function removeVal(arr, value) {
  let arr2 = [];
  for (let value2 of arr) {
    if (value2 != value) {
      arr2.push(value2);
    }
  }
  return arr2;
}

//v = d/t
// T**2 = ((4*Math.PI)/6.67*10**-11*(centre mass + planet))*r**3

let orbitalTime;
let orbitalVelocity;

//Two bodies
function orbitSpeed(body,bodyArray) {
  //orbitalTime = ((4*Math.PI)/6.67*10**-11*(centre.mass+ planet.mass))*(dist(centre.pos.x,centre.pos.y,planet.pos.x,planet.pos.y)**3);
  //orbitalVelocity = dist(centre.pos.x,centre.pos.y,planet.pos.x,planet.pos.y)/orbitalTime;
  angleMode(DEGREES);
  seperation = (dist(body.pos.x, body.pos.y, bodyArray.pos.x, bodyArray.pos.y));
  gravity = ((((6.67 * 10)**-11) * body.mass * bodyArray.mass)/seperation**2)**1; //Adjust gravity strength
  angle = angleBetween(createVector(body.pos.x, body.pos.y),createVector(bodyArray.pos.x, bodyArray.pos.y));
  //seperationV = createVector((Math.sin(angle)*seperation), (Math.cos(angle)*seperation))
  body.forceVector = createVector(0,0);
  body.forceVector.x += Math.cos(angle*(Math.PI/180))*gravity;
  body.forceVector.y += Math.sin(angle*(Math.PI/180))*gravity;
  return body.forceVector;
}

function userInterface() {
  stroke(129, 129, 129,10);
  fill(129, 129, 129,30);
  rect(width/1.067853170189099, height/10, width/13,height/1.25);
  if (button1Pressed) {
    button1 = pressed;
  }
  else {
    button1 = unPressed;
  }
  if (button2Pressed) {
    button2 = pressed;
  }
  else {
    button2 = unPressed;
  }
  if (button3Pressed) {
    button3 = pressed;
  }
  else {
    button3 = unPressed;
  }
  if (button4Pressed) {
    button4 = pressed;
  }
  else {
    button4 = unPressed;
  }
  //Button 1 Draw
  fill(button1[0], button1[1], button1[2]);
  ellipse(width/1.067853170189099+width/30, height/10+height/15, width/26);
  //Button 2 Draw
  fill(button2[0], button2[1], button2[2]);
  ellipse(width/1.067853170189099+width/30, height/10+height/15+height/5.7, width/26);
  //Button 3 Draw
  fill(button3[0], button3[1], button3[2]);
  ellipse(width/1.067853170189099+width/30, height/10+height/15+(height/5.5)*2, width/26);
  //Button 4 Draw
  fill(button4[0], button4[1], button4[2]);
  ellipse(width/1.067853170189099+width/30, height/10+height/15+(height/5.4)*3, width/26);
  //Labels
  stroke("Black");
  fill("Black");
  textSize(width/120);
  text("Heavier", width/1.067853170189099+width/52,height/10+height/14);
  if (button1Pressed || button2Pressed) {
    textSize(width/60);
    stroke(129, 129, 129);
    fill(129, 129, 129);
    text("Click and hold on a planet", width/2.5,height/1.05);
    stroke("Black");
    fill("Black");
    textSize(width/120);
  }
  text("Lighten", width/1.067853170189099+width/51,height/4+height/10.2);
  text("Orbit", width/1.067853170189099+width/43,height/2+height/28);
  text("Insert", width/1.067853170189099+width/44,height/1.45+height/28);
  if (button4Pressed) {
    spawnMenu();
  }
}

function spawnMenu() {
  rect()
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
    //if (body == ball) {
     // stroke("white");
     //fill("white");
    //}
    //Velocity Vector
    //line((body.pos.x*sf)-camera.xOffset, (body.pos.y*sf)-camera.yOffset,((body.pos.x*sf)-camera.xOffset)+body.velocityVector.x, ((body.pos.y*sf)-camera.yOffset)+body.velocityVector.y)
    ellipse((body.pos.x*sf)-camera.xOffset, (body.pos.y*sf)-camera.yOffset, (body.diameter/30)*sf);
    console.log(planetSelected);
  }
}

function preload() {
  // load any assets (images, sounds, etc.) here
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  
  sun = new cellestialBody("Sun", 1000, 0,(1.989*10**30),696340,"star");
  cellestialBodies.push(sun);

  mercury = new cellestialBody("Mercury", 1000, 27938, (3.285*10**23),48790,"planet");
  cellestialBodies.push(mercury);

  venus = new cellestialBody("Venus", 1000,38938,(4.867*10**24),32104,"planet");
  cellestialBodies.push(venus);

  earth = new cellestialBody("Earth", 1000,58430,(6*10**24),73710,"planet");
  cellestialBodies.push(earth);

  //ball = new cellestialBody("Ball", -10000,58430,(9*10**24),73710,"planet");
  //cellestialBodies.push(ball);

  //moon = new cellestialBody("Moon", 1000,108064,(7.35*10**22),17370);
  //cellestialBodies.push(moon);

  mars = new cellestialBody("Mars", 1000,76030,(6.39*10**23),67790,"planet");
  cellestialBodies.push(mars);

  jupiter = new cellestialBody("Jupiter", 1000,86680,(1.898**10*27),139820,"planet");
  cellestialBodies.push(jupiter);

  saturn = new cellestialBody("Saturn", 1000,99430,(5.683*10**26),116460,"planet");
  cellestialBodies.push(saturn);

  uranus = new cellestialBody("Uranus", 1000,109430,(8.681*10**25),50724,"planet");
  cellestialBodies.push(uranus);

  neptune = new cellestialBody("Neptune", 1000,129430,(1.024*10**26),49244,"planet");
  cellestialBodies.push(neptune);

  //Putting each planet into Orbit
  setVelocity(mercury, -4950000,0);
  console.log("Mercury: "+orbitSpeed(sun,mercury)+" Expected: -4950000");
  setVelocity(venus, -4200000,0);
  console.log("Earth: "+orbitSpeed(sun,earth)+" Expected: -3425000.2222");
  setVelocity(earth, -3425000.2222 ,0);
  //setVelocity(moon, -2227220.2222,0);
  console.log("Mars: "+orbitSpeed(sun,mars)+" Expected: -3000000");
  setVelocity(mars, -3000000,0);
  console.log("Juipiter: "+orbitSpeed(sun,jupiter)+" Expected: -2830000");
  setVelocity(jupiter, -2830000,0);
  setVelocity(saturn, -2630000,0);
  setVelocity(uranus, -2500000,0);
  setVelocity(neptune, -2299000,0);
  //setVelocity(ball, 3425000.2222,0);
}

function draw() {
  background("black");
  drawBodies();
  userInterface();
  updatePositions();
  collisionDetection();
  //Weighten
  if (button1Pressed) {
    if (planetSelected != null) {
      console.log("Benuis");
      changeMassPostive(planetSelected);
    }
  }
  //Lighten
  if (button2Pressed) {
    if (planetSelected != null) {
      console.log("Benuis");
      changeMassNegative(planetSelected);
    }
  }

  //console.log(camera.xOffset+", "+camera.yOffset);
  //console.log(sf);
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
  //if (key == 'l') {
    //launched = !launched;
  //}
}
