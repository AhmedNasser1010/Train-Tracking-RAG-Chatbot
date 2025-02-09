# Train-Tracking-Model-Tests


### Text-to-SQL Model Tests

| Index | Date      | Analytics                                                                                        | Tips                                                                                     | Recorrected | PromptsType | HardLevel | SuccessScore | PromptVersion                                                                                                                                                                                                                                                                                                    | PromptMode       | Prompts | PromptsTypes                         |
| ----- | --------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- | ----------- | ----------- | --------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ------- | ------------------------------------ |
| 1     | 18-1-2025 | X3 - Fixed time no range added.<br>X2 - Um El Masryin is merged with Giza not separated station. | 1. If there is list of train it's recommended to sort stop time in the selected station. | 4           | Random      | 4.30/10   | 6.5/10       | [System Prompt V18-1-2025](https://github.com/AhmedNasser1010/Train-Tracking-Model-Tests/blob/main/prompt_history/system_prompts/18-1-2025.txt)<br><br>[Few-Shot Prompts V18-1-2025](https://github.com/AhmedNasser1010/Train-Tracking-Model-Tests/blob/main/prompt_history/few-shot_prompts/18-1-2025.json)<br> | Multiple-Prompts | 20      | 1: 7<br>2: 6<br>3: 5<br>4: 1<br>5: 1 |

### Data-to-Text Model Tests


### User Messages Types

| #   | Type                   | Example                                          |
| --- | ---------------------- | ------------------------------------------------ |
| 1   | Where is X             | Where is train number 147                        |
| 2   | From X to Y            | I want to go from Luxor to Cairo                 |
| 3   | From X to Y in type Z  | I want to go from Cairo to Luxor in AC train     |
| 4   | From X to Y at HH      | I want to go from Luxor to Cairo at 7 AM         |
| 5   | From X or Y to Z       | I want to go from Cairo or Giza to Luxor         |
| 6   | From X or Y to Z at HH | I want to go from Cairo or Giza to Luxor at 7 AM |



## Question And Answer (Q&A)
What is prompt modes?
- Multiple-Prompts (means we keep the chat history connected while testing) (most used) .
- One-by-One (Means we remove the resent prompt while test new one).

How to calculate the Success Score?
- The score range is from 0 to 10.
- Analytics note decrease one point.
- Tip note decrease half point.

How to calculate the Hard Level?
```txt
Example Calculation:
1 * 7 = 7
2 * 6 = 12
3 * 5 = 15
4 * 1 = 4
5 * 1 = 5
7+12+15+4+5 = 43 Weighted Sum
Total Questions = 20
Total Questions × Max Types = Max Score
20 × 5 = 100
(Weighted Sum / Max Score) × 10 = Hard Level Score
```
```javascript
// Using Code (JavaScript):
function calculateHardLevelScore(data) {
  const maxLevel = 5; // Maximum TypeID
  const totalQuestions = Object.values(data).reduce((sum, count) => sum + count, 0); // Total questions
  const weightedSum = Object.entries(data).reduce(
    (sum, [level, count]) => sum + level * count,
    0
  ); // Sum of TypeID * Count
  const maxScore = totalQuestions * maxLevel; // Maximum possible score
  const hardLevelScore = (weightedSum / maxScore) * 10; // Normalize to 10

  return hardLevelScore.toFixed(2); // Return rounded score
}

// Example data: { TypeID: CountInTheTest }
let questionData = { 1: 10, 2: 5, 3: 3, 4: 1, 5: 1 };
let score = calculateHardLevelScore(questionData);

console.log(`Hard Level Score: ${score}/10`);
```
