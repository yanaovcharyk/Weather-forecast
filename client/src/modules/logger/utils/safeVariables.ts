export function safeVariables(variables: unknown) {
  try {
    if (!variables) {
      return undefined;
    }

    const str = JSON.stringify(variables);

    if (str.length > 2000) {
      return '[TRUNCATED VARIABLES]';
    }

    return JSON.parse(str);
  } catch {
    return '[UNSERIALIZABLE VARIABLES]';
  }
}
