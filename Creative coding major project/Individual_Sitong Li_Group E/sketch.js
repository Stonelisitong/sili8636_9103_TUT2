let radii;//Define an array and use it to store the radii of concentric circles.
let gridWidth;  
let gridHeight; // Define variables for the width and height of the grid
let hexagonSize; // Define a variable to store the size of the hexagon
let colorsList = []; // Define a two-dimensional array and use it to store the colours at each position.
let angle = 0;  // Define a variable to store the angle of rotation
let rotating = false;  // Define a variable to store whether the rotation is enabled, initially set to false
let rotateRate = 0.05; // Define a variable to store the rotation rate 
let mousePressedTime;  // Define a variable to store the time when the mouse is pressed
let dragging = false; // Define a variable to store whether the mouse is dragging
let gif; // Define variables for loading and creating GIFs
let img; // Define variables for loading and creating Images
let xHandPosition; 
let yHandPosition; // Define variables for the position of the GIF
let hexCenterX;
let hexCenterY; // Define variables for the center coordinates of the hexagon
let button; // Define variables for the button
let circleclock; // Define variables for the clock


function preload() {  // Load GIFs and thumbnail at the bottom of the canvas
  gif = loadImage("gif/hand.gif");
  img = loadImage("image/Wheels.jpg");
}


function setup() {
  let canvas = createCanvas(windowWidth, windowHeight); // Create a canvas that fills the window
  canvas.style('display', 'block');// Set the display of the canvas to 'block' to avoid layout confusion of the graphics
  
  // Initialize grid width, height and size of hexagons
  gridWidth = windowWidth;
  gridHeight = windowHeight;
  hexagonSize = windowWidth/5;
  // Set background color
  background(4, 81, 123);
  // Set angle mode to degrees
  angleMode(DEGREES);

  // Initialize a set of radii for concentric circles
  radii = [hexagonSize * 0.38, hexagonSize * 0.25, hexagonSize * 0.1];
  // Initialize the time when the mouse is pressed to 0
  mousePressedTime = 0;

  // Initialize the position of the hand gif
  xHandPosition = windowWidth * 0.93;
  yHandPosition = windowHeight * 0.88;

  // Create a button to refresh the sketch
  let refreshButton = createButton('Refresh');
  refreshButton.position(windowWidth * 0.02, windowHeight * 0.96);
  refreshButton.mousePressed(refreshSketch);

  // Create a clock at the bottom of the canvas
  circleclock = new circleClock(width * 0.04, height - 65, 60, color(255));

}

// Adjust the size of the canvas when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // Adjust the position of the hand gif when the window is resized
  xHandPosition = windowWidth * 0.93;
  yHandPosition = windowHeight * 0.88;
}


