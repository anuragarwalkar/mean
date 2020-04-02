FROM node:10

RUN node --version

RUN npm install -g @angular/cli

WORKDIR /usr/src/app

COPY . .
RUN npm install
RUN ng build --prod

FROM nginx

WORKDIR /usr/src/app

RUN rm -rf /usr/share/nginx/html/*
COPY dist/angular /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]