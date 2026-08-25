import prisma from "../config/db.js";

// Formate un produit pour l'affichage dashboard : stock agrégé + statut dérivé
function formatProduct(product) {
    const stockTotal = product.variants.reduce((sum, v) => sum + v.stock, 0);

    let statutStock;
    if (stockTotal === 0) statutStock = "Rupture";
    else if (stockTotal <= 3) statutStock = `Plus que ${stockTotal} unités`;
    else statutStock = "En stock";

    return {
        id: product.id,
        nom: product.nom,
        description: product.description,
        prix: product.prix,
        prix_promo: product.prix_promo,
        actif: product.actif,
        categorie: product.category?.nom ?? null,
        marque: product.brand?.nom ?? null,
        stock_total: stockTotal,
        statut_stock: statutStock,
        images: product.images.map((img) => img.url),
        variants: product.variants,
    };
}

// GET /api/admin/products
export const getAllProducts = async (req, res, next) => {
    try {
        const products = await prisma.product.findMany({
            include: {
                category: true,
                brand: true,
                variants: true,
                images: { orderBy: { ordre: "asc" } },
            },
            orderBy: { date_creation: "desc" },
        });

        res.status(200).json({
            success: true,
            products: products.map(formatProduct),
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/admin/products/:id
export const getProductById = async (req, res, next) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: req.params.id },
            include: {
                category: true,
                brand: true,
                variants: true,
                images: { orderBy: { ordre: "asc" } },
            },
        });

        if (!product) {
            return res.status(404).json({ success: false, message: "Produit introuvable" });
        }

        res.status(200).json({ success: true, product: formatProduct(product) });
    } catch (error) {
        next(error);
    }
};

// POST /api/admin/products
// Attend un multipart/form-data avec :
//  - champs texte : nom, description, category_id, brand_id, prix, prix_promo (optionnel), vendor_id
//  - variants : JSON.stringify([{ taille, couleur, stock, sku }, ...])
//  - images : plusieurs fichiers (req.files, via multer.array("images"))
export const createProduct = async (req, res, next) => {
    try {
        const { nom, description, category_id, brand_id, prix, prix_promo, variants } = req.body;

        if (!nom || !category_id || !brand_id || !prix) {
            return res.status(400).json({
                success: false,
                message: "Champs obligatoires manquants (nom, category_id, brand_id, prix).",
            });
        }

        // Single-vendor : un seul profil Vendor existe en base, on le résout
        // automatiquement plutôt que de le demander dans le formulaire.
        const vendor = await prisma.vendor.findFirst();
        if (!vendor) {
            return res.status(400).json({
                success: false,
                message: "Aucun profil boutique (Vendor) n'existe encore. Crée-le une fois avant d'ajouter des produits.",
            });
        }

        let parsedVariants = [];
        try {
            parsedVariants = variants ? JSON.parse(variants) : [];
        } catch {
            return res.status(400).json({ success: false, message: "Format des variantes invalide." });
        }

        if (parsedVariants.length === 0) {
            return res.status(400).json({ success: false, message: "Au moins une variante est requise." });
        }

        const imageFiles = req.files || [];

        const product = await prisma.product.create({
            data: {
                nom,
                description: description || null,
                category_id,
                brand_id,
                vendor_id: vendor.id,
                prix: parseFloat(prix),
                prix_promo: prix_promo ? parseFloat(prix_promo) : null,
                variants: {
                    create: parsedVariants.map((v) => ({
                        taille: v.taille,
                        couleur: v.couleur,
                        stock: parseInt(v.stock, 10) || 0,
                        sku: v.sku,
                    })),
                },
                images: {
                    create: imageFiles.map((file, index) => ({
                        url: file.path,
                        ordre: index,
                    })),
                },
            },
            include: { category: true, brand: true, variants: true, images: true },
        });

        res.status(201).json({ success: true, product: formatProduct(product) });
    } catch (error) {
        next(error);
    }
};

// PUT /api/admin/products/:id
// Met à jour les champs simples du produit (pas les variantes/images ici, géré séparément pour rester simple).
export const updateProduct = async (req, res, next) => {
    try {
        const { nom, description, category_id, brand_id, prix, prix_promo, actif } = req.body;

        const product = await prisma.product.update({
            where: { id: req.params.id },
            data: {
                ...(nom !== undefined && { nom }),
                ...(description !== undefined && { description }),
                ...(category_id !== undefined && { category_id }),
                ...(brand_id !== undefined && { brand_id }),
                ...(prix !== undefined && { prix: parseFloat(prix) }),
                ...(prix_promo !== undefined && { prix_promo: prix_promo ? parseFloat(prix_promo) : null }),
                ...(actif !== undefined && { actif }),
            },
            include: { category: true, brand: true, variants: true, images: true },
        });

        res.status(200).json({ success: true, product: formatProduct(product) });
    } catch (error) {
        next(error);
    }
};

// DELETE /api/admin/products/:id
export const deleteProduct = async (req, res, next) => {
    try {
        await prisma.product.delete({ where: { id: req.params.id } });
        res.status(200).json({ success: true, message: "Produit supprimé." });
    } catch (error) {
        next(error);
    }
};

// GET /api/admin/products/meta/categories-brands
// Renvoie catégories (avec parent/enfants) et marques, pour peupler les <select> du formulaire.
export const getCategoriesAndBrands = async (req, res, next) => {
    try {
        const [categories, brands] = await Promise.all([
            prisma.category.findMany({
                include: { children: true },
                orderBy: { nom: "asc" },
            }),
            prisma.brand.findMany({ orderBy: { nom: "asc" } }),
        ]);

        res.status(200).json({ success: true, categories, brands });
    } catch (error) {
        next(error);
    }
};