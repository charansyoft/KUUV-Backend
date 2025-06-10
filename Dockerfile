FROM node:18

WORKDIR /usr/src/practe

COPY package*.json ./

COPY . .

RUN npm install --legacy-peer-deps

EXPOSE 3000

CMD ["node", "server.js"]