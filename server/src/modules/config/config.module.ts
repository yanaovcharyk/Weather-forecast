import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { Env, envSchema } from './env.schema';
import { configuration } from './configuration';

const envFile = process.env.ENV_FILE ?? '.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [envFile],

      validate: (env) => {
        const parsed = envSchema.safeParse(env);

        if (!parsed.success) {
          const details = parsed.error.issues
            .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
            .join('; ');

          throw new Error(`Invalid environment variables: ${details}`);
        }

        return parsed.data;
      },

      load: [
        () => configuration(envSchema.parse(process.env) as Env),
      ],
    }),
  ],
})
export class AppConfigModule {}
