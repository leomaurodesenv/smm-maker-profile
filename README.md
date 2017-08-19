# smm-maker-profile #

Links:      
[npm](https://www.npmjs.com/package/smm-maker-profile) and [Github](https://github.com/leomaurodesenv/smm-maker-profile)   
      
___
   
this module can request and fetching data information of Maker Profile (of Super Mario Maker) just passing the Nintendo ID of user.      
By response the module call a callback function with 2 arguments (error, makerProfile). These arguments, the first is a boolean to check sucess in fetching and the second is a json with data information about the user.      
   
___

```
/lib/
  |__ Medals.js
  |__ Typography.js
  |__ CoursesMetrics.js
  |__ SmmMakerProfile.js
/test/
  |__ test.js
```
   
* SmmMakerProfile.js: Main file to request;   
* test.js: simple example how use it;   
   
___
   
## Example  
Example: How fetching a Maker Profile   
   
```js
/* Include */
var SmmMakerProfile = require('smm-maker-profile');

// ## Try capture some data from ID Nintendo user
// For example to get infos of BRKsEDU
// link: https://supermariomakerbookmark.nintendo.net/profile/BRKsEDU

SmmMakerProfile.getWebContent('BRKsEDU', function(error, makerProfile) {
    if(error) console.log('> Page not found or Nintendo ID inexistent.');
    else{
        console.log(makerProfile);
    }
});
```
   
___
   
## Also look ~  	
* [License GPL v2](https://www.gnu.org/licenses/old-licenses/gpl-2.0.html)
* Create by Leonardo Mauro (leo.mauro.desenv@gmail.com)
* Git: [leomaurodesenv](https://github.com/leomaurodesenv/)
* Site: [Portfolio](http://leonardomauro.com/portfolio/)
