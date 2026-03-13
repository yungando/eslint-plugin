import { Linter } from 'eslint';
import { expect } from 'vitest';
import plugin from './src/index.js';

const RuleHarnessNotConfiguredError = {
  pass: false,
  message: () => 'expected rule harness to be configured, use `setupRuleMatchers(rule);` to configure',
};

const eslintBaseConfig = {
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: {
    [plugin.meta.name]: plugin,
  },
};

const toBeValid = (received) => {
  const expectState = expect.getState();
  const expectRuleHarness = expectState.eslintRule;

  if (!expectRuleHarness) return RuleHarnessNotConfiguredError;

  const { linter, rule, options } = expectRuleHarness;

  const result = linter.verify(received, {
    ...eslintBaseConfig,
    rules: {
      [`${plugin.meta.name}/${rule.name}`]: options
        ? ['error', options]
        : 'error',
    },
  });

  const actual = result.map((lintError) => ({
    rule: lintError.ruleId,
    message: lintError.message,
    line: lintError.line,
    column: lintError.column,
  }));

  const pass = actual.length === 0;

  return {
    pass,
    message: () => 'expected code to have no linting errors',
    actual,
    expected: [],
  };
};

const toFixTo = (received, expected) => {
  const state = expect.getState();
  const expectRuleHarness = state.eslintRule;

  if (!expectRuleHarness) return RuleHarnessNotConfiguredError;

  const { linter, rule, options } = expectRuleHarness;

  const { fixed, output, messages } = linter.verifyAndFix(received, {
    ...eslintBaseConfig,
    rules: {
      [`${plugin.meta.name}/${rule.name}`]: options
        ? ['error', options]
        : 'error',
    },
  });

  if (!fixed) {
    if (messages.length) {
      const error = messages.at(0);

      return {
        pass: false,
        message: () => `input string failed to lint:\n${JSON.stringify(error, null, 2)}`,
      };
    }

    return {
      pass: false,
      message: () => 'expected string input to have linting errors and require fixing',
    };
  }

  return {
    pass: output === expected,
    actual: output,
    expected,
    message: () => 'expected fixed output to equal given `toFixTo()` input',
  };
};

const setupRuleMatchers = (rule, options) => {
  const linter = new Linter();

  expect.setState({
    ...expect.getState(),
    eslintRule: { linter, rule, options },
  });
};

const resetRuleMatchers = () => {
  const state = expect.getState();
  delete state.eslintRule;
  expect.setState(state);
};

export { resetRuleMatchers, setupRuleMatchers, toBeValid, toFixTo };
