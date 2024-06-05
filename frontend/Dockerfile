# Base image
FROM node:lts-bullseye

# Setup working directory in the container fs
WORKDIR /home/task-tracker

# Copy the package dependencies
COPY package.json yarn.lock

# Install dependencies
RUN yarn install

# Copy the contents of current host dir to container working dir
COPY . .

# Expose port for mapping
EXPOSE 5173

# Command to start the app
CMD ["yarn", "dev"]
