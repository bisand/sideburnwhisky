FROM node:lts-alpine as build-step
RUN mkdir -p /app
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
RUN npm run build --prod

FROM node:lts-alpine
COPY --from=build-step /app/dist/ /usr/src/app/

WORKDIR /usr/src/app
RUN npm install

EXPOSE 8080
CMD [ "node", "index.js" ]
