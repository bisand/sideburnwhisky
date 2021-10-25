FROM node:lts-alpine as build-step
RUN mkdir -p /app
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
RUN npm run build --prod

FROM nginx:alpine
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./nginx_default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-step /app/dist/sideburn-web /usr/share/nginx/html
EXPOSE 8585:80
