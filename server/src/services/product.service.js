import prisma from "../config/db.js";

export const getAllProducts = async ({ page = 1, limit = 20, category_id, brand_id, vendor_id }) => {
  const skip = (Number(page) - 1) * Number(limit);

  const where = {
    actif: true,
    ...(category_id && { category_id }),
    ...(brand_id && { brand_id }),
    ...(vendor_id && { vendor_id }), // permet de filtrer par boutique (page publique vendeur)
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: Number(limit),
      include: {
        category: true,
        brand: true,
        images: true,
        variants: true,
        vendor: { select: { id: true, nom_boutique: true, slug: true, logo_url: true } },
      },
      orderBy: { date_creation: "desc" },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  };
};

export const getProductById = async (id) => {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      brand: true,
      images: true,
      variants: true,
      reviews: true,
      vendor: { select: { id: true, nom_boutique: true, slug: true, logo_url: true } },
    },
  });
};

/**
 * Produits d'un vendeur pour SON dashboard : contrairement à
 * getAllProducts, inclut aussi les produits désactivés (actif: false),
 * puisque le vendeur doit pouvoir les retrouver pour les réactiver.
 */
export const getProductsByVendor = async (vendorId) => {
  return prisma.product.findMany({
    where: { vendor_id: vendorId },
    include: { category: true, brand: true, images: true, variants: true },
    orderBy: { date_creation: "desc" },
  });
};

export const createProduct = async (data) => {
  return prisma.product.create({ data });
};

export const updateProduct = async (id, data) => {
  return prisma.product.update({ where: { id }, data });
};

export const deleteProduct = async (id) => {
  return prisma.product.update({ where: { id }, data: { actif: false } });
};

export const addProductImage = async (productId, url, ordre = 0) => {
  return prisma.productImage.create({
    data: { product_id: productId, url, ordre },
  });
};

export const updateProductImage = async (imageId, newUrl) => {
  return prisma.productImage.update({
    where: { id: imageId },
    data: { url: newUrl },
  });
};