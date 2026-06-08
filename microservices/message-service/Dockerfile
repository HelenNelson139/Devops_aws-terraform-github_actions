FROM node:20-alpine AS dependencies

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

RUN rm -rf /usr/local/lib/node_modules/npm \
    /usr/local/bin/npm \
    /usr/local/bin/npx \
    /usr/local/bin/corepack

COPY --from=dependencies /app/node_modules ./node_modules
COPY src ./src

USER node
EXPOSE 3001
CMD ["node", "src/server.js"]
