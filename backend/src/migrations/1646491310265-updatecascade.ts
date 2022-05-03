import {MigrationInterface, QueryRunner} from "typeorm";

export class updatecascade1646491310265 implements MigrationInterface {
    name = 'updatecascade1646491310265'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_e204ddec8abd64c5da576c6a35d"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_e204ddec8abd64c5da576c6a35d" FOREIGN KEY ("username ") REFERENCES "users"("username") ON DELETE NO ACTION ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_e204ddec8abd64c5da576c6a35d"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_e204ddec8abd64c5da576c6a35d" FOREIGN KEY ("username ") REFERENCES "users"("username") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
