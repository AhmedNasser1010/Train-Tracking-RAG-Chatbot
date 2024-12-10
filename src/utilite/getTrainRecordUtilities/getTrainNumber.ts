import toEnglishNumber from "../toEnglishNumber"

// <!> Replace with real train numbers <!>
const officialTrainsNumbers: number[] = [1007, 2013, 163, 1013, 2007, 2015, 977, 83, 1903, 135, 87, 2009, 2031, 141, 1015, 1009, 1109, 185, 973, 871, 1087, 997, 143, 187, 89, 989, 169, 971, 1011, 165, 91, 1111, 987, 147, 3025, 833, 937, 891, 2011, 159, 3503, 157, 701, 981, 153, 975, 979, 983, 935, 81, 3007];

// Find Train Number Process
export default function getTrainNumber(keywords: string[]): number {
  const findedNumbers: number[] = [];

  for (let word of keywords) {
    const toEnglishKey = +toEnglishNumber(word);
    if (toEnglishKey) {
      findedNumbers.push(toEnglishKey);
    }
  }

  if (findedNumbers.length !== 1) {
    return 0;
  }

  for (let officialTrainNumber of officialTrainsNumbers) {
    if (officialTrainNumber === findedNumbers[0]) {
      return officialTrainNumber;
    }
  }

  return 0;
}