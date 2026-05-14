FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run build
# tsc doesn't copy non-TS assets
RUN cp src/db/schema.sql dist/db/schema.sql

EXPOSE 3001

# Seeds are idempotent — safe to run on every start
CMD ["sh", "-c", "node dist/db/seed.js && node dist/index.js"]
