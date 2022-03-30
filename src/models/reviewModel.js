let mongoose=require('mongoose')
let reviewSchema=new mongoose.Schema({
    bookId: {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Bookgroup27'},
    reviewedBy: {type:String,
        required:true,
        default:"Guest"},
    reviewedAt: {type:Date,
        required:true,},
    rating: {type:Number,
         enum:[1,2,3,4,5],
        required:true,},
    review: {type:String},
    isDeleted: {type:Boolean,
        default:false},

})
module.exports=mongoose.model("/reviewgroup27",reviewSchema)