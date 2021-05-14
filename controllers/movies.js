const Movie = require('../models/movie');

const DatabaseError = require('../errors/databaseError');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');
const IncorrectValueError = require('../errors/incorrectValueError');

const getMovies = (req, res, next) => {
  Movie.find({})
    .orFail(new DatabaseError('В базе данных отсутствуют фильмы'))
    .then((movies) => {
      res.send(movies);
    })
    .catch((error) => next(error));
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new NotFoundError('Такой фильм отсутствует'))
    .then((movie) => {
      if (req.user._id === String(movie.owner)) {
        return movie.remove()
          .then(() => res.send({ message: 'Фильм удалён' }));
      }
      throw new ForbiddenError('У вас нет прав удалять этот фильм!');
    })
    .catch((err) => {
      if (err === 'CastError') {
        next(new NotFoundError('Такой фильм отсутствует'));
      }
      next(err);
    });
};

const createMovie = (req, res, next) => {
  const userId = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = { ...req.body };

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: userId,
  })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectValueError('Введены некорректные данные'));
      }
      next(err);
    });
};

module.exports = {
  getMovies,
  deleteMovie,
  createMovie,
};
