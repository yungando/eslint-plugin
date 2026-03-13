import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { dedent as $ } from '../utils/dedent.js';
import { resetRuleMatchers, setupRuleMatchers } from '../utils/expect-rule-matchers.js';
import rule from './deep-list-children-newline.js';

describe('deep-list-children-newline', () => {
  describe('when the rule is using the default options', () => {
    beforeAll(() => {
      setupRuleMatchers(rule);
    });

    afterAll(() => {
      resetRuleMatchers();
    });

    it('should allow lists with up to 3 top level children to be in-line', () => {
      expect('const foo = { lol: "lol", lmao: "lmao", haha: "haha" };').toBeValid();
      expect('const foo = ["lol", "lmao", "haha"];').toBeValid();
    });

    it('should allow lists with up to 3 top level children to newline', () => {
      expect($(`
        const foo = {
          lol: "lol",
          lmao: "lmao",
          haha: "haha"
        };
      `)).toBeValid();

      expect($(`
        const foo = [
          "lol",
          "lmao",
          "haha"
        ];
      `)).toBeValid();
    });

    it('should disallow lists with 4 or more top level children to be in-line', () => {
      expect('const foo = { lol: "lol", lmao: "lmao", haha: "haha", nice: "nice" };')
        .toFixTo($(`
          const foo = {
            lol: "lol",
            lmao: "lmao",
            haha: "haha",
            nice: "nice"
          };
        `));

      expect('const foo = ["lol", "lmao", "haha", "nice"];')
        .toFixTo($(`
          const foo = [
            "lol",
            "lmao",
            "haha",
            "nice"
          ];
        `));
    });

    it('should allow lists with 4 or more top level children to newline', () => {
      expect($(`
        const foo = {
          lol: "lol",
          lmao: "lmao",
          haha: "haha",
          nice: "nice"
        };
      `)).toBeValid();

      expect($(`
        const foo = [
          "lol",
          "lmao",
          "haha",
          "nice",
          "one"
        ];
      `)).toBeValid();
    });

    it('should disallow lists with 4 or more deep children to be in-line', () => {
      expect('const foo = { lol: "lol", lmao: ["lol","lmao","haha","nice"], beignet: "beignet"};')
        .toFixTo($(`
          const foo = {
            lol: "lol",
            lmao: [
              "lol",
              "lmao",
              "haha",
              "nice"
            ],
            beignet: "beignet"
          };  
        `));

      expect('const foo = ["lol", ["lol", "lmao", "haha", "nice"], "beignet"];')
        .toFixTo($(`
          const foo = [
            "lol",
            [
              "lol",
              "lmao",
              "haha",
              "nice"
            ],
            "beignet"
          ];
        `));
    });

    it('should allow nested lists with 3 or less children to be in-line when the parent list is newlined', () => {
      expect('const lol = { lmao: "lmao", bri: { haha: "haha", nice: "nice", one: "one" }, beignet: "beignet" };')
        .toFixTo($(`
          const lol = {
            lmao: "lmao",
            bri: { haha: "haha", nice: "nice", one: "one" },
            beignet: "beignet"
          };
        `));

      expect('const lol = ["lmao", ["haha", "nice", "one"], "beignet"];')
        .toFixTo($(`
          const lol = [
            "lmao",
            ["haha", "nice", "one"],
            "beignet"
          ];
        `));
    });

    it('should ignore array holes when counting deep children', () => {
      expect('const foo = ["lol", ["lol", "lmao", "haha", , "nice"], "beignet"];')
        .toFixTo($(`
          const foo = [
            "lol",
            [
              "lol",
              "lmao",
              "haha", ,
              "nice"
            ],
            "beignet"
          ];
        `));

      expect('const foo = ["lol", ["lol", "lmao", , "nice"], "beignet"];')
        .toFixTo($(`
          const foo = [
            "lol",
            ["lol", "lmao", , "nice"],
            "beignet"
          ];
        `));
    });
  });

  describe('when the rule has minChildren set to 6', () => {
    beforeAll(() => {
      setupRuleMatchers(rule, { minChildren: 6 });
    });

    afterAll(() => {
      resetRuleMatchers();
    });

    it('should allow lists with up to 5 top level children to be in-line', () => {
      expect('const foo = { lol: "lol", lmao: "lmao", haha: "haha", nice: "nice", one: "one" };').toBeValid();
      expect('const foo = ["lol", "lmao", "haha", "nice", "one"];').toBeValid();
    });

    it('should allow lists with up to 5 top level children to newline', () => {
      expect($(`
        const foo = {
          lol: "lol",
          lmao: "lmao",
          haha: "haha",
          nice: "nice",
          one: "one",
        };
      `)).toBeValid();

      expect($(`
        const foo = [
          "lol",
          "lmao",
          "haha",
          "nice",
          "one"
        ];
      `)).toBeValid();
    });

    it('should disallow lists with 6 or more top level children to be in-line', () => {
      expect('const foo = { lol: "lol", lmao: "lmao", haha: "haha", nice: "nice", one: "one", beignet: "beignet" };')
        .toFixTo($(`
          const foo = {
            lol: "lol",
            lmao: "lmao",
            haha: "haha",
            nice: "nice",
            one: "one",
            beignet: "beignet"
          };
        `));

      expect('const foo = ["lol", "lmao", "haha", "nice", "one", "beignet"];')
        .toFixTo($(`
          const foo = [
            "lol",
            "lmao",
            "haha",
            "nice",
            "one",
            "beignet"
          ];
        `));
    });

    it('should allow lists with 6 or more top level children to newline', () => {
      expect($(`
        const foo = {
          lol: "lol",
          lmao: "lmao",
          haha: "haha",
          nice: "nice",
          one: "one",
          beignet: "beignet"
        };
      `)).toBeValid();

      expect($(`
        const foo = [
          "lol",
          "lmao",
          "haha",
          "nice",
          "one",
          "beignet"
        ];
      `)).toBeValid();
    });

    it('should disallow lists with 6 or more deep children to be in-line', () => {
      expect('const foo = { lol: "lol", lmao: { lol: "lol", lmao: "lmao", haha: "haha", nice: "nice", one: "one", beignet: "beignet" }, beignet: "beignet"};')
        .toFixTo($(`
          const foo = {
            lol: "lol",
            lmao: {
              lol: "lol",
              lmao: "lmao",
              haha: "haha",
              nice: "nice",
              one: "one",
              beignet: "beignet"
            },
            beignet: "beignet"
          };  
        `));

      expect('const foo = ["lol", ["lol", "lmao", "haha", "nice", "one", "beignet"], "beignet"];')
        .toFixTo($(`
          const foo = [
            "lol",
            [
              "lol",
              "lmao",
              "haha",
              "nice",
              "one",
              "beignet"
            ],
            "beignet"
          ];
        `));
    });

    it('should allow nested lists with 5 or less children to be in-line when the parent list is newlined', () => {
      expect('const lol = { lmao: "lmao", bri: { haha: "haha", nice: "nice", one: "one", beignet: "beignet", bri: "bri", }, beignet: "beignet" };')
        .toFixTo($(`
          const lol = {
            lmao: "lmao",
            bri: { haha: "haha", nice: "nice", one: "one", beignet: "beignet", bri: "bri", },
            beignet: "beignet"
          };
        `));

      expect('const lol = ["lmao", ["haha", "nice", "one", "beignet", "bri"], "beignet"];')
        .toFixTo($(`
          const lol = [
            "lmao",
            ["haha", "nice", "one", "beignet", "bri"],
            "beignet"
          ];
        `));
    });
  });
});
