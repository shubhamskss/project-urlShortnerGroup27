let mongoose = require("mongoose");
let reviewSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Bookgroup27",
  },
  reviewedBy: { type: String, required: true, default: "Guest" },
  reviewedAt: { type: Date, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  review: { type: String },
  isDeleted: { type: Boolean, default: false },
});
module.exports = mongoose.model("/reviewgroup27", reviewSchema);
