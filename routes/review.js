const  express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");

const { validateReview, isLoggedIn, isOwner, isReviewAuthor } = require("../middleware.js");
const listingController =  require("../controller/reviews.js")

//REVIEWS post Route
router.post("/" , isLoggedIn, validateReview,  wrapAsync(listingController.createReview));
 
 //delete review route
 router.delete("/:reviewId" ,isLoggedIn,isReviewAuthor, wrapAsync(listingController.destroyReview))

 module.exports = router;
 