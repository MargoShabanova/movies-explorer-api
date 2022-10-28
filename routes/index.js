const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const { signupValidation, signinValidation } = require('../middlewares/validaton');
const routerUsers = require('./users');
const routerMovies = require('./movies');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');

router.post('/signin', signinValidation, login);

router.post('/signup', signupValidation, createUser);

router.use(auth);

router.post('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Bye' });
});

router.use('/users', routerUsers);
router.use('/movies', routerMovies);

router.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
