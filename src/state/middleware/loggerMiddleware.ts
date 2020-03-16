import { AnyAction, Dispatch } from "redux";

import { AzureStorageLoggerService, createLoggerService, LogLevel } from "@/services";
import { RecieveLogMessageAction } from "@/state/log";

const logger = createLoggerService(AzureStorageLoggerService);
logger.initialize();

const getLevel = (level: LogLevel | "NONE"): number => {
    switch (level) {
        case "DEBUG":
            return 4;
        case "INFO":
            return 3;
        case "WARNING":
            return 2;
        case "ERROR":
            return 1;
        default:
            return 0;
    }
};

export default () => (next: Dispatch) => (action: AnyAction) => {
    //Dont log redux persit actions
    if (action.type.indexOf("persist/") === 0) return next(action);

    if (action.type === "LOG_RECIEVE_MESSAGE") {
        const a = action as RecieveLogMessageAction;

        const actionLogLevel = getLevel(a.payload.level);
        const logLevel = getLevel(__LOG_LEVEL__);

        if (actionLogLevel <= logLevel)
            logger.log(a.payload.level, a.payload.message, a.payload.data);
    } else {
        if (__LOG_LEVEL__ === "DEBUG") {
            logger.log("DEBUG", `Redux Action: ${action.type}`, action);
        }
    }

    return next(action);
};
