# Stage 1: Build the application
FROM node:18-slim AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Set the API URL environment variable
ARG VITE_API_URL=http://localhost:3000/api
ENV VITE_API_URL=$VITE_API_URL

# Build the application
RUN npm run build

# Stage 2: Serve the static files
FROM node:18-slim AS production

WORKDIR /app

# Install serve
RUN npm install -g serve

# Copy the build output from the build stage
COPY --from=build /app/dist /app/dist

# Expose the port
EXPOSE 3001

# Start the server
CMD ["serve", "-s", "dist", "-l", "3001"]