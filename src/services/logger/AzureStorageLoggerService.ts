import { AppVersion } from '@awesome-cordova-plugins/app-version';
import { Device } from '@awesome-cordova-plugins/device';
import { v4 as uuidv4 } from 'uuid';
import { insertEntity } from '../azureStorage';
import { LoggerService, LogLevel, LogRecord } from './';

export class AzureStorageLoggerService implements LoggerService {
  private readonly _tableName = 'Logs';
  private _appVersionNumber = '';

  async initialize() {
    this._appVersionNumber = await AppVersion.getVersionNumber();
  }

  log(level: LogLevel, message: string, data?: unknown) {
    const entity: LogRecord = {
      PartitionKey: Device.uuid || 'no-device-id',
      RowKey: uuidv4(),
      Level: level,
      Platform: Device.platform,
      AppVersionNumber: this._appVersionNumber,
      DeviceModel: Device.model,
      DeviceVersion: Device.version,
      Message: message,
      Data: data ? JSON.stringify(data) : '',
    };

    console.log(`Logging to Azure Storage: ${JSON.stringify(entity)}`);

    insertEntity(this._tableName, entity).then((success) => {
      if (!success) console.log('Error writing log record');
    });
  }
}
