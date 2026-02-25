import express from 'express';

const hostname = 'localhost';
const port = 3000;

const app = express();

// allows the server to accept JSON data in the body of the request
app.use(express.json());

// enables cookie parsing
app.use(cookieParser());

// enables CORS and allow cookies and credentials to be included in requests
app.use(cors({ origin: TODO_APP_ORIGIN, credentials: true }));

app.get('/', (req, res) => {
  res.sendStatus(200);
});

app.listen(port, hostname, (err) => {
  console.log(err ?? `server running at http://${hostname}:${port}`);
});
