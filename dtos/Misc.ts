
export enum ModelOrderBy {
  ASC = 'asc',
  DESC = 'desc'
};

export interface ISizeDTO {
  width: number,
  height: number,
};

export interface IPositionDTO {
  posX: number,
  posY: number,
};

export interface ITransformScaleDTO {
  scaleX: number,
  scaleY: number,
}

export interface IPaginatedDTO<T> {
  page: number;
  total: number;
  pageSize: number;
  elements: T[];
};

export interface IPaginateModelRequestQueryDTO {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  orderBy?: ModelOrderBy;
  status?: string;
  imageDetailLevel?: string;
};
