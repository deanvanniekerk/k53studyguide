type Data = {
  PartitionKey: string;
  RowKey: string;
  [key: string]: string | boolean | number;
};

//https://docs.microsoft.com/en-us/rest/api/storageservices/table-service-rest-api

export const insertEntity = (tableName: string, data: Data): Promise<boolean> => {
  const url = `${__AZURE_STORAGE_TABLE_URL__}/${tableName}?${__AZURE_STORAGE_TABLE_SAS_TOKEN__}`;

  return new Promise((resolve) => {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-ms-date': new Date().toUTCString(),
        'Content-Length': JSON.stringify(data).length.toString(),
      },
      body: JSON.stringify(data),
    }).then((response) => {
      resolve(response.ok);
    });
  });
};

export const query = <T>(tableName: string, partitionKey: string, selectKeys: string[]): Promise<T[]> => {
  let url = `${__AZURE_STORAGE_TABLE_URL__}/${tableName}()`;
  url = `${url}?$filter=(PartitionKey+eq+%27${partitionKey}%27)`;
  url = `${url}&$select=${selectKeys.join(',')}`;
  url = `${url}&${__AZURE_STORAGE_TABLE_SAS_TOKEN__}`;

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json;odata=nometadata',
        'x-ms-date': new Date().toUTCString(),
      },
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => resolve(data.value));
      } else reject();
    });
  });
};
