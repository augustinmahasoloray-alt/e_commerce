import * as vendorService from "../services/vendor.service.js";

export const applyAsVendor = async (req, res, next) => {
  try {
    const vendor = await vendorService.registerVendor(req.user.id, req.body);
    res.status(201).json({ succes: true, vendor });
  } catch (error) {
    next(error);
  }
};

export const getMyVendorProfile = async (req, res, next) => {
  try {
    const vendor = await vendorService.getVendorProfile(req.user.id);
    if (!vendor) {
      return res.status(404).json({ succes: false, message: "Profil boutique introuvable" });
    }
    res.status(200).json({ succes: true, vendor });
  } catch (error) {
    next(error);
  }
};

export const updateMyVendorProfile = async (req, res, next) => {
  try {
    const vendor = await vendorService.updateVendorProfile(req.vendor.id, req.body);
    res.status(200).json({ succes: true, vendor });
  } catch (error) {
    next(error);
  }
};

export const getMySolde = async (req, res, next) => {
  try {
    const solde = await vendorService.getVendorSolde(req.vendor.id);
    res.status(200).json({ succes: true, solde });
  } catch (error) {
    next(error);
  }
};

export const getMyDashboard = async (req, res, next) => {
  try {
    const dashboard = await vendorService.getVendorDashboard(req.vendor.id);
    res.status(200).json({ succes: true, dashboard });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await vendorService.getVendorOrders(req.vendor.id, { statut: req.query.statut });
    res.status(200).json({ succes: true, orders });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    // req.resource posé par requireOwnership("vendorOrder") en amont
    const vendorOrder = await vendorService.updateVendorOrderStatus(req.params.id, req.body.statut);
    res.status(200).json({ succes: true, vendorOrder });
  } catch (error) {
    next(error);
  }
};

// ============ ADMIN ============

export const listVendors = async (req, res, next) => {
  try {
    const vendors = await vendorService.listVendorsByStatus(req.query.statut);
    res.status(200).json({ succes: true, vendors });
  } catch (error) {
    next(error);
  }
};

export const validateVendor = async (req, res, next) => {
  try {
    const vendor = await vendorService.validateVendor(req.params.id);
    res.status(200).json({ succes: true, vendor });
  } catch (error) {
    next(error);
  }
};

export const rejectVendor = async (req, res, next) => {
  try {
    const vendor = await vendorService.rejectVendor(req.params.id);
    res.status(200).json({ succes: true, vendor });
  } catch (error) {
    next(error);
  }
};

export const suspendVendor = async (req, res, next) => {
  try {
    const vendor = await vendorService.suspendVendor(req.params.id);
    res.status(200).json({ succes: true, vendor });
  } catch (error) {
    next(error);
  }
};