FROM node:10 as builder

RUN node --version

RUN npm install -g @angular/cli

WORKDIR /usr/src/app

# Copy all files to working dir
COPY . .

# Running npm install and build
RUN npm install
RUN ng build --prod --configuration local

FROM nginx:alpine

WORKDIR /usr/src/app

# Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

#Copying files from angular dist folder to nginx html folder
COPY --from=builder /usr/src/app/dist/angular /usr/share/nginx/html

# Exposing port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
