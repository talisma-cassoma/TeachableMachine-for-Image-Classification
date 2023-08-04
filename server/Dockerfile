# Use the node:lts image as the base image
FROM justadudewhohacks/opencv-nodejs

# Set the working directory inside the container
WORKDIR /usr/app

# Copy package.json and package-lock.json (if exists) to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Expose the port on which your application listens
EXPOSE 3000

# Start your application using the latest Node.js version
CMD ["npm", "start"]
