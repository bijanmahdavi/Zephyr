const express = require('express');
const router = express.Router();
var listing = require("../controllers/listing");
var filter = require("../controllers/filter");


router.get('/search/:input', function (req, res) {
    res.json(listing.findListing(req.params.input));
});
router.get('/filter',  filter.filterListings);
router.get('/listings', listing.findAllApprovedListings);
router.get('/new-listing', function (req, res) {
    if (req.user) {
        res.render('new-listing', { user: req.user, message: undefined  });
    } else {
        res.redirect('/');
    }
});
router.get('/admin-approve', listing.findAllPendingListings);
router.post('/listing/:id/approve', listing.updateListing);
router.post('/listing/:id/delete', listing.deleteListing);

router.post('/new-listing', listing.newListing);
module.exports = router;