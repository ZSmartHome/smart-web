import {exec} from 'child_process';
import {ExecutionError} from './errors/execution-error';

export const shell = (command: string): Promise<string> => {
  return new Promise((onSuccess, onFail) => {
    console.log(`Calling command: ${command}`);
    exec(command,
      (error: Error | null, stdout: string, stderr: string) => {
        console.log(`Command: ${command} complete`, error, stdout, stderr);
        if (error) {
          onFail(new ExecutionError(`exec error: ${error}`));
          return;
        }
        let message;
        if (stdout || stderr) {
          message = `stdout: ${stdout}\nstderr: ${stderr}`;
        } else {
          message = `Command complete`;
        }
        onSuccess(message);
      });
  });
};

export const split = (buttons: any[], ...rows: number[]): any[][] => {
  if (rows.length <= 0 || rows.length > 10) {
    throw new Error(`Invalid rows argument. Should be interval of 0..10`);
  }

  const result: any[][] = [[]];

  let currentRow = 0; // will be increased to 0 on first element
  let rowCount = rows[currentRow];
  for (let i = 0; i < buttons.length; i++) {
    if (i >= rowCount) {
      const nextRow = rows[currentRow + 1];
      if (nextRow > 0) {
        currentRow++;
        // move to next row
        rowCount += nextRow;
        result[currentRow] = [];
      } else {
        // overflow current row
        rowCount += buttons.length;
      }
    }
    result[currentRow].push(buttons[i]);
  }
  return result;
};
