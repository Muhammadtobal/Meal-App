import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { Category } from "../entities/category.entitiy";
import { OrderDetail } from "./orderdetail.entity";

@Entity()
export class Item extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price!: number;
  @Column({ nullable: false })
  image?: string;
  @ManyToOne(() => Category, (category) => category.items, { nullable: false })
  category!: Category;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.item)
  orderDetails!: OrderDetail[];
  @CreateDateColumn({ type: "timestamp" }) 
  
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" }) 
  
  
  updatedAt!: Date;
  
}
