export default {
  name: 'deep-list-children-newline',
  meta: {
    type: 'layout',
    docs: { description: 'Enforce placing list children on separate lines.' },
    fixable: 'whitespace',
    schema: [{
      type: 'object',
      properties: {
        minChildren: { type: 'integer', minimum: 1 },
        maxDepth: { type: 'integer', minimum: 0 },
      },
      additionalProperties: false,
    }],
    defaultOptions: [{ minChildren: 4, maxDepth: 2 }],
    messages: {
      childrenOnNewline: 'List should be multiline.',
    },
  },
  create: (context) => {
    const [{ minChildren, maxDepth }] = context.options;

    const LIST_TYPES = new Set([
      'ObjectExpression',
      'ObjectPattern',
      'ArrayExpression',
      'ArrayPattern',
    ]);

    const getChildren = (node) => {
      switch (node.type) {
        case 'ArrayExpression':
        case 'ArrayPattern':
          return node.elements || [];

        case 'ObjectExpression':
        case 'ObjectPattern':
          return node.properties || [];

        default:
          return [];
      }
    };

    const shouldSkipSingleChild = (children) => (
      children.length === 1 && children.at(0).type !== 'Property'
    );

    const unwrapNode = (node) => {
      switch (node.type) {
        case 'Property':
          return unwrapNode(node.value);

        case 'SpreadElement':
        case 'RestElement':
          return unwrapNode(node.argument);

        case 'AssignmentPattern':
          return unwrapNode(node.right);

        default:
          return node;
      }
    };

    const countChildrenDeep = (items, depth = 0) => {
      if (!items || depth > maxDepth) return 0;
      let count = 0;

      for (const item of items) {
        const nestedNode = unwrapNode(item);

        if (LIST_TYPES.has(nestedNode.type)) {
          const children = getChildren(nestedNode).filter(Boolean);
          count += countChildrenDeep(children, depth + 1);
        }

        count += 1;
        if (count >= minChildren) break;
      }

      return count;
    };

    const isOnSameLine = (firstNode, secondNode) => (
      firstNode?.loc.end.line === secondNode?.loc.start.line
    );

    const replaceRangeWithNewline = (fixer, firstNode, secondNode) => {
      const tokens = context.sourceCode.getTokensBetween(
        firstNode,
        secondNode,
        { includeComments: true },
      );

      const firstComment = tokens
        .find((token) => token.type === 'Block' || token.type === 'Line');

      const rangeStart = firstNode.range[1];
      const rangeEnd = firstComment?.range[0] ?? secondNode.range[0];

      return fixer.replaceTextRange([rangeStart, rangeEnd], '\n');
    };

    const checkNode = (node) => {
      const children = getChildren(node).filter(Boolean);
      if (!children || shouldSkipSingleChild(children)) return;

      const childrenCount = countChildrenDeep(children);
      if (childrenCount < minChildren) return;

      const openingToken = context.sourceCode.getFirstToken(node);
      const closingToken = context.sourceCode.getLastToken(node);

      for (const [index, item] of children.entries()) {
        const currentFirstToken = context.sourceCode.getFirstToken(item);
        if (!currentFirstToken) continue;

        const previousToken = index === 0
          ? openingToken
          : context.sourceCode.getTokenBefore(currentFirstToken);

        if (!previousToken) continue;

        if (isOnSameLine(previousToken, currentFirstToken)) {
          context.report({
            node: item,
            loc: currentFirstToken.loc,
            messageId: 'childrenOnNewline',
            fix: (fixer) => replaceRangeWithNewline(fixer, previousToken, currentFirstToken),
          });
        }
      }

      const lastChild = children.at(-1);
      const lastChildLastToken = context.sourceCode.getLastToken(lastChild);

      if (lastChildLastToken && isOnSameLine(lastChildLastToken, closingToken)) {
        context.report({
          node: lastChild,
          loc: closingToken.loc,
          messageId: 'childrenOnNewline',
          fix: (fixer) => replaceRangeWithNewline(fixer, lastChildLastToken, closingToken),
        });
      }
    };

    return {
      ArrayExpression: checkNode,
      ArrayPattern: checkNode,
      ObjectExpression: checkNode,
      ObjectPattern: checkNode,
    };
  },
};
