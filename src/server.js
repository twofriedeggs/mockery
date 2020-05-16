const express = require('express');
const home = require('./controllers/home');
const mock = require('./controllers/mock');

const app = express();
const port = 8080;

app.get('/', home);
app.get('/mock/*', mock);
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
