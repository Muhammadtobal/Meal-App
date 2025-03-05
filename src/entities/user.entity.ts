import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Order } from "../entities/order.entity";
import { Reservation } from "../entities/reservation.entity";
import { Payment } from "../entities/payments.entity";
import { UserRole } from "../enum";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.Customer })
  role!: UserRole; // Admin, Employee, Customer

  @Column({ nullable: true, unique: true }) 
  email!: string; // قد لا يحتوي بعض مستخدمي Google على بريد إلكتروني متاح

  @Column({ nullable: true }) 
  password?: string; // كلمة المرور إذا تم التسجيل بالبريد الإلكتروني

  @Column({ nullable: true, unique: true }) 
  googleId?: string; // معرف Google الفريد

  @Column({ nullable: true }) 
  avatar?: string; // صورة الملف الشخصي من Google

  @Column({ type: "varchar", length: 6, nullable: true }) 
  otp?: string | null; // كود OTP للتحقق عند تسجيل الدخول بالبريد الإلكتروني

  @Column({ type: "timestamp", nullable: true }) 
  otpExpires?: Date | null; // تاريخ انتهاء صلاحية OTP

  @OneToMany(() => Order, (order) => order.user)
  orders!: Order[];

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations!: Reservation[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments!: Payment[];

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;
}
