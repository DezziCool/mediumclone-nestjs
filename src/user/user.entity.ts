import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { hash } from 'bcrypt';

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

  @Column({ default: '' })
  image: string;

  @Column()
  password: string;

  @BeforeInsert() // будет вызвана до того, как мы сделали запись в БД
  async hasPassword() {
    this.password = await hash(this.password, 10);
  }
}
//  также нужно поле password, но мы не должны будем его отображать.
