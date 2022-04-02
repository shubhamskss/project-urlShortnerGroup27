const express = require('express');
const router = express.Router();

const userController=require("../controllers/userController")
const BookController=require("../controllers/BookController")
const reviewController=require("../controllers/reviewcontroller")
const middleWare=require("../middleware/mid")
const cover=require("../cloud link/s3link")



router.post("/register",userController.UserRegister)
router.post("/login",userController.login)
router.post("/cover",cover.createAws)
router.post("/books",middleWare.authent,BookController.createBook)
router.get("/books",middleWare.authent,BookController.getBooks)
router.get("/books/:bookId",middleWare.authent,BookController.getBooksBYid)
// router.put("/books/:bookId",BookController.updateBook)
router.put('/books/:bookId',middleWare.authent,middleWare.authorise,BookController.updateBook)

router.delete("/books/:bookId",middleWare.authent,middleWare.authorise,BookController.deleteBooks)
router.post("/books/:bookId/review",reviewController.createReview)
router.put("/books/:bookId/review/:reviewId",reviewController.updateReview)
router.delete("/books/:bookId/review/:reviewId",reviewController.deletereview)





module.exports=router;