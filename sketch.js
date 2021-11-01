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
let buttons = [];


let camera = {
  xOffset: -966,
  yOffset: -473,
}

class cellestialBody {
  constructor(name,x,y,mass,diameter,type,colour) {
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
    //Type
    this.type = type;
    //Colour
    this.colour = colour;
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
  body.mass += body.mass/30;
}

function changeMassNegative(body) {
  body.mass -= body.mass/30;
  if (body.mass < 0) {
    body.mass = 0;
  }
}

class button {
  constructor(x,y,size, planet) {
    this.x = x,
    this.y = y,
    this.size = size
    this.pressed = false;
    this.colour = [77, 78, 80];
    this.planet = planet;
  }
}

class tail {
  constructor(x,y,width) {
    this.x = x,
    this.y = y,
    this.age = 200,
    this.width = width;
  }
}

function createTail() {
  for (let body of cellestialBodies) {
    tailB = new tail(body.pos.x,body.pos.y, mercury.diameter/100000);
    trajectories.push(tailB);
  }
  if (trajectories.length > 2000) {
   trajectories.shift();
  }
}

function drawTail() {
  for (let tail of trajectories) {
    if (tail.age <= 0) {
      continue;
    }
    stroke(255,255,255,tail.age);
    fill(255,255,255,tail.age);
    ellipse(((tail.x*sf)-camera.xOffset), ((tail.y*sf)-camera.yOffset), tail.width);
    tail.age -= 0.5;
  }
}

function clicked(button) {
  //console.log(width/mouseX+", "+height/mouseY);
  if (mouseX > button.x && mouseX < button.x + button.size && mouseY < button.y+button.size && mouseY > button.y) {
    button.pressed = !button.pressed;
    if (button.pressed) {
      for (let butt of buttons) {
        if (butt == button) {
          continue;
        }
        butt.pressed = false;
        butt.colour = [77, 78, 80];
      }
    button.colour = [164, 167, 171];
    }
    else {
      button.colour = [77, 78, 80];
    }
  }
}

function drawButton(button) {
  stroke(button.colour[0],button.colour[1],button.colour[2]);
  fill(button.colour[0],button.colour[1],button.colour[2]);
  rect(button.x, button.y, button.size);
  fill(button.planet.colour[0],button.planet.colour[1],button.planet.colour[2]);
  stroke(button.planet.colour[0],button.planet.colour[1],button.planet.colour[2]);
  if (button.planet == sun) {
    stroke("orange");
    fill("yellow");
  }
  ellipse(button.x+button.size/2, button.y+button.size/2, width/100);
  if (button.pressed) {
    textSize(width/50);
    text(button.planet.name, width/1.1940298507462686, height/1.688404452690167);
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
    if (body == moon) {
      if (bodyArray != earth) {
        continue;
      }
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
    if (bodyArray == earth && body == moon) {
      body.accelerationVector.x += (body.forceVector.x/body.mass)*-1;
      body.accelerationVector.y += (body.forceVector.y/body.mass)*-1;
    }
    else {                                           
    body.accelerationVector.x += (body.forceVector.x/body.mass)*-1;
    body.accelerationVector.y += (body.forceVector.y/body.mass)*-1;
    }


  }
  if (body == moon) {
    body.velocityVector.x = earth.velocityVector.x;
    body.velocityVector.y = earth.velocityVector.y;
  }
  body.velocityVector.x += (body.accelerationVector.x*400);
  body.velocityVector.y += (body.accelerationVector.y*400);
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

let selected = false;

let plutoPlaced = false;

let mousePosXL = 0;
let mousePosYL = 0;
let launchSpeedX = 0;
let launchSpeedY = 0;

function mousePressed() {
  mousePosXL = mouseX;
  mousePosYL = mouseY;
  launchSpeedX = 0;
  launchSpeedY = 0;
  //Button Detection
  if(mouseX > (width/1.067853170189099+width/30)-width/26/2 && mouseX < (width/1.067853170189099+width/30)+width/26/2 &&
    mouseY < (height/10+height/15)+width/26/2 && mouseY > (height/10+height/15)-width/26/2) 
    {
      button1Pressed = !button1Pressed;
      button2Pressed = false;
      button3Pressed = false;
      button4Pressed = false;
  };
  if(mouseX > (width/1.067853170189099+width/30)-width/26/2 && mouseX < (width/1.067853170189099+width/30)+width/26/2 &&
    mouseY < (height/10+height/15+height/5.7)+width/26/2 && mouseY > (height/10+height/15+height/5.7)-width/26/2) 
    {
      button2Pressed = !button2Pressed;
      button1Pressed = false;
      button3Pressed = false;
      button4Pressed = false;
  };
  if(mouseX > (width/1.067853170189099+width/30)-width/26/2 && mouseX < (width/1.067853170189099+width/30)+width/26/2 &&
    mouseY < (height/10+height/15+(height/5.5)*2)+width/26/2 && mouseY > (height/10+height/15+(height/5.5)*2)-width/26/2) 
    {
      button3Pressed = !button3Pressed;
      button1Pressed = false;
      button2Pressed = false;
      button4Pressed = false;
  };
  if(mouseX > (width/1.067853170189099+width/30)-width/26/2 && mouseX < (width/1.067853170189099+width/30)+width/26/2 &&
    mouseY < (height/10+height/15+(height/5.4)*3)+width/26/2 && mouseY > (height/10+height/15+(height/5.4)*3)-width/26/2) 
    {
      button4Pressed = !button4Pressed;
      button1Pressed = false;
      button2Pressed = false;
      button3Pressed = false;
  };


  for (let body of cellestialBodies) {
    if (mouseX > (((body.pos.x*sf)-camera.xOffset)-(body.diameter/30/2)*sf) && mouseX < (((body.pos.x*sf)-camera.xOffset)+(body.diameter/30/2)*sf) &&
        mouseY < (((body.pos.y*sf)-camera.yOffset)+(body.diameter/30/2)*sf) && mouseY > (((body.pos.y*sf)-camera.yOffset)-(body.diameter/30/2)*sf)) {
          if (button1Pressed || button2Pressed || button3Pressed) {
          planetSelected = body;
          }
        } 
  }
  if (button4Pressed) {
    for (let bu of buttons) {
      clicked(bu);
      if (selected && bu.pressed) {
        bu.pressed = false;
        bu.colour = [77, 78, 80];
        selected = false;
        if (bu.planet == pluto) {
          plutoPlaced = true;
        }
        createNewBody(bu.planet);
      }
    }
  }

  mousePosX = mouseX;
  mousePosY = mouseY;
  mouseOffX = camera.xOffset;
  mouseOffy = camera.yOffset;
  //console.log(width/mouseX+", "+height/mouseY);
}

let firedB = false;
let launching = false;

function mouseReleased() {
  if (button3Pressed) {
    launchSpeedX = ((mouseX)-mousePosXL)*-10000;
    launchSpeedY = ((mouseY)-mousePosYL)*-10000;
    console.log(launchSpeedX);
    console.log(launchSpeedY);
    planetSelected.velocityVector.x += launchSpeedX;
    planetSelected.velocityVector.y += launchSpeedY;
  }
  if (button3Pressed) {
    firedB = true;
  }
}

function mouseDragged() {
  if (!button3Pressed) {
  camera.xOffset = ((mouseX)-mousePosX)*-1+mouseOffX;
  camera.yOffset = ((mouseY)-mousePosY)*-1+mouseOffy;
  }
  //if (launched) {
    //launchVector.x = mousePosX - mouseX;
   //launchVector.y = mousePosY - mouseY;
  //}
}

function createNewBody(body) {
  spawnedBody = new cellestialBody("new"+body.name,(mouseX+camera.xOffset)/sf, (mouseY+camera.yOffset)/sf,body.mass,body.diameter,body.type,body.colour);
  //console.log(spawnedBody);
  cellestialBodies.push(spawnedBody);
  //console.log(cellestialBodies);
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
        if (body.type == "star" && body2.type != "star") {
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
  if (button3Pressed) {
    textSize(width/60);
    stroke(129, 129, 129);
    fill(129, 129, 129);
    text("Click and drag away from a planet then release to fire it", width/2.5,height/1.05);
    stroke("Black");
    fill("Black");
    textSize(width/120);
  }
  text("Lighten", width/1.067853170189099+width/51,height/4+height/10.2);
  text("Launch", width/1.071+width/43,height/2+height/28);
  text("Insert", width/1.067853170189099+width/44,height/1.45+height/28);
  if (button4Pressed) {
    spawnMenu();
  }
  if (!button4Pressed) {
    for (let butt of buttons) {
      selected = false;
      butt.pressed = false;
      butt.colour = [77, 78, 80];
    }
  }
}

function spawnMenu() {
  stroke(129, 129, 129,10);
  fill(129, 129, 129,30);
  rect(width/1.200765155974102, height/1.6327217125382263, width/10.2, height/3.45);
  for (let bu of buttons) {
    drawButton(bu);
    if (bu.pressed) {
      selected = true;
      if (bu.planet.type == "star") {
        stroke("orange");
        fill("yellow");
      }
      ellipse(mouseX, mouseY, (bu.planet.diameter/30)*sf);
    }
  }
}

function drawBodies() {
  for (let body of cellestialBodies) {
    if (body == sun) {
      //noFill();
      //stroke("white");
      //ellipse((body.pos.x*sf)-camera.xOffset, (body.pos.y*sf)-camera.yOffset,(27938*2)*sf);
      //ellipse((body.pos.x*sf)-camera.xOffset, (body.pos.y*sf)-camera.yOffset,(38938*2)*sf);
      //ellipse((body.pos.x*sf)-camera.xOffset, (body.pos.y*sf)-camera.yOffset,(58430*2)*sf);
      //ellipse((body.pos.x*sf)-camera.xOffset, (body.pos.y*sf)-camera.yOffset,(76030*2)*sf);
      //ellipse((body.pos.x*sf)-camera.xOffset, (body.pos.y*sf)-camera.yOffset,(86680*2)*sf);
      //ellipse((body.pos.x*sf)-camera.xOffset, (body.pos.y*sf)-camera.yOffset,(99430*2)*sf);
      //ellipse((body.pos.x*sf)-camera.xOffset, (body.pos.y*sf)-camera.yOffset,(109430*2)*sf);
      //ellipse((body.pos.x*sf)-camera.xOffset, (body.pos.y*sf)-camera.yOffset,(129430*2)*sf);
    }
    //Velocity Vector
    //line((body.pos.x*sf)-camera.xOffset, (body.pos.y*sf)-camera.yOffset,((body.pos.x*sf)-camera.xOffset)+body.velocityVector.x, ((body.pos.y*sf)-camera.yOffset)+body.velocityVector.y)
    fill(body.colour[0],body.colour[1],body.colour[2]);
    stroke(body.colour[0],body.colour[1],body.colour[2]);
    if (body.type == "star") {
      stroke("orange");
      fill("yellow");
    }
    ellipse((body.pos.x*sf)-camera.xOffset, (body.pos.y*sf)-camera.yOffset, (body.diameter/30)*sf);
  }
}

function soundWarp() {
  overalGrav = 0;
  for (let bodyArray of cellestialBodies) {
    seperation = dist((mouseX+camera.xOffset)/sf, (mouseY+camera.yOffset)/sf, bodyArray.pos.x, bodyArray.pos.y);
    gravity = ((((6.67 * 10)**-11) * (6*10**24) * bodyArray.mass)/seperation**2)**1; //Adjust gravity strength
    overalGrav += gravity;
  }
  overalGrav = 2.418630304850073*10**28/overalGrav;
  overalGrav = map(overalGrav, 0, 1000, 0, 0.3);
  let volumeWarp = 1.5-overalGrav*10;
  let pitchWarp = map(overalGrav, 0, 1200, 0, 0.3);
  if (volumeWarp < 0) {
    volumeWarp = 0;
  }
  if (pitchWarp < 0.076) {
    pitchWarp = 0.076;
  }
  //console.log(volumeWarp);
  gravityHum.rate(pitchWarp);
  gravityHum.setVolume(volumeWarp);
}

function preload() {
  gravityHum = loadSound('assets/gravitynoise.mp3');
  backgroundMusic = loadSound('assets/jellyfish-in-space-by-kevin-macleod-from-filmmusic-io.mp3');
  first = loadSound('assets/Intro.mp3');
  second = loadSound('assets/Second.mp3');
  third = loadSound('assets/Third.mp3');
  fourth = loadSound('assets/Fourth.mp3');
  fifth = loadSound('assets/Fifth.mp3');
  gravityHum.setVolume(0.2);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  sun = new cellestialBody("Sun", 1000, 0,(1.989*10**30),696340,"star",[219, 114, 27]);
  cellestialBodies.push(sun);

  mercury = new cellestialBody("Mercury", 1000, 27938, (3.285*10**23),48790,"planet",[144, 138, 140]);
  cellestialBodies.push(mercury);

  venus = new cellestialBody("Venus", 1000,-38938,(4.867*10**24),32104,"planet",[238, 229, 220]);
  cellestialBodies.push(venus);

  earth = new cellestialBody("Earth", 1000,58430,(6*10**24),73710,"planet",[71, 97, 59]);
  cellestialBodies.push(earth);

  moon = new cellestialBody("Moon", 1000,62430,(7.35*10**22),17370,"moon",[156, 156, 156]);
  cellestialBodies.push(moon);

  mars = new cellestialBody("Mars", 1000,-76030,(6.39*10**23),67790,"planet",[255, 133, 96]);
  cellestialBodies.push(mars);

  jupiter = new cellestialBody("Jupiter", 1000,86680,(1.898**10*27),139820,"planet",[185, 147, 85]);
  cellestialBodies.push(jupiter);

  saturn = new cellestialBody("Saturn", 1000,-99430,(5.683*10**26),116460,"planet",[202, 162, 110]);
  cellestialBodies.push(saturn);

  uranus = new cellestialBody("Uranus", 1000,109430,(8.681*10**25),50724,"planet",[138, 157, 168]);
  cellestialBodies.push(uranus);

  neptune = new cellestialBody("Neptune", 1000,-129430,(1.024*10**26),49244,"planet",[95, 115, 159]);
  cellestialBodies.push(neptune);

  pluto = new cellestialBody("Pluto", 1000, 15000,(1.30900*10**22),19188.3,"planet",[117, 105, 89]);

  //Putting each planet into Orbit
  setVelocity(mercury, -4950000,0);
  //console.log("Mercury: "+orbitSpeed(sun,mercury)+" Expected: -4950000");
  setVelocity(venus, 4200000,0);
  //console.log("Earth: "+orbitSpeed(sun,earth)+" Expected: -3425000.2222");
  setVelocity(earth, -3425000.2222 ,0);
  setVelocity(moon, -3825000.2222,20000);
  //console.log("Mars: "+orbitSpeed(sun,mars)+" Expected: -3000000");
  setVelocity(mars, 3000000,0);
  //console.log("Juipiter: "+orbitSpeed(sun,jupiter)+" Expected: -2830000");
  setVelocity(jupiter, -2830000,0);
  setVelocity(saturn, 2630000,0);
  setVelocity(uranus, -2500000,0);
  setVelocity(neptune, 2299000,0);
  //setVelocity(ball, 3425000.2222,0);

  //UI Elements
  mercuryB = new button(width/1.1947728686994399, height/1.6072041166380788, width/40, mercury);
  buttons.push(mercuryB);
  venusB = new button(width/1.151, height/1.6072041166380788, width/40, venus);
  buttons.push(venusB);
  earthB = new button(width/1.1111111111111112, height/1.6072041166380788, width/40, earth);
  buttons.push(earthB);
  marsB = new button(width/1.1947728686994399, height/1.454968944099379, width/40, mars);
  buttons.push(marsB);
  jupiterB = new button(width/1.151, height/1.454968944099379, width/40, jupiter);
  buttons.push(jupiterB);
  saturnB = new button(width/1.1111111111111112, height/1.454968944099379, width/40, saturn);
  buttons.push(saturnB);
  uranusB = new button(width/1.1947728686994399, height/1.3347578347578348, width/40, uranus);
  buttons.push(uranusB);
  neptuneB = new button(width/1.151, height/1.3347578347578348, width/40, neptune);
  buttons.push(neptuneB);
  sunB = new button(width/1.1111111111111112, height/1.3347578347578348, width/40, sun);
  buttons.push(sunB);
  plutoB = new button(width/1.1947728686994399,height/1.2307807133421401, width/40, pluto);
  buttons.push(plutoB);
  moonB = new button(width/1.151,height/1.2307807133421401, width/40, moon);
  buttons.push(moonB);

  //Sound
  gravityHum.loop();
  backgroundMusic.loop();
  backgroundMusic.setVolume(0.05);
  first.play();
}

let part1 = true;
let part2 = false;
let part3 = false;
let part4 = false;
let part5 = false;
let draggingB = true;
let count = 0;
let stopB = true;
let notPlayed = true;
let cheese = true;
let cake = true;

function lockCamera() {
  camera.xOffset = (earth.pos.x*sf)-width/2;
  camera.yOffset = (earth.pos.y*sf)-height/2;
  sf = 0.03866514315355348;
} 

function draw() {
  background("black");
  createTail();
  drawTail();
  drawBodies();
  userInterface();
  updatePositions();
  collisionDetection();
  //console.log(camera.xOffset+", "+camera.yOffset);
  soundWarp();
  //Weighten
  if (button1Pressed) {
    if (planetSelected != null) {
      changeMassPostive(planetSelected);
    }
  }
  //Lighten
  if (button2Pressed) {
    if (planetSelected != null) {
      changeMassNegative(planetSelected);
    }
  }
  console.log(planetSelected);
  //Structure
  if (part1) {
    lockCamera();
  }
  if (!first.isPlaying() && draggingB && stopB) {
    part1 = false;
    draggingB = false;
  }
  if (!first.isPlaying() && !draggingB) {
    fill("White");
    text("Click and drag to move and scroll wheel to zoom", width/2.5,height/1.2);
  }
  if (count > 1320) {
    draggingB = true;
    stopB = false;
  }
  if (sf <= 0.0052111853208671277 || count > 1320) {
    part2 = true;
  }
  if (part2 && notPlayed) {
    notPlayed = false;
    second.setVolume(1.8);
    second.play();
  }
  if (plutoPlaced && cheese) {
    cheese = false; 
    part2 = false;
    notPlayed = true;
    part3 = true;
  }
  if (part3 && notPlayed) {
    fourth.play();
    fourth.setVolume(1.8);
    notPlayed = false;
  }
  if (!fourth.isPlaying() && part3) {
    part4 = true;
    part3 = false;
    launching = true;
  }
  if (part4 && cake) {
    fill("White");
    text("Use the launch button to propel Pluto", width/2.5,height/1.2);
  }
  if (cake && firedB) {
    fifth.setVolume(1.8);
    fifth.play();
    cake = false;
  }
  //console.log(count);



  //console.log(camera.xOffset+", "+camera.yOffset);
  //console.log(sf);
  count++;
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
