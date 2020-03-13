export interface LoggerServiceConstructor {
    new (): LoggerService;
}

export interface LoggerService {
    initialize: () => void;
    log: (message: string, data?: LogData) => void;
}

export type LogData = {
    [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
};

export type LogLevel = "DEBUG" | "INFO" | "WARNING" | "ERROR" | "DEBUG";
