import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || ''; // Must be 32 bytes (64 hex characters)

/**
 * Encrypts a string using AES-256-CBC
 * @param text The text to encrypt
 * @returns Encrypted string in "iv:encryptedData" format
 */
export function encrypt(text: string): string {
    if (!ENCRYPTION_KEY) {
        throw new Error('ENCRYPTION_KEY is not defined in environment variables');
    }

    const iv = crypto.randomBytes(16);
    const key = Buffer.from(ENCRYPTION_KEY, 'hex');

    if (key.length !== 32) {
        throw new Error('ENCRYPTION_KEY must be a 32-byte hex string (64 characters)');
    }

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return `${iv.toString('hex')}:${encrypted}`;
}

/**
 * Decrypts an encrypted string using AES-256-CBC
 * @param encryptedText The text to decrypt in "iv:encryptedData" format
 * @returns Decrypted string
 */
export function decrypt(encryptedText: string): string {
    if (!ENCRYPTION_KEY) {
        throw new Error('ENCRYPTION_KEY is not defined in environment variables');
    }

    const [ivHex, encryptedData] = encryptedText.split(':');
    if (!ivHex || !encryptedData) {
        throw new Error('Invalid encrypted text format. Expected "iv:encryptedData"');
    }

    const iv = Buffer.from(ivHex, 'hex');
    const key = Buffer.from(ENCRYPTION_KEY, 'hex');

    if (key.length !== 32) {
        throw new Error('ENCRYPTION_KEY must be a 32-byte hex string (64 characters)');
    }

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}