// Define a function to draw six white dots with orange and brown edges at the vertices of the hexagon
// Then draw the hexagonal honeycomb grid with twisted lines
function drawTwistedLine(cX, cY, r, row, col) {
  // Get the current position’s color list
  let colors = getColorsForPosition(row, col);
  if (mouseInHexagon(mouseX - width / 2, mouseY - height / 2, cX, cY, r)) {
    // If the mouse is in the hexagon
    colors[0] = color(255); // Set the first color of the list to white 
    //It means that the twisted line and radius lines of are white when the mouse is in the hexagon
  }
  // Set the first color of the list as the fill color
  fill(colors[0]);

  for (let a = 0; a < 360; a += 60) {
    // Calculate current vertice’s coordinates. 
    let x1 = cX + r * cos(a);
    let y1 = cY + r * sin(a);

    // Draw a white circle and a larger brown concentric circle at each vertex, then set the stroke to orange.
    push();
    strokeWeight(3); // Set the strokeWeight to 3
    stroke(255, 100, 0); // Set the stroke color to orange
    fill(101, 67, 33); // Set fill color to dark brown
    ellipse(x1, y1, r * 0.2, r * 0.2); // Draw dark brown concentric circles
    pop();

    push();
    noStroke(); // No fill
    fill(255); // Set fill color to white
    ellipse(x1, y1, r * 0.1, r * 0.1); // Draw white dotted circles
    pop();


    // Draw a hexagonal honeycomb grid of twisted lines
    // Calculate the vertex coordinates of the immediately preceding vertex,
    // and use the coordinates of the current vertex and the immediately preceding vertex to draw a twisted line
    let x2 = cX + r * cos(a + 60);
    let y2 = cY + r * sin(a + 60);

    // Divide the line between the vertex of the hexagon and the immediately adjacent vertex into two segments, 
    //and draw two interlaced Bezier curves for each segment
    let segments = 2; 
    for (let i = 0; i < segments; i++) {
      // Calculate the starting point coordinates of each line segment
      let startX = lerp(x1, x2, i / segments);// The X coordinate of the starting point of the current segment
      let startY = lerp(y1, y2, i / segments);// The X coordinate of the starting point of the current segment

      // Calculate the end point coordinates of each line segment
      let endX = lerp(x1, x2, (i + 1) / segments);// X coordinate of the end point of the current segment
      let endY = lerp(y1, y2, (i + 1) / segments);// Y coordinate of the end point of the current segment

      // Calculate the midpoint coordinates of each line segment to determine the control points of the Bezier curve
      let midX = (startX + endX) / 2;
      let midY = (startY + endY) / 2;

      // Calculate the first control point of the Bezier curve
      let ControlPoint1x = midX + (startY - endY) * 0.3; // Control the X coordinate of point 1 and adjust 0.3 to change the distance of the control point
      let ControlPoint1y = midY + (endX - startX) * 0.3; // Control the Y coordinate of point 1 and adjust 0.3 to change the distance of the control point

      // Calculate the second control point of the Bezier curve
      let ControlPoint2x = midX - (startY - endY) * 0.3; // Control the X coordinate of point 2 and adjust 0.3 to change the distance of the control point
      let ControlPoint2y = midY - (endX - startX) * 0.3; // Control the Y coordinate of point 2 and adjust 0.3 to change the distance of the control point


      // Draw the first Bezier curve
      beginShape();
      vertex(startX, startY);// Define start points
      bezierVertex(ControlPoint1x, ControlPoint1y, ControlPoint2x, ControlPoint2y, endX, endY);
      //Define two control points and end points of another Bezier curve,
      endShape();

      // Draw the second Bezier curve
      beginShape();
      vertex(startX, startY);// Define the start points
      bezierVertex(ControlPoint2x, ControlPoint2y, ControlPoint1x, ControlPoint1y, endX, endY);
      // Define two control points and end points of another Bezier curve,
      // The order of the control points of this curve is opposite to that of the previous curve to form a staggered line
      endShape();

    }
  }
}

// Define a function to draw concentric circles and dotted rings
function drawConcentricCirclesAndDetails(cX, cY, radii, row, col) {
  // Get the color list of the current location
  let colors = getColorsForPosition(row, col);
  new ConcentricCirclesAndDetails(cX, cY, radii, colors).draw();
}

// Define a class to draw dotted circles
class DottedCircle {
  constructor(cX, cY, r, dotRadius, color) {
    this.cX = cX;
    this.cY = cY;
    this.r = r;
    this.dotRadius = dotRadius;
    this.color = color;
  }

  draw() {
    push();
    stroke(this.color);

    //Take the center of the hexagon as the center of the ring, 
    //and draw a small dot every 15 degrees to form a ring
    for (let a = 0; a < 360; a += 15) {
      // Use trigonometric functions to calculate the coordinates of the current small circle
      let x = this.cX + this.r * cos(a);
      let y = this.cY + this.r * sin(a);
      ellipse(x, y, this.dotRadius, this.dotRadius);
    }
    pop();
  }
}

