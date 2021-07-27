import { MigrationInterface, QueryRunner } from "typeorm";

export class AddApplicationColumns1627173140748 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE applications
        DROP CONSTRAINT applications_pkey,
        ADD COLUMN description text NOT NULL,
        ADD COLUMN version numeric NOT NULL DEFAULT 0,
        ADD COLUMN metadata jsonb NOT NULL DEFAULT '{}',
        ADD COLUMN data jsonb NOT NULL DEFAULT '{}',
        ADD COLUMN deleted_at timestamp without time zone,
        ADD PRIMARY KEY (application_id, version)
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE applications
        DROP CONSTRAINT applications_pkey,
        DROP COLUMN deleted_at,
        DROP COLUMN data,
        DROP COLUMN metadata,
        DROP COLUMN version,
        DROP COLUMN description,
        ADD PRIMARY KEY (application_id)
    `);
  }
}
