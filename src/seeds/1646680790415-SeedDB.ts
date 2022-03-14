import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDB1646680790415 implements MigrationInterface {
  name = 'SeedDB1646680790415';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO tags (name) VALUES ('dragons'), ('coffee'), ('nestjs')`,
    );
    // password 123
    await queryRunner.query(
      `INSERT INTO users (username, email, password) VALUES ('brow', 'brow@gmail.com', '$2b$10$z3VPMwLZaHlqNeGZtf8MGuWr9obHQNF6AHp/7E1BVU2ieRTtAhbfS')`,
    );
    await queryRunner.query(
      `INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('first-article', 'First article', 'first art desc', 'first art body', 'coffee,dragons', 1)`,
    );
    await queryRunner.query(
      `INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('to-article', 'To article', 'To art desc', 'To art body', 'coffee,nestjs', 1)`,
    );
  }
  public async down(): Promise<void> {}
}

// в запросе INSERT INTO articles - мы используем "tagList" в кавычки, т.к. постгрес не воспринял бы такое имя без них.
