import jwt from "jsonwebtoken";

export const genrateToken = (user, message, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "5d",
  });

  res.status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",        // only secure in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 5 * 24 * 60 * 60 * 1000,
    })
    .json({
      success: true,
      message,
      user,
      token,
    });
};
