import nanoid from 'nanoid';

export function idgen() {
  const idgen = nanoid.customAlphabet('0123456789ABCDEFabcdef', 10);
  return idgen();
}
