import * as productService from "../services/product.service.js";
import { uploadImage } from "../services/cloudinary.service.js";

export const getProducts = async (req, res, next) => {
  try {
    const result = await productService.getAllProducts(req.query);
    res.status(200).json({ succes: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ succes: false, message: "Produit introuvable" });
    }
    res.status(200).json({ succes: true, product });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({ succes: true, product });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.status(200).json({ succes: true, product });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.status(200).json({ succes: true, message: "Produit désactivé" });
  } catch (error) {
    next(error);
  }
};

export const addProductImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ succes: false, message: "Aucune image fournie" });
    }
    const result = await uploadImage(req.file.buffer);
    const image = await productService.addProductImage(req.params.id, result.secure_url);
    res.status(201).json({ succes: true, image });
  } catch (error) {
    next(error);
  }
};

export const updateProductImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ succes: false, message: "Aucune image fournie" });
    }
    const result = await uploadImage(req.file.buffer);
    const image = await productService.updateProductImage(req.params.imageId, result.secure_url);
    res.status(200).json({ succes: true, image });
  } catch (error) {
    next(error);
  }
};