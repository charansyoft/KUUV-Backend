import jwt from "jsonwebtoken";

export default async function generateToken({ user }) {
  try {
    const data = {
      _id: user?._id,
      email: user?.email,
      role: user?.role,
    };
    return jwt.sign(data, process.env.JWT_SECRET_KEY);
  } catch (err) {
    console.log({ err });
  }
}
