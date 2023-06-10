const listingModel = require('../models/db').Listing;

//1. Duplicate listing from EJS/ query unapproved listings
//2. update
exports.updateListing = function(req, res) {
    req.body.adminAprove = req.body.adminAprove == undefined ? 0 : 1;
    console.log(req.body);
    listingModel.create(req.body);
    res.redirect('/listings');
};
