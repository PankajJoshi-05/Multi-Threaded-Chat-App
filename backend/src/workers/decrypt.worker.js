import { parentPort } from 'worker_threads';
import crypto from 'crypto';

const secret = process.env.ENCRYPTION_SECRET || 'default_secret';

function decrypt(encryptedText) {
  const [ivHex, encryptedHex] = encryptedText.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const key = crypto.scryptSync(secret, 'salt', 32);
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString('utf8');
}

parentPort.on('message', (encryptedText) => {
  try {
    const decrypted = decrypt(encryptedText);
    parentPort.postMessage({ success: true, data: decrypted });
  } catch (error) {
    parentPort.postMessage({ success: false, error: error.message });
  }
});
