const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const IncorrectValueError = require('../errors/incorrectValueError');
const AuthError = require('../errors/authError');
const NotFoundError = require('../errors/notFoundError');
const EmailError = require('../errors/emailError');

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Такой пользователь отсутствует'))
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError('Такой пользователь не найден'))
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, email, password: hash,
      })
        .then((user) => res.send({
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
          },
        }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new IncorrectValueError('Введены некорректные данные'));
          } else if (err.code === 11000) {
            next(new EmailError('Пользователь с таким email уже существует'));
          }
          next(err);
        });
    });
};

const updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { email, name } = { ...req.body };

  if (!name || !email) {
    throw new IncorrectValueError('Имя и/или email не могут быть пустыми!');
  }

  User.findByIdAndUpdate(
    userId,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new NotFoundError('Такой пользователь отсутствует'))
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new IncorrectValueError('Введены некорректные данные'));
      }
      next(error);
    });
};

function login(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new IncorrectValueError('Не введены почта или пароль');
  }

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Почта или пароль введены неверно');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError('Почта или пароль введены неверно');
          }

          const token = jwt.sign(
            { _id: user.id },
            NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
            { expiresIn: '7d' },
          );

          return res.cookie('jwt', token,
            {
              maxAge: 3600000,
              httpOnly: true,
              sameSite: true,
            }).send({ message: 'Аутентификация успешно завершена' });
        });
    })
    .catch((err) => {
      if (err.message.includes('Illegal arguments')) {
        next(new IncorrectValueError('Введены некорректные данные'));
      }

      next(err);
    });
}

function signOut(req, res, next) {
  res.clearCookie('jwt').send({ message: 'cookie удалена' });
  next();
}

module.exports = {
  getUserById,
  createUser,
  updateUser,
  getCurrentUser,
  login,
  signOut,
};
