import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { FileTypes } from './enums/file-types';

@Entity()
export class Upload {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: false,
  })
  name!: string;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: false,
  })
  path!: string;

  @Column({
    type: 'enum',
    enum: FileTypes,
    nullable: false,
    default: FileTypes.IMAGE,
  })
  type!: FileTypes;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 128,
  })
  mime!: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  size!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
