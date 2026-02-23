import pkg from '../package.json' with { type: 'json' };
import deepListChildrenNewline from './rules/deep-list-children-newline.js';

const plugin = {
  meta: {
    name: 'ando',
    version: pkg.version,
  },
  // @keep-sorted
  rules: {
    'deep-list-children-newline': deepListChildrenNewline,
  },
};

export default plugin;
