import { MigrationInterface, QueryRunner } from 'typeorm';

export class SplitUserAuth1720000000003 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS user_auth (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        "passwordHash" VARCHAR NOT NULL,
        salt VARCHAR NOT NULL,
        "refreshTokenVersion" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'user_auth' AND column_name = 'passwordHash'
        ) THEN
          ALTER TABLE user_auth ADD COLUMN "passwordHash" VARCHAR;
        END IF;

        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'users' AND column_name = 'password'
        ) THEN
          IF EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'users' AND column_name = 'salt'
          ) THEN
            INSERT INTO user_auth (
              "userId",
              "passwordHash",
              salt,
              "refreshTokenVersion",
              "createdAt",
              "updatedAt"
            )
            SELECT
              id,
              password,
              salt,
              "refreshTokenVersion",
              "createdAt",
              "updatedAt"
            FROM users
            ON CONFLICT ("userId") DO UPDATE
            SET
              "passwordHash" = COALESCE(user_auth."passwordHash", EXCLUDED."passwordHash"),
              salt = COALESCE(user_auth.salt, EXCLUDED.salt),
              "refreshTokenVersion" = EXCLUDED."refreshTokenVersion";
          END IF;

          UPDATE user_auth
          SET "passwordHash" = users.password
          FROM users
          WHERE user_auth."userId" = users.id
            AND user_auth."passwordHash" IS NULL;

          ALTER TABLE users DROP COLUMN IF EXISTS password;
          ALTER TABLE users DROP COLUMN IF EXISTS salt;
          ALTER TABLE users DROP COLUMN IF EXISTS "refreshTokenVersion";
        END IF;

        ALTER TABLE user_auth ALTER COLUMN "passwordHash" SET NOT NULL;
      END $$;
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS salt VARCHAR;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS "refreshTokenVersion" INTEGER NOT NULL DEFAULT 0;

      UPDATE users
      SET
        password = user_auth."passwordHash",
        salt = user_auth.salt,
        "refreshTokenVersion" = user_auth."refreshTokenVersion"
      FROM user_auth
      WHERE users.id = user_auth."userId";

      ALTER TABLE users ALTER COLUMN password SET NOT NULL;
      ALTER TABLE users ALTER COLUMN salt SET NOT NULL;
    `);

    await queryRunner.query(`DROP TABLE IF EXISTS user_auth`);
  }
}
