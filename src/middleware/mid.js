let jwt = require("jsonwebtoken");
let mongoose=require('mongoose')
let BookModel = require("../models/BooksModel");
const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId);
  };

let authent = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token) {
      return res.status(404).send({ status: false, msg: "token not found" });
    }
    let decodetoken = jwt.verify(token, "shubham kumar");
    if (!decodetoken) {
      return res
        .status(401)
        .send({ status: false, msg: "you are not authenticated" });
    }
    next();
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};
// ===================================================================================================
let authorise = async function (req, res, next) {
  try {
    let bookId = req.params.bookId;
    
    if (!bookId) {
      return res
        .status(400)
        .send({ status: false, msg: "bookId is required for authorisation" });
    }
    if(!isValidObjectId(bookId)){return res.status(400).send({status:false,msg:"invalid bookid"})}
    let token = req.headers["x-api-key"];
    let decodetoken = jwt.verify(token, "shubham kumar");
    if (!decodetoken) {
      return res
        .status(401)
        .send({ status: false, msg: "you are not authenticated" });
    }
    let bookid = await BookModel.findById(bookId);

    let BooktobeModified = bookid.userId;
    let userloggedin = decodetoken.userId;
    if (BooktobeModified != userloggedin) {
      return res
        .status(403)
        .send({ status: false, msg: "you are not authorised" });
      
    }
    next()
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

module.exports.authent = authent;
module.exports.authorise = authorise;
