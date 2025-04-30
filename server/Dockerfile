# Use the node:lts image as the base image
FROM node:latest

# Set the working directory inside the container
WORKDIR /usr/app

# Instalar dependências necessárias
RUN apt-get update && apt-get install -y \
    python3 python3-pip python3-dev \
    libc6-dev \
    libglib2.0-0 \
    libstdc++6
    
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

