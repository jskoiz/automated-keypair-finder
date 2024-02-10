import { readFile } from 'fs/promises';
import bs58 from 'bs58';

const [,, keypairPath] = process.argv;

if (!keypairPath) {
  console.error('Please provide the path to the keypair file.');
  process.exit(1);
}

try {
  const keypairData = await readFile(new URL(keypairPath, import.meta.url), { encoding: 'utf8' });
  const keypairArray = JSON.parse(keypairData);
  const secretKey = bs58.encode(Buffer.from(keypairArray));
  console.log('Base58 Encoded Secret Key:', secretKey);
} catch (error) {
  console.error('Error reading keypair file:', error);
  process.exit(1);
}
