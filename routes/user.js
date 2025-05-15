const  express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const listingController =  require("../controller/users.js")

router.route("/signup")
.get(listingController.renderSignupform)
.post(wrapAsync(listingController.signup));

router.route("/login")
.get(listingController.renderLoginform)
 .post(saveRedirectUrl,
    passport.
    authenticate("local" ,{
    failureRedirect : "/login" ,
    failureFlash : true
    }) ,
    listingController.login
)


//logout
router.get("/logout" ,listingController.logout)

module.exports =router