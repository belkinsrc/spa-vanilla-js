const express = require('express');

const PORT = 5000;

const app = express();

app.use((req, res) => {
  res.send('Server listening...');
});

app.listen(PORT, () => {
  console.log(`Server was launched on port ${PORT}`);
});
