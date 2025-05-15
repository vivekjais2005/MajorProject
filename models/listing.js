const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { string, number } = require("joi");

// Defining Listing Schema
const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
       url : String,
       filename : String
    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    contactNo: {
  type: String,
  validate: {
    validator: function (v) {
      return /^[0-9]{10,15}$/.test(v);
    },
    message: props => `${props.value} is not a valid phone number!`,
  },
  required: [true, "Contact number required"],
},

    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    geometry : {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
     coordinates: {
      type: [Number], // Array of numbers [longitude, latitude]
      required: true,
    },
  } 
});

// Cascade delete reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

module.exports = mongoose.model("Listing", listingSchema);
