import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateApplicationEntity1627138301081
  implements MigrationInterface
{
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`
      CREATE TABLE applications (
        application_id uuid PRIMARY KEY default uuid_generate_v4()
      );
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE applications`);
    await queryRunner.query(`DROP EXTENSION "uuid-ossp"`);
  }
}
