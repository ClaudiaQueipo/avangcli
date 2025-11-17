/**
 * Custom ESLint rule to block comments that don't start with TODO, FIXME, NOTE, HACK, or XXX
 */
export default {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow comments that are not TODO, FIXME, NOTE, HACK, or XXX",
      category: "Stylistic Issues",
      recommended: true
    },
    fixable: null,
    schema: [],
    messages: {
      unexpectedComment: "Regular comments are not allowed. Use TODO:, FIXME:, NOTE:, HACK:, or XXX: instead."
    }
  },
  create(context) {
    const sourceCode = context.sourceCode || context.getSourceCode()
    const allowedPrefixes = ["TODO:", "FIXME:", "NOTE:", "HACK:", "XXX:", "TODO", "FIXME", "NOTE", "HACK", "XXX"]

    return {
      Program() {
        const comments = sourceCode.getAllComments()

        comments.forEach((comment) => {
          const trimmedValue = comment.value.trim()

          const isAllowed = allowedPrefixes.some((prefix) =>
            trimmedValue.toUpperCase().startsWith(prefix.toUpperCase())
          )

          if (
            comment.type === "Shebang" || // Allow shebang lines
            !trimmedValue ||
            trimmedValue.startsWith("!") || // Shebang lines
            trimmedValue.startsWith("/usr/bin/env") || // Alternative shebang format
            (comment.loc.start.line === 1 && trimmedValue.includes("/usr/bin/env")) || // Shebang at top
            trimmedValue.startsWith("eslint") ||
            trimmedValue.startsWith("@ts-") ||
            trimmedValue.startsWith("*") // JSDoc comments
          ) {
            return
          }

          if (!isAllowed) {
            context.report({
              loc: comment.loc,
              messageId: "unexpectedComment"
            })
          }
        })
      }
    }
  }
}
