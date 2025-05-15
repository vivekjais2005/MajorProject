const Joi = require('joi');
const review = require('./models/review');

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
       description : Joi.string().required(),
       location : Joi.string().required(),
       contactNo: Joi.number().required().min(1000000000).max(9999999999999),
       country :Joi.string().required(),
       price : Joi.number().required().min(0),
       image: Joi.object({
        filename: Joi.string().allow('').optional(),
        url: Joi.string().uri().allow("").optional()
      }).optional()
    })
});

    module.exports.reviewSchema = Joi.object({
        review : Joi.object({
         rating : Joi.number().required().min(1).max(5),
         comment : Joi.string().required(),
        }).required(),
    });

    
      