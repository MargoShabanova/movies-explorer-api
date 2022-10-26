const router = require('express').Router();
const { newMovieValidation, deleteMovieValidation } = require('../middlewares/validaton');
const {
  getUserMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getUserMovies);

router.post('/', newMovieValidation, createMovie);

router.delete('/:id', deleteMovieValidation, deleteMovie);

module.exports = router;
