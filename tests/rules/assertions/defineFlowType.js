import {
  ESLint,
  RuleTester,
} from 'eslint';

import {
  getBuiltinRule,
} from '../../../src/utilities/getBuiltinRule';

const noUndefRule = getBuiltinRule('no-undef');
const noUnusedVars = getBuiltinRule('no-unused-vars');

const VALID_WITH_DEFINE_FLOW_TYPE = [
  {
    code: 'var a: AType',
    errors: [
      '\'AType\' is not defined.',
    ],
  },
  {
    code: 'var a: AType; var b: AType',
    errors: [
      '\'AType\' is not defined.',
      '\'AType\' is not defined.',
    ],
  },
  {
    code: 'var a; (a: AType)',
    errors: [
      '\'AType\' is not defined.',
    ],
  },
  {
    code: 'var a: AType<BType>',
    errors: [
      '\'AType\' is not defined.',
      '\'BType\' is not defined.',
    ],
  },
  {
    code: 'type A = AType',
    errors: [
      '\'AType\' is not defined.',
    ],
  },
  {
    code: 'declare type A = number',
    errors: [
      '\'A\' is not defined.',
    ],
  },
  {
    code: 'opaque type A = AType',
    errors: [
      // Complaining about 'A' is fixed in https://github.com/babel/babel-eslint/pull/696
      '\'A\' is not defined.',
      '\'AType\' is not defined.',
    ],
  },
  {
    code: 'function f(a: AType) {}',
    errors: [
      '\'AType\' is not defined.',
    ],
  },
  {
    code: 'function f(a: AType.a) {}',
    errors: [
      '\'AType\' is not defined.',
    ],
  },
  {
    code: 'function f(a: AType.a.b) {}',
    errors: [
      '\'AType\' is not defined.',
    ],
  },
  {
    code: 'function f(a): AType {}; var a: AType',
    errors: [
      '\'AType\' is not defined.',
      '\'AType\' is not defined.',
    ],
  },
  {
    code: 'function f(a): AType {}',
    errors: [
      '\'AType\' is not defined.',
    ],
  },
  {
    code: 'class C { a: AType }',
    errors: [
      '\'AType\' is not defined.',
    ],
  },
  {
    code: 'class C { a: AType.a }',
    errors: [
      '\'AType\' is not defined.',
    ],
  },
  {
    code: 'class C { a: AType.a.b }',
    errors: [
      '\'AType\' is not defined.',
    ],
  },
  {
    code: 'class C implements AType {}',
    errors: [
      '\'AType\' is not defined.',
    ],
  },
  {
    code: 'declare interface A {}',
    errors: [
      '\'A\' is not defined.',
    ],
  },
  {
    code: '({ a: ({b() {}}: AType) })',

    // `AType` appears twice in `globalScope.through` as distinct
    // references, this may be a babel-eslint bug.
    errors: [
      '\'AType\' is not defined.',
      '\'AType\' is not defined.',
    ],
  },
  {
    code: 'type X = {Y<AType>(): BType}',
    errors: [
      '\'AType\' is not defined.',
      '\'BType\' is not defined.',
    ],
  },

  // This tests to ensure we have a robust handling of @flow comments
  {
    code: `
/**
* Copyright 2019 no corp
* @flow
*/
type Foo = $ReadOnly<{}>`,
    errors: [
      '\'$ReadOnly\' is not defined.',
    ],
    settings: {
      'ft-flow': {
        onlyFilesWithFlowAnnotation: true,
      },
    },
  },

  // Enum types
  {
    code: 'enum Status { Active, Paused }',
    errors: [
      '\'Status\' is not defined.',
      '\'Active\' is not defined.',
      '\'Paused\' is not defined.',
    ],
  },
  {
    // eslint-disable-next-line quotes
    code: `enum Status { Active = 'active', Paused = 'paused' }`,
    errors: [
      '\'Status\' is not defined.',
      '\'Active\' is not defined.',
      '\'Paused\' is not defined.',
    ],
  },
  {
    // eslint-disable-next-line quotes
    code: `enum Status { Active = 1, Paused = 2 }`,
    errors: [
      '\'Status\' is not defined.',
      '\'Active\' is not defined.',
      '\'Paused\' is not defined.',
    ],
  },
];

