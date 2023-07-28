export const getPageTitle = (title?: string) => {
  if (title) {
    return `${title} - Party Box`;
  }

  return `Party Box`;
};
