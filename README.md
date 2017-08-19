# smm-maker-profile #

Links:      
[JsClasses](https://www.jsclasses.org/smm-maker-profile), [npm](https://www.npmjs.com/package/smm-maker-profile) and [Github](https://github.com/leomaurodesenv/smm-maker-profile)   

___
   
This module can request and fetching data information of Maker Profile (of Super Mario Maker) just passing the Nintendo ID of user.      
By response the module call a callback function with 2 arguments `(error, makerProfile)`. These arguments, the first is a boolean to check sucess in fetching and the second is a json with data information about the user.      
   
___

### Json `makerProfile`    
The data information:    

```js
info: 
  \_ user: nintendo ID,
  \_ userUrl: https://supermariomakerbookmark.nintendo.net/profile/..,
  \_ miiUrl: https://miiverse.nintendo.net/users/..,
  \_ miiFace: http://mii-images.cdn.nintendo.net/..,
  \_ flag: Country,
  \_ name: Name
stars: number
medals: [ 'Goomba', 'Koopa Troopa', .., 'Princess Peach' ]
marioChallenge: 
  \_ easyClears: number,
  \_ normalClears: number,
  \_ expertClears: number,
  \_ superExpertClears: number
playHistory: 
  \_ coursesPlayed: number,
  \_ coursesCleared: number,
  \_ totalPlays: number,
  \_ livesLost: number
```
   
* SmmMakerProfile.js: Main file to request;   
* test.js: simple example how use it;   
   
___

### Files

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
