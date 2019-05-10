export class ExecutionError extends Error {
  constructor (message: string) {
    super(message);
    this.name = `Execution Error`;
  }
}
