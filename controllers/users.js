const { NODE_ENV, JWT_SECRET } = process.env;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');
const {
  BAD_REQUEST_ERROR_MESSAGE,
  CONFLICT_ERROR_MESSAGE,
  USER_NOT_FOUND_ERROR_MESSAGE,
} = require('../utils/constants');

// const createUser = (req, res, next) => {
//   const {
//     email,
//     password,
//     name,
//   } = req.body;

//   bcrypt.hash(password, 10)
//     .then((hash) => User.create({
//       email,
//       password: hash,
//       name,
//     }))
//     .then((user) => {
//       res.status(201).send({
//         _id: user._id,
//         name: user.name,
//         email,
//       });
//     })
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         next(new BadRequestError(BAD_REQUEST_ERROR_MESSAGE));
//         return;
//       }
//       if (err.code === 11000) {
//         next(new ConflictError(CONFLICT_ERROR_MESSAGE));
//         return;
//       }
//       next(err);
//     });
// };

const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        { expiresIn: '7d' },
      );
      return res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        })
        .send({
          _id: user._id,
          name: user.name,
          email: user.email,
          token,
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(BAD_REQUEST_ERROR_MESSAGE));
        return;
      }
      if (err.code === 11000) {
        next(new ConflictError(CONFLICT_ERROR_MESSAGE));
        return;
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        { expiresIn: '7d' },
      );
      return res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        })
        .send({
          _id: user._id,
          name: user.name,
          email: user.email,
          token,
        });
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError(USER_NOT_FOUND_ERROR_MESSAGE));
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError(BAD_REQUEST_ERROR_MESSAGE));
        return;
      }
      if (err.code === 1100) {
        next(new ConflictError(CONFLICT_ERROR_MESSAGE));
        return;
      }
      next(err);
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUser,
};
