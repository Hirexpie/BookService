import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("refresh_tokens")
export class Refresh {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    userId: string;

    @Column()
    token: string;

    @Column({ default: false })
    isActive: boolean;

    @Column({ nullable: true })
    ipAddress: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

