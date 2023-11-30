const asyncWrapper = require("../middelware/asyncWrapper");
const User = require("../models/user.model");
const generateJWT = require("../utils/generateJWT");
const httpStatusText = require('../utils/httpStatusText');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getAllUsers = asyncWrapper(async (req,res) => {
  console.log(req.headers);
    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;

    const users = await User.find({}, {"__v":false, 'password':false}).limit(limit).skip(skip);
    res.json({ status: httpStatusText.SUCCESS, data: {users}});
})

const register = asyncWrapper(async (req, res) => {
  const {firstName, lastName, email, password, role } = req.body;

  const oldUser = await User.findOne({ email: email});
  if(oldUser) {
    return res.status(400).json({status: httpStatusText.ERROR, message: "User already exist"});
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    avatar: req.file.filename
  })

  // generate JWT token
  const token = await generateJWT({email: newUser.email, id: newUser._id, role: newUser.role});
  newUser.token = token;

  await newUser.save();
  res.json({ status: httpStatusText.SUCCESS, data: {user: newUser}});
})

const login = asyncWrapper(async (req, res) => {
  const {email, password} = req.body;
  if(!email && !password) {
    return res.status(400).json({status: httpStatusText.ERROR, message: "email and password are required"});
  }
  const user = await User.findOne({email: email});
  if(!user) {
    return res.status(400).json({status: httpStatusText.ERROR, message: "user not found"});
  }

  const matchedPassword = await bcrypt.compare(password, user.password);


  if(user && matchedPassword) {
    //logged in successfully
    const token = await generateJWT({email: user.email, id: user._id, role: user.role});
    return  res.json({ status: httpStatusText.SUCCESS, data: {token}});
  } else {
    return res.status(500).json({status: httpStatusText.ERROR, message: "something wrong"});
  }
})

module.exports = {
    getAllUsers,
    register,
    login
}