// Define a class to draw concentric circles and dotted rings
class ConcentricCirclesAndDetails {
  constructor(cX, cY, radii, colors) {
    this.cX = cX;
    this.cY = cY;
    this.radii = radii;
    this.colors = colors;
  }

// Using the center of the hexagon as the center of the circle, 
// draw three concentric circles and the small dots between the concentric circles
  draw() {
    push();
    // Loop through the three sets of data in the radius array
    // and draw concentric circles using the stored colours
    for (let i = 0; i < this.radii.length; i++) {
      fill(this.colors[i + 1]);
      ellipse(this.cX, this.cY, this.radii[i] * 2, this.radii[i] * 2);
    }
    
  
    // Draw radius lines on the largest circles
    push();
    strokeWeight(5);
    // Use the first color for the line 
    stroke(this.colors[0]); 
    // Calculate the end point of the line based on the current angle and the radius of the largest circle
    let endX = this.cX + this.radii[0] * cos(angle);
    let endY = this.cY + this.radii[0] * sin(angle);
    line(this.cX, this.cY, endX, endY); 

    // Draw two arc between the smallest circle and the middle circle
    // Reference code from https://editor.p5js.org/ri1/sketches/9KYDDY328
    // Set the radius of the arc
    let arcRadius_1 = this.radii[0] * 0.5;
    // Set the stroke and fill for the arc
    stroke(0, 100,168); 
    strokeWeight(5); 
    noFill(); // Ensure the arc isn't filled
    arc(this.cX, this.cY, arcRadius_1 * 2, arcRadius_1 * 2, 90 + angle, 180 + angle, OPEN); // Draw the arc

    let arcRadius_2 = this.radii[0] * 0.55;
    // Set the stroke and fill for the arc
    stroke(0, 230, 255); 
    strokeWeight(6); 
    noFill(); // Ensure the arc isn't filled
    arc(this.cX, this.cY, arcRadius_2 * 2, arcRadius_2 * 2, 180 + angle, 450 + angle, OPEN); // Draw the arc
    pop();

    // Calculate the radii of three rings formed by small dots
    let r1 = (this.radii[0] + this.radii[1]) / 2 * 0.85;
    let r2 = r1 * 1.12;
    let r3 = r2 * 1.14

    // Draw dotted rings
    new DottedCircle(this.cX, this.cY, r1, r1 * 0.1, this.colors[4]).draw();
    new DottedCircle(this.cX, this.cY, r2, r1 * 0.1, this.colors[5]).draw();
    new DottedCircle(this.cX, this.cY, r3, r1 * 0.1, this.colors[6]).draw();

    // When the mouse is pressed and the rotation is not enabled, 
    // a straight line starts to rotate with the centre of the circle as a fixed point
    if (mouseIsPressed && !rotating) {
      rotating = true;
    }

  
    if (rotating) {
      angle += rotateRate; // Increase the angle by 0.05 each time
    }
    
    pop();
  }
}

// Fill wrapped lines, concentric circles, and dots with random colors:
// Get the color based on the row and column position of the grid, if no color is stored, generate the color and store it
// Reference code: https://github.com/CodingTrain/website-archive/blob/main/Tutorials/P5JS/p5.js/09/9.15_p5.js_2D_Arrays/sketch.js
function getColorsForPosition(row, col) {
  // If the current row does not store colors, create a new empty list to store the colors
  if (!colorsList[row]) colorsList[row] = [];
  
  // If there is no color list at the current location, a set of colors is randomly generated and stored
  if (!colorsList[row][col]) {
    let colorsForThisSet = [];
    
    // Add color to twisted thread
    colorsForThisSet.push(color(random(255), random(255), random(255)));

    // Add color to concentric circles
    for (let r of radii) {
      colorsForThisSet.push(color(random(255), random(255), random(255)));
    }

    // Add color to the small dots between concentric circles
    colorsForThisSet.push(color(random(255), random(255), random(255)));
    colorsForThisSet.push(color(random(255), random(255), random(255)));
    colorsForThisSet.push(color(random(255), random(255), random(255)));

    // Store randomly generated colors into a list
    colorsList[row][col] = colorsForThisSet;
  }

  // Return the color list for the current location
  return colorsList[row][col];
}

