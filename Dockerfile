FROM node:12

WORKDIR /express-demo

RUN npm install -g node_modules

COPY package.json .
RUN npm install

COPY . .

USER node
EXPOSE 3000

CMD ["npm","start"]