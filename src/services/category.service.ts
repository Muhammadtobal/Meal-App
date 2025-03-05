import { DeepPartial } from "typeorm";
import AppDataSource from "../database/db";
import { Category } from "../entities/category.entitiy";
import { deleteFile, uploadPathCategory } from "../utils/uploads";
import { paginate,getPaginationInfo } from "../utils/pagination";

export class CategoryService {
  private categoryRepository = AppDataSource.getRepository(Category);
  async createCategory(data: DeepPartial<Category>): Promise<Category> {
    return await this.categoryRepository.save(data);
  }
  async updateCategory(
    id: number,
    data: { name?: string; parent?: number; image?: string }
  ): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ["parent"],
    });

    if (!category) {
      throw new Error("Category not found");
    }

    if (data.name) category.name = data.name;
    if (data.parent) {
      const parent = await this.categoryRepository.findOne({
        where: { id: data.parent },
      });

      if (!parent) {
        throw new Error("Parent category not found");
      }

      category.parent = parent;
    }

    if (category.image) await deleteFile(category.image, uploadPathCategory);
    if (data.image) category.image = data.image;

    return await this.categoryRepository.save(category);
  }

  async deleteCategory(id: number): Promise<string> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ["subcategories"],
    });

    if (!category) {
      throw new Error("Category not found");
    }

    return await this.deleteCategorysAndSub(category);
  }
  private async deleteCategorysAndSub(category: Category): Promise<string> {
    if (category !== null) {
      if (category.subcategories && category.subcategories.length > 0) {
        for (const subCategory of category.subcategories) {
          if (subCategory.image) {
            deleteFile(subCategory.image, uploadPathCategory);
          }
          await this.categoryRepository.remove(subCategory);
        }
      }

      if (category.image) {
        deleteFile(category.image, uploadPathCategory);
      }

      await this.categoryRepository.remove(category);
    }
    return "Category and its subcategories were successfully deleted.";
  }

  async getCategories(page: number = 1, limit: number = 10): Promise<Category[]> {
    return paginate(this.categoryRepository, page, limit, ["subcategories"]);
  }


  async getPaginationInfo(page: number = 1, limit: number = 10) {
    return getPaginationInfo(this.categoryRepository, page, limit);
  }
  async getOneCategory(id: number): Promise<Category | null> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ["subcategories"],
    });
    if (!category) {
      throw new Error(`the Category not found`);
    }
    return category;
  }
}
