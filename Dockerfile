# syntax = docker/dockerfile:1

FROM node:20.9.0-slim as base

LABEL fly_launch_runtime="Node.js"

WORKDIR /app

ENV NODE_ENV="production"

FROM base as build

COPY --link .npmrc package-lock.json package.json ./
RUN npm ci --include=dev

COPY --link . .

RUN npm run build
RUN npm prune --omit=dev

FROM base
COPY --from=build /app /app

EXPOSE 3000
CMD [ "node", "build" ]
