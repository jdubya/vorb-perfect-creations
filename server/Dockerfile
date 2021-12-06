FROM node:12.22.1

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 3001

CMD [ "npm", "run", "start:dev" ]