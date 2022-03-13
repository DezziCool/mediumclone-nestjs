import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { hash } from 'bcrypt';
import { ArticleEntity } from '@app/article/article.entity';

@Entity({ name: 'users' }) // задали название таблицы, иначе по умлочанию tag
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column({ default: '' })
  bio: string;

  @Column({ select: false }) // По умолчанию указываем, что мы не отображаем эту колонку - исключает из абсалютно всех запросов (find(), findOne())
  password: string;

  @BeforeInsert() // будет вызвана до того, как мы сделали запись в БД
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }

  @OneToMany(() => ArticleEntity, (article) => article.author) // отношение один ко многим
  articles: ArticleEntity[];

  @ManyToMany(() => ArticleEntity) // указываем что у нас есть Many to Many ассоциация между user и article
  @JoinTable() // он необходим для того, чтобы у нас была создана отдельная таблица под это
  favorites: ArticleEntity[]; // это наименование поля, которое содержит массив наших ArticleEntity; Массив тех статей, которых залайкал user.
}
//  также нужно поле password, но мы не должны будем его отображать.
