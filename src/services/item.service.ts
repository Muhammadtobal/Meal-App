import { injectable } from "inversify";

import AppDataSource from "../database/db";
import { Item } from "../entities/item.entity";
import { DeepPartial } from "typeorm";
import { deleteFile, uploadPathItem } from "../utils/uploads";
import { Category } from "../entities/category.entitiy";
import { getPaginationInfo, paginate } from "../utils/pagination";

injectable();
export class ItemService {
  private itemRepository = AppDataSource.getRepository(Item);
  async getCategories(page: number = 1, limit: number = 10): Promise<Item[]> {
      return paginate(this.itemRepository, page, limit);
    }
  
  
    async getPaginationInfo(page: number = 1, limit: number = 10) {
      return getPaginationInfo(this.itemRepository, page, limit);
    }
  async createItem(data: DeepPartial<Item>): Promise<Item> {
    return await this.itemRepository.save(data);
  }
  async updateItem(id: number, data: DeepPartial<Item>): Promise<Item> {
    const exist = await this.itemRepository.findOne({ where: { id } });
    if (!exist) {
      throw new Error("the Item not found");
    }

    if (data.name) exist.name = data.name;
    if (data.price) exist.price = data.price;
    if (data.description) exist.description = data.description;
    if (data.category) {
      const existCategory = await Category.findOne({
        where: { id: Number(data.category) },
      });
      if (!existCategory) {
        throw new Error("the category not found");
      }
      exist.category = existCategory;
    }
    if (exist.image) deleteFile(exist.image, uploadPathItem);
    if (data.image) exist.image = data.image;
    const newitem = await this.itemRepository.save(exist);
    return newitem;
  }
  async getOneItem(id: number): Promise<Item> {
    const existItem = await this.itemRepository.findOne({
      where: { id },
      relations: ["category"],
    });
    if (!existItem) {
      throw new Error("the item not found");
    }
    return existItem;
  }
  async deleteItem(id: number): Promise<void> {
    const existItem = await this.itemRepository.findOne({ where: { id } });
    if (!existItem) throw new Error("the item not found");
    await this.itemRepository.remove(existItem);
  }
}
