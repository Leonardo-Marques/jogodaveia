const DecisionTree = require('./decision-tree');
const dataset = mapDataset(require('./dataset-treino.json'))

const features = ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9"];
const dt = new DecisionTree("output", features);

dt.train(dataset)
console.log('Accuracy Arvore:', calcAccuracy())

function mapDataset(dset) {
    return dset.data.map(x => {
        const pos = x.input
        return {
            ...x,
            p1: pos[0], p2: pos[1], p3: pos[2],
            p4: pos[3], p5: pos[4], p6: pos[5],
            p7: pos[6], p8: pos[7], p9: pos[8],
            output: getLabel(x.output)
        }
    })
}

function calcAccuracy() {
    const testDataset = mapDataset(require('./dataset-teste.json'))
    const acertos = testDataset.filter(x => dt.predict(x) == x.output).length
    const accuracy = (acertos / testDataset.length) * 100
    return accuracy.toFixed(2)
}

function getLabel(arr) {
    if (arr[0] == 1) return 'xWins'
    if (arr[1] == 1) return 'oWins'
    return 'playing'
}

export function arv(arr){
    return getLabel(dt.predct(arr.map(pos =>{
        return {
            p1: pos[0], p2: pos[1], p3: pos[2],
            p4: pos[3], p5: pos[4], p6: pos[5],
            p7: pos[6], p8: pos[7], p9: pos[8],
        }
    })))
}