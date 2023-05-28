import { Router } from "express";

import { ValidateRequestPayload } from "../middleware/ValidateRequestPayload";
import * as ProductImageService from "../services/ProductImageService";
import { RequestPayloadType } from "../dtos/Controller";
import { CreateProductColorImagesDTOValidator } from "../validators/ProductImage";

const ProductImageController: Router = Router();

ProductImageController.post("/products/:productId/images",
  ValidateRequestPayload(
    CreateProductColorImagesDTOValidator,
    [RequestPayloadType.BODY, RequestPayloadType.PARAMS]
  ),
  ProductImageService.AddProductImages
);
ProductImageController.get("/products/:productId/images", ProductImageService.GetProductImages);
ProductImageController.delete("/products/:productId/images/:imageId", ProductImageService.DeleteProductImage);

export default ProductImageController;
