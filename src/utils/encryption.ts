
/**
 * Simple encryption/decryption utilities for storing sensitive data
 * in localStorage. Note: This is still client-side encryption and not
 * a replacement for proper server-side security.
 */

// A simple encryption key - in a real app, this would be more securely managed
const ENCRYPTION_KEY = "aid-on-medical-app-encryption-key";

/**
 * Encrypts data before storing in localStorage
 */
export function encryptData(data: any): string {
  try {
    // Convert data to string if it's not already
    const dataString = typeof data === 'string' ? data : JSON.stringify(data);
    
    // Simple XOR encryption (very basic - would use a proper encryption library in production)
    let encrypted = '';
    for (let i = 0; i < dataString.length; i++) {
      const charCode = dataString.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
      encrypted += String.fromCharCode(charCode);
    }
    
    // Convert to base64 for storage
    return btoa(encrypted);
  } catch (error) {
    console.error("Encryption error:", error);
    return "";
  }
}

/**
 * Decrypts data retrieved from localStorage
 */
export function decryptData(encryptedData: string): any {
  try {
    // Decode from base64
    const decoded = atob(encryptedData);
    
    // Reverse the XOR encryption
    let decrypted = '';
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
      decrypted += String.fromCharCode(charCode);
    }
    
    // Parse back to an object if it was one
    try {
      return JSON.parse(decrypted);
    } catch {
      // If it's not valid JSON, return as is
      return decrypted;
    }
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
}

/**
 * Securely stores data in localStorage with encryption
 */
export function secureLocalStorage = {
  setItem: (key: string, value: any) => {
    try {
      const encrypted = encryptData(value);
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error("Error storing encrypted data:", error);
    }
  },
  
  getItem: (key: string) => {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      return decryptData(encrypted);
    } catch (error) {
      console.error("Error retrieving encrypted data:", error);
      return null;
    }
  },
  
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing data:", error);
    }
  }
};
