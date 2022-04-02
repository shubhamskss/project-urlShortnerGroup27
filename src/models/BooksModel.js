const mongoose = require('mongoose')
const BookSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        unique: true
    },
    excerpt: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "usergroup27"
    },
    ISBN: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true
    },
    subcategory: {
        type:[{type:String}],
        required:true
    },
    reviews: {
        type: Number,
        default: 0,
    },
    deletedAt: {
        type: Date,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    releasedAt: {
        type: Date,
        required: true,
        default:null,
    
    },
    bookCover:String,

}, { timestamps: true })
module.exports = mongoose.model("Bookgroup27", BookSchema)