FROM node:18-alpine

WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

COPY package*.json ./

RUN npm install

COPY . .

# Generate Prisma Client with retries
RUN npx prisma generate || npx prisma generate || npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
