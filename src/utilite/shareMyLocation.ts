import sendMessage from "../handlers/sendMessage";
import { TelegramUpdate } from "../types/TelegramUpdate";

const generateTrainHashtag = (number: string) => {
  // #قطار_1015_روسي_اسوان_الاسكندريه
  // #Train_{Number}_{StartStation}_{EndStation}

  const type = 'روسي';
  const startStation = 'اسوان';
  const endStation = 'اسكندريه';

  return `#قطار_${number}_${type}_${startStation}_${endStation}`;
}

const current = () => {
  return 'Currently in..'
}

export default async function shareMyLocation(env: Env, update: TelegramUpdate) {
  const chat_id = update.message.chat.id;
  const text = update.message.text;
  const trainNumber = text.split(' ')[1];

  await sendMessage(env, chat_id, `
  ${generateTrainHashtag(trainNumber)}
  


  ${current()}


  #خير_الناس_انفعهم_الناس  
  #فيد_زي‌ما‌بتستفيد 
  #ربنا_يسترها_علي_الجميع 
  #راكب
  `);
  return new Response('OK');
}
