import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  BaseEntity,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm";
import { Item } from "../entities/item.entity";

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  name!: string;

  @ManyToOne(() => Category, (category) => category.subcategories, {
    nullable: true,
  })
  parent!: Category;

  @OneToMany(() => Category, (category) => category.parent)
  subcategories!: Category[];

  @OneToMany(() => Item, (item) => item.category)
  items!: Item[];
  @Column({ type: "varchar", length: 255, nullable: true })
  image?: string;
  @CreateDateColumn({ type: "timestamp" }) 
  
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" }) 
  
  
  updatedAt!: Date;}
