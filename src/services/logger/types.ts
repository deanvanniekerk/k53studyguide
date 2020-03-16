export interface LoggerServiceConstructor {
    new (): LoggerService;
}

export interface LoggerService {
    initialize: () => void;
    log: (level: LogLevel, message: string, data?: LogData) => void;
}

export type LogRecord = {
    PartitionKey: string;
    RowKey: string;
    Level: LogLevel;
    Message: string;
    Data: string;
};

export type LogData = {
    [key: string]: string;
};

export type LogLevel = "DEBUG" | "INFO" | "WARNING" | "ERROR" | "DEBUG";
