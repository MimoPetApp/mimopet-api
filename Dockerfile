FROM node:14-alpine
MAINTAINER JadsonLucena <jadsonlucena@gmail.com>

RUN apk add --update-cache \
    git \
    zip \
    unzip

WORKDIR /usr/src/app

COPY --chown=node:node ./ ./

ENV NODE_ENV=production

#RUN npm install -g npm@latest
RUN npm install --production

#RUN npm run develop
RUN NODE_ENV=production npm run build

USER node

CMD node ecosystem.config.js