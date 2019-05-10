import * as express from 'express';
import * as path from 'path';

import * as bodyParser from 'body-parser';
import {execute} from './tv';
import {errorHandler, errorNotFoundHandler} from './error-middleware';

const app = express();
const port = process.env.PORT || 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

app.set('views', path.join(__dirname, '../view'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, '../static')));

app.get('/', (req, res) => {
  res.render('index', {title: 'SmartHome Web'});
});

app.post('/command', (req, res, next) => {
  execute(req.body.command)
    .then(() => res.redirect('/'))
    .catch((error) => next(error));
});

app.use(errorNotFoundHandler);
app.use(errorHandler);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
