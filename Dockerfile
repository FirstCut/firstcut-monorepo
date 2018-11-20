FROM node:latest
WORKDIR /usr/app

COPY package.json .
RUN npm install -g lerna react-scripts
COPY lerna.json .
COPY . .

RUN npm run build:babel
RUN lerna bootstrap

CMD ["npm", "--prefix packages/firstcut-marketplace-client", "run" , "start"]
