FROM node:16-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create upload directories
RUN mkdir -p uploads/bouquets uploads/categories

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "run", "dev"] 