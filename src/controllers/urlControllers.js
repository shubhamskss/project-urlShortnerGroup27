const urlModel=require("../models/urlmodel")

const validUrl = require("valid-url")
const shortid = require('shortid')
const baseUrl = 'http:localhost:3000'

const isvalidStringOnly = function (value) {
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
  };
  
  const isValidRequestBody = RequestBody => {
    return Object.keys(RequestBody).length > 0 ;
  };

const urlshorten= async function (req,res){
try{
    const longUrl=req.body.longUrl
    if(!isValidRequestBody(req.body)){return res.status(400).send({status:false,msg:"you can't send empty body"})}
    if(!isvalidStringOnly(longUrl)){return res.status(400).send({status:false,msg:"please give link"})}
    if (!validUrl.isUri(baseUrl)) {
        return res.status(400).send({status:false,msg:'Invalid base URL'})
    }


    // if valid, we create the url code
    const urlCode = shortid.generate()

    if (validUrl.isUri(longUrl)){
        let url = await urlModel.findOne({
            longUrl
        }).select({_id:0,__v:0})
        

        // url exist and return the respose
        if (url) {
            res.status(200).send({status:true,data:url})
        } else {
            // join the generated short code the the base url
            const shortUrl = baseUrl + '/' + urlCode

            // invoking the Url model and saving to the DB
            url = new urlModel({
                longUrl,
                shortUrl,
                urlCode,
                // date: new Date()
            })
            await url.save()
            const result={
               longUrl:url.longUrl,
                shortUrl:url.shortUrl,
                urlCode:url.urlCode,
            }
            console.log(result)
            res.status(200).send({status:true,data:result})
        }
    }
        else {
            res.status(400).send('Invalid longUrl')
        }

    


}   
catch(err){   
    res.status(500).send({status:false,error:err.message})
}}
// ==============================================================================================================

let geturl=async function(req,res){
try{
    let urlCode=req.params.urlCode
    if(!isvalidStringOnly(urlCode)){return res.status(400).send({status:false,msg:"not valid urlCode"})}
    // if(!validUrl.isUri(urlCode)){return res.status(400).send({status:false,msg:"invalid urlCode"})}
    let fetchUrl=await urlModel.findOne({urlCode}).select({_id:0,__v:0})
    // if(!fetchUrl){return res.status(404).send({status:false,msg:"url not found"})}
    if(!fetchUrl){return res.status(404).send({status:false,msg:" this urlCode not found"})}

    res.status(300).redirect(fetchUrl.longUrl)
}
    
    catch(err){res.status(500).send({status:false,error:err.message})}

}

module.exports.urlshorten=urlshorten
module.exports.geturl=geturl