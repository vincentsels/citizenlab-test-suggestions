# Tech test

## Prerequisites

You'll need the following:
- Angular CLI v12
- Node v14, NPM v6
- The Heroku CLI and an account
- [PostgreSQL](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)

After cloning, first install the dependencies:

    npm install

## Developing locally

You'll first need to create a local database. The code assumes the database, user and password all being `postgres`. Alternatively, set a connection string to environment variable `DATABASE_URL`.

Initialize the database structure by executing `db/000_initial.sql`.

To work on the front-end without a backend (Angular runs this on port 4200 by default):

    ng serve

To test the application with a backend (Runs on port 4000 by default, overwrite witht he `PORT` environment variable):

    ng build
    npm start

> Note: Of course, in the ideal setup, the backend would host this in the way `ng serve` does, or both could be hosted separately (then CORS should be configured). I haven't been able to find how to set this up in time.

## Publishing to heroku

Initialize heroku and add a postgreql database:

    heroku login
    heroku create
    heroku addons:create heroku-postgresql:hobby-dev

Publish to your own heroku instance:

    git push heroku master