// Define a class to draw a clock at the bottom of the canvas
class circleClock {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 30;
  }

  // Function to draw the circle of clock
  draw() {
    push();
    fill(255);
    stroke(0);
    strokeWeight(3);
    circle(this.x, this.y, this.radius * 2);

    // Draw the hour hand
    fill(0);
    noStroke();
    rect(this.x-3, this.y, 3, 20);
    rect(this.x-3, this.y, 28, 3);
    pop();
  }
}

// Define a function to draw the hexagonal honeycomb grid
// Reference code: https://www.gorillasun.de/blog/a-guide-to-hexagonal-grids-in-p5js/#constructing-a-hexagonal-grid
function makeGrid() {
  let count = 0;// init counter
  
  // Adjust the starting position of the entire grid so that it fully displays on the canvas
  let offsetX = -width / 2;
  let offsetY = -height / 2;

  // Draw the base grid using a hexagonal honeycomb grid frame
  for (let y = offsetY *1.4, row = 0; y < gridHeight; y += hexagonSize / 2.3, row++) {
    for (let x = offsetX *1.2, col = 0; x < gridWidth; x += hexagonSize * 1.5, col++) {
      let hexCenterX = x + hexagonSize * (count % 2 == 0) * 0.75;
      let hexCenterY = y;

      // Call the drawTwistedLine function to draw twisted lines 
      drawTwistedLine(hexCenterX, hexCenterY, hexagonSize / 2, row, col);
      // Call drawConcentricCircles function to draw concentric circles and details
      drawConcentricCirclesAndDetails(hexCenterX, hexCenterY, radii, row, col);
    }
    count++;// increment every row
  }
}



// When the mouse is clicked, the colors are randomly changed
function mouseClicked() {
  // Iterate through all stored colors and change them directly
  for (let row = 0; row < colorsList.length; row++) {
    for (let col = 0; col < (colorsList[row] ? colorsList[row].length : 0); col++) {
      let colorsForThisSet = [];

      // Calculate new random color for twisted thread and radius lines
      let newColor = color(random(255), random(255), random(255));
      colorsForThisSet.push(newColor);

      // Calculate new random colors for concentric circles
      for (let i = 0; i < radii.length; i++) {
        newColor = color(random(255), random(255), random(255));
        colorsForThisSet.push(newColor);
      }

      // Calculate new random colors for the small dots between concentric circles
      for (let i = 0; i < 3; i++) { 
        newColor = color(random(255), random(255), random(255));
        colorsForThisSet.push(newColor);
      }

      // Update the colors in the colors list
      colorsList[row][col] = colorsForThisSet;
    }
  }
}


// When the mouse is pressed, the rotation of the concentric circles and details is enabled
function mousePressed() {
  // When the mouse is pressed, record the current time
  mousePressedTime = millis();
  rotating = true;
  dragging = true;
  loop(); //Make sure the draw function is called continuously
}

// When the mouse is released, the rotation of the concentric circles and details is disabled
function mouseReleased() {
  // When the mouse is released, stop the rotation
  rotating = false;
  mousePressedTime = 0; 
  //Reset the time
  rotating = false;
  dragging = false; 
  noLoop(); 
}

// Define a function to determine whether the mouse is in the hexagon,
// When the mouse is in the hexagon, the color of the twisted line and radius line changes to white
function mouseInHexagon(mx, my, hexX, hexY, hexSize) {
  // Calculate wheather the mouse is in the hexagon
  let d = dist(mx, my, hexX, hexY);
  return d < hexSize;
}

