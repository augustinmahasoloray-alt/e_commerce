// server/src/controllers/adminProduct.controller.js
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
        etat: product.etat,
        livraison_gratuite: product.livraison_gratuite,
        livraison_express: product.livraison_express,
        categorie: product.category?.nom ?? null,
        marque: product.brand?.nom ?? null,
        stock_total: stockTotal,
        statut_stock: statutStock,
        images: product.images.map((img) => img.url),
        variants: product.variants,
    };
}

// Convertit une valeur venant d'un <input type="checkbox"> / FormData
// ("true", "on", "1"...) en vrai booléen. Absent ou "false" -> false.
function parseBoolean(value) {
    return value === "true" || value === "on" || value === "1";
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
//  - champs texte : nom, description, category_id, brand_id, prix, prix_promo (optionnel)
//  - etat : "neuf" | "reconditionne" | "occasion" (optionnel, défaut "neuf")
//  - livraison_gratuite, livraison_express : "true"/"false" (optionnels, défaut false)
//  - variants : JSON.stringify([{ taille, couleur, stock, sku }, ...])
//  - images : plusieurs fichiers (req.files, via multer.array("images"))
export const createProduct = async (req, res, next) => {
    try {
        const {
            nom,
            description,
            category_id,
            brand_id,
            prix,
            prix_promo,
            etat,
            livraison_gratuite,
            livraison_express,
            variants,
        } = req.body;

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

        const validConditions = ["neuf", "reconditionne", "occasion"];
        if (etat && !validConditions.includes(etat)) {
            return res.status(400).json({
                success: false,
                message: `État invalide. Valeurs acceptées : ${validConditions.join(", ")}.`,
            });
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
                etat: etat || "neuf",
                livraison_gratuite: parseBoolean(livraison_gratuite),
                livraison_express: parseBoolean(livraison_express),
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
        const {
            nom,
            description,
            category_id,
            brand_id,
            prix,
            prix_promo,
            actif,
            etat,
            livraison_gratuite,
            livraison_express,
        } = req.body;

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
                ...(etat !== undefined && { etat }),
                ...(livraison_gratuite !== undefined && { livraison_gratuite: parseBoolean(livraison_gratuite) }),
                ...(livraison_express !== undefined && { livraison_express: parseBoolean(livraison_express) }),
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
// Renvoie catégories (avec parent/enfants) et marques (avec leurs univers liés),
// pour peupler les <select> du formulaire ET filtrer les marques par univers côté frontend.
export const getCategoriesAndBrands = async (req, res, next) => {
    try {
        const [categories, brands] = await Promise.all([
            prisma.category.findMany({
                include: { children: true },
                orderBy: { nom: "asc" },
            }),
            prisma.brand.findMany({
                include: { categories: { select: { id: true, nom: true } } },
                orderBy: { nom: "asc" },
            }),
        ]);

        res.status(200).json({ success: true, categories, brands });
    } catch (error) {
        next(error);
    }
};

// GET /api/admin/products/meta/top-ventes?limit=5
// Calcule les produits les plus vendus à partir des vraies commandes (OrderItem),
// plutôt qu'un champ manuel — pas de valeur stockée qui pourrait se désynchroniser.
export const getTopSellingProducts = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 5;

        const orderItems = await prisma.orderItem.findMany({
            include: { variant: { select: { product_id: true } } },
        });

        const salesByProduct = {};
        for (const item of orderItems) {
            const productId = item.variant.product_id;
            salesByProduct[productId] = (salesByProduct[productId] || 0) + item.quantite;
        }

        const topProductIds = Object.entries(salesByProduct)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([productId]) => productId);

        if (topProductIds.length === 0) {
            return res.status(200).json({ success: true, topProducts: [] });
        }

        const products = await prisma.product.findMany({
            where: { id: { in: topProductIds } },
            include: {
                category: true,
                brand: true,
                images: { orderBy: { ordre: "asc" }, take: 1 },
            },
        });

        // findMany({ where: { id: { in } } }) ne garantit pas l'ordre : on réordonne
        // manuellement selon le classement réel des ventes.
        const topProducts = topProductIds
            .map((id) => {
                const product = products.find((p) => p.id === id);
                if (!product) return null;
                return {
                    id: product.id,
                    nom: product.nom,
                    categorie: product.category?.nom ?? null,
                    marque: product.brand?.nom ?? null,
                    image: product.images[0]?.url ?? null,
                    quantite_vendue: salesByProduct[id],
                };
            })
            .filter(Boolean);

        res.status(200).json({ success: true, topProducts });
    } catch (error) {
        next(error);
    }
};