const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.status(404).json({
    message: 'Hallo from the server side!!',
    app: 'Natours',
  });
});

app.post('/', (req, res) => {
  res.send('You can PoST in this URL...');
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running in ${port} port!!`);
});
