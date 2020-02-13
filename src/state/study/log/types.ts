export type SeenContentKeys = {
    [key: string]: boolean;
};

export type NavigationTreeItem = {
    key: string;
    children: NavigationTreeItem[];
};

export type SeenTotals = {
    [key: string]: SeenTotal;
};

export type SeenTotal = {
    seen: number;
    total: number;
};
