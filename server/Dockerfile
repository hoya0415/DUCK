FROM node:10.15.2
WORKDIR /app
COPY package*.json /app
RUN npm install
COPY . /app
EXPOSE 4000
CMD [ "node", "index.js" ]