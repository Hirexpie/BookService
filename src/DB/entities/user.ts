import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("users") // Название таблицы
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", length: 255, unique: true })
  email: string;

  @Column({ type: "varchar", length: 255 })
  password: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;
}

