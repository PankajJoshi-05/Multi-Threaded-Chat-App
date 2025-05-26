import { parentPort } from 'worker_threads';
import crypto from 'crypto';

const secret = process.env.ENCRYPTION_SECRET || 'default_secret';

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const key = crypto.scryptSync(secret, 'salt', 32);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

parentPort.on('message', (text) => {
  const encrypted = encrypt(text);
  parentPort.postMessage(encrypted);
});
