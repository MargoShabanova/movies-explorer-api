const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUserMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const { pattern } = require('../utils/pattern');

router.get('/', getUserMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().uri().regex(pattern).required(),
    trailerLink: Joi.string().uri().regex(pattern).required(),
    thumbnail: Joi.string().uri().regex(pattern).required(),
    movieId: Joi.string().required().hex().length(24),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

router.delete('/:id', celebrate({
  params: Joi.object().keys({
    objectId: Joi.string().required().hex().length(24),
  }),
}), deleteMovie);

module.exports = router;
