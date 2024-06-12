const parseType = (unknown) => {
  if (['home', 'personal', 'work'].includes(unknown)) return unknown;
};

const parseBoolean = (unknown) => {
  if (!['true', 'false'].includes(unknown)) return;

  return unknown === 'true' ? true : false;
};
export const parseFilters = (query) => {
  return {
    type: parseType(query.type),
    isFavourite: parseBoolean(query.isFavourite),
  };
};
