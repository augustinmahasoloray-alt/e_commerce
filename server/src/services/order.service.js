import prisma from "../config/db.js";

export const createOrder = async (userId, { address_id, mode_paiement, mode_livraison, items, coupon_id }) => {
  return prisma.$transaction(async (tx) => {
    let montant_total = 0;
    const itemsAvecVraiPrix = [];

    for (const item of items) {
      const variant = await tx.productVariant.findUnique({
        where: { id: item.variant_id },
        include: { product: true },
      });

      if (!variant) {
        throw new Error(`Variante ${item.variant_id} introuvable`);
      }
      if (variant.stock < item.quantite) {
        throw new Error(`Stock insuffisant pour ${variant.product.nom}`);
      }

      const prixReel = Number(variant.product.prix);
      montant_total += prixReel * item.quantite;

      itemsAvecVraiPrix.push({
        variant_id: item.variant_id,
        quantite: item.quantite,
        prix_unitaire: prixReel,
      });

      await tx.productVariant.update({
        where: { id: item.variant_id },
        data: { stock: { decrement: item.quantite } },
      });
    }

    const order = await tx.order.create({
      data: {
        user_id: userId,
        address_id,
        coupon_id,
        mode_paiement,
        mode_livraison,
        montant_total,
        items: { create: itemsAvecVraiPrix },
      },
      include: { items: true },
    });

    return order;
  });
};

export const getOrdersByUser = async (userId) => {
  return prisma.order.findMany({
    where: { user_id: userId },
    include: { items: true, address: true },
    orderBy: { date_commande: "desc" },
  });
};

export const getOrderById = async (id) => {
  return prisma.order.findUnique({
    where: { id },
    include: { items: { include: { variant: { include: { product: true } } } }, address: true, user: true },
  });
};

export const updateOrderStatus = async (id, statut) => {
  return prisma.order.update({ where: { id }, data: { statut } });
};