import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Admin from "../models/admin.js";

const JWT_SECRET = process.env.JWT_SECRET || "queue-dev-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      mobile,
    });

    res.status(201).json({ message: "User registered" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user._id, "USER");

    res.json({ token, role: "USER" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ message: "Admin exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({
      name,
      email,
      password: hashedPassword,
      mobile,
    });

    res.status(201).json({ message: "Admin registered" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(admin._id, "ADMIN");

    res.json({ token, role: "ADMIN" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
