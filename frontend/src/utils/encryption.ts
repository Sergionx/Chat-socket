import { AES, SHA256, enc } from "crypto-js";

export function decryptString(data: string): string {
  return AES.decrypt(data, import.meta.env.VITE_ENCRYPT_KEY).toString(enc.Utf8);
}

export function encryptString(data: string): string {
  return AES.encrypt(data, import.meta.env.VITE_ENCRYPT_KEY).toString();
}

export function hashPassword(password: string): string {
  return SHA256(password).toString()
}