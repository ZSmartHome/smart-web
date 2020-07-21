import * as Yeelight from 'yeelight2';
import {ExecutionError} from './errors/execution-error';

interface Option {
  [command: string]: (light: Yeelight.Light) => Promise<any>;
}

// Default yellow not very bright light
const DEFAULT_STATE = {
  power: `on`,
  bright: 100,
  color_mode: 2,
  ct: 2429,
  rgb: 16514957,
  hue: 62,
  sat: 44,
};

const LAMP_TIMEOUT = 2000;
const connectLamp = () => new Promise<Yeelight.Light>((success, fail) => {
  const timer = setTimeout(() => fail(new ExecutionError(`Couldn't find lamp in ${LAMP_TIMEOUT}ms`)), LAMP_TIMEOUT);
  Yeelight.discover(function (myLight) {
    this.close();
    clearTimeout(timer);
    success(myLight);
  });
});

const Option: Option = {
  on: (it) => it.set_power(`on`),
  off: (it) => it.set_power(`off`),
  bright: (it) => it.set_bright(100),
  normal: (it) => it.set_bright(50),
  dark: (it) => it.set_bright(25),
  red: (it) => it.set_rgb(0xFF0000),
  blue: (it) => it.set_rgb(0x0000FF),
  green: (it) => it.set_rgb(0x00FF00),
  white: (it) => it.set_rgb(0xFFFFFF),
};

export const execute = async (command: string): Promise<string> => {
  if (!command) {
    throw new ExecutionError(`What should I do with Light?`);
  }
  const action = Option[command];
  if (!action) {
    throw new ExecutionError(`Unsupported command: ${command}`);
  }

  const lamp = await connectLamp();

  return action(lamp).then(() => lamp.set_default()).then((it) => {
    lamp.exit();
    return it;
  });
};
