import { spawn } from 'child_process';
import { Storage } from '@google-cloud/storage';

// Configure Google Cloud Storage
const storage = new Storage();
const bucketName = 'solanapow'; // Replace with your actual bucket name

// Your original script code
const prefix = process.env.SOLANA_PREFIX || 'defaultPrefix';
const args = ['grind', '--starts-with', prefix];
let intervalId; // Declare outside to clear it later in the 'close' event

const executeCommand = (cmd, args) => {
  const process = spawn(cmd, args);

  process.stdout.on('data', async (data) => {
    console.log(`stdout: ${data}`);

    if (data.includes('Wrote keypair to')) {
      // Function to print the notification and upload to Google Cloud Storage
      const notifyFound = async () => {
        console.log('\x1b[93m%s\x1b[0m', 'Keypair Found! Details: ' + data.toString());
        console.log('\x1b[93m%s\x1b[0m', '--- KEYPAIR FOUND ---');

        // Extract the filename from the data output
        const filenameMatch = data.toString().match(/Wrote keypair to (.*)/);
        if (filenameMatch) {
          const filename = filenameMatch[1];
          try {
            // Upload the file to Google Cloud Storage
            await storage.bucket(bucketName).upload(filename, {
              destination: filename,
            });
            console.log('Keypair uploaded to Google Storage:', filename);
          } catch (error) {
            console.error('Error uploading keypair to Google Storage:', error.message);
          }
        }
      };

      // Print and upload immediately
      await notifyFound();

      // Repeat every 5 seconds
      intervalId = setInterval(notifyFound, 5000);
    }
  });

  process.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  process.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    // Clear the interval to prevent a memory leak
    if (intervalId) clearInterval(intervalId);
  });
};

executeCommand('solana-keygen', args);
