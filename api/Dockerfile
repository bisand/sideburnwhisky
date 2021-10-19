FROM node:lts-alpine as build-step
RUN mkdir -p /app
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
RUN npm install
RUN npm run clean
RUN npm run build

FROM node:lts-alpine
WORKDIR /usr/src/app/
COPY --from=build-step /app/dist/ ./dist/

COPY package* ./
RUN npm install --production

EXPOSE 8080
CMD npm start
