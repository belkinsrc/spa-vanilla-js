const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const router = require('./routes');

const URL = 'mongodb://localhost:27017/BlogPlatformDB';
const PORT = 5000;

const app = express();

mongoose
  .connect(URL)
  .then(() => console.log('Connected to DB'))
  .catch((err) => console.log(`DB connection error: ${err}`));

app.listen(PORT, (err) => {
  err ? console.log(err) : console.log(`Server was launched on port ${PORT}`);
});

app.use(cors());
app.use(router);
