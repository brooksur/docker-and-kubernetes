# Specifies the base image we're extending
FROM node:14-alpine

# Create app directory
WORKDIR /usr/app

# Copy package.json and package-lock.json to the container
COPY ./ ./

# Install app dependencies
RUN npm install

# Start the app
CMD ["npm", "start"]