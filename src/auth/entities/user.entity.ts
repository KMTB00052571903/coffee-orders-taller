import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 150, unique: true })
  email!: string;

  @Column({ name: 'password_hash', length: 255, select: false })
  passwordHash!: string;
}
