FROM node:10 as builder

RUN node --version

RUN npm install -g @angular/cli

WORKDIR /usr/src/app

COPY . .
RUN npm install
RUN ng build --prod

FROM nginx:alpine

WORKDIR /usr/src/app

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /usr/src/app/dist/angular /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]