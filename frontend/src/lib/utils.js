import CryptoJS from "crypto-js";

// Static salt for demo; in production, use secure key exchange
const STATIC_SALT = "chatapp-demo-salt";

// Derive a symmetric key for a conversation between two users
export function deriveConversationKey(userId1, userId2) {
  // Sort IDs to ensure both users derive the same key
  const [a, b] = [userId1, userId2].sort();
  return CryptoJS.SHA256(a + b + STATIC_SALT).toString();
}

export function encryptMessage(plainText, key) {
  return CryptoJS.AES.encrypt(plainText, key).toString();
}

export function decryptMessage(cipherText, key) {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, key);
    return bytes.toString(CryptoJS.enc.Utf8) || "Message Error";
  } catch {
    return "Message Error";
  }
}

export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}