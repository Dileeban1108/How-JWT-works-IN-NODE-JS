const jwt = require("jsonwebtoken");

// Generate access token (with user ID)
const generateAccessToken = (user) => {
  return jwt.sign(
    { userInfo: { id: user._id } }, // Using the user ID
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" } // Short expiration for security
  );
};

// Generate refresh token (with user ID)
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id }, // Using the user ID
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" } // Longer expiration for refresh tokens
  );
};

module.exports = { generateAccessToken, generateRefreshToken };
