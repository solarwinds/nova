FROM node:carbon-slim

RUN npm config set @solarwinds:registry=http://dev-artifactory.dev.local/artifactory/api/npm/npm

RUN mkdir /app

WORKDIR /app

COPY package.json .
RUN yarn

ADD . /app

CMD [ "yarn", "start" ]
