export function getRequiredEnvVar(envVarName: string): string {
  const value = import.meta.env[envVarName];

  if (!value || typeof value !== 'string') {
    throw new Error(
      `[Config] Missing required environment variable: ${envVarName}`,
    );
  }

  return value;
}
