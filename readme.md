# Automated Keypair Finder

Script to automate the process of finding Solana keypairs that match specified prefixes and uploading the found keypairs to Google Cloud Storage.

## Prerequisites

- Node.js
- Google Cloud SDK
- Solana CLI tools

## Setup

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/automated-keypair-finder.git
    cd automated-keypair-finder
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Configure Google Cloud Storage:**

    Ensure you have the Google Cloud SDK installed and configured. Set up authentication and specify your bucket name in the script or via environment variables.

4. **Set Environment Variables:**

    You can set the following environment variables:

    - `SOLANA_NUM_THREADS`: Number of threads to use (default is 8).
    - `SOLANA_PREFIXES`: Space-delimited list of prefixes to search for.

    Example:

    ```bash
    export SOLANA_NUM_THREADS=8
    export SOLANA_PREFIXES="prefix1 prefix2"
    ```

## Usage

1. **Run the script:**

    ```bash
    node index.mjs
    ```

    This will start the process of generating Solana keypairs using the `solana-keygen` tool and will upload any found keypairs to the specified Google Cloud Storage bucket.

## How It Works

- The script spawns a child process to run the `solana-keygen grind` command with the specified number of threads and prefixes.
- When a keypair is found, it logs the details and uploads the keypair file to Google Cloud Storage.
- The script continues to check for keypair generation and uploads them at regular intervals.

## Files

- `index.mjs`: Main script file.
- `makekeypair.mjs`: Utility script for keypair generation.
- `readKeypair.mjs`: Utility script for reading keypair information.
- `keypair-example.json`: Example JSON file for keypair structure.
- `Dockerfile`: Docker configuration for containerization.
- `Procfile`: Configuration for Heroku deployment.
- `heroku.yml`: Heroku deployment configuration.
- `.gitignore`: List of files and directories to ignore in the repository.

## Contributing

Feel free to open issues or submit pull requests for any changes or improvements.

## License

This project is licensed under the MIT License.
