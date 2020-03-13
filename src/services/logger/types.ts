export interface LoggerServiceConstructor {
    new (): LoggerService;
}

export interface LoggerService {
    initialize: () => void;
    log: (message: string, data?: never) => void;
}
