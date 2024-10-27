// Matrix class for creating and manipulating matrices
class Matrix {
    // Constructor to initialize a matrix with given rows and columns, filled with zeros
    constructor(rows, cols) {
        this.rows = rows;  // Number of rows
        this.cols = cols;  // Number of columns
        // Create a 2D array filled with 0s
        this.data = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
    }

    // Creates a copy of the current matrix
    copy() {
        let m = new Matrix(this.rows, this.cols);  // Create a new matrix with the same dimensions
        // Copy each element from the current matrix to the new one
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                m.data[i][j] = this.data[i][j];
            }
        }
        return m;  // Return the copied matrix
    }

    // Converts an array to a matrix (column matrix)
    static fromArray(arr) {
        // Create a matrix with rows equal to the array length and 1 column
        return new Matrix(arr.length, 1).map((e, i) => arr[i]);  // Map each array element into the matrix
    }

    // Subtract matrix 'b' from matrix 'a' and return the result
    static subtract(a, b) {
        // Ensure the matrices have the same dimensions
        if (a.rows !== b.rows || a.cols !== b.cols) {
            console.log('Columns and Rows of A must match Columns and Rows of B.');
            return;
        }

        // Create a new matrix for the result of a - b
        return new Matrix(a.rows, a.cols)
            .map((_, i, j) => a.data[i][j] - b.data[i][j]);  // Subtract corresponding elements
    }

    // Converts the matrix into a flat array
    toArray() {
        let arr = [];  // Initialize an empty array
        // Push each matrix element into the array
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                arr.push(this.data[i][j]);
            }
        }
        return arr;  // Return the resulting array
    }

    // Randomize each element in the matrix with values between -1 and 1
    randomize() {
        return this.map(e => Math.random() * 2 - 1);  // Map random values to each element
    }

    // Add either a matrix or a scalar to this matrix
    add(n) {
        if (n instanceof Matrix) {
            // If adding another matrix, ensure dimensions match
            if (this.rows !== n.rows || this.cols !== n.cols) {
                console.log('Columns and Rows of A must match Columns and Rows of B.');
                return;
            }
            // Add corresponding elements from both matrices
            return this.map((e, i, j) => e + n.data[i][j]);
        } else {
            // If adding a scalar, apply it to each element
            return this.map(e => e + n);
        }
    }

    // Transpose a matrix (rows become columns and vice versa)
    static transpose(matrix) {
        // Create a new transposed matrix
        return new Matrix(matrix.cols, matrix.rows)
            .map((_, i, j) => matrix.data[j][i]);  // Swap rows and columns
    }

    // Multiply two matrices (matrix product)
    static multiply(a, b) {
        // Ensure the number of columns in 'a' matches the number of rows in 'b'
        if (a.cols !== b.rows) {
            console.log('Columns of A must match rows of B.');
            return;
        }

        // Create a new matrix for the result of the multiplication
        return new Matrix(a.rows, b.cols)
            .map((e, i, j) => {
                let sum = 0;
                // Calculate the dot product for the element at position (i, j)
                for (let k = 0; k < a.cols; k++) {
                    sum += a.data[i][k] * b.data[k][j];
                }
                return sum;  // Return the result of the dot product
            });
    }

    // Multiply the current matrix by another matrix (Hadamard product) or a scalar
    multiply(n) {
        if (n instanceof Matrix) {
            // Ensure the matrices have the same dimensions
            if (this.rows !== n.rows || this.cols !== n.cols) {
                console.log('Columns and Rows of A must match Columns and Rows of B.');
                return;
            }
            // Perform element-wise multiplication (Hadamard product)
            return this.map((e, i, j) => e * n.data[i][j]);
        } else {
            // If multiplying by a scalar, apply it to each element
            return this.map(e => e * n);
        }
    }

    // Apply a function to every element of the matrix
    map(func) {
        // Loop through each element of the matrix
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let val = this.data[i][j];
                this.data[i][j] = func(val, i, j);  // Apply the function
            }
        }
        return this;  // Return the updated matrix
    }

    // Apply a function to every element of the matrix (static version)
    static map(matrix, func) {
        // Create a new matrix and apply the function to each element
        return new Matrix(matrix.rows, matrix.cols)
            .map((e, i, j) => func(matrix.data[i][j], i, j));  // Apply the function
    }

    // Print the matrix to the console in a table format
    print() {
        console.table(this.data);  // Log the matrix as a table
        return this;  // Return the matrix for potential chaining
    }

    // Convert the matrix to a serialized JSON string
    serialize() {
        return JSON.stringify(this);  // Serialize the matrix object
    }

    // Deserialize a JSON string back into a matrix object
    static deserialize(data) {
        // If the input is a string, parse it into a JSON object
        if (typeof data == 'string') {
            data = JSON.parse(data);
        }
        // Create a new matrix with the same dimensions
        let matrix = new Matrix(data.rows, data.cols);
        matrix.data = data.data;  // Assign the data to the matrix
        return matrix;  // Return the deserialized matrix
    }
}

// Export the Matrix class if this is a Node.js environment (e.g., for server-side use)
if (typeof module !== 'undefined') {
    module.exports = Matrix;
}
