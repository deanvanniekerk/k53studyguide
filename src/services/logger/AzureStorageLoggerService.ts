import azure from "azure-storage";

import { LoggerService } from "./";

const tableService = azure.createTableService(__AZURE_STORAGE_CONNECTION_STRING__);
const entGen = azure.TableUtilities.entityGenerator;

export class AzureStorageLoggerService implements LoggerService {
    private _tableName = "Logs";

    initialize() {
        tableService.createTableIfNotExists(this._tableName, error => {
            if (error) console.log("AzureStorageLoggerService: createTableIfNotExists > ", error);
        });
    }

    log(message: string, data?: object) {
        const entity = {
            PartitionKey: entGen.String("part2"),
            RowKey: entGen.String("row1"),
            Message: entGen.String(message),
            Data: data,
        };

        tableService.insertEntity(this._tableName, entity, error => {
            if (error) console.log("AzureStorageLoggerService: insertEntity > ", error);
        });
    }
}
