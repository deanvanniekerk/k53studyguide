import { v4 as uuidv4 } from "uuid";

import { Device } from "@ionic-native/device";

import { insertEntity } from "../azureStorage";
import { LoggerService, LogLevel, LogRecord } from "./";

export class AzureStorageLoggerService implements LoggerService {
    private _tableName = "Logs";
    private _deviceId = "";

    async initialize() {
        this._deviceId = Device.uuid || "no-device-id";
    }

    log(level: LogLevel, message: string, data?: object) {
        const entity: LogRecord = {
            PartitionKey: this._deviceId,
            RowKey: uuidv4(),
            Level: level,
            Message: message,
            Data: data ? JSON.stringify(data) : "",
        };

        insertEntity(this._tableName, entity).then(success => {
            if (!success) console.log("Error writing log record");
        });
    }
}
