FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build || true
EXPOSE 3001
CMD ["node", "dist/index.js"]
FROM node:20-alpine
WORKDIR /usr/src/app
COPY package.json tsconfig.json ./
# Install dependencies (will create lockfile if missing) and build
RUN npm install
COPY src ./src
RUN npm run build || true
# Remove dev dependencies to keep image small
RUN npm prune --production || true
EXPOSE 3001
CMD ["node", "dist/index.js"]
