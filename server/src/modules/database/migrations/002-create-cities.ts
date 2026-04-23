import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCities002 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE cities (
        id SERIAL PRIMARY KEY,
        city VARCHAR NOT NULL,
        "userId" INTEGER,
        CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES users(id)
      );
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE cities`);
  }
}
