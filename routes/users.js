const router = require('express').Router();
const { updateUserValidation } = require('../middlewares/validaton');
const {
  updateUser,
  getCurrentUser,
} = require('../controllers/users');

router.get('/me', getCurrentUser);

router.patch('/me', updateUserValidation, updateUser);

module.exports = router;
