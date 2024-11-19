// Function to create the next generation of cars
function nextGeneration() {
    console.log('next generation');
    generation++;  // Increment the generation counter
    calculateFitness();  // Calculate the fitness scores for all saved cars

    // Elitism: Preserve the best-performing car from the current generation
    let topPerformer = pickBestCar();  // Find the car with the highest score
    cars[0] = topPerformer.copy();  // Keep the top performer in the next generation without mutation

    // Create the rest of the new generation by selecting and mutating cars
    for (let i = 1; i < TOTAL; i++) {
        cars[i] = pickOne();  // Pick and mutate the rest of the cars
    }

    savedcars = [];  // Clear the saved cars array (since they've been used to create the new generation)
}

// Function to calculate fitness for each car based on its score
function calculateFitness() {
    let sum = 0;

    // Sum up the scores of all the saved cars (used for fitness normalization)
    for (let car of savedcars) {
        sum += car.score;
    }

    // Normalize each car's fitness score (relative to the total score sum)
    for (let car of savedcars) {
        car.fitness = car.score / sum;  // Fitness is proportional to the car's score
    }
}

// Function to find the best-performing car in the current generation
function pickBestCar() {
    let bestCar = savedcars[0];  // Start with the first car as the best

    // Loop through all saved cars to find the car with the highest score
    for (let car of savedcars) {
        if (car.score > bestCar.score) {
            bestCar = car;  // Update the best car if a higher-scoring car is found
        }
    }

    return bestCar;  // Return the best car for elitism
}

// Function to select a car for the new generation (with mutation)
function pickOne() {
    let index = 0;
    let r = random(1);  // Generate a random number between 0 and 1 (roulette wheel selection)

    // Select a car based on its fitness score (higher fitness = higher chance of selection)
    while (r > 0) {
        r = r - savedcars[index].fitness;  // Subtract the fitness of each car from r
        index++;  // Move to the next car
    }
    index--;  // Adjust index after overshooting

    let car = savedcars[index];  // Select the car with the corresponding index
    let child = new Car(700, 70, 40, 70, carimages);  // Create a new car (child)

    // Deep copy the brain (neural network) of the selected car for the child
    child.brain = car.brain.copy();

    // Mutate the child's brain with a mutation rate that decreases as generations increase
    child.brain.mutate(0.1 / generation);

    return child;  // Return the new car (with a mutated brain)
}
