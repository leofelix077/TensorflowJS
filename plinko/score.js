const outputs = []

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([dropPosition, bounciness, size, bucketLabel])
}

function runAnalysis() {
  let testSetSize = 50;
  const k = 10;
  
  _.range(0, 3).forEach(feature => {
    const data = _.map(outputs, row => [row[feature], _.last(row)])
    const [testSet, trainingSet] = minMax(splitDataset(data, testSetSize), 1);

    const accuracy = _.chain(testSet)
      .filter(testPoint => knn(trainingSet, _.initial(testPoint), k) === _.last(testPoint))
      .size()
      .divide(testSetSize)
      .value()
    console.log("For Feature of ", feature, "Accuracy: ", accuracy)
  })

}


const knn = (dataset, point, k) =>
  _.chain(dataset)
    .map(row => [distance(_.initial(row), point), _.last(row)])
    .sortBy(row => row[0])
    .slice(0, k)
    .countBy(row => row[1])
    .toPairs()
    .sortBy(row => row[1])
    .last()
    .first()
    .parseInt()
    .value()

const distance = (pointA, pointB) =>
  _.chain(pointA)
    .zip(pointB)
    .map(([a, b]) => (a - b) ** 2)
    .sum()
    .value() ** 0.5

const splitDataset = (dataset, testCount) => {
  const shuffled = _.shuffle(dataset);
  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);
  return [testSet, trainingSet];
}

const minMax = (dataset, featureCount) => {
  const clonedData = _.cloneDeep(dataset)

  for (let i = 0; i < featureCount; i++) {
    const column = clonedData.map(row => row[i])
    const min = _.min(column)
    const max = _.max(column)

    for (let j = 0; j < clonedData.length; j++) {
      clonedData[j][i] = (clonedData[j][i] - min) / (max - min)
    }
  }
  return clonedData
}

