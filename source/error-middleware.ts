import {NextFunction, Request, Response} from 'express';
import {WebError} from './errors/web-error';
import {ExecutionError} from '@zsmarthome/command-core';

const HTTP_NOT_FOUND_ERROR = 404;
const HTTP_INTERNAL_SERVER_ERROR = 500;

// noinspection JSUnusedLocalSymbols
export const errorHandler = (err: ExecutionError | WebError, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get(`env`) === `development` ? err : {};

  // render the error page
  res.status((err as WebError).code || HTTP_INTERNAL_SERVER_ERROR);
  const error = {title: err.name, message: err.message};
  // noinspection JSUnreachableSwitchBranches
  switch (req.accepts([`html`, `json`])) {
    case `json`:
      return res.json({status: `Error`, ...error});
    default:
      return res.render(`error`, error);
  }
};

export const errorNotFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  next(new WebError(HTTP_NOT_FOUND_ERROR, `Page was not found`));
};
