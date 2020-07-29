import * as express from 'express';
import * as path from 'path';

import * as bodyParser from 'body-parser';
import {light, lightCommands, split, tv, tvCommands} from '@zsmarthome/command-core';
import {errorHandler, errorNotFoundHandler} from './error-middleware';
import {Command} from '@zsmarthome/command-core/build/commands/option';

const app = express();
const port = process.env.PORT || 3000;

process.on(`uncaughtException`, (e: object) => {
  console.error(`Uncaught: ${e.toString()}`);
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

app.set(`views`, path.join(__dirname, `../view`));
app.set(`view engine`, `pug`);
app.use(express.static(path.join(__dirname, `../static`)));

const commandMap: { [command: string]: { name: string, commands: Command<any>[][], action: (action: string) => Promise<any> } } = {
  tv: {name: `TV Controller`, action: tv, commands: split(Object.values(tvCommands), 2, 3, 3)},
  light: {name: `Light Controller`, action: light, commands: split(Object.values(lightCommands), 2, 3, 4)},
};

app.get(`/`, (req, res) => {
  res.render(`index`, {
    title: `SmartHome Web`,
    controller: commandMap
  });
});

app.post(`/command`, (req, res, next) => {
  const input = req.body.command;

  const [command, action] = input.split(/\W+/);
  const executor = commandMap[command];
  const handler = executor && executor.action;
  if (handler) {
    handler(action)
      .then(() => res.redirect(303, `/`))
      .catch((error) => next(error));
  } else {
    res.status(501).send(`Not Implemented`);
  }
});

app.use(errorNotFoundHandler);
app.use(errorHandler);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
