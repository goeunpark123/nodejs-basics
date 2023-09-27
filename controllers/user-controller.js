const User = require("../models/user");
const HttpError = require("../models/http-error");

const getUsers = async (req, res, next) => {
  let users;

  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError("Fetching Failed.", 500);

    return next(error);
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Something went wrong!", 500);

    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("Your email is already exists.", 422);

    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    password,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Fail to sign up!", 500);

    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  let name;

  try {
    existingUser = await User.findOne({ email: email });
    name = existingUser.name;
  } catch (err) {
    const error = new HttpError("Something went wrong!", 500);

    return next(error);
  }

  if (!existingUser || existingUser.password != password) {
    const error = new HttpError("Invalid input!", 401);

    return next(error);
  }

  res.json({
    message: "Welcome!",
    user: existingUser.toObject({ getters: true }),
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
