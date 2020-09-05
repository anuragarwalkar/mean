# Messages App

## Description
Front End : Angular Version 8.3.6 <br>
Back End : NodeJs & MongoDb

## API Link

Hosted On Heroku `https://nodejs-backend-posts.herokuapp.com/api`

## Databse Link

Hosted On MongoCloud `mongodb+srv://anurag:<passowrd>@cluster0-mbclo.gcp.mongodb.net/posts?retryWrites=true&w=majority`


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Continuous Integration and Continuous Deployment (CI-CD) 

Continuous Intigration And Continuous Deployment Using GitHub Actions
Build and deployment will automatically pick by GitHub Workflow when changes in master branch

## Manual Build
ng build --prod --base-href "https://anuragarwalkar.github.io/my-messages/"

npx ngh --dir=dist/angular
