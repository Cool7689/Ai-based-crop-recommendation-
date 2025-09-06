# Railway deployment configuration for Backend + AI Service

# Backend Service
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/ .
EXPOSE 5000
CMD ["npm", "start"]

# AI Service (separate deployment)
# Use this for AI service deployment
