const Listing  = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index  = async (req, res) =>{
    let allListing =  await Listing.find({});
    res.render("./listings/index.ejs" , {allListing});
    };

    module.exports.search = async (req, res) => {
  const { location } = req.query;
  if (!location || location.trim() === '') {
    req.flash("error" , "please enter location to serach")
    return res.redirect('/listing');
  }
  try {
    // Use case-insensitive regex search on location field
    const listings = await Listing.find({
      location: { $regex: location, $options: 'i' }
    });
     if(listings.length === 0 ){
        req.flash("info" , "No listings found for the searched loaction");
     }
    res.render('listings/index.ejs', { allListing: listings });
  } catch (err) {
    req.flash('error', 'Something went wrong with your search');
    res.redirect('/listing');
  }
};


module.exports.renderNewForm = ( req, res ) => {
        res.render("./listings/new.ejs");
    }
 
module.exports.showListing = async (req, res) =>{
    let {id} = req.params;
    const listing =   await Listing.findById(id)
    .populate({
        path : "reviews",
        populate : {
            path : "author",
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error"  ,"listing you requested for , does not exist !");
        res.redirect("/listing");
    }
    res.render("./listings/show.ejs" ,{listing});
};  

module.exports.createNewListing = async (req, res, next) =>{
  let response = await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1,
})
.send();


    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url , "..", filename);
    const newListing = new Listing(req.body.listing);
   newListing.owner = req.user._id;
    newListing.image = { url , filename}
    newListing.geometry =response.body.features[0].geometry;
    
    newListing.contactNo = req.body.listing.contactNo;
     let savedListing  =  await  newListing.save();
     console.log(savedListing);
   req.flash("success" , "New Listing Created !");
   res.redirect("/listing");

}

module.exports.renderEditForm = async(req , res) =>{
    let {id} = req.params;
    const listing =   await Listing.findById(id);
    if(!listing) {
        req.flash("error" , "Listing you requested for does not exist")
        res.redirect("./listings" , {listing});
    }
     let orignalImage =  listing.image.url;
      orignalImage = orignalImage.replace("/upload/ w_250");
    res.render("./listings/edit.ejs" , {listing , orignalImage});
};

module.exports.updateListing = async(req , res) => {
    
    if(!req.body.listing) {
        throw new ExpressError(400 ,"Send Valid data for listing") 
    }
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id ,{...req.body.listing});
      
    if(typeof req.file !== "undefined"){
     let url = req.file.path;
     let filename = req.file.filename;
     listing.image = { url , filename}
     await listing.save();
    }

     // ✅ Ensure contactNo is updated
    listing.contactNo = req.body.listing.contactNo;
    
     req.flash("success" , " Listing Updated !");
     res.redirect(`/listing/${id}`); 
};

module.exports.destroyListing = async(req, res) =>{
    let {id} = req.params;
    let deleted_listing =  await Listing.findByIdAndDelete(id);
    console.log(deleted_listing);
       req.flash("success" , " Listing has been deleted !");
    res.redirect("/listing");
 }