export class WebError extends Error {
  constructor (public code: number, message: string) {
    super(message);
  }
}
