import prisma from "../config/db.js";

// GET /api/admin/dashboard/stats
export const getDashboardStats = async (req, res, next) => {
    try {
        const [productCount, pendingOrders, deliveredOrders, categoriesWithCount] = await Promise.all([
            prisma.product.count({ where: { actif: true } }),
            prisma.vendorOrder.count({ where: { statut: "en_attente" } }),
            prisma.vendorOrder.findMany({
                where: { statut: "livree" },
                select: { montant_net: true },
            }),
            prisma.category.findMany({
                where: { parent_id: null },
                include: {
                    children: {
                        include: { _count: { select: { products: true } } },
                    },
                    _count: { select: { products: true } },
                },
            }),
        ]);

        const revenue = deliveredOrders.reduce((sum, o) => sum + Number(o.montant_net), 0);

        // Aplati : univers + ses sous-catégories, avec le nombre de produits de chacune
        const categoryStats = categoriesWithCount.flatMap((parent) => {
            const rows = parent.children.length
                ? parent.children.map((child) => ({ nom: child.nom, count: child._count.products }))
                : [{ nom: parent.nom, count: parent._count.products }];
            return rows;
        });

        res.status(200).json({
            success: true,
            stats: {
                produits_actifs: productCount,
                commandes_en_attente: pendingOrders,
                chiffre_affaires: revenue,
                produits_par_categorie: categoryStats,
            },
        });
    } catch (error) {
        next(error);
    }
};