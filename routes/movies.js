const router = require('express').Router();

const {
  getMovies,
  deleteMovie,
  createMovie,
} = require('../controllers/movies');

const {
  createMovieValidation,
  deleteMovieValidation,
} = require('../middlewares/celebrate');

router.get('/', getMovies);
router.post('/', createMovieValidation, createMovie);
router.delete('/:movieId', deleteMovieValidation, deleteMovie);

module.exports = router;
