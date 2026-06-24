/**
 * User Service
 * Layer ini berisi business logic dan orkestrasi antar repository atau domain lain
 */

const userRepository = require("./repository");
const { UserResponse } = require("./dto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../../../.env") });

const secretKey = process.env.JWT_SECRET || "your-default-secret-key";

const getAllUsers = async () => {
  const users = await userRepository.findAll();
  return users.map((user) => UserResponse(user));
};

const login = async (email, password) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    secretKey,
    { expiresIn: "1d" },
  );

  return {
    user: UserResponse(user),
    token,
  };
};

const getUserById = async (id) => {
  const user = await userRepository.findById(id);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return UserResponse(user);
};

const createUser = async (userData) => {
  // Validate required fields
  if (!userData.name || !userData.email || !userData.password) {
    const error = new Error("Name, email, and password are required");
    error.statusCode = 400;
    throw error;
  }

  // Check if email already exists
  const existingUser = await userRepository.findByEmail(userData.email);
  if (existingUser) {
    const error = new Error("Email already registered");
    error.statusCode = 400;
    throw error;
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  const newUser = await userRepository.create({
    ...userData,
    password: hashedPassword,
  });

  return UserResponse(newUser);
};

const updateUser = async (id, userData) => {
  const user = await userRepository.findById(id);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  // If password is provided, hash it
  if (userData.password) {
    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);
  } else {
    delete userData.password;
  }

  // Check if email is being updated and if it's already taken
  if (userData.email && userData.email !== user.email) {
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      const error = new Error("Email already taken");
      error.statusCode = 400;
      throw error;
    }
  }

  const updatedUser = await userRepository.update(id, userData);
  return UserResponse(updatedUser);
};

const deleteUser = async (id) => {
  const user = await userRepository.findById(id);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return await userRepository.remove(id);
};

module.exports = {
  getAllUsers,
  login,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
