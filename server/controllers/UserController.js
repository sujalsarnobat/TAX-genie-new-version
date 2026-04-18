const bcrypt = require('bcryptjs');
const generateToken = require('../Config/generateToken');
const userModel = require('../Models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Signup controller
exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await userModel.getUserByEmail(email);
  if (existingUser) {
    throw new AppError('Email already registered', 409);
  }

  // Hash password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user using model
  const user = await userModel.createUser({
    first_name: name,
    email,
    password: hashedPassword,
  });

  if (!user) {
    throw new AppError('Failed to create user', 500);
  }

  const token = generateToken(user.id);

  res.status(201).json({
    status: 'success',
    token,
    user: { id: user.id, first_name: user.first_name, email: user.email },
  });
});

// Login controller
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.getUserByEmail(email);
  if (!user) {
    throw new AppError('No account found with this email', 404);
  }

  // Compare hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError('Incorrect password', 401);
  }

  const token = generateToken(user.id);
  res.json({
    status: 'success',
    token,
    message: 'Success',
    user: { id: user.id, first_name: user.first_name, email: user.email },
  });
});
