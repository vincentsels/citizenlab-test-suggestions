import express from 'express';
import { join } from 'path';

import * as init from './src/api/init.js';

// The Express app is exported so that it can be used by serverless Functions.
export function app() {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/citizenlab-test');

  // Initialize the api endpoints and database
  init.bootstrap(server);

  server.use(express.static(distFolder));

  server.get('*', (req, res) => {
    res.sendFile(join(distFolder, 'index.html'));
   });

  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  return server;
}

function run() {
  const port = process.env.PORT || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
