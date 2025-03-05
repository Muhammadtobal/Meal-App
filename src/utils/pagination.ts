import { Repository, ObjectLiteral } from "typeorm";

export async function paginate<T extends ObjectLiteral>(
  repository: Repository<T>,
  page: number = 1,
  limit: number = 10,
  relations: string[] = []
): Promise<T[]> {
  const skip = (page - 1) * limit;

  const data = await repository.find({
    skip,
    take: limit,
    relations, 
  });

  return data;
}

export async function getPaginationInfo<T extends ObjectLiteral>(
  repository: Repository<T>,
  page: number = 1,
  limit: number = 10
): Promise<{
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}> {
  const totalItems = await repository.count();
  const totalPages = Math.ceil(totalItems / limit);

  return {
    totalItems,
    totalPages,
    currentPage: page,
    limit: limit,
  };
}
export default { paginate, getPaginationInfo };
