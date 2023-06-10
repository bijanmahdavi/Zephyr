const listingModel = require('../models/db').Listing;
const multer = require('multer');

exports.findAllApprovedListings = function(req, res) {
    exports.findAllListings(req, res, 1);
};
exports.findAllPendingListings = function(req, res) {
    exports.findAllListings(req, res, 0);
};
exports.findAllListings = function(req, res, approve) {
    // search for specific attributes - hash usage
    listingModel.findAll({where:{adminApprove:approve}}).then(listings => {
        res.render('listings', { listings: listings, user: req.user, approve: approve });
    });
};
exports.newListing = function(req, res) {
    console.log('1');
    upload.single('picture');
    console.log('2');
    req.body.UserId = req.user.id;
    req.body.hasRoomate = req.body.hasRoomate == undefined ? false : true;
    req.body.parking = req.body.parking == undefined ? false : true;
    req.body.allowPets = req.body.allowPets == undefined ? false : true;
    console.log('file: ',req.file);
    checkUpload(req);
    listingModel.create(req.body);
    res.redirect('/listings');
};
exports.findListing = function(input) {
    // search for specific attributes - hash usage
    let response = {};
    listingModel.findAll({where:{descripiton:input}}).then(listings => {
        response.data = {};
        response.data.listings = [];
        for(var i = 0; i < listings.length; i++) {
            response.data.listings.push(listings[i].address);
        };
        
      // projects will be an array of Project instances with the specified name
    });
    return response;   
};
exports.updateListing = function(req, res) {
    listingModel.findByPk(req.params.id).then(function(listing){
        listing.adminApprove = 1;
        listing.save().then(function(aaa){
            res.redirect('/admin-approve');
        });
    });
    
};
exports.deleteListing = function(req, res) {
    listingModel.destroy({ where: { id: req.params.id } }).then(function(){
        res.redirect('/admin-approve');
    });
};
//setting location for storage of image and sets format for name of images stored
var storage = multer.diskStorage({
    destination: '../public/pictures',
    filename: function (req, file, cb) {
        cb(null, file.originalname + '-' + Date.now())
        }
    })

//multer init
var upload = multer({
    storage: storage,
    limits: {
        fileSize: 100000
    },
    fileFilter: function(req, file, cb) {
        checkFile(file, cb);
    }
})

function checkFile(file, cb) {
    //allowed file extensions
    let extensions = ['png', 'jpg', 'jpeg', 'gif'];

    let isAllowed = extensions.includes(file.originalname.split('.')[1].toLowerCase());
    let isAllowedMimeType = file.mimetype.startsWith("image/")

    if (isAllowed && isAllowedMimeType) {
        //all is good
        return cb(null, true)
    } else {
        cb('File type not allowed!');
    }
}
function checkUpload (req, error) {
    if(error) {
        console.log('poop');
        //res.render('new-listing', {message: error});
    } else {
        //file didnt get sent or invalid file type
        if(req.file == undefined) {
        console.log('no file')
            //res.render('new-listing', {message: 'No File!'});
        } else {
        //else file did get sent!
        console.log('Success!');
        }
    }

}