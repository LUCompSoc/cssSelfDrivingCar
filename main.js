let canvasbox = document.getElementById("canvasbox")

let canvasWidth = canvasbox.clientWidth
let canvasHeight = canvasbox.clientWidth / 2
let generationspan = document.getElementById("generationspan")
let populationspan = document.getElementById("populationspan")

let car
let cars = []
savedcars = [];
let carImage1, carImage2, carImage3, carImage4
let carimages = []
let TOTAL = 100
let generation = 0
let roadBorders = []
let backgroundImage

function calculateroadboarders() {
    roadBorders = []
    for (let index = 0; index < allboarders.length; index++) {
        roadBorders.push([{
            x: allboarders[index]["start"].x,
            y: allboarders[index]["start"].y
        }, {
            x: allboarders[index]["end"].x,
            y: allboarders[index]["end"].y
        }])
    }
}


let outerlines = [
    { "start": { "x": 57, "y": 128 }, "end": { "x": 242, "y": 61 } }, 
    { "start": { "x": 242, "y": 61 }, "end": { "x": 575, "y": 32 } }, 
    { "start": { "x": 575, "y": 32 }, "end": { "x": 775, "y": 32 } }, 
    { "start": { "x": 775, "y": 32 }, "end": { "x": 1050, "y": 157 } }, 
    { "start": { "x": 1050, "y": 157 } , "end": { "x": 1110, "y": 306 } },
    { "start": { "x": 1110, "y": 306 } , "end": { "x": 1207, "y": 330 } },
    { "start": { "x": 1207, "y": 330 } , "end": { "x": 1305, "y": 324 } },
    { "start": { "x": 1305, "y": 324 } , "end": { "x": 1366, "y": 337 } },
    { "start": { "x": 1366, "y": 337 } , "end": { "x": 1497, "y": 650 } },
    { "start": { "x": 1497, "y": 650 } , "end": { "x": 1468, "y": 750 } },
    { "start": { "x": 1468, "y": 750 } , "end": { "x": 1170, "y": 760 } },
    { "start": { "x": 1170, "y": 760 } , "end": { "x": 1114, "y": 707 } },
    { "start": { "x": 1114, "y": 707 } , "end": { "x": 1057, "y": 566 } },
    { "start": { "x": 1057, "y": 566 } , "end": { "x": 710, "y": 631 } },
    { "start": { "x": 710, "y": 631 } , "end": { "x": 482, "y": 621 } },
    { "start": { "x": 482, "y": 621 } , "end": { "x": 212, "y": 524 } },
    { "start": { "x": 212, "y": 524 } , "end": { "x": 89, "y": 525 } },
    { "start": { "x": 89, "y": 525 } , "end": { "x": 34, "y": 444 } },
    { "start": { "x": 34, "y": 444 } , "end": { "x": 57, "y": 128 } }]
let innerlines = [
    { "start": { "x": 150, "y": 200 }, "end": { "x": 242, "y": 165 } }, 
    { "start": { "x": 242, "y": 165 }, "end": { "x": 766, "y": 120 } },
    { "start": { "x": 766, "y": 120 }, "end": { "x": 985, "y": 263 } }, 
    { "start": { "x": 985, "y": 263 }, "end": { "x": 1010, "y": 382 } }, 
    { "start": { "x": 1010, "y": 382 } , "end": { "x": 1115, "y": 465 } },
    { "start": { "x": 1115, "y": 465 } , "end": { "x": 1195, "y": 460 } },
    { "start": { "x": 1195, "y": 460 } , "end": { "x": 1307, "y": 450 } },
    { "start": { "x": 1307, "y": 450 } , "end": { "x": 1350, "y": 600 } },
    { "start": { "x": 1350, "y": 600 } , "end": { "x": 1215, "y": 655 } },
    { "start": { "x": 1215, "y": 655 } , "end": { "x": 1115, "y": 465 } },
    { "start": { "x": 1115, "y": 465 } , "end": { "x": 500, "y": 510 } },
    { "start": { "x": 500, "y": 510 } , "end": { "x": 244, "y": 448 } },
    { "start": { "x": 244, "y": 448 } , "end": { "x": 144, "y": 388 } },
    { "start": { "x": 144, "y": 388 } , "end": { "x": 150, "y": 200 } }]
let allboarders = innerlines.concat(outerlines);

function preload() {
    carImage1 = loadImage('1.png');
    carImage2 = loadImage('2.png');
    carImage3 = loadImage('3.png');
    carImage4 = loadImage('4.png');

    for (let index = 1; index < 5; index++) {
        carimages.push(loadImage(`${index}.png`))
    }

    backgroundImage = loadImage('campus.JPG');
}

function setup() {
    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(canvasbox);
    calculateroadboarders()

    for (let index = 0; index < TOTAL; index++) {
        cars.push(new Car(700, 70, 40, 70, carimages))
    }
}

function draw() {
    generationspan.innerText = generation;
    populationspan.innerText = cars.length;

    image(backgroundImage, 0, 0, canvasWidth, canvasHeight);

    // Fill the road with black
    fill(0); // Black color
    noStroke(); // Remove stroke while filling

    beginShape();
    // Draw outerlines vertices
    for (let index = 0; index < outerlines.length; index++) {
        vertex(outerlines[index].start.x, outerlines[index].start.y);
    }
    // Close the outer shape
    endShape(CLOSE);

    beginShape();
    // Draw innerlines vertices
    // Fill the road with black
    fill(118, 185, 0); // Black color
    noStroke(); // Remove stroke while filling
    for (let index = innerlines.length - 1; index >= 0; index--) {
        vertex(innerlines[index].start.x, innerlines[index].start.y);
    }
    // Close the inner shape
    endShape(CLOSE);

    // Set stroke color and weight for road borders
    stroke(255); // Set to white or any color you prefer (e.g., stroke(0, 255, 0) for green)
    strokeWeight(3); // Set line thickness

    // Draw the road borders
    for (let index = 0; index < roadBorders.length; index++) {
        line(roadBorders[index][0].x, roadBorders[index][0].y, roadBorders[index][1].x, roadBorders[index][1].y);
    } 

    for (let index = 0; index < cars.length; index++) {
        cars[index].update(roadBorders);
        cars[index].display();

        for (let j = 0; j < cars.length; j++) {
            if (cars[j].damaged == true) {
                savedcars.push(cars.splice(j, 1)[0]);
            }
        }
    }

    if (cars.length == 0) {
        nextGeneration();
    }
}
