import {MigrationInterface, QueryRunner} from "typeorm";

export class cascadingtags1646918071719 implements MigrationInterface {
    name = 'cascadingtags1646918071719'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tags" DROP CONSTRAINT "FK_2f560e305ae578a49f694adad40"`);
        await queryRunner.query(`ALTER TABLE "tags" ADD CONSTRAINT "FK_2f560e305ae578a49f694adad40" FOREIGN KEY ("username") REFERENCES "users"("username") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tags" DROP CONSTRAINT "FK_2f560e305ae578a49f694adad40"`);
        await queryRunner.query(`ALTER TABLE "tags" ADD CONSTRAINT "FK_2f560e305ae578a49f694adad40" FOREIGN KEY ("username") REFERENCES "users"("username") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
