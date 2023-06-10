const assert = require('assert')

const listing = require('./controllers/listing.js')
it('should return true', () => {

    assert.equal(listing.newListing(1, 3), true)

  })