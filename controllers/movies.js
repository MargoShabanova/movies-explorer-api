const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');

const MESSAGE_404 = 'Фильм не найден.';

const getUserMovies = (req, res, next) => {
  Movie.find({ ...req.body, owner: req.user._id }).sort({ createdAt: -1 })
    .then((movies) => {
      res.send(movies);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError());
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
        next(new BadRequestError());
        return;
      }
      next(err);
    });
};

const deleteMovie = (req, res, next) => {
  const { objectId } = req.params;

  Movie.findById(objectId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(MESSAGE_404);
      }
      if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError();
      }
      Movie.findByIdAndRemove(objectId)
        .then(() => {
          res.send({ data: movie });
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            next(new BadRequestError());
            return;
          }
          next(err);
        });
    })
    .catch(next);
};

module.exports = {
  getUserMovies,
  createMovie,
  deleteMovie,
};
