import { v4 as uuidv4 } from "uuid";

import { UniqueDeviceID } from "@ionic-native/unique-device-id";

import { LoggerService } from "./";
import { getConnectionData, insertEntity } from "./azure-storage";

const connectionData = getConnectionData(__AZURE_STORAGE_CONNECTION_STRING__);

export class AzureStorageLoggerService implements LoggerService {
    private _tableName = "Logs";

    initialize() {
        // tableService.createTableIfNotExists(this._tableName, error => {
        //     if (error) console.log("AzureStorageLoggerService: createTableIfNotExists > ", error);
        // });
    }

    log(message: string, data?: object) {
        const entity = {
            PartitionKey: UniqueDeviceID.get(),
            RowKey: uuidv4(),
            Message: message,
            Data: data,
        };

        insertEntity(connectionData, this._tableName, entity);
    }
}
