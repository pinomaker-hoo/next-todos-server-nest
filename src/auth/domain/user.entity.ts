// Typeorm Imports
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// ** Entity Imports
import { BaseTimeEntity } from 'src/common/entity/BaseTime.Entity';

@Entity({ name: 'tbl_user' })
export class User extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column()
  id: string;

  @Column()
  password: string;

  @Column()
  name: string;
}
