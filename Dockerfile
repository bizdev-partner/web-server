# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy the current directory contents into the container
COPY . .
COPY .npmrc ./.npmrc

# Install dependencies
RUN npm install

# Build the application (optional, for production setup)
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the Node.js server
CMD ["npm", "start"]
