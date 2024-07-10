export const chunkArr = (arr, chunkSize) => {
  const chunked = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunked.push(arr.slice(i, i + chunkSize));
  }
  return chunked;
};

export const extractNumber =(currencyString) =>{
const numberString = currencyString.replace(/[^\d.-]/g, '');

  const number = parseFloat(numberString);
  return number;
}
