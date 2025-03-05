import { injectable } from "inversify";
import AppDataSource from "../database/db";
import { Reservation } from "../entities/reservation.entity";
import {  LessThan, MoreThan } from "typeorm";
import { User } from "../entities/user.entity";
import { reservationRole } from "../enum";
import { Table } from "../entities/tabel.entitiy";
import moment from 'moment-timezone';
import dotenv from "dotenv"
import { getPaginationInfo, paginate } from "../utils/pagination";
dotenv.config()
@injectable()
export class ReservationService {
  private reservationRepository = AppDataSource.getRepository(Reservation);



  async createReservation(data: {
      reservationTime: Date;
      duration: number;
      user: number;
      table: number;
  }): Promise<Reservation> {
    
      if (!data.reservationTime) {
          throw new Error("Reservation time is required");
      }
  
      const existUser = await User.findOne({ where: { id: data.user } });
      if (!existUser) throw new Error("User not found");
  
      const existTable = await Table.findOne({ where: { id: data.table } });
      if (!existTable) throw new Error("Table not found");
  
   
      const reservationTime = moment.utc(data.reservationTime).toDate();



      const totalTime = moment(reservationTime).add(data.duration, "hours").toDate();
  
      
      const overlappingReservation = await this.reservationRepository.findOne({
          where: {
              table: { id: existTable.id },
              reservationTime: LessThan(totalTime),
              totalTime: MoreThan(reservationTime),
          },
      });
  
      if (overlappingReservation) {
          throw new Error("The table is already reserved for this time slot.");
      }
  
      
      const newReservation = this.reservationRepository.create({
          table: existTable,
          reservationTime: reservationTime,
          duration: data.duration,
          user: existUser,
          totalTime: totalTime,
          status: reservationRole.Confirmed,
      });
  
      await this.reservationRepository.save(newReservation);
      return newReservation;
  }
  
   async getCategories(page: number = 1, limit: number = 10): Promise<Reservation[]> {
       return paginate(this.reservationRepository, page, limit);
     }
   
   
     async getPaginationInfo(page: number = 1, limit: number = 10) {
       return getPaginationInfo(this.reservationRepository, page, limit);
     }
  async getOneReservation(id: number): Promise<Reservation> {
    const exist = await this.reservationRepository.findOne({
      where: { id },
      relations: ["user"],
    });
    if (!exist) {
      throw new Error("the reservation not found");
    }
    return exist;
  }
  async updateReservation(
    id: number,
    data: {
      reservationTime: Date;
      duration: number;
      user: number;
      table: number;
      status: reservationRole;
    }
  ): Promise<Reservation> {
    const exist = await this.reservationRepository.findOne({ where: { id } });
    if (!exist) {
      throw new Error("the Reservation not found");
    }
    if (data.duration) {
      exist.duration = data.duration;

      exist.totalTime = new Date(
        new Date(exist.reservationTime).getTime() +
          Number(exist.duration) * 60 * 60 * 1000
      );
      await this.reservationRepository.save(exist);
    }
    if (data.table) {
      const existTable = await Table.findOne({ where: { id: data.table } });
      if (!existTable) throw new Error("the table not found");
      exist.table = existTable;
    }
    if (data.status) {
      exist.status = data.status;
      await this.time(exist);
      await this.reservationRepository.save(exist);
    }
    if (data.user) {
      const existUser= await User.findOne({
        where: { id: Number(data.user) },
      });
      if (!existUser) throw new Error("the user not found");
      exist.user = existUser;
      await this.time(exist);
      await this.reservationRepository.save(exist);
    }
    if (data.reservationTime) {
      exist.reservationTime = data.reservationTime;
      const d = new Date(
        new Date(data.reservationTime).getTime() +
          Number(exist.duration) * 60 * 60 * 1000
      );
      exist.totalTime = d;
      await this.reservationRepository.save(exist);
    }

    return await this.reservationRepository.save(exist);
  }
  private async time(exist: Reservation): Promise<Reservation> {
    exist.reservationTime = new Date(
      new Date(exist.totalTime).getTime() - exist.duration * 60 * 60 * 1000
    );
    return exist;
  }

  async deleteReservation(id: number): Promise<void> {
    const exist = await this.reservationRepository.findOne({ where: { id } });
    if (!exist) {
      throw new Error("the Reservation Not found");
    }
    await this.reservationRepository.remove(exist);
  }
}
