import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { dedent as $ } from '../utils/dedent.js';
import { resetRuleMatchers, setupRuleMatchers } from '../utils/expect-rule-matchers.js';
import deepListChildrenNewline from './deep-list-children-newline.js';

describe('deep-list-children-newline', () => {
  describe('when the rule is using the default options', () => {
    beforeAll(() => {
      setupRuleMatchers(deepListChildrenNewline);
    });

    afterAll(() => {
      resetRuleMatchers();
    });

    it('should allow lists with up to 3 top level children to be in-line', () => {
      expect('const lol = { lmao: "lmao", haha: "haha", nice: "nice" };').toBeValid();
      expect('const lol = ["lmao", "haha", "nice"];').toBeValid();
      expect('const { lol, lmao, haha } = nice;').toBeValid();
      expect('const [lol, lmao, haha] = nice;').toBeValid();
    });

    it('should allow lists with up to 3 top level children to newline', () => {
      expect($`
        const lol = {
          lmao: "lmao",
          haha: "haha",
          nice: "nice"
        };
      `).toBeValid();

      expect($`
        const lol = [
          "lmao",
          "haha",
          "nice"
        ];
      `).toBeValid();

      expect($`
        const {
          lol,
          lmao,
          haha
        } = nice;
      `).toBeValid();

      expect($`
        const [
          lol,
          lmao,
          haha
       ] = nice;
      `).toBeValid();
    });

    it('should disallow lists with 4 or more top level children to be in-line', () => {
      expect('const lol = { lmao: "lmao", haha: "haha", nice: "nice", one: "one" };')
        .toFixTo($`
          const lol = {
            lmao: "lmao",
            haha: "haha",
            nice: "nice",
            one: "one"
          };
        `);

      expect('const lol = ["lmao", "haha", "nice", "one"];')
        .toFixTo($`
          const lol = [
            "lmao",
            "haha",
            "nice",
            "one"
          ];
        `);

      expect('const { lol, lmao, haha, nice } = one;')
        .toFixTo($`
          const {
            lol,
            lmao,
            haha,
            nice
          } = one;
        `);

      expect('const [ lol, lmao, haha, nice ] = one;')
        .toFixTo($`
          const [
            lol,
            lmao,
            haha,
            nice
          ] = one;
        `);

      expect('const lol = [[], "haha", "nice", "one"];')
        .toFixTo($`
          const lol = [
            [],
            "haha",
            "nice",
            "one"
          ];
        `);
    });

    it('should allow lists with 4 or more top level children to newline', () => {
      expect($`
        const lol = {
          lmao: "lmao",
          haha: "haha",
          nice: "nice",
          one: "one"
        };
      `).toBeValid();

      expect($`
        const lol = [
          "lmao",
          "haha",
          "nice",
          "one",
          "beignet"
        ];
      `).toBeValid();

      expect($`
        const {
          lol,
          lmao,
          haha,
          nice
        } = one;
      `).toBeValid();

      expect($`
        const [
          lol,
          lmao,
          haha,
          nice
        ] = one;
      `).toBeValid();
    });

    it('should disallow lists with 4 or more deep children to be in-line', () => {
      expect('const lol = { lmao: "lmao", haha: { nice: "nice", one: "one", beignet: "beignet", bri: "bri" }, huh: "huh" };')
        .toFixTo($`
          const lol = {
            lmao: "lmao",
            haha: {
              nice: "nice",
              one: "one",
              beignet: "beignet",
              bri: "bri"
            },
            huh: "huh"
          };
        `);

      expect('const lol = ["lmao", ["haha", "nice", "one", "beignet"], "bri"];')
        .toFixTo($`
          const lol = [
            "lmao",
            [
              "haha",
              "nice",
              "one",
              "beignet"
            ],
            "bri"
          ];
        `);

      expect('const { lol, lmao = { haha, nice, one, beignet }, bri } = huh;')
        .toFixTo($`
          const {
            lol,
            lmao = {
              haha,
              nice,
              one,
              beignet
            },
            bri
          } = huh;
        `);

      expect('const [lol, [lmao, haha, nice, one], beignet] = bri;')
        .toFixTo($`
          const [
            lol,
            [
              lmao,
              haha,
              nice,
              one
            ],
            beignet
          ] = bri;
        `);
    });

    it('should allow nested lists with 3 or less children to be in-line when the parent list is newlined', () => {
      expect('const lol = { lmao: "lmao", haha: { nice: "nice", one: "one", beignet: "beignet" }, bri: "bri" };')
        .toFixTo($`
          const lol = {
            lmao: "lmao",
            haha: { nice: "nice", one: "one", beignet: "beignet" },
            bri: "bri"
          };
        `);

      expect('const lol = ["lmao", ["haha", "nice", "one"], "beignet"];')
        .toFixTo($`
          const lol = [
            "lmao",
            ["haha", "nice", "one"],
            "beignet"
          ];
        `);

      expect('const { lol, lmao = { haha, nice, one }, beignet } = huh;')
        .toFixTo($`
          const {
            lol,
            lmao = { haha, nice, one },
            beignet
          } = huh;
        `);

      expect('const [lol, [lmao, haha, nice], one] = beignet;')
        .toFixTo($`
          const [
            lol,
            [lmao, haha, nice],
            one
          ] = beignet;
        `);
    });

    it('should disallow a single keyed wrapper with 4 or more deep children to be in-line', () => {
      expect('const lol = { lmao: ["haha", "nice", "one", "beignet"] };')
        .toFixTo($`
          const lol = {
            lmao: [
              "haha",
              "nice",
              "one",
              "beignet"
            ]
          };
        `);
    });

    it('should allow a single unkeyed wrapper with 4 or more deep children to be in-line', () => {
      expect('const lol = [["lmao", "haha", "nice", "one"]];')
        .toFixTo($`
          const lol = [[
            "lmao",
            "haha",
            "nice",
            "one"
          ]];
        `);
    });

    it('should count spread and rest list children deeply', () => {
      expect('const lol = ["lmao", ...["haha", "nice", "one"], "beignet"];')
        .toFixTo($`
          const lol = [
            "lmao",
            ...["haha", "nice", "one"],
            "beignet"
          ];
        `);

      expect('const [lol, ...[lmao, haha, nice]] = one;')
        .toFixTo($`
          const [
            lol,
            ...[lmao, haha, nice]
          ] = one;
        `);
    });

    it('should preserve comments when inserting newlines between children', () => {
      expect('const lol = ["lmao", /* haha */ "nice", "one", "beignet"];')
        .toFixTo($`
          const lol = [
            "lmao",
            /* haha */ "nice",
            "one",
            "beignet"
          ];
        `);
    });

    it('should fix lists that are only partially newlined', () => {
      expect($`
        const lol = ["lmao",
          "haha",
          "nice",
          "one"];
      `).toFixTo($`
        const lol = [
          "lmao",
          "haha",
          "nice",
          "one"
        ];
      `);
    });

    it('should ignore array holes when counting deep children', () => {
      expect('const lol = ["lmao", ["haha", "nice", "one", , "beignet"], "bri"];')
        .toFixTo($`
          const lol = [
            "lmao",
            [
              "haha",
              "nice",
              "one", ,
              "beignet"
            ],
            "bri"
          ];
        `);

      expect('const lol = ["lmao", ["haha", "nice", , "one"], "beignet"];')
        .toFixTo($`
          const lol = [
            "lmao",
            ["haha", "nice", , "one"],
            "beignet"
          ];
        `);
    });
  });

  describe('when the rule has minChildren set to 6', () => {
    beforeAll(() => {
      setupRuleMatchers(deepListChildrenNewline, { minChildren: 6 });
    });

    afterAll(() => {
      resetRuleMatchers();
    });

    it('should allow lists with up to 5 top level children to be in-line', () => {
      expect('const lol = { lmao: "lmao", haha: "haha", nice: "nice", one: "one", beignet: "beignet" };').toBeValid();
      expect('const lol = ["lmao", "haha", "nice", "one", "beignet"];').toBeValid();
      expect('const { lol, lmao, haha, nice, one } = beignet;').toBeValid();
      expect('const [lol, lmao, haha, nice, one] = beignet;').toBeValid();
    });

    it('should disallow lists with 6 or more deep children to be in-line', () => {
      expect('const lol = { lmao: "lmao", haha: { nice: "nice", one: "one", beignet: "beignet", bri: "bri", huh: "huh", panini: "panini" }, popeye: "popeye" };')
        .toFixTo($`
          const lol = {
            lmao: "lmao",
            haha: {
              nice: "nice",
              one: "one",
              beignet: "beignet",
              bri: "bri",
              huh: "huh",
              panini: "panini"
            },
            popeye: "popeye"
          };
        `);

      expect('const lol = ["lmao", ["haha", "nice", "one", "beignet", "bri", "huh"], "panini"];')
        .toFixTo($`
          const lol = [
            "lmao",
            [
              "haha",
              "nice",
              "one",
              "beignet",
              "bri",
              "huh"
            ],
            "panini"
          ];
        `);
    });
  });

  describe('when the rule has maxDepth set to 0', () => {
    beforeAll(() => {
      setupRuleMatchers(deepListChildrenNewline, { maxDepth: 0 });
    });

    afterAll(() => {
      resetRuleMatchers();
    });

    it('should ignore nested children when counting the parent list', () => {
      expect('const lol = { lmao: "lmao", haha: { nice: "nice", one: "one", beignet: "beignet", bri: "bri" }, huh: "huh" };')
        .toFixTo($`
          const lol = { lmao: "lmao", haha: {
            nice: "nice",
            one: "one",
            beignet: "beignet",
            bri: "bri"
          }, huh: "huh" };
        `);

      expect('const lol = ["lmao", ["haha", "nice", "one", "beignet"], "bri"];')
        .toFixTo($`
          const lol = ["lmao", [
            "haha",
            "nice",
            "one",
            "beignet"
          ], "bri"];
        `);

      expect('const lol = [["haha"], "nice", "one", "beignet"];')
        .toFixTo($`
          const lol = [
            ["haha"],
            "nice",
            "one",
            "beignet"
          ];
        `);
    });
  });
});
