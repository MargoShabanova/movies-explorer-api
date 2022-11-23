const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const { signupValidation, signinValidation } = require('../middlewares/validaton');
const routerUsers = require('./users');
const routerMovies = require('./movies');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');
const { PAGE_NOT_FOUND_ERROR_MESSAGE } = require('../utils/constants');

router.post('/signin', signinValidation, login);

router.post('/signup', signupValidation, createUser);

router.use(auth);

router.post('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Bye' });
});

router.use('/users', routerUsers);
router.use('/movies', routerMovies);

router.use('*', (req, res, next) => {
  next(new NotFoundError(PAGE_NOT_FOUND_ERROR_MESSAGE));
});

module.exports = router;
