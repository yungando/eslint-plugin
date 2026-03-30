# @yungando/eslint-plugin

Opinionated ESLint rules for newline consistency.

## Installation

```bash
npm i -D @yungando/eslint-plugin
```

## Usage

```js
import yungando from '@yungando/eslint-plugin';

export default [
  {
    plugins: {
      yungando,
    },
    rules: {
      'yungando/deep-list-children-newline': 'error',
    },
  },
];
```

## Rules

- `yungando/deep-list-children-newline` - Enforce placing list children on separate lines.

---

### deep-list-children-newline

Enforce placing list children on separate lines when a list has enough children, including nested children.

#### Rule Details

<!-- eslint-skip -->

```js
// 👎 bad
const foo = {
  bar: 'baz',
  qux: { a: 1, b: 2, c: 3, d: 4 },
  fez: 'fum'
}
```

<!-- eslint-skip -->

```js
// 👍 good
const foo = {
  bar: 'baz',
  qux: {
    a: 1,
    b: 2,
    c: 3,
    d: 4
  },
  fez: 'fum'
}

// 👍 good
const foo = { bar: 'baz', qux: { a: 1, b: 2, c: 3 }, fez: 'fum' }
```

This rule checks objects, arrays, object patterns, and array patterns.

By default, it requires each child to be on its own line when a list reaches `4` children. Nested lists are counted too, up to a depth of `2`.

That means a parent list can become multiline because one of its children expands into a larger nested list.

#### Options

<!-- eslint-skip -->

```js
{
  minChildren: 4,
  maxDepth: 2,
}
```

##### `minChildren`

Minimum number of children required before the list must be multiline.

<!-- eslint-skip -->

```js
// `minChildren: 6`
const foo = { a: 1, b: 2, c: 3, d: 4, e: 5 }
```

##### `maxDepth`

Maximum nesting depth used when counting children.

Set `maxDepth: 0` to count only the current list and ignore nested children.

<!-- eslint-skip -->

```js
// `maxDepth: 0`
const foo = { a: 1, b: { c: 3, d: 4, e: 5, f: 6 }, g: 7 }
```

#### Rule Conflicts

This rule may conflict with newline rules that enforce different wrapping behavior for objects and arrays, such as `object-curly-newline`, `object-property-newline`, or `array-element-newline`.

Turn off conflicting rules if needed.

```js
export default [
  {
    rules: {
      'object-curly-newline': 'off',
      'object-property-newline': 'off',
      'array-element-newline': 'off',
    },
  },
];
```
