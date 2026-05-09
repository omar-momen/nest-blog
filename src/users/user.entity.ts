import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Post } from 'src/posts/post.entity';

/**
 * TypeORM entity representing an application user and their posts relation
 */
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  firstName!: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: true,
  })
  lastName!: string;

  @Column({
    type: 'varchar',
    unique: true,
    length: 96,
    nullable: false,
  })
  email!: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  password!: string;

  @OneToMany(() => Post, (post) => post.author)
  posts?: Post[];
}
