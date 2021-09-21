import bodyParser from 'body-parser';
import pgPromise from 'pg-promise';
import * as suggestions from './endpoints/suggestions.js'

export function bootstrap(app) {
  app.use(bodyParser.json());

  // Create a database variable outside of the database connection callback to reuse the connection pool in your app.
  const opts = process.env.DATABASE_URL ? {
    connectionString: process.env.DATABASE_URL || 'postgres://$(whoami)?sslmode=disable',
    ssl: { rejectUnauthorized: false }
  } : {
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'postgres',
  };

  var db = pgPromise()(opts);

  suggestions.setup(app, db);
}
