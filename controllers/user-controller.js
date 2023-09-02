const { v4: uuidv4 } = require("uuid");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Alex Claremont-Diaz",
    email: "theagcd@gmail.com",
    password: "hgejhsf",
  },
];

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

const signup = (req, res, next) => {
  const { name, email, password } = req.body;

  const error = validationResult(req);

  if (!error.isEmpty()) {
    throw new HttpError("Invalid input.", 422);
  }

  const existedUser = DUMMY_USERS.find((u) => u.email === email);

  if (existedUser) {
    throw new HttpError("Your email is already exists.", 422);
  }

  const createdUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };

  DUMMY_USERS.push(createdUser);

  res.status(201).json({ user: createdUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError("Wrong email or password!", 401);
  }

  res.json({ message: "Welcome!", identifiedUser });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
