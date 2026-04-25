import CryptoJS from "crypto-js";

const SECRET_KEY = "my-secret-key";

export const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

export const decryptData = (cipherText) => {
  if (!cipherText) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
   
    if (!decrypted) {
      return null;
    }

    return JSON.parse(decrypted);
  } catch (err) {
    console.error("decryptData failed:", err.message);
    return null;
  }
};