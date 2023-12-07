import { LogData, LogLevel } from '@/services';

export const LOG_RECIEVE_MESSAGE = 'LOG_RECIEVE_MESSAGE';

export interface RecieveLogMessageAction {
  type: typeof LOG_RECIEVE_MESSAGE;
  payload: {
    level: LogLevel;
    message: string;
    data?: LogData;
  };
}

export const recieveLogMessage = (level: LogLevel, message: string, data?: LogData): RecieveLogMessageAction => ({
  type: LOG_RECIEVE_MESSAGE,
  payload: {
    level,
    message,
    data,
  },
});
