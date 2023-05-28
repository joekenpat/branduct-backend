import { StatusCodes } from 'http-status-codes';
import { QueryOptions, Types } from 'mongoose';

import {
  IRouterResponseDTO,
  IErrorResponseDTO,
  RouterResponseStatus,
  IRouterRequestParamBodyDTO,
  IRouterRequestParamsDTO,
} from "../dtos/Controller";
import { ProductModel } from "../models/ProductModel";
import { ICreateProductColorImagesDTO, IProductImageResponseDTO } from "../dtos/ProductImage";
import { ProductImageModel } from "../models/ProductImageModel";

export const AddProductImages = async (
  req: IRouterRequestParamBodyDTO<{productId: string}, ICreateProductColorImagesDTO>,
  res: IRouterResponseDTO<IProductImageResponseDTO | IErrorResponseDTO>
) => {
  const productId = req.params.productId;
  const body = req.body;
  const product = await ProductModel.findOne({ _id: productId, "colors.code": body.colorCode }).lean();

  if (!product) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: RouterResponseStatus.ERROR,
      message: "Product not found",
      errors: {
        id: [`Product with id: ${productId} not found`],
      }
    });
  }

  const addedImages = await ProductImageModel.insertMany(body.images.map(image => ({
    ...image,
    productId: new Types.ObjectId(productId),
    colorCode: body.colorCode,
  })));

  product.images.concat(addedImages.map(image => image.id as string));
  await product.save();

  return res.status(StatusCodes.CREATED).json({
    status: RouterResponseStatus.SUCCESS,
    message: "Product images added successfully",
    productImages: addedImages.map(image => image.toObject())
  });
};

export const GetProductImages = async (
  req: IRouterRequestParamsDTO<{productId: string}>,
  res: IRouterResponseDTO<IProductImageResponseDTO | IErrorResponseDTO>
) => {
  const productId = req.params.productId;
  const productImages = await ProductImageModel.find({
    productId: new Types.ObjectId(productId)
  }).lean();

  return res.status(StatusCodes.OK).json({
    status: RouterResponseStatus.SUCCESS,
    message: "Product images retrieved successfully",
    productImages: productImages
  }); 
};

export const DeleteProductImage = async (
  req: IRouterRequestParamsDTO<{productId: string, imageId: string}>,
  res: IRouterResponseDTO<{} | IErrorResponseDTO>
) => {
  const productId = req.params.productId;
  const imageId = req.params.imageId;
  const productImage = await ProductImageModel.findOneAndDelete({
    productId: new Types.ObjectId(productId),
    _id: new Types.ObjectId(imageId)
  });

  if (!productImage) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: RouterResponseStatus.ERROR,
      message: "Product image not found",
      errors: {
        id: [`Product image with id: ${imageId} not found`],
      }
    });
  }

  return res.status(StatusCodes.OK).json({
    status: RouterResponseStatus.SUCCESS,
    message: "Product image deleted successfully",
  });
}
