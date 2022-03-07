const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

console.log(`process.env THOR`, process.env);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listen on port ${port} ...`);
});
