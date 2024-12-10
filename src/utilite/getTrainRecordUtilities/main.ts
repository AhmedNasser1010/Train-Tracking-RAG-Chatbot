import { TelegramUpdate } from "../../types/TelegramUpdate"
import getTrainNumber from './getTrainNumber'

export default function generateTrainRecord(update: TelegramUpdate) {
  const keywords: string[] = update.message.text.split(/[\s#_]+/).filter(Boolean);
  console.log(keywords)

  let trainNumber: number = getTrainNumber(keywords);

  console.log('trainNumber', trainNumber)
  return keywords
}