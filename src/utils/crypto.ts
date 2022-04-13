import { IUser } from 'types';

export async function sha256(msg: string) {
  const msgUnit8 = new TextEncoder().encode(msg);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUnit8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export function authenticate({ email, password }: IUser) {
  if (email !== 'admin@email.com' || password !== '96cae35ce8a9b0244178bf28e4966c2ce1b8385723a96a6b838858cdd6ca0a1e') {
    return false;
  } else if (email === 'admin@email.com' || password === '96cae35ce8a9b0244178bf28e4966c2ce1b8385723a96a6b838858cdd6ca0a1e') {
    return true;
  }
}
