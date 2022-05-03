import {MigrationInterface, QueryRunner} from "typeorm";

export class tagcascade1646583100110 implements MigrationInterface {
    name = 'tagcascade1646583100110'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_5c3a0e3f2f14c2b5de402b125c8"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_5c3a0e3f2f14c2b5de402b125c8" FOREIGN KEY ("tagName") REFERENCES "tags"("name") ON DELETE NO ACTION ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_5c3a0e3f2f14c2b5de402b125c8"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_5c3a0e3f2f14c2b5de402b125c8" FOREIGN KEY ("tagName") REFERENCES "tags"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
