import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Post } from 'src/posts/post.entity';

/**
 * TypeORM entity storing structured meta options linked one-to-one with a post
 */
@Entity()
export class MetaOption {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'json',
    nullable: false,
  })
  value!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToOne(() => Post, (post) => post.metaOptions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  post?: Post;
}
