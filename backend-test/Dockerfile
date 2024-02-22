FROM node:20.11.1 AS builder

WORKDIR /app

ENV TZ=Asia/Bangkok

ARG APP_ENV=unknown
ARG APP_NAME=unknown

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN APP_ENV=${APP_ENV} npm run build ${APP_NAME}

FROM node:20.11.1

ARG APP_NAME=unknown

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/dist/apps/${APP_NAME}/main.js ./dist/main.js
