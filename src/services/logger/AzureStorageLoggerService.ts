import { v4 as uuidv4 } from "uuid";

import { UniqueDeviceID } from "@ionic-native/unique-device-id";

import { LoggerService } from "./";
import { insertEntity } from "./azureStorage";

export class AzureStorageLoggerService implements LoggerService {
    private _tableName = "Logs";
    private _deviceId = "";

    async initialize() {
        this._deviceId = await UniqueDeviceID.get();
    }

    log(message: string, data?: object) {
        const entity = {
            PartitionKey: this._deviceId || "no-device-id",
            RowKey: uuidv4(),
            Message: message,
            Data: data ? JSON.stringify(data) : "",
        };

        insertEntity(this._tableName, entity);
    }
}
