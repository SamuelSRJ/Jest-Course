const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
const ALPHABET = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

export function encode(message:string, num:number) {
  let str:string[] = message.split("");
  let shift:number = num
  let newStr:string = "";

  str.forEach(Element => {
    const lowerIndex = alphabet.indexOf(Element);
    const upperIndex = ALPHABET.indexOf(Element);

    if(lowerIndex >= 0) {
      const shiftedIndex = (lowerIndex + shift + 26) % 26;
      newStr += alphabet[shiftedIndex];
    } else if (upperIndex >= 0) {
      const shiftedIndex = (upperIndex + shift + 26) % 26;
      newStr += ALPHABET[shiftedIndex];
    } else {
      newStr += Element;
    }
  })

  return newStr;
}