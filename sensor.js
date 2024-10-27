// The Sensor class represents a sensor attached to a car that can detect road borders using rays.
class Sensor {
    constructor(car) {
        this.car = car; // Reference to the car this sensor is attached to
        this.rayCount = 5; // Number of rays to cast for detecting road borders
        this.rayLength = 200; // Length of each ray
        this.raySpread = Math.PI / 2; // Angle spread of rays in radians (90 degrees)

        this.rays = []; // Array to hold the rays
        this.readings = []; // Array to hold readings from the rays
    }

    // Updates the sensor by casting rays and obtaining readings based on road borders.
    update(roadBorders) {
        this.#castRays(); // Cast rays based on the current position and angle of the car
        this.readings = []; // Clear previous readings
        for (let i = 0; i < this.rays.length; i++) {
            // For each ray, get the reading (intersection with road borders) and store it
            this.readings.push(
                this.#getReading(this.rays[i], roadBorders)
            );
        }
    }

    // Private method to get the reading for a single ray based on road borders.
    #getReading(ray, roadBorders) {
        let touches = []; // Array to store intersection points

        // Check each road border for intersections with the ray
        for (let i = 0; i < roadBorders.length; i++) {
            const touch = getIntersection(
                ray[0], // Start point of the ray
                ray[1], // End point of the ray
                roadBorders[i][0], // Start point of the road border
                roadBorders[i][1]  // End point of the road border
            );
            if (touch) {
                // If an intersection is found, add it to the touches array
                touches.push(touch);
            }
        }

        // If there are no intersections, return 0 (no contact with borders)
        if (touches.length == 0) {
            return 0;
        } else {
            // If there are intersections, find the closest one (minimum offset)
            const offsets = touches.map(e => e.offset); // Get offsets of all intersection points
            const minOffset = Math.min(...offsets); // Find the minimum offset
            // Return the intersection point that has the minimum offset
            return touches.find(e => e.offset == minOffset);
        }
    }

    // Private method to cast rays based on the car's position and angle.
    #castRays() {
        this.rays = []; // Reset rays array
        for (let i = 0; i < this.rayCount; i++) {
            // Calculate the angle for each ray, evenly distributed within the ray spread
            const rayAngle = lerp(
                this.raySpread / 2, // Start angle
                -this.raySpread / 2, // End angle
                this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1) // Adjust for ray count
            ) - this.car.angle; // Adjust by the car's angle

            // Starting point of the ray (the car's position)
            const start = { x: this.car.x, y: this.car.y };
            // Calculate the end point of the ray using trigonometry
            const end = {
                x: this.car.x - Math.sin(rayAngle) * this.rayLength, // x coordinate based on angle
                y: this.car.y - Math.cos(rayAngle) * this.rayLength  // y coordinate based on angle
            };
            // Add the ray (start and end points) to the rays array
            this.rays.push([start, end]);
        }
    }

    // Method to draw the rays and their readings on the canvas.
    draw() {
        for (let i = 0; i < this.rayCount; i++) {
            let end = this.rays[i][1]; // Default end point of the ray
            if (this.readings[i]) {
                // If there's a reading, set the end point to the intersection point
                end = this.readings[i];
            }

            // Draw the ray (from start point to end point)
            strokeWeight(2); // Set the stroke weight for the rays
            stroke(0, 0, 255); // Set the stroke color (blue for rays)
            line(this.rays[i][0].x, this.rays[i][0].y, end.x, end.y); // Draw the ray

            // Draw the intersection (if any) as a red line from the original end point to the intersection point
            strokeWeight(2); // Set the stroke weight for the readings
            stroke(255, 0, 0); // Set the stroke color (red for readings)
            line(this.rays[i][1].x, this.rays[i][1].y, end.x, end.y); // Draw the line to the reading
        }
    }
}
