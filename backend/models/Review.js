const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  product: { type: Schema.Types.ObjectId, ref: 'Product' },
  rating: { type: Number, min: 1, max: 5 },
  text: String,
  photos: [String],
   reply: {
    text: String,
    date: Date
  },
}, { timestamps: true });
module.exports = mongoose.model('Review', reviewSchema);
