import fs from 'fs/promises';

// Your secret key
const secretKey = "D5uQv3B7tRx76cNsCGD6z3Qt9nbEmy7DsbDsvGPw75jELqHk2h3SAhgLpPqfnZZcrLZf24";

// Convert the secret key into a byte array
const byteArray = Array.from(secretKey, char => char.charCodeAt(0));

// Save the byte array into a JSON file
const saveKeyPairJson = async () => {
    try {
        await fs.writeFile('keypair.json', JSON.stringify(byteArray, null, 4));
        console.log('Keypair JSON file created successfully.');
    } catch (error) {
        console.error('Error creating keypair JSON file:', error);
    }
};

saveKeyPairJson();
