import * as Yeelight from 'yeelight2';
import {ExecutionError} from './errors/execution-error';

interface Option {
  [command: string]: (light: Yeelight.Light) => Promise<any>;
}

// https://en.wikipedia.org/wiki/Color_temperature
const TEMPERATURE = {
  match: 1700,
  candle: 1850,
  lamp: 2400,
  white_lamp: 2550,
  soft: 2700,
  warm: 3000,
  cold_white: 6500,
};

// Default yellow not very bright light
const DEFAULT_STATE = {
  bright: 75,
  ct: TEMPERATURE.warm,
  rgb: 0xFBFF8D,
  hue: 62,
  sat: 44,
};

const reset = (lamp: Yeelight.Light) => Promise.all([
  lamp.set_bright(DEFAULT_STATE.bright),
  lamp.set_ct_abx(DEFAULT_STATE.ct),
  // If we set color temperature, then rgb and hsv is reset

  // lamp.set_rgb(DEFAULT_STATE.rgb),
  // lamp.set_hsv(DEFAULT_STATE.hue, DEFAULT_STATE.sat),
]).then(() => lamp);

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
  default: (it) => reset(it),
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
