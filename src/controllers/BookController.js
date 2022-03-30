const { default: mongoose } = require("mongoose");
let BookModel = require("../models/BooksModel");
const reviewModel = require("../models/reviewModel");
const UserModel = require("../models/UserModel");

const isValid = function (value) {
  if (typeof value === "undefined" || typeof value == "null") {
    return false;
  }

  if (typeof value === ("string" || "Array") && value.trim().length > 0) {
    return true;
  }
};

const isvalidStringOnly = function (value) {
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

isvalidRequesbody = function (requestbody) {
  if (Object.keys(requestbody).length > 0) {
    return true;
  }
};
const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId);
};

function isValidDate(dateString) {
  var regEx = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regEx)) return false; // Invalid format
  var d = new Date(dateString);
  var dNum = d.getTime();
  if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
  return d.toISOString().slice(0, 10) === dateString;
}

const createBook = async function (req, res) {
  try {
    const requestbody = req.body;

    let userid = requestbody.userId;

    if (!isValidObjectId(userid) && !isValid(userid)) {
      return res.status(400).send({ status: false, msg: "incorrect userid" });
    }

    if (!isvalidRequesbody(requestbody)) {
      return res
        .status(400)
        .send({ status: false, msg: "request body is required" });
    }

    const { title, excerpt, ISBN, category, subcategory, releasedAt,review } =
      requestbody;

    if (!isValid(title)) {
      return res
        .status(400)
        .send({ status: false, msg: "please give valid title" });
    }

    let duplicatetitle = await BookModel.findOne({ title: requestbody.title });

    if (duplicatetitle) {
      return res.status(400).send({ status: false, msg: "Duplicate title" });
    }

    if (!isValid(excerpt)) {
      return res
        .status(400)
        .send({ status: false, msg: "please give valid excerpt" });
    }

    if (!isValid(ISBN)) {
      return res
        .status(400)
        .send({ status: false, msg: "please give valid ISBN" });
    }

    let duplicateIsbn = await BookModel.findOne({ ISBN: requestbody.ISBN });
    console.log(ISBN);
    if (duplicateIsbn) {
      return res.status(400).send({ status: false, msg: "Duplicate ISBN" });
    }

    if (!isValid(category)) {
      return res
        .status(400)
        .send({ status: false, msg: "please give category" });
    }

    if (!isvalidStringOnly(subcategory)) {
      return res
        .status(400)
        .send({ status: false, msg: "please give valid subcategory" });
    }

    if (!isValid(releasedAt)) {
      return res
        .status(400)
        .send({ status: false, msg: "releaseAt is required" });
    }

    if (!isValidDate(releasedAt)) {
      return res
        .status(400)
        .send({ status: false, msg: "invalid date format" });
    }

    let searchuserid = await UserModel.findById(userid);

    if (!searchuserid) {
      return res
        .status(404)
        .send({ status: false, msg: "user wit this id not found" });
    }

    let Bookcreated = await BookModel.create(requestbody);
       res
      .status(201)
      .send({ status: true, msg: "Book created", data:Bookcreated });
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};
// =======================================================================================================
let getBooks = async function (req, res) {
  try {
    let data = req.query;

    if (!isvalidRequesbody(data)) {
      let search1 = await BookModel.find({ isDeleted: false })
        .select({
          _id: 1,
          title: 1,
          excerpt: 1,
          userId: 1,
          category: 1,
          subcategory: 1,
          reviews: 1,
          releasedAt: 1,
        })
        .sort({ title: 1 });
      if (!search1) {
        return res.status(404).send({ status: false, msg: "no data found" });
      }
      let getdata=await reviewModel.find({bookId:search1[0]._id})
     return res.status(200).send({ status: true, msg: search1 });
    }
    const filterquery = { isDeleted: false };
    const { userId, category, subcategory } = data;

    if (!isvalidStringOnly(userId)) {
      return res.status(400).send("invalid userId");
    }

    if (isValid(userId) && isValidObjectId(userId)) {
      filterquery.userId = userId;
    }

    if (userId) {
      if (!isValidObjectId(userId)) {
        return res.status(400).send({ status: false, msg: "invalid id" });
      }
    }

    if (isValid(category)) {
      filterquery.category = category.trim();
    }

    if (!isvalidStringOnly(category)) {
      return res.status(400).send({ staus: false, msg: "category required" });
    }

    if (isValid(subcategory)) {
      filterquery.subcategory = subcategory.trim();
    }

    if (!isvalidStringOnly(subcategory)) {
      return res
        .status(400)
        .send({ status: false, msg: "subcategory is required" });
    }
console.log(filterquery)
    const searchBooks = await BookModel.find(filterquery)
      .select({
        _id: 1,
        title: 1,
        excerpt: 1,
        userId: 1,
        category: 1,
        subcategory: 1,
        reviews: 1,
        releasedAt: 1,
      })
      .sort({ title: 1 });

    if (Array.isArray(searchBooks) && searchBooks.length == 0) {
      return res.status(404).send({ status: false, msg: "No books found" });
    }
    let getdata
    for(let i=0;i<searchBooks.length;i++){
      getdata=await reviewModel.find({bookId:searchBooks[i]._id})}
     
     console.log(getdata)
     
     
     
     

    res.status(200).send({ status: true,msg:"sucess",data: searchBooks });
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};
// ==============================================================================================================================================================================================
let getBooksBYid = async function (req, res) {
  try {
    let result = {};
    let review = [];
    let BookId = req.params.bookId;

    // if (!BookId)
    //     return res.status(400).send({ status: false, msg: "Please Provide BookId" }

    let BookDetail = await BookModel.findOne({ _id: BookId });
    if (!BookDetail)
      return res.status(400).send({ status: false, msg: "BookId not Found" });
    if (BookDetail.isDeleted == true) {
      return res.status(400).send({ status: false, msg: "deleted document" });
    }
console.log(BookDetail)
    let reviewDetails = await reviewModel.find({ bookId:BookDetail._id });
    if (!reviewDetails) {
      return res
        .status(400)
        .send({ status: false, msg: "please provide review details" });
    }
    // console.log(reviewDetails)
    let bookData = {
      _id: BookDetail._id,
      title: BookDetail.title,
      excerpt: BookDetail.excerpt,
      userId: BookDetail.userId,
      category: BookDetail.category,
      subcategory: BookDetail.subcategory,
      reviews: BookDetail.reviews,
      deletedAt: BookDetail.deletedAt,
      releasedAt: BookDetail.releasedAt,
      createdAt: BookDetail.createdAt,
      updatedAt: BookDetail.updatedAt,
    };
    for (let i = 0; i < reviewDetails.length; i++) {
      result = {
        _id: reviewDetails[i]._id,
        reviewedBy: reviewDetails[i].reviewedBy,
        reviewedAt: reviewDetails[i].reviewedAt,
        rating: reviewDetails[i].rating,
        review: reviewDetails[i].review,
      };
      review.push(result);
    }
    bookData["reviewsData"] = review;
    
    res.status(200).send({ status: true,msg:"sucessa",data: bookData });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, msg: error.message });
  }
};
// ========================================================================================================================================================================================

