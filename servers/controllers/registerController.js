const bcrypt = require("bcrypt");
const User = require("../models/User");

const checkDuplicateEmail = async (email) => {
  const userCheck = User.findOne({ email: email }).exec();

  const [user] = await Promise.all([
    userCheck
  ]);

  return user;
};

const handleNewUser = async (req, res) => {
  const {
    username,
    studentnumber,
    email,
    password,
    phone,
    faculty,
    department,
  } = req.body;

  if (!username || !password || !email) {
    return res
      .status(400)
      .json({ message: "Email, username, and password are required" });
  }

  const duplicateUser = await checkDuplicateEmail(email);

  if (duplicateUser) {
    return res.status(409).json({ message: "Email already exists" });
  }

  try {
    const hashedPWD = await bcrypt.hash(password, 10);

    // Remove slashes from studentnumber
    const cleanedStudentnumber = studentnumber.replace(/\//g, "");

    const newUser = await User.create({
      username: username,
      studentnumber: cleanedStudentnumber,
      email: email,
      password: hashedPWD,
      phone: phone,
      department: department,
      faculty: faculty,
    });

    console.log(newUser);

    res
      .status(200)
      .json({ success: `New user with username ${username} created` });
  } catch (error) {
    res.status(500).json({ error: `${error.message}` });
  }
};



module.exports = {handleNewUser};
