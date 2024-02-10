import { spawn } from 'child_process';
import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import os from 'os';
import path from 'path';

const prefix = process.env.SOLANA_PREFIX || 'defaultPrefix'; // Your prefix
const args = ['grind', '--starts-with', prefix];
const bucketName = 'solanapow'; // Your Google Cloud Storage bucket name

if (!process.env.GOOGLE_CLOUD_KEY) {
  console.error('The environment variable GOOGLE_CLOUD_KEY is not set.');
  process.exit(1);
}

// Decode the Google Cloud credentials from the environment variable
const creds = Buffer.from(process.env.GOOGLE_CLOUD_KEY, 'base64').toString('utf8');
const credsPath = path.join(os.tmpdir(), 'gcloud-creds.json');

try {
  fs.writeFileSync(credsPath, creds);
} catch (error) {
  console.error('Failed to write Google Cloud credentials to temp file:', error);
  process.exit(1);
}

// Create a Google Cloud Storage client using the decoded credentials
const storage = new Storage({ keyFilename: credsPath });

const uploadFileToGoogleCloud = async (filePath) => {
  try {
    await storage.bucket(bucketName).upload(filePath, {
      destination: `keypairs/${path.basename(filePath)}`,
    });
    console.log(`Uploaded ${filePath} to bucket ${bucketName}`);
  } catch (error) {
    console.error('Failed to upload file:', error);
  } finally {
    // Optionally delete the temporary credentials file
    fs.unlinkSync(credsPath);
  }
};

const executeCommand = (cmd, args) => {
  const process = spawn(cmd, args);
  let buffer = '';

  process.stdout.on('data', (data) => {
    buffer += data.toString();
    // Check for the success message in the aggregated buffer
    if (buffer.includes('Wrote keypair to')) {
      const match = buffer.match(/Wrote keypair to (.+)/);
      if (match && match[1]) {
        const filePath = match[1].trim();
        console.log('\x1b[93m%s\x1b[0m', 'Keypair Found! Details: ' + filePath);
        // Print and upload immediately
        uploadFileToGoogleCloud(filePath).catch(console.error);
        buffer = ''; // Clear the buffer if the keypair is found
      }
    }
  });

  process.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  process.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
};

executeCommand('solana-keygen', args);
