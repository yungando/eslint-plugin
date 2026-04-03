# @yungando/eslint-plugin

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

- `yungando/deep-list-children-newline` - enforce placing list children on new lines.

---

### deep-list-children-newline

Ensures objects, arrays, object patterns, and array patterns become multiline once the number of nested children reach the threshold.

<!-- eslint-skip -->

```js
// bad: disallowed
const badObject = { foo: 'foo', bar: 'bar', baz: 'baz', qux: 'qux' };

// fix: auto-fixed form
const badObject = {
  foo: 'foo',
  bar: 'bar',
  baz: 'baz',
  qux: 'qux'
};

// bad: nested children also count toward the limit
const invalidNested = { foo: 'foo', bar: { a: 1, b: 2, c: 3, d: 4 }, baz: 'baz' };

// fix: becomes multiline because the nested object has four children
const object = {
  foo: 'foo',
  bar: {
    a: 1,
    b: 2,
    c: 3,
    d: 4
  },
  baz: 'baz'
};
```

- Multi-line parents can keep shorter nested lists inline:

<!-- eslint-skip -->

```js
const object = {
  foo: 'foo',
  bar: { a: 1, b: 2, c: 3 },
  baz: 'baz'
};

const array = [
  'foo',
  ['bar', 'baz', 'qux'],
  'quux'
];
```

#### Options

Pass an options object to tune the thresholds (defaults shown):

<!-- eslint-skip -->

```js
{
  minChildren: 4,
  maxDepth: 2,
}
```

##### `minChildren`

Raise the inline allowance before multiline wrapping kicks in. With `minChildren: 6`, five siblings can stay inline, but deep children are still counted:

<!-- eslint-skip -->

```js
// ok when minChildren: 6
const object = { foo: 'foo', bar: 'bar', baz: 'baz', qux: 'qux', quux: 'quux' };

// bad: becomes multiline because the nested object has six entries
const object = {
  foo: 'foo',
  bar: {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: 5,
    f: 6
  },
  baz: 'baz'
};
```

##### `maxDepth`

Control how deep nested children are counted. With `maxDepth: 0`, only the direct siblings matter:

<!-- eslint-skip -->

```js
// ok when maxDepth: 0
const object = {
  foo: 'foo',
  bar: {
    a: 1,
    b: 2,
    c: 3,
    d: 4
  },
  baz: 'baz'
};

// bad: four direct children
const object = {
  foo: ['bar'],
  baz: 'baz',
  qux: 'qux',
  quux: 'quux'
};
```

#### Rule conflicts

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
