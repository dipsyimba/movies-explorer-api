const router = require('express').Router();

const {
  getCurrentUser,
  updateUser,
} = require('../controllers/users');
const { updateUserValidation } = require('../middlewares/celebrate');

router.get('/me', getCurrentUser);
router.patch('/me', updateUserValidation, updateUser);

module.exports = router;
