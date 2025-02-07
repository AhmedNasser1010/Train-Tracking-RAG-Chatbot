export const detectSQLInjection = (query: string) => {
  const injectionPatterns = [
    /(--|#|\/\*).*$/,
    /\b(OR|AND)\b\s+\d+=\d+/i,
    /\bUNION\b\s+SELECT\b/i,
    /\bSLEEP\((\d+|\d+\.\d+)\)/i,
    /;.*(--|#|\/\*)/,
    /;[^\s]/,
    /\bINFORMATION_SCHEMA\b/i
  ];

  for (const pattern of injectionPatterns) {
    if (pattern.test(query)) {
      return {
        isInjection: true,
        message: "Potential SQL injection detected.",
        matchedPattern: pattern.toString(),
      };
    }
  }

  return {
    isInjection: false,
    message: "Query looks safe.",
  };
}
