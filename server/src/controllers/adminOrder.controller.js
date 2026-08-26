import * as orderService from "../services/order.service.js";

const STATUTS_VALIDES = ["en_attente", "confirmee", "expediee", "livree", "annulee"];

export const listOrders = async (req, res, next) => {
  try {
    const { statut } = req.query;
    if (statut && !STATUTS_VALIDES.includes(statut)) {
      return res.status(400).json({ succes: false, message: "Statut invalide" });
    }
    const orders = await orderService.getAllOrdersAdmin({ statut: statut || undefined });
    res.status(200).json({ succes: true, orders });
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ succes: false, message: "Commande introuvable" });
    res.status(200).json({ succes: true, order });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { statut } = req.body;
    if (!STATUTS_VALIDES.includes(statut)) {
      return res.status(400).json({ succes: false, message: "Statut invalide" });
    }
    const vendorOrder = await orderService.updateOrderStatusByOrderId(req.params.id, statut);
    res.status(200).json({ succes: true, vendorOrder });
  } catch (error) {
    next(error);
  }
};