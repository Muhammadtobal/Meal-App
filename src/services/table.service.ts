import { injectable } from "inversify";
import AppDataSource from "../database/db";
import { Table } from "../entities/tabel.entitiy";
import { DeepPartial } from "typeorm";
import { getPaginationInfo, paginate } from "../utils/pagination";

@injectable()
export class TableService {
  private readonly tableRepository = AppDataSource.getRepository(Table);
  async createTable(data: {
    numberTable: number;
    capacity: number;
  }): Promise<Table> {
    const exist = await this.tableRepository.findOne({
      where: { numberTable: data.numberTable },
    });
    if (exist) {
      throw new Error(`the the already exist`);
    }
    return await this.tableRepository.save(data);
  }
async getCategories(page: number = 1, limit: number = 10): Promise<Table[]> {
      return paginate(this.tableRepository, page, limit);
    }
  
  
    async getPaginationInfo(page: number = 1, limit: number = 10) {
      return getPaginationInfo(this.tableRepository, page, limit);
    }
  async getOneTable(id: number): Promise<Table | null> {
    const exist = await this.tableRepository.findOne({ where: { id } });
    if (!exist) {
      throw new Error("the Table not found");
    }

    return exist;
  }

  async updateTable(
    id: number,
    data: { capacity: number; numberTable: number }
  ): Promise<Table> {
    const exist = await this.tableRepository.findOne({ where: { id } });
    if (!exist) {
      throw new Error("the Table not found");
    }
    if (data.capacity) exist.capacity = data.capacity;
    if (data.numberTable) exist.numberTable = data.numberTable;

    return await this.tableRepository.save(exist);
  }
  async deleteTable(id: number): Promise<void> {
    const exist = await this.tableRepository.findOne({ where: { id } });
    if (!exist) {
      throw new Error("the Table not found");
    }
    await this.tableRepository.remove(exist);
  }
}
