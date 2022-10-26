const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const { signupValidation, signinValidation } = require('../middlewares/validaton');
const routerUsers = require('./users');
const routerMovies = require('./movies');
const auth = require('../middlewares/auth');

router.post('/signin', signinValidation, login);

router.post('/signup', signupValidation, createUser);

router.post('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Bye' });
});

router.use('/users', auth, routerUsers);
router.use('/movies', auth, routerMovies);

module.exports = router;
