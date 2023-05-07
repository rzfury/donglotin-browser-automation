import { customAlphabet } from 'nanoid';

export function idgen() {
  const idgen = customAlphabet('0123456789ABCDEFabcdef', 10);
  return idgen();
}
