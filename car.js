class Car {
    constructor(x, y, w, h, carimages) {
        // Initialize the car's position and size
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;

        // Initialize car movement properties
        this.speed = 0;
        this.acceleration = 0.2;

        // Set the car's maximum speed and friction (for gradual deceleration)
        this.maxspeed = 2;
        this.friction = 0.05;

        // Initialize car angle and damaged state
        this.angle = -4.7; // Default starting angle
        this.damaged = false;

        // Create a sensor object to detect surroundings (obstacles, road borders, etc.)
        this.sensor = new Sensor(this);

        // Initialize control system (e.g., manual or AI controls)
        this.controls = new Controls();

        // Randomly select an image for the car from a provided array of images
        let randomIndex = Math.floor(Math.random() * carimages.length);
        this.image = carimages[randomIndex];

        // Initialize AI-related properties (score, fitness, and neural network)
        this.score = 0; // Incremented as the car moves
        this.fitness = 0; // Used for genetic algorithm evaluation
        this.brain = new NeuralNetwork(5, 7, 1); // Neural network with 5 inputs, 7 hidden nodes, and 1 output
    }

    // Method to create a copy of the current car instance (used in genetic algorithm)
    copy() {
        // Create a new Car object with the same initial properties
        let newCar = new Car(this.x, this.y, this.width, this.height, [this.image]); // Passing image as an array
        
        // Deep copy the neural network (brain) to ensure the new car has the same AI state
        newCar.brain = this.brain.copy();
        
        // Copy the score and fitness values
        newCar.score = this.score;
        newCar.fitness = this.fitness;
        
        return newCar; // Return the new car copy
    }

    // Method to display the car on the screen (using p5.js)
    display() {
        // Draw the sensor (used for visualizing the car's surroundings)
        this.sensor.draw();
        
        // Save current drawing state and apply transformations
        push();
        translate(this.x, this.y); // Move the origin to the car's position
        rotate(this.angle); // Rotate the car to its current angle
        
        // Draw the car as an image at its current position and orientation
        stroke(0); // Outline the car
        fill(200); // Fill the car with a color
        rectMode(CENTER); // Draw from the center point
        image(this.image, 0 - this.width / 2, 0 - this.height / 2, this.width, this.height);
        
        // Restore previous drawing state
        pop();
    }

    // Method to mutate the car's neural network (used in genetic algorithm evolution)
    mutate() {
        this.brain.mutate(0.2); // Mutate the brain with a given mutation rate
    }

    // Method to allow the car's AI to think and make decisions based on sensor inputs
    think() {
        let input = [];
        
        // Collect sensor readings as inputs for the neural network
        for (let index = 0; index < this.sensor.readings.length; index++) {
            if (this.sensor.readings[index].offset) {
                input.push(this.sensor.readings[index].offset); // Use sensor offset data if available
            } else {
                input.push(1); // Default to 1 if no reading is available
            }
        }

        // Predict the output (steering decision) using the neural network
        let output = this.brain.predict(input);

        // Adjust car controls based on the neural network's prediction
        if (output[0] < 0.5) {
            this.controls.left = true;
            this.controls.right = false;
        } else {
            this.controls.left = false;
            this.controls.right = true;
        }
    }

    // Method to update the car's state (position, collision check, sensor readings)
    update(roadBorders) {
        // Update the sensor data based on the car's position and the road borders
        this.sensor.update(roadBorders);

        if (!this.damaged) {
            this.score++; // Increment score as the car continues moving
            
            // Let the AI think and adjust controls
            this.think();
            
            // Move the car based on controls
            this.#move();

            // Create a polygon representing the car's position and check for damage
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders); // Check if the car hits a road border
        }
    }

    // Private method to check if the car has collided with road borders (damage assessment)
    #assessDamage(roadBorders) {
        // Loop through each road border and check if the car's polygon intersects it
        for (let i = 0; i < roadBorders.length; i++) {
            if (polysIntersect(this.polygon, roadBorders[i])) {
                return true; // Return true if a collision is detected
            }
        }
        return false; // No collision detected
    }

    // Private method to create a polygon representing the car's current position (used for collision detection)
    #createPolygon() {
        const points = [];
        const rad = Math.hypot(this.width, this.height) / 2; // Calculate the radius of the car
        const alpha = Math.atan2(this.width, this.height); // Calculate the angle for rotation
        
        // Calculate the four corners of the car (after rotation)
        points.push({
            x: this.x - Math.sin(-this.angle - alpha) * rad,
            y: this.y - Math.cos(-this.angle - alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(-this.angle + alpha) * rad,
            y: this.y - Math.cos(-this.angle + alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle * -1 - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle * -1 - alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle * -1 + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle * -1 + alpha) * rad
        });

        return points; // Return the array of points defining the polygon
    }

    // Private method to handle car movement based on controls (accelerating, braking, steering)
    #move() {
        if (this.controls.forward == true) {
            this.speed += this.acceleration; // Accelerate the car
        }
        if (this.controls.backward == true) {
            this.speed -= this.acceleration; // Reverse the car
        }

        // Limit the speed to the maximum allowed speed
        if (this.speed > this.maxspeed) {
            this.speed = this.maxspeed;
        }

        // Limit reverse speed
        if (this.speed < -this.maxspeed) {
            this.speed = -this.maxspeed;
        }

        // Apply friction to gradually reduce speed
        if (this.speed > 0) {
            this.speed -= this.friction;
        }
        if (this.speed < 0) {
            this.speed += this.friction;
        }

        // Stop the car when speed is below the friction threshold
        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        // Handle left-right controls (only if the car is moving)
        if (this.speed != 0) {
            let flip = this.speed > 0 ? 1 : -1; // Flip direction based on speed

            if (this.controls.left == true) {
                this.angle -= 0.03 * flip; // Turn left
            }
            if (this.controls.right == true) {
                this.angle += 0.03 * flip; // Turn right
            }
        }

        // Update the car's position based on speed and angle
        this.x -= Math.sin(-this.angle) * this.speed;
        this.y -= Math.cos(-this.angle) * this.speed;
    }
}
