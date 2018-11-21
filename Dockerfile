FROM node:11.2.0
WORKDIR /usr/app

COPY package.json .
RUN npm install -g lerna react-scripts
COPY . .

RUN npm run build:babel && lerna bootstrap
