ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine as base

WORKDIR /app/

FROM base as build

COPY --link package.json package-lock.json ./
RUN npm install

COPY --link . .

RUN npm run generate
RUN npm prune


FROM nginx:alpine-slim

COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html/

