import { FilterQuery, Model } from "mongoose";
import { IPaginatedDTO } from "../dtos/Misc";

interface IPopulate {
  path: string,
  model?: string,
  select?: string[]
  populate?: IPopulate[]
}

export const PaginateModel = async <T>(
  m: Model<T>,
  page: number = 0,
  pageSize: number = 20,
  sortBy: string = 'createdAt',
  orderBy: 'asc' | 'desc' = 'desc',
  populate: IPopulate[] = [],
  filter: FilterQuery<T> = {}
): Promise<IPaginatedDTO<T>> => {
  const query = m.find(filter).sort({ [sortBy]: orderBy }).skip(+page * +pageSize)
  .lean().populate(populate).limit(pageSize).exec();
  const count = m.countDocuments(filter).exec();
  const [result, total] = await Promise.all([
    query,
    count
  ]);

  return {
    page: +page,
    pageSize: +pageSize,
    total,
    elements: result as T[]
  };
};
