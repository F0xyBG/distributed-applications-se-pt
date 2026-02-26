import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';

import { HOST_NAME, PORT, CLIENT_ORIGIN, DB_CONFIG } from './config/constants.js';
import { createNewConnection, closeConnection } from './config/db.js';

const app = express();

// allows the server to accept JSON data in the body of the request
app.use(express.json());

// enables cookie parsing
app.use(cookieParser());

// enables CORS and allow cookies and credentials to be included in requests
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));

try {
  const mysqlConnection = await createNewConnection(DB_CONFIG);

  process.on('SIGINT', async () => {
    try {
      await closeConnection(mysqlConnection);
      process.exit(0);
    } catch (err) {
      console.error('❌ error closing connection: ', err);
      process.exit(1);
    }
  });
} catch (err) {
  console.error(err);
  process.exit(1);
}

// endpoints
app.get('/', (req, res) => {
  res.send('hello from express!');
});

app.listen(PORT, HOST_NAME, (err) => {
  console.log(err ?? `server running at http://${HOST_NAME}:${PORT}`);
});
