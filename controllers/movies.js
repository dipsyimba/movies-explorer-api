/* eslint-disable eqeqeq */
const Movie = require('../models/movie');

const DatabaseError = require('../errors/databaseError');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');
const IncorrectValueError = require('../errors/incorrectValueError');

// const getMovies = (req, res, next) => {
//   const userId = req.user._id;
//   Movie.find({})
//     .orFail(new DatabaseError('В базе данных отсутствуют фильмы'))
//     .then((movies) => {
//       const likedMovies = movies.filter((movie) => movie.likes.some((i) => i == userId));
//       res.send(likedMovies);
//     })
//     .catch((error) => next(error));
// };

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
    likes: userId,
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

const likeMovie = (req, res, next) => {
  const userId = req.user._id;
  Movie.findByIdAndUpdate(
    req.params.movieId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .then((addLike) => {
      res.send(addLike);
    })
    .catch((err) => {
      res.send(err);
      next(err);
    });
};

const dislikeMovie = (req, res, next) => {
  const userId = req.user._id;
  const { movieId } = req.params;
  Movie.findByIdAndUpdate(
    movieId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .then((dislike) => {
      if (!dislike) {
        throw new NotFoundError('Не найдено');
      }
      res.send(dislike);
    })
    .catch(next);
};

module.exports = {
  getMovies,
  deleteMovie,
  createMovie,
  likeMovie,
  dislikeMovie,
};
