export default function toEnglishNumber(strNum: string) {
  var ar = '٠١٢٣٤٥٦٧٨٩'.split('');
  var en = '0123456789'.split('');
  strNum = strNum.replace(/[٠١٢٣٤٥٦٧٨٩]/g, x => en[ar.indexOf(x)]);
  strNum = strNum.replace(/[^\d]/g, '');
  return strNum;
}