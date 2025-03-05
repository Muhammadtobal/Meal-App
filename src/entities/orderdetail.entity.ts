import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm";
import { Order } from "../entities/order.entity";
import { Item } from "../entities/item.entity";

@Entity()
export class OrderDetail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Order, (order) => order.orderDetails, { nullable: false })
  order!: Order;

  @ManyToOne(() => Item, { nullable: false })
  item!: Item;

  @Column("int")
  quantity!: number;
  @CreateDateColumn({ type: "timestamp" }) 
  
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" }) 
  
  
  updatedAt!: Date;
}
