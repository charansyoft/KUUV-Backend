import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { unauthorized } from "../responses/errorResponses.js";
import User from "../models/userModel.js";

dotenv.config();

const verifyToken = (req, res, next) => {
  try {
    const secretKey = process.env.JWT_SECRET_KEY;
    const { authorization } = req.headers;

    console.log("Authorization Header Received:", authorization); // Debugging

    if (!authorization) {
      console.log("Error: Token not found");
      return unauthorized(res, "Token not found");
    }

    const tokenParts = authorization.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      console.log("Error: Invalid Token Format:", authorization);
      return unauthorized(
        res,
        "Invalid token format. Expected 'Bearer <token>'"
      );
    }

    const token = tokenParts[1];

    console.log("Extracted Token:", token);

    // Check if the JWT secret key is correctly loaded
    if (!secretKey) {
      console.error("Error: JWT_SECRET_KEY is missing in .env file");
      return unauthorized(res, "Internal server error");
    }

    jwt.verify(token, secretKey, async (err, decoded) => {
      console.log(decoded);
      if (err) {
        console.error("JWT Verification Error:", err.message);
        if (err.name === "TokenExpiredError") {
          return unauthorized(res, "Token has expired, please log in again");
        }
        return unauthorized(res, "Invalid or expired token");
      }

      // ✅ Fetch phone from DB using decoded._id
      try {
        const user = await User.findById(decoded._id).select("phone");
        if (!user) {
          return unauthorized(res, "User not found");
        }

        // ✅ Append phone to decoded token
        decoded.phone = user.phone;
        console.log("Decoded Token Data with Phone:", decoded);
        req.user = decoded;
        next();
      } catch (dbError) {
        console.error("Error fetching user:", dbError.message);
        return unauthorized(res, "Error fetching user data");
      }
    });
  } catch (error) {
    console.error("Token verification error:", error.message);
    return unauthorized(res, "Token verification error");
  }
};

export default verifyToken;
