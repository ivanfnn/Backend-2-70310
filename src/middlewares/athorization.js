export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).send({ status: "error", message: "Access denied: Admins only" });
  }
  next();
};

export const authorizeUser = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(403).send({ status: "error", message: "Access denied: Users only" });
  }
  next();
};