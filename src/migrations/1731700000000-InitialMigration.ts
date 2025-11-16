import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1731700000000 implements MigrationInterface {
  name = 'InitialMigration1731700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying(255) NOT NULL,
        "name" character varying(255) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      )
    `);

    // Create products table
    await queryRunner.query(`
      CREATE TABLE "products" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "description" text,
        "price" numeric(10,2) NOT NULL,
        "quantity" integer NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_products_id" PRIMARY KEY ("id")
      )
    `);

    // Create transaction type enum
    await queryRunner.query(`
      CREATE TYPE "transactions_type_enum" AS ENUM('ADJUSTMENT', 'RESTOCK', 'SALE')
    `);

    // Create transactions table
    await queryRunner.query(`
      CREATE TABLE "transactions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "product_id" uuid NOT NULL,
        "user_id" uuid,
        "type" "transactions_type_enum" NOT NULL DEFAULT 'ADJUSTMENT',
        "quantity" integer NOT NULL,
        "previous_quantity" integer NOT NULL,
        "new_quantity" integer NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_transactions_id" PRIMARY KEY ("id")
      )
    `);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "transactions"
      ADD CONSTRAINT "FK_transactions_product_id"
      FOREIGN KEY ("product_id") REFERENCES "products"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "transactions"
      ADD CONSTRAINT "FK_transactions_user_id"
      FOREIGN KEY ("user_id") REFERENCES "users"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    // Create indexes for better query performance
    await queryRunner.query(`
      CREATE INDEX "IDX_transactions_product_id" ON "transactions" ("product_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_transactions_user_id" ON "transactions" ("user_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_transactions_created_at" ON "transactions" ("created_at")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_transactions_created_at"`);
    await queryRunner.query(`DROP INDEX "IDX_transactions_user_id"`);
    await queryRunner.query(`DROP INDEX "IDX_transactions_product_id"`);

    // Drop foreign key constraints
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_transactions_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_transactions_product_id"`,
    );

    // Drop tables
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(`DROP TYPE "transactions_type_enum"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
