const dataset = require('./dataset-treino.json').data

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function dsigmoid(x){
  return x * (1-x); 
}

class RedeNeural {
  constructor(i_nodes, h_nodes, o_nodes) {
      this.i_nodes = i_nodes;
      this.h_nodes = h_nodes;
      this.o_nodes = o_nodes;

      this.bias_ih = new Matrix(this.h_nodes, 1);
      this.bias_ih.randomize();
      this.bias_ho = new Matrix(this.o_nodes, 1);
      this.bias_ho.randomize();

      this.weigths_ih = new Matrix(this.h_nodes, this.i_nodes);
      this.weigths_ih.randomize()

      this.weigths_ho = new Matrix(this.o_nodes, this.h_nodes)
      this.weigths_ho.randomize()

      this.learning_rate = 0.005;
  }

  train(arr,target) {
      // INPUT -> HIDDEN
      let input = Matrix.arrayToMatrix(arr);
      let hidden = Matrix.multiply(this.weigths_ih, input);
      hidden = Matrix.add(hidden, this.bias_ih);

      hidden.map(sigmoid)

      // HIDDEN -> OUTPUT
      // d(Sigmoid) = Output * (1- Output)
      let output = Matrix.multiply(this.weigths_ho, hidden);
      output = Matrix.add(output, this.bias_ho);
      output.map(sigmoid);

      // BACKPROPAGATION

      // OUTPUT -> HIDDEN
      let expected = Matrix.arrayToMatrix(target);
      let output_error = Matrix.subtract(expected,output);
      let d_output = Matrix.map(output,dsigmoid);
      let hidden_T = Matrix.transpose(hidden);

      let gradient = Matrix.hadamard(d_output,output_error);
      gradient = Matrix.escalar_multiply(gradient,this.learning_rate);
      
      // Adjust Bias O->H
      this.bias_ho = Matrix.add(this.bias_ho, gradient);
      // Adjust Weigths O->H
      let weigths_ho_deltas = Matrix.multiply(gradient,hidden_T);
      this.weigths_ho = Matrix.add(this.weigths_ho,weigths_ho_deltas);

      // HIDDEN -> INPUT
      let weigths_ho_T = Matrix.transpose(this.weigths_ho);
      let hidden_error = Matrix.multiply(weigths_ho_T,output_error);
      let d_hidden = Matrix.map(hidden,dsigmoid);
      let input_T = Matrix.transpose(input);

      let gradient_H = Matrix.hadamard(d_hidden,hidden_error);
      gradient_H = Matrix.escalar_multiply(gradient_H, this.learning_rate);

      // Adjust Bias O->H
      this.bias_ih = Matrix.add(this.bias_ih, gradient_H);
      // Adjust Weigths H->I
      let weigths_ih_deltas = Matrix.multiply(gradient_H, input_T);
      this.weigths_ih = Matrix.add(this.weigths_ih, weigths_ih_deltas);
  }

  predict(arr){
      // INPUT -> HIDDEN
      let input = Matrix.arrayToMatrix(arr);

      let hidden = Matrix.multiply(this.weigths_ih, input);
      hidden = Matrix.add(hidden, this.bias_ih);

      hidden.map(sigmoid)

      // HIDDEN -> OUTPUT
      let output = Matrix.multiply(this.weigths_ho, hidden);
      output = Matrix.add(output, this.bias_ho);
      output.map(sigmoid);
      output = Matrix.MatrixToArray(output);

      //console.log(output)
      return output;
  }
}

class Matrix {
  constructor(rows, cols) {
      this.rows = rows;
      this.cols = cols;
      this.data = [];

      for (let i = 0; i < rows; i++) {
          let arr = []
          for (let j = 0; j < cols; j++) {
              arr.push(0)
          }
          this.data.push(arr);
      }
  }

  static arrayToMatrix(arr) {
      let matrix = new Matrix(arr.length, 1);
      matrix.map((elm, i, j) => {
          return arr[i];
      })
      return matrix;
  }

  static MatrixToArray(obj) {
      let arr = []
      obj.map((elm, i, j) => {
          arr.push(elm);
      })
      return arr;
  }

  print() {
      console.table(this.data);
  }

  randomize() {
      this.map((elm, i, j) => {
          return Math.random() * 2 - 1;
      });
  }

  static map(A, func) {
      let matrix = new Matrix(A.rows, A.cols);

      matrix.data = A.data.map((arr, i) => {
          return arr.map((num, j) => {
              return func(num, i, j);
          })
      })

      return matrix;
  }

  map(func) {
      this.data = this.data.map((arr, i) => {
          return arr.map((num, j) => {
              return func(num, i, j);
          })
      })
      return this;
  }

  static transpose(A){
      var matrix = new Matrix(A.cols, A.rows);
      
      matrix.map((num,i,j) => {
          return A.data[j][i];
      });
      
      return matrix;
  }
  
  static escalar_multiply(A, escalar) {
      var matrix = new Matrix(A.rows, A.cols);

      matrix.map((num, i, j) => {
          return A.data[i][j] * escalar;
      });

      return matrix;
  }

  static hadamard(A, B) {
      var matrix = new Matrix(A.rows, A.cols);

      matrix.map((num, i, j) => {
          return A.data[i][j] * B.data[i][j]
      });

      return matrix;
  }

  static add(A, B) {
      var matrix = new Matrix(A.rows, A.cols);

      matrix.map((num, i, j) => {
          return A.data[i][j] + B.data[i][j]
      });

      return matrix;
  }

  static subtract(A, B) {
      var matrix = new Matrix(A.rows, A.cols);

      matrix.map((num, i, j) => {
          return A.data[i][j] - B.data[i][j]
      });

      return matrix;
  }

  static multiply(A, B) {
      var matrix = new Matrix(A.rows, B.cols);

        matrix.map((num, i, j) => {
            let sum = 0
            for (let k = 0; k < A.cols; k++) {
                let elm1 = A.data[i][k];
                let elm2 = B.data[k][j];
                sum += elm1 * elm2;
            }
            
            return sum;
        })

      return matrix;
  }
}

var nn = new RedeNeural(9, 10, 3);

function train() {

    for (let i = 1; i <= 2500; i++) {
        dataset.forEach(x => nn.train(x.input, x.output));
        console.log('Época', i)
    }
}


function calcAccuracy() {
    const testDataset = require('./dataset-teste.json').data
    const acertos = testDataset.filter(x => getLabel(nn.predict(x.input)) == getLabel(x.output)).length
    const accuracy = (acertos / testDataset.length) * 100
    return accuracy.toFixed(2)
}

function getLabel(arr) {
    if (arr[0] > arr[1] && arr[0] > arr[2]) return 'xWins'
    if (arr[1] > arr[0] && arr[1] > arr[2]) return 'xWins'
    if (arr[1] == 1) return 'oWins'
    return 'playing'
  }

train(nn, 750)
console.log('Accuracy MLP:', calcAccuracy())


export function mlp(arr){
    return getLabel(nn.predict(arr))
}