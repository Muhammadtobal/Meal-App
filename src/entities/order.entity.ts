import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  BaseEntity,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm";
import { User } from "../entities/user.entity";
import { Reservation } from "../entities/reservation.entity";
import { OrderDetail } from "../entities/orderdetail.entity";
import { Payment } from "../entities/payments.entity";
import { orderRole } from "../enum";

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(() => Payment, (payment) => payment.order)
  payments!: Payment[];

  @ManyToOne(() => User, (user) => user.orders, { nullable: false })
  user!: User;

  @ManyToOne(() => Reservation, (reservation) => reservation.orders, { nullable: true })
  reservation?: Reservation; // الحجز اختياري

  @Column({ type: "enum", enum: orderRole, default: orderRole.Delivered })
  status!: orderRole; // حالة الطلب: قيد الانتظار، التجهيز، جاهز، مُسلّم

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  orderDetails!: OrderDetail[];

  @CreateDateColumn({ type: "timestamp" }) 
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" }) 
  updatedAt!: Date;
}
