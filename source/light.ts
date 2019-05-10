import * as Yeelight from 'yeelight2';
import {ExecutionError} from './errors/execution-error';

const connectLamp = () => new Promise<Yeelight.Light>((success, fail) => {
  const timer = setTimeout(() => fail(new ExecutionError(`Couldn't find lamp in 2000ms`)), 2000);
  Yeelight.discover(function (myLight) {
    this.close();
    clearTimeout(timer);
    success(myLight);
  });
});

const Option: { [command: string]: (light: Yeelight.Light) => Promise<any> } = {
  on: (it) => it.set_power('on'),
  off: (it) => it.set_power('off'),
  bright: (it) => it.set_bright(75),
  normal: (it) => it.set_bright(50),
  dark: (it) => it.set_bright(30),
  red: (it) => it.set_rgb(0xFF0000),
  blue: (it) => it.set_rgb(0x0000FF),
  green: (it) => it.set_rgb(0x00FF00),
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

  return action(lamp);
};