// When the mouse is dragged (horizontal movement), the size of the concentric circles and details is controlled
function mouseDragged() {
  if (dragging) {
    let difference = mouseX - pmouseX; // Calculate the difference of mouse X position since the last frame

    // Loop through all the radii and update them based on the mouse movement
    for (let i = 0; i < radii.length; i++) {
      // Increase or decrease the radius based on the direction of mouse movement
      radii[i] = max(radii[i] + difference * 0.03, windowWidth/40); // Set the range of the radius
    }
  }
  return false; // Prevent default behavior and event propagation
}

// When the arrow keys are moved, the position of the hand gif is controlled
// When the w/s key is pressed, the rotation rate of the concentric circles and details is controlled
function keyPressed() {
  // When the arrow keys are pressed, move the hand gif
  if (keyIsDown(LEFT_ARROW)) {
    xHandPosition -= 10; // Move the gif to the left
  } else if (keyIsDown(RIGHT_ARROW)) {
    xHandPosition += 10; // Move the gif to the right
  } else if (keyIsDown(UP_ARROW)) {
    yHandPosition -= 10; // Move the gif up
  } else if (keyIsDown(DOWN_ARROW)) {
    yHandPosition += 10; // Move the gif down
  } else if (keyIsDown(87)) {
    rotateRate += 0.05; // Press the w key to increase the rotation rate
  } else if (keyIsDown(83)) {
    rotateRate -= 0.05; // Press the s key to decrease the rotation rate
}
}

function refreshSketch() {
  // Reload the page to refresh the sketch
  window.location.reload();
}

function draw() {
  // Set the background color
  background(4, 81, 123); 
 
  // Move the origin to the center of the canvas
  translate(width / 2, height / 2); 
  rotate(15); 
  // Set the stroke color to white
  stroke(255); 
  noFill(); 
  makeGrid();
  // Reset the transformation matrix，so that the rectangle is created at the bottom of the canvas
  resetMatrix();
  // Draw a light blue rectangle at the bottom of the canvas
  push();
  fill(198, 226, 237); 
  // Make it a little bit transparent
  noStroke(); 
  rect(0, height - 100, width, 100);
  pop();

  // Draw a clock at the bottom of the canvas
  circleclock.draw();

  //Add text to the bottom of the canvas to illustrate the current rotation rate of the controled details 
  textSize(12);
  fill(4, 81, 123);
  text(`Current Rotation Rate: ${rotateRate.toFixed(2)}`, width * 0.55, height * 0.975); // Display the rotation rate

  //Add the instruction of the interaction to the bottom of the canvas
  textSize(14);
  fill(0);
  textWrap(WORD)
  text(`1. Click to change the colour of the picture except the canvas.
  2. Long press the mouse and the wheel starts to rotate.
  3. Hold down the mouse and drag left and right to control the size of the wheel.
  4. Move the mouse over the screen to see the changes in the twisted lines`, width * 0.08, height * 0.89, width/2.5, height/5); // Display the instruction

  textSize(14);
  fill(0);
  textWrap(WORD)
  text(`5. Press the w/s key to control the rotation rate
  6. Press the arrow keys to move the hand, when it coincides with the picture in the bottom centre of the canvas, you can see the original image of this piece of artwork`, windowWidth * 0.55, windowHeight * 0.89, windowWidth/2.5, windowHeight/5); // Display the instruction


  // Draw a original thumbnail at the bottom of the canvas
  image(img, width * 0.5 -50, height * 0.89, width/24, height/12); 

  // Check the hand gif is/ is not on the thumbnail
  if (xHandPosition >= width/2 - 40 && xHandPosition <= width/2 + 40 &&
  yHandPosition >= height - 100 && yHandPosition <= height) {
clear(); // If the hand is on the thumbnail, clear the entire canvas
image(img, 0, 0, width, height * 2); // Then, show the original artwork
}

  image(gif, xHandPosition, yHandPosition, width/20, height/10); // Draw GIF
  if (image){
    loop();
  }


  keyPressed();
}

//This code is debuged by ChatGPT