const UNUSED_BUT_VALID_WITH_DEFINE_FLOW_TYPE = [
  {
    code: 'type A = AType',
    errors: [
      '\'A\' is not defined.',
    ],
  },
  {
    code: 'declare type A = number',
    errors: [
      '\'A\' is not defined.',
    ],
  },
  {
    code: 'opaque type A = AType',
    errors: [
      // Complaining about 'A' is fixed in https://github.com/babel/babel-eslint/pull/696
      '\'A\' is not defined.',
      '\'AType\' is not defined.',
    ],
  },
  {
    code: 'function f(a: AType) {}',
    errors: [
      '\'AType\' is not defined.',
    ],
  },
  {
    code: 'function f(a: AType.a) {}',
    errors: [
      '\'AType\' is not defined.',
    ],
  },
  {
    code: 'function f(a: AType.a.b) {}',
    errors: [
      '\'AType\' is not defined.',
    ],
  },
  {
    code: 'function f(a): AType {}; var a: AType',
    errors: [
      '\'AType\' is not defined.',
      '\'AType\' is not defined.',
    ],
  },
  {
    code: 'function f(a): AType {}',
    errors: [
      '\'AType\' is not defined.',
    ],
  },
  {
    code: 'class C { a: AType }',
    errors: [
      '\'AType\' is not defined.',
    ],
  },
  {
    code: 'class C { a: AType.a }',
    errors: [
      '\'AType\' is not defined.',
    ],
  },
  {
    code: 'class C { a: AType.a.b }',
    errors: [
      '\'AType\' is not defined.',
    ],
  },
  {
    code: 'class C implements AType {}',
    errors: [
      '\'AType\' is not defined.',
    ],
  },
  {
    code: 'declare interface A {}',
    errors: [
      '\'A\' is not defined.',
    ],
  },
  {
    code: '({ a: ({b() {}}: AType) })',

    // `AType` appears twice in `globalScope.through` as distinct
    // references, this may be a babel-eslint bug.
    errors: [
      '\'AType\' is not defined.',
      '\'AType\' is not defined.',
    ],
  },
  {
    code: 'type X = {Y<AType>(): BType}',
    errors: [
      '\'AType\' is not defined.',
      '\'BType\' is not defined.',
    ],
  },

  // This tests to ensure we have a robust handling of @flow comments
  {
    code: `
/**
* Copyright 2019 no corp
* @flow
*/
type Foo = $ReadOnly<{}>`,
    errors: [
      '\'Foo\' is defined but never used.',
    ],
    settings: {
      'ft-flow': {
        onlyFilesWithFlowAnnotation: true,
      },
    },
  },

  // Enum types
  {
    code: 'enum Status { Active, Paused }',
    errors: [
      '\'Status\' is defined but never used.',
    ],
  },
  {
    // eslint-disable-next-line quotes
    code: `enum Status { Active = 'active', Paused = 'paused' }`,
    errors: [
      '\'Status\' is defined but never used.',
    ],
  },
  {
    code: 'enum Status { Active = 1, Paused = 2 }',
    errors: [
      '\'Status\' is defined but never used.',
      // {
      //   message: '\'Status\' is defined but never used.',
      // },
    ],
    rules: {
      'define-flow-type': 1,
    },
  },
];

const ALWAYS_INVALID = [
  {
    code: 'var a = b',
    errors: [
      '\'b\' is not defined.',
    ],
  },
  {
    code: 'function f(a = b) {}',
    errors: [
      '\'b\' is not defined.',
    ],
  },
  {
    code: 'class C extends b {}',
    errors: [
      '\'b\' is not defined.',
    ],
  },
  {
    code: 'class C { static S = b }',
    errors: [
      '\'b\' is not defined.',
    ],
  },
];

