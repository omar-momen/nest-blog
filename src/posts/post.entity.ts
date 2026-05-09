import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm';

import { postType } from './enums/postType.enum';
import { PostStatus } from './enums/post-status.enum';

import { MetaOption } from 'src/meta-options/meta-option.entity';
import { Tag } from 'src/tags/tag.entity';
import { User } from 'src/users/user.entity';

/**
 * TypeORM entity representing a blog post, its author, tags, and optional meta options
 */
@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'varchar',
    length: 512,
    nullable: false,
  })
  title!: string;

  @Column({
    type: 'enum',
    enum: postType,
    nullable: false,
    default: postType.Post,
  })
  postType!: postType;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
    unique: true,
  })
  slug!: string;

  @Column({
    type: 'enum',
    enum: PostStatus,
    nullable: false,
    default: PostStatus.Draft,
  })
  status!: PostStatus;

  @Column({
    type: 'text',
    nullable: true,
  })
  content?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  schema?: string;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
  })
  featuredImageUrl?: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  publishOn?: Date;

  @OneToOne(() => MetaOption, (metaOption) => metaOption.post, {
    cascade: true,
  })
  metaOptions?: MetaOption;

  @ManyToOne(() => User, (user) => user.posts)
  author: User;

  @ManyToMany(() => Tag, (tag) => tag.posts)
  @JoinTable()
  tags?: Tag[];
}
