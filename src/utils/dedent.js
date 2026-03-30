const leadingWhitespace = /^ {2,}/gm;

// eslint-disable-next-line import/prefer-default-export
export const dedent = (strings) => {
  const str = typeof strings === 'string'
    ? strings
    : strings[0];

  return str.replace(leadingWhitespace, '').trim();
};
