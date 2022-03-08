import {MigrationInterface, QueryRunner} from "typeorm";

export class DelImgToUsers1646768768292 implements MigrationInterface {
    name = 'DelImgToUsers1646768768292'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "image"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "image" character varying NOT NULL DEFAULT ''`);
    }

}
