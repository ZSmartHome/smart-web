import * as express from 'express';
import * as path from 'path';

import * as bodyParser from 'body-parser';
import {execute as tv} from './tv';
import {execute as light} from './light';
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

const commandMap: { [command: string]: (action: string) => Promise<any> } = {
  tv,
  light,
};
app.post('/command', (req, res, next) => {
  const input = req.body.command;

  const [command, action] = input.split(/\W+/);
  const handler = commandMap[command];
  if (handler) {
    handler(action)
      .then(() => res.redirect('/'))
      .catch((error) => next(error));
  } else {
    res.status(501).send(`Not Implemented`);
  }
});

app.use(errorNotFoundHandler);
app.use(errorHandler);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
