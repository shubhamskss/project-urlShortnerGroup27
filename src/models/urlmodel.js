const mongoose=require('mongoose')
const urlSchema=new mongoose.Schema(
{
    // urlCode: { mandatory, unique, lowercase, trim }, longUrl: {mandatory, valid url}, shortUrl: {mandatory, unique} }
    urlCode:{
        type:String,
        unique:true,
    
        lowercase:true,
        trim:true
    },
    longUrl:{
        type:String,
        required:true,
        trim:true
    },
    shortUrl:{
type:String,
required:true


    },
}

)
module.exports=mongoose.model("urlSchema27",urlSchema)