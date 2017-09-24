/* Include */
const SmmMakerProfile = require("../lib/SmmMakerProfile.js");

// ## Try capture some data from ID Nintendo user
// For example to get infos of BRKsEDU
// link: https://supermariomakerbookmark.nintendo.net/profile/BRKsEDU
console.time('testing');

//SmmMakerProfile.getMetaContent('BRKsEDU', function(error, makerProfile) {
//SmmMakerProfile.getMetaCoursesContent('BRKsEDU', function(error, makerProfile) {
SmmMakerProfile.getAllContent('BRKsEDU', function(error, makerProfile) {
    if(error) console.log('> Page not found or Nintendo ID inexistent.');
    else console.log(makerProfile);
    console.timeEnd('testing');
});