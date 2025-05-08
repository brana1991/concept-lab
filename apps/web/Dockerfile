FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
COPY packages/shared/package*.json ./packages/shared/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production image
FROM node:18-alpine

WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/apps/web/dist ./dist
COPY --from=builder /app/apps/web/package*.json ./

# Install production dependencies
RUN npm install --production

# Expose port
EXPOSE 5173

# Start the application
CMD ["npm", "run", "preview"] 