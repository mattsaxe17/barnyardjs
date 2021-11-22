export function createHash(length = 8) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz1234567890';
  let str = '';

  for (let i = 0; i < length; i++) {
    str += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return str;
}
