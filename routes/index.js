const router = require('express').Router();
const auth = require('../middlewares/auth');

const { login, createUser, signOut } = require('../controllers/users');
const {
  createUserValidation,
  loginValidation,
} = require('../middlewares/celebrate');
const NotFoundError = require('../errors/notFoundError');

// router.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });

router.post('/signin', loginValidation, login);
router.post('/signup', createUserValidation, createUser);
router.use(auth);

router.delete('/signout', signOut);
router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

module.exports = router;
