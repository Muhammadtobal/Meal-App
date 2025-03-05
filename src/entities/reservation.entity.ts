import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../entities/user.entity";
import { Order } from "../entities/order.entity";
import { reservationRole } from "../enum";
import { Table } from "./tabel.entitiy";
@Entity()
export class Reservation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.reservations, { nullable: false })
  user!: User;

  @Column({ type: "datetime", nullable: true }) // بدلاً من timestamp
  reservationTime!: Date;

  @Column({ type: "int" })
  duration!: number;

  @Column({ type: "enum", enum: reservationRole, default: reservationRole.Confirmed })
  status!: reservationRole; // confirmed, canceled, completed.

  @OneToMany(() => Order, (order) => order.reservation)
  orders!: Order[];
  @Column({ type: "timestamp", nullable: true })
  totalTime!: Date;
  @ManyToOne(() => Table, (table) => table.reservations, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  table!: Table;
}
