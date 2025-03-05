import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../entities/user.entity";
import { Order } from "../entities/order.entity";
import { paymentRole } from "../enum";

@Entity()
export class Payment extends BaseEntity {
  [x: string]: any;
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Order, (order) => order.payments, { nullable: false })
  order!: Order;

  @ManyToOne(() => User, { nullable: false })
  user!: User;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  discount!: number; // قيمة الخصم (إن وجد).

  @Column({ type: "decimal", precision: 10, scale: 2 })
  totalAmount!: number; // المبلغ الإجمالي قبل الخصم.
  @Column({ type: "decimal", precision: 10, scale: 2 })
  finalAmount!: number; // المبلغ الإجمالي قبل الخصم.
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  paymentDate!: Date; // تاريخ الدفع.

  @Column({ type: "enum", enum: paymentRole, default: paymentRole.Paid })
  status!: paymentRole; // Paid, Pending, Failed
  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;
}
