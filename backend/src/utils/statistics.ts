export function mean(numbers: number[]) {
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
}

export function stddev(numbers: number[], calculatedMean?: number) {
  const numbersMean = calculatedMean ?? mean(numbers);

  const squareDiffs = numbers.map((number) => {
    const diff = number - numbersMean;
    const sqrDiff = diff * diff;
    return sqrDiff;
  });

  const squareDiffMean = mean(squareDiffs);

  const stdDev = Math.sqrt(squareDiffMean);

  return stdDev;
}

export function getStatistics(numbers: number[]) {
  const numbersMean = mean(numbers);
  const numbersStddev = stddev(numbers, numbersMean);

  return {
    mean: numbersMean,
    stddev: numbersStddev,
  };
}