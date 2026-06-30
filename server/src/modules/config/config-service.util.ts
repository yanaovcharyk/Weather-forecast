import { ConfigService, Path, PathValue } from '@nestjs/config';

export function getConfig<TConfig, TPath extends Path<TConfig>>(
  config: ConfigService<TConfig>,
  path: TPath,
): PathValue<TConfig, TPath> | undefined {
  return config.get(path, { infer: true });
}

export function getRequiredConfig<TConfig, TPath extends Path<TConfig>>(
  config: ConfigService<TConfig>,
  path: TPath,
): PathValue<TConfig, TPath> {
  return config.getOrThrow(path, { infer: true }) as PathValue<TConfig, TPath>;
}
