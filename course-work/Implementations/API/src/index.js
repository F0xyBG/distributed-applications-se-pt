import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';

import { HOST_NAME, PORT, CLIENT_ORIGIN, DB_CONFIG } from './config/constants.js';
import { createNewConnection, closeConnection } from './config/db.js';

// models
import User from './models/User.js';

// controllers
import * as authController from './controllers/authController.js';
import * as userController from './controllers/userController.js';

// middlewares
import { authenticateToken } from './middlewares/auth.js';

const app = express();

// allows the server to accept JSON data in the body of the request
app.use(express.json());

// enables cookie parsing
app.use(cookieParser());

// enables CORS and allow cookies and credentials to be included in requests
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));

try {
  const mysqlConnection = await createNewConnection(DB_CONFIG);

  User.setConnection(mysqlConnection);

  await User.initTable();

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
  res.status(200).json({ message: 'hello from express!' });
});

// auth
app.post('/auth/register', authController.register);
app.post('/auth/login', authController.login);
app.post('/auth/logout', authController.logout);

// user
app.get('/user', authenticateToken, userController.getUser);
app.patch('/user', authenticateToken, userController.updateUser);
app.delete('/user', authenticateToken, userController.deleteUser);

// start the server
app.listen(PORT, HOST_NAME, (err) => {
  console.log(err ?? `server running at http://${HOST_NAME}:${PORT}`);
});
