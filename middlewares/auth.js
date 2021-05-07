const jwt = require('jsonwebtoken');
const AuthError = require('../errors/authError.js');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new AuthError('Токен не передан!');
  }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    req.user = payload;
    next();
  } catch (error) {
    next(new AuthError('Неправильный токен авторизации'));
  }
};

module.exports = auth;
