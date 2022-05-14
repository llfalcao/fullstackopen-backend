import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import morgan from 'morgan';
import logger from './logger';

const requestLogger = [
  (req: Request, res: Response, next: NextFunction) => {
    morgan.token('body', (req: Request) => JSON.stringify(req.body));
    next();
  },
  morgan(':method :url :status - :response-time ms :body'),
];

const unknownEndpoint = (req: Request, res: Response) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  logger.error(error);

  if (error.name === 'CastError') {
    if (error.path === '_id') {
      error.message = 'Invalid ID format';
    }
    return res.status(400).json({ error: error.message });
  }

  if (error.name === 'ValidationError') {
    const errorObject: { [key in string]: string } = {};
    Object.keys(error.errors).forEach(
      (key) => (errorObject[key] = error.errors[key].message),
    );
    return res.status(400).json({ errors: errorObject });
  }

  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' });
  }

  res.status(500).json('Something went wrong.');
  next(error);
};

const tokenExtractor = (request: Request) => {
  const authorization = request.headers.authorization;
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

const middlewares = {
  errorHandler,
  requestLogger,
  tokenExtractor,
  unknownEndpoint,
};

export default middlewares;
