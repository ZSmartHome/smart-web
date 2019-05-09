import * as express from 'express';
import * as path from 'path';

import * as bodyParser from 'body-parser';

const app = express();
const port = 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

app.set('views', path.join(__dirname, '../view'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, '../static')));

app.get('/', (req, res) => {
  res.render('index', {title: 'SmartHome Web'});
});

import {execute} from './tv';
app.post('/command', (req, res) => {
  execute(req.body.command)
    .then(() => res.redirect('/'))
    .catch((error) => res.render('error', {message: error.message}));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
