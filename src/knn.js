const dataset = require('./dataset-treino.json').data;

function calcDist(board1, board2) {
  let dist = 0;
  for (let i = 0; i < board1.length; i++) {
      dist += Math.abs(board1[i] - board2[i]);
  }
  return dist;
}

export function knn(k, input) {
  if (input.filter(x => x == 0).length > 4) return 'playing'
  const dists = dataset.map(x => { return {...x, distance: calcDist(input, x.input)}})
                      .sort((a, b) => a.distance - b.distance)
                      .slice(0, k)
  const res = [
    { class: 'xWins', sum: dists.filter(x => x.output[0] == 1).length },
    { class: 'oWins', sum: dists.filter(x => x.output[1] == 1).length },
    { class: 'playing', sum: dists.filter(x => x.output[2] == 1).length },
  ]
  return res.sort((a, b) => b.sum - a.sum)[0].class;
}

function calcAccuracy() {
  const testDataset = require('./dataset-teste.json').data
  const acertos = testDataset.filter(x => knn(7, x.input) == getLabel(x.output)).length
  const accuracy = (acertos / testDataset.length) * 100
  return accuracy.toFixed(2)
}

function getLabel(arr) {
  if (arr[0] == 1) return 'xWins'
  if (arr[1] == 1) return 'oWins'
  return 'playing'
}

console.log('Accuracy KNN:', calcAccuracy())