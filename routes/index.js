const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { login, createUser } = require('../controllers/users');
const routerUsers = require('./users');
const routerMovies = require('./movies');
const auth = require('../middlewares/auth');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

router.post('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Bye' });
});

// router.use(auth);

router.use('/users', auth, routerUsers);
router.use('/movies', auth, routerMovies);

module.exports = router;
