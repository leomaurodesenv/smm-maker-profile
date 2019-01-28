# smm-maker-profile #

Links:      
[JsClasses](https://www.jsclasses.org/smm-maker-profile), [npm](https://www.npmjs.com/package/smm-maker-profile) and [Github](https://github.com/leomaurodesenv/smm-maker-profile)   

___
   
Maker Profile is the user information about the game Super Mario Maker. This module can fetch data from the official [bookmark site](https://supermariomakerbookmark.nintendo.net).    
This module can request and fetching data information of Maker Profile just passing the Nintendo ID of user.      
      
By response the module call a callback function with 2 arguments `(error, makerProfile)`. These arguments: the first is a boolean to check sucess in fetching; and the second is a json with data information about the user.      
   
Note: This module makes analysis on the html structure of the bookmark site. In case of site changes, the `smm-maker-profile` system may not work correctly.      

___

### Installation

```shell
npm install --save smm-maker-profile
```
   
___
   
**Functions**:    
* getMetaContent: get profile content;      
* getMetaCoursesContent: get profile content and courses details (uploaded, liked, fastest clear and first clear);      
* getAllContent: get profile content and courses details (plus data course \[search in each page]);      
      
___

### Json `makerProfile`    
The data information:    

```js
info: 
  \_ user: 'Nintendo ID',
  \_ userUrl: 'https://supermariomakerbookmark.nintendo.net/profile/..',
  \_ miiUrl: 'https://miiverse.nintendo.net/users/..',
  \_ miiFace: 'http://mii-images.cdn.nintendo.net/..',
  \_ flag: 'Country',
  \_ name: 'Name'
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
  \_ livesLost: number,
  \_ courses: (only in getMetaCoursesContent | getAllContent)
        \_ posted: number | object
        \_ liked:  number | object
        \_ fastest:  number | object
        \_ first:  number | object
```
   
___

### Files

```
/lib/
  |__ Medals.js
  |__ Typography.js
  |__ CoursesMetrics.js
  |__ CoursesWrapper.js
  |__ SmmMakerProfile.js
/test/
  |__ test.js
```
   
* SmmMakerProfile.js: main file to request;   
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

SmmMakerProfile.getMetaContent('BRKsEDU', function(error, makerProfile) {
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
