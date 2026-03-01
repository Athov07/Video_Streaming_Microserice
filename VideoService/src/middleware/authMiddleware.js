import jwt from "jsonwebtoken";

// Middleware to protect VideoService routes
export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify token using the same secret as AuthService
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // decoded should have user info (id, email, etc.)
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};