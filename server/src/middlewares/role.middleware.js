// middleware/roleMiddleware.js
//
// Doit toujours être utilisé APRÈS authMiddleware, puisqu'il dépend
// de req.user posé par le decode du JWT.

/**
 * Restreint l'accès à une route selon le(s) rôle(s) autorisé(s).
 * Usage : router.post("/produits", authMiddleware, requireRole("vendeur"), ...)
 *         router.get("/admin/vendeurs", authMiddleware, requireRole("admin"), ...)
 *         router.patch("/x", authMiddleware, requireRole("vendeur", "admin"), ...)
 */
const requireRole = (...rolesAutorises) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Non autorisé",
      });
    }

    if (!rolesAutorises.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Accès refusé : rôle insuffisant",
      });
    }

    next();
  };
};

export default requireRole;