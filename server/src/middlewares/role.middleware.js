const roleMiddleware = (rolesAutorises) => {
  return (req, res, next) => {
    if (!req.user || !rolesAutorises.includes(req.user.role)) {
      return res.status(403).json({
        succes: false,
        message: "Accès refusé, permissions insuffisantes"
      });
    }
    next();
  };
};

export default roleMiddleware;