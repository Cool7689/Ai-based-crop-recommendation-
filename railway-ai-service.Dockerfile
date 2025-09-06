# Railway deployment configuration for AI Service

FROM node:18-alpine
WORKDIR /app
COPY ai-service/package*.json ./
RUN npm ci --only=production
COPY ai-service/ .
EXPOSE 5001
CMD ["npm", "start"]
