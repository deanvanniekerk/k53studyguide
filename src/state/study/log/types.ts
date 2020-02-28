export type SeenContentKeys = {
    [key: string]: boolean;
};

export type SeenTotals = {
    [key: string]: SeenTotal;
};

export type SeenTotal = {
    seen: number;
    total: number;
};
