export const navigationKeyToBreadcrumb = (key: string): string[] => {
    const breadcrumb: string[] = [];

    const split = (key || "").split(".");

    while (split.length > 0) {
        breadcrumb.push(split.join("."));
        split.pop();
    }

    return breadcrumb.reverse();
};
