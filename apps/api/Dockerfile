# Use Ubuntu 22.04 as the base image
FROM ubuntu:22.04

# Install necessary tools and Node.js
RUN apt-get update && apt-get install -y \
    poppler-utils \
    tesseract-ocr \
    webp \
    curl \
    libpq-dev \
    ghostscript \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Set the working directory
WORKDIR /app

# Copy package.json and install Node.js dependencies
COPY package.json ./
RUN npm install --omit=dev

# Copy the conversion script
COPY convert.mjs ./

# Create output directory and ensure it's writable
RUN mkdir -p /output && chmod 777 /output

# Define volumes for input and output
VOLUME ["/input", "/output"]

# Set the entrypoint
ENTRYPOINT ["node", "convert.mjs"]
