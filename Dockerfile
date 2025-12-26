# Step 1: Use official Node.js LTS as base image
FROM node:20-alpine AS builder

# Step 2: Set working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json / tsconfig first
# This allows caching dependencies in Docker
COPY package*.json ./
COPY tsconfig.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the code
COPY . .

# Step 6: Build Next.js project
RUN npm run build

# Step 7: Production image
FROM node:20-alpine AS runner

WORKDIR /app

# Copy only necessary files from build stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose default Next.js port
EXPOSE 3000

# Run the Next.js app in production
CMD ["npm", "start"]
