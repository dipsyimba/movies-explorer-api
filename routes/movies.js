const router = require('express').Router();

const {
  getMovies,
  deleteMovie,
  createMovie,
  likeMovie,
  dislikeMovie,
} = require('../controllers/movies');

const {
  createMovieValidation,
  deleteMovieValidation,
  changeLikeValidation,
} = require('../middlewares/celebrate');

router.get('/', getMovies);
router.post('/', createMovieValidation, createMovie);
router.put('/:movieId/likes', changeLikeValidation, likeMovie);
router.delete('/:movieId/likes', changeLikeValidation, dislikeMovie);
router.delete('/:movieId', deleteMovieValidation, deleteMovie);

module.exports = router;
