const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');
const {
  BAD_REQUEST_ERROR_MESSAGE,
  MOVIE_NOT_FOUND_ERROR_MESSAGE,
  FORBIDDEN_ERROR_MESSAGE,
} = require('../utils/constants');

const getUserMovies = (req, res, next) => {
  Movie.find({ ...req.body, owner: req.user._id }).sort({ createdAt: -1 })
    .then((movies) => {
      res.send(movies);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(BAD_REQUEST_ERROR_MESSAGE));
        return;
      }
      next(err);
    });
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const ownerId = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: ownerId,
  })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(BAD_REQUEST_ERROR_MESSAGE));
        return;
      }
      next(err);
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(MOVIE_NOT_FOUND_ERROR_MESSAGE);
      }
      if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError(FORBIDDEN_ERROR_MESSAGE);
      }
      Movie.findByIdAndRemove(req.params.movieId)
        .then(() => {
          res.send({ data: movie });
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(BAD_REQUEST_ERROR_MESSAGE));
        return;
      }
      next(err);
    });
};

module.exports = {
  getUserMovies,
  createMovie,
  deleteMovie,
};
