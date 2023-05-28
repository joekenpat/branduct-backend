import { Request } from "express";
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

import {
  IRouterResponseDTO,
  IErrorResponseDTO,
  RouterResponseStatus,
  IRouterRequestParamBodyDTO,
  IRouterRequestBodyDTO,
  IRouterRequestParamsDTO,
  IRouterRequestQueryDTO,
} from "../dtos/Controller";
import {
  IProductDTO,
  IUpdateProductDTO,
  IProductResponseDTO,
  IProductsResponseDTO
} from "../dtos/Product";
import { ProductModel } from "../models/ProductModel";
import { omitBy, isUndefined } from 'lodash';
import { QueryOptions } from 'mongoose';
import { IPaginateModelRequestQueryDTO } from '../dtos/Misc';
import { PaginateModel } from '../utils/PaginateModel';

const updateOptions: QueryOptions = {
  upsert: false,
  new: true,
}

export const CreateProduct = async (
  req: IRouterRequestBodyDTO<IProductDTO>,
  res: IRouterResponseDTO<IProductResponseDTO | IErrorResponseDTO>
) => {
  try {
    const productExistByName = await ProductModel.findOne({ name: req.body.name }).lean();

    if (productExistByName) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: RouterResponseStatus.ERROR,
        message: "Product already exists",
        errors: {
          name: ["Product already exists"],
        }
      });
    }

    const product = await ProductModel.create(req.body);

    return res.status(StatusCodes.CREATED).json({
      status: RouterResponseStatus.SUCCESS,
      message: "Product created successfully",
      product: product.toObject()
    });
  } catch (err: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: RouterResponseStatus.ERROR,
      message: "Unable to create product",
      errors: {
        server: [err.message],
      }
    });
  }
};

export const FindProductById = async (
  req: IRouterRequestParamsDTO<{id: string}>,
  res: IRouterResponseDTO<IProductResponseDTO | IErrorResponseDTO>
) => {
  const productId = req.params.id;
  const product = await ProductModel
    .findById(productId)
    .populate([{
      path: 'images',
      select: getProductImageDetailLevel('max')
    }])
    .lean();

  if (!product) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: RouterResponseStatus.SUCCESS,
      message: ReasonPhrases.NOT_FOUND,
      errors: {
        id: [ `Product with id: ${productId} not found!`]
      }
    })
  }
  
  return res.status(StatusCodes.OK).json({
    status: RouterResponseStatus.SUCCESS,
    message: ReasonPhrases.OK,
    product
  })
};

export const UpdateProductById = async (
  req: IRouterRequestParamBodyDTO<{id: string}, IUpdateProductDTO>,
  res: IRouterResponseDTO<IProductResponseDTO | IErrorResponseDTO>
) => {
  const productId = req.params.id;
  const updates:IUpdateProductDTO = omitBy(req.body, property => isUndefined(property));
  const updatedProduct = await ProductModel.findByIdAndUpdate(productId, updates, updateOptions).lean();

  if (!updatedProduct) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: RouterResponseStatus.SUCCESS,
      message: ReasonPhrases.NOT_FOUND,
      errors: {
        productId: [`Product with id: ${productId} not found!`]
      }
    })
  }
  
  return res.status(StatusCodes.OK).json({
    status: RouterResponseStatus.SUCCESS,
    message: ReasonPhrases.OK,
    product: updatedProduct
  })
};

export const GetProducts = async (
  req: Request<IPaginateModelRequestQueryDTO>,
  res: IRouterResponseDTO<IProductsResponseDTO | IErrorResponseDTO>
) => {
  const query = req.query as IPaginateModelRequestQueryDTO;
  const detailLevel = query.imageDetailLevel || "min";

  const result = await PaginateModel(
    ProductModel,
    query.page,
    query.pageSize,
    query.sortBy,
    query.orderBy,
    [{
      path: 'images',
      select: getProductImageDetailLevel(detailLevel)
    }]
  );

  return res.status(StatusCodes.OK).json({
    status: RouterResponseStatus.SUCCESS,
    message: ReasonPhrases.OK,
    products: result
  });
};

const getProductImageDetailLevel = (detailLevel: string): string[] => {
  switch (detailLevel) {
    case "max":
      return ["url", "location", "colorCode", "printableAreas"];
    case "mid":
      return ["url", "location", "colorCode"];
    default:
      return ["url", "location"];
  }
}