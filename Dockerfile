FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create logs directory
RUN mkdir -p logs

# Create data directory
RUN mkdir -p data

# Expose port
EXPOSE 3000

# Run application
CMD ["node", "src/index.js"]
