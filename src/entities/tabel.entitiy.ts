
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BaseEntity } from 'typeorm';
import { Reservation } from '../entities/reservation.entity';

@Entity()
export class Table extends BaseEntity {
  @PrimaryGeneratedColumn()
  id !: number;

  @Column({ unique: true })
  numberTable !: number;

  @Column()
  capacity !: number; 

  @OneToMany(() => Reservation, (reservation) => reservation.table)
  reservations !: Reservation[];
}