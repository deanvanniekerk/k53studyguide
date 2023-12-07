import { LoggerService, LoggerServiceConstructor } from './types';

const createLoggerService = (ctor: LoggerServiceConstructor): LoggerService => {
  return new ctor();
};

export { createLoggerService };
