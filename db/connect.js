const mongoose = require('mongoose');

// Suppress deprication warning
mongoose.set('strictQuery', true);

const connectDB = (url) => {
  return mongoose.connect(url);
};

module.exports = connectDB;
