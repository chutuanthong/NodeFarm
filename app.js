const express = require('express');

const app = express();
const port = 3000;

/*
  Xác định URL :
  trả về 1 callback gồm req và res 
*/

app.get('/', (req, res) => {
  res.status(200).send('Hello from server side!');
});

app.post('/', (req, res) => {
  res.send('You can post to this endpoint..');
});

app.listen(port, () => {
  console.log(`App listen on port ${port} ...`);
});
//hello thong
