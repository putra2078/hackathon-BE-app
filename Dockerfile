# Use official Node.js image as the base
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the application port (assuming 3000)
EXPOSE 3000

# Command to run the application
CMD ["node", "cmd/main.js"]
