# Stage 1: Build the application
FROM node:18 AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

# Set the working directory in the container
WORKDIR /usr/share/nginx/html

# Remove default Nginx files
RUN rm -rf ./*

# Copy built files from the previous stage
COPY --from=build /app/dist .

# Expose the default Nginx port
EXPOSE 80

# Nginx default CMD will serve the files

