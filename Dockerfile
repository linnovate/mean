# Create image based on the official Node 6 image from dockerhub
FROM node:6

# Change directory so that our commands run inside this new directory
WORKDIR /usr/src/app

# Copy dependency definitions
COPY package.json .

# Install dependecies
RUN npm install

# Get all the code needed to run the app
COPY . .

# Serve the app
CMD ["npm", "start"]
