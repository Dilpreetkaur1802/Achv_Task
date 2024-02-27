import jwt from "jsonwebtoken";

const Middleware = {
  loginCheck: (req, res, next) => {
    try {
      const token =
        req.cookies?.token ||
        req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        return res.status(403).json({
          success: false,
          message: "You are not logged in!",
        });
      }
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error verifying the token!",
        error,
      });
    }
  },
};
export { Middleware };
