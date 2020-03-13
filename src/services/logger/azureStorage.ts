type Data = {
    [key: string]: string;
};

export const insertEntity = (tableName: string, data: Data): void => {
    const url = `${__AZURE_STORAGE_TABLE_URL__}/${tableName}${__AZURE_STORAGE_TABLE_SAS_TOKEN__}`;

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-ms-date": new Date().toUTCString(),
            "Content-Length": JSON.stringify(data).length.toString(),
        },
        body: JSON.stringify(data),
    });
};
