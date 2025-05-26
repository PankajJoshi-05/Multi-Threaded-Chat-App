import path from 'path';
import { Worker } from 'worker_threads';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const runEncryptionWorker = (file, data) => {
  return new Promise((resolve, reject) => {
    const workerPath = path.resolve(__dirname, '../workers', file);

    const worker = new Worker(workerPath);

    worker.postMessage(data); 

    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
};