const ALWAYS_VALID = [
  'var a: string',
  'var a: Array',
  'var a: Array<string>',
  'type A = Array',

  // This complains about 'A' not being defined. It might be an upstream bug
  // 'opaque type A = Array',
  'function f(a: string) {}',
  'function f(a): string {}',
  'class C { a: string }',
  'var AType = {}; class C { a: AType.a }',
  'declare module A { declare var a: AType }',
];

/**
 * This rule is tested differently than the rest because `RuleTester` is
 * designed to test rule reporting and define-flow-type doesn't report
 * anything. define-flow-type suppresses reports from no-undef. So we're
 * actually testing no-undef's reporting with define-flow-type enabled.
 */
// {
//   const ruleTester = new RuleTester({
//     parser: require.resolve('@babel/eslint-parser'),
//     parserOptions: {
//       babelOptions: {
//         plugins: [
//           'babel-plugin-transform-flow-enums',
//           '@babel/plugin-syntax-flow',
//         ],
//       },
//       requireConfigFile: false,
//     },
//   });

//   ruleTester.run('no-undef must not trigger an error in these cases', noUndefRule, {
//     invalid: [],
//     valid: ALWAYS_VALID,
//   });
// }

// {
//   const ruleTester = new RuleTester({
//     parser: require.resolve('@babel/eslint-parser'),
//     parserOptions: {
//       babelOptions: {
//         plugins: [
//           'babel-plugin-transform-flow-enums',
//           '@babel/plugin-syntax-flow',
//         ],
//       },
//       requireConfigFile: false,
//     },
//   });

//   ruleTester.run('no-undef must trigger an error when define-flow-type is not used in these cases', noUndefRule, {
//     invalid: [
//       ...ALWAYS_INVALID,
//       ...VALID_WITH_DEFINE_FLOW_TYPE,
//     ],
//     valid: [],
//   });
// }

export const customRunners = async (parser) => {
  const eslint = new ESLint({
    useEslintrc: false,
    overrideConfig: {
      parser: require.resolve(parser),
      rules: {
        "define-flow-type": "error",
        "no-unused-vars": "error",
      },
    },
    parser: {
      "ft-flow": {
        rules: {
          "define-flow-type": require("../../../src/rules/defineFlowType"),
        },
      },
    }
  });

  const exit = (message) => {
    console.error(message);
    process.exit(2);
  };

  await Promise.all(
    UNUSED_BUT_VALID_WITH_DEFINE_FLOW_TYPE.map(async (subject) => {
      const [result] = await eslint.lintText(subject.code);

      console.log('hihiih');
      if (result.errorCount.length === 0) {
        exit('No errors found');
      }
      console.log('hihi');
      if (result.messages.length === subject.errors.length) {
        console.log(subject.errors)
        subject.errors.forEach((error, ind) => {
          console.log(error, result.messages[ind].message)
          if (error !== result.messages[ind].message) {
            exit(`Error ${error} does not match ${result.messages[ind].message}`);
          }
        })
      } else {
        console.error(result);
        exit(`${result.source} - expected ${subject.errors.length} errors but found ${result.messages.length}`);
      }
    })
  );
};

export default {
  invalid: [],
  valid: [
    // ...VALID_WITH_DEFINE_FLOW_TYPE.map((subject) => ({
    //   code: subject.code,
    //   rules: {
    //     'no-undef': 2,
    //   },
    //   settings: subject.settings,
    // })),
    // ...VALID_WITH_DEFINE_FLOW_TYPE.map((subject) => ({
    //   code: subject.code,
    //   rules: {
    //     'no-undef': 2,
    //     'no-use-before-define': [
    //       2,
    //       'nofunc',
    //     ],
    //     'no-unused-vars': ['error', { argsIgnorePattern: '^_', ignoreRestSiblings: true }],
    //   },
    //   settings: subject.settings,
    // })),
  ],
};
