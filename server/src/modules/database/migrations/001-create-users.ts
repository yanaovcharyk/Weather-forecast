import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers001 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR NOT NULL UNIQUE,
        password VARCHAR NOT NULL,
        salt VARCHAR NOT NULL
      );
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE users`);
  }
}
