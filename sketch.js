function arrayRemove(arr, value) { 
    
  return arr.filter(function(ele){ 
      return ele != value; 
  });
}

function preload() {
  // load any assets (images, sounds, etc.) here
}

cellestialBodies = [];

class cellestialBody {
  constructor(x,y,mass,diameter) {
    //Position of body
    this.x = x;
    this.y = y;
    //Weight of the body
    this.mass = mass;
    //Diameter of the body
    this.diameter = diameter;
    //Density of the body
    this.density = mass/((4/3)*PI*((diameter/2)^3));
  }
}

function getForces(body) {
  for (i = 0; i < cellestialBodies.length; i++) {
    
  }
}

function setup() {
  background("black");
}

function draw() {
  for (i = 0; i < cellestialBodies.length; i++) {

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