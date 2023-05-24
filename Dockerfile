FROM node:12

WORKDIR /urs/src/app

COPY package*.json ./

RUN npm install
# use for prod
# RUN npm ci --omit=dev

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]