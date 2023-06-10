const listingModel = require('../models/db').Listing;
const Op = require('sequelize').Op;

var info = {};
//link example: http://localhost:8081/filter/?descripiton=san+francisco&houseType=0&numOfBedroom=1&numOfBathroom=1&houseSize=0&price=20000
exports.getRoomFilter = function(query) {
    if (query == '') {
        return {[Op.ne]: null};
    } else if (query == '5+') {
        return {[Op.gte]: 5};
    }
    return query;
}

exports.filterListings = function(req, res) {
    //create an object literal which we will return, and has a nested object named filteredList inside.
    //filteredList contains an array named listings where we will put listings that match our filter inside
    let response = {
        filteredList: {listings: []},
    };
    //now we need to see how the user wants us to filter the listings
    const query = req.query;
    //do some logic where we decompose query

    info = {
        houseType: query.houseType,
        houseSize: {[Op.between]: [query.sizeMin, query.sizeMax]},
        price: {[Op.between]: [query.priceMin, query.priceMax]}
    };
    if (query.zipCode != undefined && query.zipCode.length != 0) {
        console.log('description = ', query.zipCode.length);

        info.zipCode = {[Op.like]: '%'+ query.zipCode +'%'};
    }
    if (query.hasRoomate != undefined) {
        info.hasRoomate = query.hasRoomate;
    }
    if (query.numOfBedroom != undefined) {
        info.numOfBedroom = exports.getRoomFilter(query.numOfBedroom);
    }
    if (query.numOfBathroom != undefined) {
        info.numOfBathroom = exports.getRoomFilter(query.numOfBathroom);
    }
    //access the listings table in the database through the listingsModel (seqeuelize)
    //if the sequelize method findAll (gets all posts in the listings table) returns a promise (the .then part), the data is stored in listings as an array
    listingModel.findAll({
        where: info
    }).then(listings => {
        // so we loop through listings and insert what we have found into the response (which we are going to return)
    for(var i = 0; i < listings.length; i++) {
        response.filteredList.listings.push(listings[i]);
    }; // loop where we insert data into response done

    //logging for testing purposes :)
    console.log("query: ", query);
    console.log('info: ',info)
    // console.log("response.filteredList.listings: ", response.filteredList.listings);

    //need to reset info
    info = {};
    //we return the filtered listings, since promise is async we need to return inside the .then( otherwise we will return prematurely (i think)
    res.render('listings', { listings: response.filteredList.listings, user: req.user, approve: 1 });

    }); //promise end
}

