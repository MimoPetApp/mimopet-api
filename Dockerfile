FROM node:latest
MAINTAINER JadsonLucena <jadsonlucena@gmail.com>

RUN apt-get update && apt-get install -y \
    git \
    zip \
    unzip

WORKDIR /usr/src/app

COPY --chown=node:node ./ ./

ENV NODE_ENV=production

RUN npm install -g npm@latest
RUN npm install --production

USER node

CMD NODE_ENV=production npm start