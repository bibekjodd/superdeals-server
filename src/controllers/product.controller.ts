import mongoose from "mongoose";
import ApiFeatures from "../lib/apiFeatures";
import { CustomError } from "../lib/customError";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import Product from "../models/product.model";
import { GetProductsQuery } from "../types/product";

export const getAllProducts = catchAsyncError<
  unknown,
  unknown,
  unknown,
  GetProductsQuery
>(async (req, res) => {
  const apiFeature = new ApiFeatures(Product.find(), { ...req.query });

  const invalidOwner = apiFeature.invalidOwner();

  if (invalidOwner) {
    return res.json({
      totalResults: 0,
      total: 0,
      products: [],
    });
  }

  apiFeature.search().filter().order().paginate();
  const products = await apiFeature.result;

  const totalProducts = await new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .countTotalProducts();

  return res.json({
    totalResults: products.length,
    total: totalProducts,
    products,
  });
});

export const getProductDetails = catchAsyncError<{ id: string }>(
  async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid Product Id" });
    }
    const product = await Product.findById(req.params.id)
      .populate("owner")
      .populate("reviews");

    if (!product)
      throw new CustomError("Product with this id doens't exist", 400);

    return res.json({ product });
  }
);
