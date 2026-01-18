import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  let token = req.cookies?.accessToken;

  if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      userId: payload.userId,
      orgId: payload.orgId,
    };

    // console.log(req.user);

    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
 