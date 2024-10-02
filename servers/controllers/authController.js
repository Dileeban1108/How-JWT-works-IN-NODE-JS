const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../../servers/utills/generateTokens");

// Handle login and issue access and refresh tokens
const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  let foundUser = await User.findOne({ email }).exec();
  if (!foundUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const matchPassword = await bcrypt.compare(password, foundUser.password);
  if (matchPassword) {
    // Generate tokens
    const accessToken = generateAccessToken(foundUser);
    const refreshToken = generateRefreshToken(foundUser);

    // Save refresh token in the database
    foundUser.refreshToken = refreshToken;
    await foundUser.save();

    // Set refresh token as an HTTP-only secure cookie
    res.cookie("jwt", refreshToken, {
      httpOnly: true, 
      secure: true, 
      sameSite: "None", 
      maxAge: 24 * 60 * 60 * 1000 // 1 day expiration
    });

    // Send access token to client
    res.json({ accessToken });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// Handle refresh token and issue new access and refresh tokens
const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const refreshToken = cookies.jwt;

  // Check if refresh token exists in the database
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    return res.status(403).json({ message: "Forbidden" });
  }

  // Verify refresh token
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
    if (err || foundUser._id.toString() !== decoded.id) {
      // If there is an error or the user ID in the token doesn't match the found user's ID
      return res.status(403).json({ message: "Forbidden" });
    }
  
    // Proceed to generate new access and refresh tokens
    const newRefreshToken = generateRefreshToken(foundUser);
    foundUser.refreshToken = newRefreshToken;
    await foundUser.save();
  
    // Set the new refresh token in the cookie
    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000
    });
  
    // Generate a new access token and send it back
    const newAccessToken = generateAccessToken(foundUser);
    res.json({ accessToken: newAccessToken });
  });
  
};

module.exports = {
  handleLogin,
  handleRefreshToken,
};
