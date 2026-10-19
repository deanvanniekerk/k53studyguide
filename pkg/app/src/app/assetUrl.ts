/** Resolve public assets at the native root or the current web app mount. */
export const assetUrl = (path: string) => `${import.meta.env.BASE_URL}assets/${path.replace(/^\/+/, "")}`;
