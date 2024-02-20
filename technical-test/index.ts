type InputItem = string;
export type InputData = InputItem[];
export type OutputData = string;

function run(input: InputData): OutputData {
  let shortestInputItemIndex: number = 0;

  // find shortest input item
  for (let i = 1; i < input.length; i += 1) {
    if (input[shortestInputItemIndex].length > input[i].length) {
      shortestInputItemIndex = i;
    }
  }

  let output: OutputData = '';

  const shortestInputItem = input[shortestInputItemIndex];
  let currentCharacterIndexToCheck = 0;
  while (currentCharacterIndexToCheck <= shortestInputItem.length - 1) {
    const areAllMatched = input.every(item => item[currentCharacterIndexToCheck] === shortestInputItem[currentCharacterIndexToCheck]);
    if (!areAllMatched) {
      break;
    }
    output = output + shortestInputItem[currentCharacterIndexToCheck];
    currentCharacterIndexToCheck += 1;
  }

  return output;
}

export default run;
