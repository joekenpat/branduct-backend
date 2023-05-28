import { Router } from "express";

import { ValidateRequestPayload } from "../middleware/ValidateRequestPayload";
import { CreateProductValidator, UpdateProductValidator } from "../validators/Product";
import * as ProductService from "../services/ProductService";
import { RequestPayloadType } from "../dtos/Controller";
import { PaginationQueryValidator } from "../validators/Misc";

const ProductController: Router = Router();

ProductController.get("/products/:id", ProductService.FindProductById);
ProductController.put("/products/:id", ValidateRequestPayload(UpdateProductValidator), ProductService.UpdateProductById);
ProductController.post("/products", ValidateRequestPayload(CreateProductValidator), ProductService.CreateProduct);
ProductController.get("/products", ValidateRequestPayload(PaginationQueryValidator, [RequestPayloadType.QUERY]), ProductService.GetProducts);

export default ProductController;
