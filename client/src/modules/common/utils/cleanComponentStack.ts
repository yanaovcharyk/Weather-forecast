export function cleanComponentStack(stack?: string | null): string[] {
  if (!stack) {
    return [];
  }

  return stack
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => {
      return (
        !line.includes('node_modules') &&
        !line.includes('antd') &&
        !line.includes('react-router') &&
        !line.includes('react-dom')
      );
    });
}
