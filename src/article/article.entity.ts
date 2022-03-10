import { BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'articles' })
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  title: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: '' })
  body: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column('simple-array') // указываем что жто массив
  tagList: string;

  @Column({ default: 0 })
  favoritesCount: number;

  @BeforeUpdate()
  updateTimeStamp() {
    this.updatedAt = new Date();
  }
}

// default: () => 'CURRENT_TIMESTAMP' - позволяет установмить текущую отметку времени по умолчанию при создании строки
// "updatedAt" - не будет сама по себе обновлять время, поэтому создали функцию с декоратором "@BeforeUpdate()"
