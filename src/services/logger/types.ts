export interface LoggerServiceConstructor {
    new (): LoggerService;
}

export interface LoggerService {
    initialize: () => void;
    log: (message: string, data?: LogData) => void;
}

export type LogRecord = {
    PartitionKey: string;
    RowKey: string;
    Message: string;
    Data: string;
};

export type LogData = {
    [key: string]: string;
};

export type LogLevel = "DEBUG" | "INFO" | "WARNING" | "ERROR" | "DEBUG";
