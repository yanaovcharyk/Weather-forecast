import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCities1720000000002 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS cities (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "cityName" VARCHAR NOT NULL,
        lat DOUBLE PRECISION NOT NULL,
        lon DOUBLE PRECISION NOT NULL,
        "userId" UUID NOT NULL,
        "isPinned" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "FK_cities_userId_users_id"
          FOREIGN KEY ("userId")
          REFERENCES users(id)
          ON DELETE CASCADE,
        CONSTRAINT "UQ_cities_userId_lat_lon" UNIQUE ("userId", lat, lon)
      );
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS cities`);
  }
}
