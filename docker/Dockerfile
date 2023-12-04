FROM node:20.10-alpine3.17

WORKDIR /app

COPY ../package-lock.json ../package.json ./
RUN npm ci
