const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^(https?:\/\/)(www\.)?[\w-]+(\.[a-z])+[\w~!@#$%&*()-+=:;\\'",.?/]+#?/gi.test(v);
      },
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^(https?:\/\/)(www\.)?[\w-]+(\.[a-z])+[\w~!@#$%&*()-+=:;\\'",.?/]+#?/gi.test(v);
      },
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^(https?:\/\/)(www\.)?[\w-]+(\.[a-z])+[\w~!@#$%&*()-+=:;\\'",.?/]+#?/gi.test(v);
      },
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  movieId: { // тут мне пока что не совсем понятно какого типа будет id
    type: String, // поставил пока что строку
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);