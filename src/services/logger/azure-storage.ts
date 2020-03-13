type ConnectionData = {
    DefaultEndpointsProtocol: string;
    AccountName: string;
    AccountKey: string;
    EndpointSuffix: string;
};

export const getConnectionData = (connectionString: string): ConnectionData => {
    const connectionData: ConnectionData = {
        DefaultEndpointsProtocol: "",
        AccountName: "",
        AccountKey: "",
        EndpointSuffix: "",
    };

    connectionString.split(";").forEach(p => {
        const keyValue = p.split("=");
        const key = keyValue[0];
        const value = keyValue[1];

        connectionData[key as keyof ConnectionData] = value;
    });

    return connectionData;
};

type Data = {
    [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
};

export const insertEntity = (
    connectionData: ConnectionData,
    tableName: string,
    data: Data
): void => {
    const url = `${connectionData.DefaultEndpointsProtocol}://${connectionData.AccountName}.table.${connectionData.EndpointSuffix}/${tableName}`;

    const authorizationHeader = `SharedKey ${connectionData.AccountName}:${connectionData.AccountKey}`;

    fetch(url, {
        method: "POST",
        headers: {
            Authorization: authorizationHeader,
            "Content-Type": "application/json",
            "x-ms-date": new Date().toUTCString(),
            "Content-Length": JSON.stringify(data).length.toString(),
        },
        body: JSON.stringify(data),
    });
};
