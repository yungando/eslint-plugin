import { describe, expect, it } from 'vitest';
import { toBeValid, toFixTo } from './src/utils/expect-rule-matchers.js';

globalThis.fit = it.only;
globalThis.fdescribe = describe.only;

globalThis.xit = it.skip;
globalThis.xdescribe = describe.skip;

expect.extend({ toBeValid, toFixTo });
