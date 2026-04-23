import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Env, envSchema } from './env.schema';
import { configuration } from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,

      validate: (env) => {
        const parsed = envSchema.safeParse(env);

        if (!parsed.success) {
          console.error('Invalid ENV config');
          console.error(parsed.error.format());
          throw new Error('Invalid environment variables');
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
