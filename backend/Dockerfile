# Use a lightweight Node.js image
FROM node:22-alpine3.20

# Set the working directory
WORKDIR /app/backend

# Copy package.json and package-lock.json for dependency installation
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 8002

# Start the application
CMD ["npm", "run", "dev"]