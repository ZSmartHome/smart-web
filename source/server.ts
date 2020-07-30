import * as express from 'express';
import {Request} from 'express';
import * as path from 'path';

import * as bodyParser from 'body-parser';
import {light, lightCommands, split, tv, tvCommands} from '@zsmarthome/command-core';
import {errorHandler, errorNotFoundHandler} from './error-middleware';
import {Command} from '@zsmarthome/command-core/build/commands/option';
import {WebError} from './errors/web-error';

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

type Action = (action: string) => Promise<any>;
type ButtonsArray = Array<Array<Command<any>>>;

const commandMap: { [command: string]: { name: string, buttons: ButtonsArray, action: Action } } = {
  tv: {name: `TV Controller`, action: tv, buttons: split(Object.values(tvCommands), 2, 3, 3)},
  light: {name: `Light Controller`, action: light, buttons: split(Object.values(lightCommands), 2, 3, 4)},
};

app.get(`/`, (req, res) => {
  res.render(`index`, {
    title: `SmartHome Web`,
    controller: commandMap,
  });
});

const acceptsHtmlOrJSON = (req: Request) => {
  if (!req.accepts([`html`, `json`])) {
    throw new WebError(406, `Not Acceptable`);
  }
};

app.post(`/command`, (req, res, next) => {
  acceptsHtmlOrJSON(req);

  const input = req.body.command;

  const [command, action] = input.split(/\W+/);
  const executor = commandMap[command];
  const handler = executor && executor.action;
  if (handler) {
    handler(action)
      .then(() => {
        // noinspection JSUnreachableSwitchBranches
        switch (req.accepts([`html`, `json`])) {
          case `json`:
            return res.status(200).json({status: `Success`});
          case `html`:
            return res.redirect(303, `/`);
          default:
            throw new WebError(406, `Not Acceptable`);
        }
      })
      .catch((error) => next(error));

  } else {
    throw new WebError(501, `Not Implemented`);
  }
});

app.use(errorNotFoundHandler);
app.use(errorHandler);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
