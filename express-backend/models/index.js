// Central model loader - require this from app.js to register all mongoose models

require('./user');
require('./detection');
require('./category');

// Optionally export models for convenience
const mongoose = require('mongoose');

module.exports = {
  User: mongoose.model('User'),
  Detection: mongoose.model('Detection'),
  Category: mongoose.model('Category')
};
