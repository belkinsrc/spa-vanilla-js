const express = require('express');
const mongoose = require('mongoose');

const URL = 'mongodb://localhost:27017/BlogPlatformDB';
const PORT = 5000;

mongoose
  .connect(URL)
  .then(() => console.log('Connected to DB'))
  .catch((err) => console.log(`DB connection error: ${err}`));

const app = express();

app.use((req, res) => {
  res.send('Server listening...');
});

app.listen(PORT, (err) => {
  err ? console.log(err) : console.log(`Server was launched on port ${PORT}`);
});
