// The ActivationFunction class is a utility for defining activation functions and their derivatives.
class ActivationFunction {
    constructor(func, dfunc) {
        this.func = func; // The activation function (e.g., ReLU, Sigmoid)
        this.dfunc = dfunc; // The derivative of the activation function
    }
}

// Defining common activation functions and their derivatives

// ReLU (Rectified Linear Unit) and its derivative
let relu = new ActivationFunction(
    x => Math.max(0, x), // ReLU function: returns x if x > 0; otherwise returns 0
    y => (y > 0 ? 1 : 0) // Derivative of ReLU: returns 1 if y > 0; otherwise returns 0
);

// Sigmoid function and its derivative
let sigmoid = new ActivationFunction(
    x => 1 / (1 + Math.exp(-x)), // Sigmoid function: squashes input to range (0, 1)
    y => y * (1 - y) // Derivative of Sigmoid: y(1-y)
);

// Tanh (Hyperbolic Tangent) function and its derivative
let tanh = new ActivationFunction(
    x => Math.tanh(x), // Tanh function: squashes input to range (-1, 1)
    y => 1 - (y * y) // Derivative of Tanh: 1 - y^2
);

// The NeuralNetwork class represents a simple feedforward neural network.
class NeuralNetwork {
    constructor(a, b, c) {
        // If a is an instance of NeuralNetwork, we clone it
        if (a instanceof NeuralNetwork) {
            this.input_nodes = a.input_nodes; // Number of input nodes
            this.hidden_nodes = a.hidden_nodes; // Number of hidden nodes
            this.output_nodes = a.output_nodes; // Number of output nodes

            // Clone the weights and biases from the existing neural network
            this.weights_ih = a.weights_ih.copy(); // Weights from input to hidden layer
            this.weights_ho = a.weights_ho.copy(); // Weights from hidden to output layer
            this.bias_h = a.bias_h.copy(); // Biases for hidden layer
            this.bias_o = a.bias_o.copy(); // Biases for output layer

            // Set learning rate and activation function
            this.setLearningRate(a.learning_rate);
            this.setActivationFunction(a.activation_function);
        } else {
            // Initialize the network parameters
            this.input_nodes = a; // Number of input nodes
            this.hidden_nodes = b; // Number of hidden nodes
            this.output_nodes = c; // Number of output nodes

            // Initialize weights and biases with random values
            this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
            this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);
            this.weights_ih.randomize(); // Randomize input-to-hidden weights
            this.weights_ho.randomize(); // Randomize hidden-to-output weights

            this.bias_h = new Matrix(this.hidden_nodes, 1); // Initialize hidden biases
            this.bias_o = new Matrix(this.output_nodes, 1); // Initialize output biases
            this.bias_h.randomize(); // Randomize hidden biases
            this.bias_o.randomize(); // Randomize output biases

            // Set default learning rate and activation function
            this.setLearningRate();
            this.setActivationFunction();
        }
    }

    // Method to make predictions based on input data
    predict(input_array) {
        let inputs = Matrix.fromArray(input_array); // Convert input array to Matrix
        let hidden = Matrix.multiply(this.weights_ih, inputs); // Calculate hidden layer output
        hidden.add(this.bias_h); // Add bias for hidden layer
        hidden.map(this.activation_function.func);  // Apply activation function (ReLU or Sigmoid) for hidden layer

        let output = Matrix.multiply(this.weights_ho, hidden); // Calculate output layer output
        output.add(this.bias_o); // Add bias for output layer
        output.map(this.activation_function.func);  // Apply activation function for output
        return output.toArray(); // Convert output matrix back to array
    }

    // Method to set the learning rate for training
    setLearningRate(learning_rate = 0.01) {
        this.learning_rate = learning_rate; // Default to 0.01 if not provided
    }

    // Method to set the activation function for the network
    setActivationFunction(func = relu) {  // Default to ReLU for hidden layers
        this.activation_function = func; // Set the activation function
    }

    // Method to train the network using input and target data
    train(input_array, target_array) {
        let inputs = Matrix.fromArray(input_array); // Convert input array to Matrix
        let hidden = Matrix.multiply(this.weights_ih, inputs); // Calculate hidden layer output
        hidden.add(this.bias_h); // Add hidden bias
        hidden.map(this.activation_function.func); // Apply activation function

        let outputs = Matrix.multiply(this.weights_ho, hidden); // Calculate output layer output
        outputs.add(this.bias_o); // Add output bias
        outputs.map(this.activation_function.func); // Apply activation function

        let targets = Matrix.fromArray(target_array); // Convert target array to Matrix
        let output_errors = Matrix.subtract(targets, outputs); // Calculate output errors

        // Calculate gradients based on output errors and apply learning rate
        let gradients = Matrix.map(outputs, this.activation_function.dfunc);
        gradients.multiply(output_errors);
        gradients.multiply(this.learning_rate);

        let hidden_T = Matrix.transpose(hidden); // Transpose hidden layer matrix
        let weight_ho_deltas = Matrix.multiply(gradients, hidden_T); // Calculate weight changes

        this.weights_ho.add(weight_ho_deltas); // Update weights for hidden-to-output
        this.bias_o.add(gradients); // Update biases for output

        // Calculate hidden layer errors
        let who_t = Matrix.transpose(this.weights_ho); // Transpose weights from hidden to output
        let hidden_errors = Matrix.multiply(who_t, output_errors); // Multiply to get hidden errors

        // Calculate hidden gradients
        let hidden_gradient = Matrix.map(hidden, this.activation_function.dfunc);
        hidden_gradient.multiply(hidden_errors);
        hidden_gradient.multiply(this.learning_rate); // Apply learning rate

        let inputs_T = Matrix.transpose(inputs); // Transpose input matrix
        let weight_ih_deltas = Matrix.multiply(hidden_gradient, inputs_T); // Calculate weight changes for input-to-hidden

        this.weights_ih.add(weight_ih_deltas); // Update weights for input-to-hidden
        this.bias_h.add(hidden_gradient); // Update biases for hidden layer
    }

    // Method to serialize the neural network into a JSON string
    serialize() {
        return JSON.stringify(this); // Convert the neural network object to JSON
    }

    // Static method to deserialize a JSON string back into a NeuralNetwork object
    static deserialize(data) {
        if (typeof data == 'string') {
            data = JSON.parse(data); // Parse JSON string into object if needed
        }
        // Create a new NeuralNetwork object from the deserialized data
        let nn = new NeuralNetwork(data.input_nodes, data.hidden_nodes, data.output_nodes);
        nn.weights_ih = Matrix.deserialize(data.weights_ih); // Deserialize weights
        nn.weights_ho = Matrix.deserialize(data.weights_ho); // Deserialize weights
        nn.bias_h = Matrix.deserialize(data.bias_h); // Deserialize biases
        nn.bias_o = Matrix.deserialize(data.bias_o); // Deserialize biases
        nn.learning_rate = data.learning_rate; // Set learning rate
        nn.setActivationFunction(new ActivationFunction(data.activation_function.func, data.activation_function.dfunc)); // Set activation function
        return nn; // Return the new NeuralNetwork object
    }

    // Method to create a copy of the current NeuralNetwork
    copy() {
        return new NeuralNetwork(this); // Create a new instance by copying the current network
    }

    // Method to mutate the weights and biases of the network
    mutate(rate) {
        function mutate(val) {
            // Randomly change the value based on the mutation rate
            if (Math.random() < rate) {
                return val + randomGaussian(0, 0.05);  // Apply Gaussian mutation (less aggressive)
            } else {
                return val; // Return the original value if no mutation occurs
            }
        }
        // Apply mutation to weights and biases
        this.weights_ih.map(mutate); // Mutate input-to-hidden weights
        this.weights_ho.map(mutate); // Mutate hidden-to-output weights
        this.bias_h.map(mutate); // Mutate hidden biases
        this.bias_o.map(mutate); // Mutate output biases
    }
}
