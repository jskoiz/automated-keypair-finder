FROM node:16

# Install dependencies for Solana installation and other utilities
RUN apt-get update && apt-get install -y curl bash openssh-client iproute2 python

# Install Solana CLI
RUN sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Add Solana CLI to PATH (adjust this if the installation path is different)
ENV PATH="/root/.local/share/solana/install/active_release/bin:$PATH"

WORKDIR /usr/src/app

# Copy your application source
COPY . .

# Install Node.js dependencies
RUN npm install

# Start the application
CMD ["node", "index.mjs"]
