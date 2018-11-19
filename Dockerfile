FROM node:latest
WORKDIR /usr/app

COPY package.json .
COPY . .

RUN npm install -g lerna react-scripts
RUN lerna bootstrap

CMD ["npm", "--prefix packages/firstcut-marketplace-client", "run" , "start"]
