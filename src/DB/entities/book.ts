import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("books") // Название таблицы
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: "varchar", length: 255 })
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "varchar", length: 255 })
  author_id: string; 

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;
}