const updateBook = async function (req, res) {
  try {
    let Id = req.params.bookId;

    if (!isValidObjectId(Id)) {
      return res.status(400).send({ status: false, msg: "invalid objectid" });
    }
    let { title, excerpt, releasedAt, ISBN } = req.body;

    if (!isvalidStringOnly(title)) {
      return res.status(400).send({status:false,msg:"please give title"})
    }
    const titleAlreadyUsed = await BookModel.findOne({ title });
    if (titleAlreadyUsed) {
     return res.status(400).send("tittle alerady exist");
      
    }
    if (!isvalidStringOnly(excerpt)) {

    return res.status(400).send({ status: false, msg: "exceerpt is required for updation" });
    
    }

    if (!isvalidStringOnly(ISBN)) {
      
        
       return res.status .send({ status: false, msg: "ISBN is required for updation" })}
    
    const ISBNAlreadyUsed = await BookModel.findOne({ ISBN });
    if (ISBNAlreadyUsed) {
      return res.status(400).send("ISBN is  alerady exist");
    }
    if (!isvalidStringOnly(releasedAt)) {
      res
        .status(400)
        .send({ status: false, msg: "releasedAt is required for updation" });
      return;
    }
    if (!isValidDate(releasedAt)) {
      return res
        .status(400)
        .send({ status: false, msg: "Invalid date format" });
    }
    
    let findBook = await BookModel.findById(Id);
    if (!findBook) {
      return res
        .status(400)
        .send({ status: false, msg: "this id is not in db" });
    }
    if (!findBook.isDeleted == false) {
     return res.status(400).send("This Books Already Deleted");
    }
    console.log(findBook)
    let updateBook = await BookModel.findOneAndUpdate(
      { bookId: Id, isDeleted: false },
      req.body,
      { new: true }
    );
    res.status(201).send({status:false,msg:"updated sucessfully",data:updateBook})
  } catch (error) {
    res.status(500).send({ satus: false, msg: error.message });
  }
};
// ==================================================================================================================================================
let deleteBooks = async function (req, res) {
  try {
    let bookId =req.params.bookId

    if(!isValidObjectId(bookId)){
        return res.status(400).send({status:false,msg:"invalid bookid"})
    }

    const book = await BookModel.findById(bookId);
    if (book.isDeleted == true) {
      res.status(400).send({ status: false, msg: "book is already deleted" });
      return;
    }
    let deleteBook = await BookModel.findByIdAndUpdate(
      { _id: bookId },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    res
      .status(200)
      .send({
        status: true,
        msg: " successfully delete content",
        data: deleteBook,
      });

  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports.createBook = createBook;
module.exports.getBooks = getBooks;
module.exports.getBooksBYid = getBooksBYid;
module.exports.updateBook = updateBook;
module.exports.deleteBooks = deleteBooks;
