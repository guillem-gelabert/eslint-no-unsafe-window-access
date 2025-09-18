import {
  ESLintUtils,
  AST_NODE_TYPES,
  type TSESTree,
} from "@typescript-eslint/utils";

const isImportMetaClient = (node: TSESTree.Node): boolean => {
  return (
    node.type === AST_NODE_TYPES.MemberExpression &&
    node.object.type === AST_NODE_TYPES.MetaProperty &&
    node.object.meta.name === "import" &&
    node.object.property.name === "meta" &&
    node.property.type === AST_NODE_TYPES.Identifier &&
    node.property.name === "client"
  );
};

const isProcessClient = (node: TSESTree.Node): boolean => {
  return (
    node.type === AST_NODE_TYPES.MemberExpression &&
    node.object.type === AST_NODE_TYPES.Identifier &&
    node.object.name === "process" &&
    node.property.type === AST_NODE_TYPES.Identifier &&
    node.property.name === "client"
  );
};

const isWindowCheck = (node: TSESTree.Node): boolean => {
  if (node.type === AST_NODE_TYPES.Identifier && node.name === "window") {
    return true;
  }
  if (node.type === AST_NODE_TYPES.UnaryExpression && node.operator === "!") {
    return isWindowCheck(node.argument);
  }
  if (node.type === AST_NODE_TYPES.BinaryExpression) {
    return (
      (node.operator === "!==" || node.operator === "===") &&
      ((node.left.type === AST_NODE_TYPES.UnaryExpression &&
        node.left.operator === "typeof" &&
        node.left.argument.type === AST_NODE_TYPES.Identifier &&
        node.left.argument.name === "window") ||
        (node.right.type === AST_NODE_TYPES.UnaryExpression &&
          node.right.operator === "typeof" &&
          node.right.argument.type === AST_NODE_TYPES.Identifier &&
          node.right.argument.name === "window"))
    );
  }
  return false;
};

const isWindow = (node: TSESTree.Identifier) => {
  return node.name === "window";
};

const isClientGuard = (node: TSESTree.Node): boolean => {
  if (
    isImportMetaClient(node) ||
    isProcessClient(node) ||
    isWindowCheck(node)
  ) {
    return true;
  }

  if (node.type === AST_NODE_TYPES.LogicalExpression) {
    return isClientGuard(node.left) || isClientGuard(node.right);
  }

  if (node.type === AST_NODE_TYPES.BinaryExpression) {
    return isClientGuard(node.left) || isClientGuard(node.right);
  }

  return false;
};

const isInClientGuard = (
  node: TSESTree.Node,
  ancestors: TSESTree.Node[]
): boolean => {
  // Check if we're inside an if statement with client guard
  for (const ancestor of ancestors) {
    if (ancestor.type === AST_NODE_TYPES.IfStatement) {
      if (isClientGuard(ancestor.test)) {
        return true;
      }
    }

    // Check ternary operators
    if (ancestor.type === AST_NODE_TYPES.ConditionalExpression) {
      if (isClientGuard(ancestor.test)) {
        return true;
      }
    }

    // Check logical AND expressions
    if (
      ancestor.type === AST_NODE_TYPES.LogicalExpression &&
      ancestor.operator === "&&"
    ) {
      if (isClientGuard(ancestor.left)) {
        return true;
      }
    }
  }

  return false;
};

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://example.com/rule/${name}`
);

const rule = createRule({
  name: "no-unsafe-window-access",
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow unsafe access to the `window` object without client-side guards",
    },
    fixable: "code",
    schema: [],
    messages: {
      unsafeWindowAccess:
        "Unsafe access to `window` object. Wrap in a client-side check like `if (typeof window !== 'undefined')` or `if (import.meta.client)`",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      Identifier(node) {
        if (isWindow(node)) {
          const ancestors = context.sourceCode.getAncestors(node);
          const isSafe = isInClientGuard(node, ancestors);
          if (!isSafe) {
            context.report({
              node,
              messageId: "unsafeWindowAccess",
            });
          }
        }
      },
    };
  },
});

export default rule;
