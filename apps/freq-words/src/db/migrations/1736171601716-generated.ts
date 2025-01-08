import { MigrationInterface, QueryRunner } from 'typeorm';

export class Generated1736171601716 implements MigrationInterface {
	name = 'Generated1736171601716';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "source" ADD "ddd" integer NOT NULL DEFAULT '2'`);
		await queryRunner.query(`UPDATE "language" SET "newColumn" = 'ddd'`);
		await queryRunner.query(`ALTER TABLE "language" ALTER COLUMN "newColumn" SET NOT NULL`);
		await queryRunner.query(`ALTER TABLE "language" ALTER COLUMN "newColumn" SET DEFAULT 'ddd'`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "language" DROP COLUMN "newColumn"`);
	}
}
