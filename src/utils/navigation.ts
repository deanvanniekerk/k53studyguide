export const navigationKeyToBreadcrumb = (key: string | null): string[] => {
  const breadcrumb: string[] = [];

  const split = (key || '').split('.');

  while (split.length > 0) {
    breadcrumb.push(split.join('.'));
    split.pop();
  }

  return breadcrumb.reverse();
};

export const navigateUp = (key: string | null): string => {
  if (!key) key = '';

  const split = key.split('.');

  if (split.length > 1) {
    split.pop(); //remove last
    key = split.join('.');
  }

  return key;
};
