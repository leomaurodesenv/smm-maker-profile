/* Include */
var SmmMakerProfile = require("../lib/SmmMakerProfile.js");

// ## Try capture some data from ID Nintendo user
// For example to get infos of BRKsEDU
// link: https://supermariomakerbookmark.nintendo.net/profile/BRKsEDU

SmmMakerProfile.getWebContent('BRKsEDU', function(error, makerProfile) {
    if(error) console.log('> Page not found or Nintendo ID inexistent.');
    else{
        console.log(makerProfile);
    }
});