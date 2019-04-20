# smm-maker-profile

[![GPLv3 license](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE.md)
[![npm](https://img.shields.io/badge/Code-npm-yellow.svg)](https://www.npmjs.com/package/smm-maker-profile)
[![JsClasses](https://img.shields.io/badge/Code-JsClasses-yellow.svg)](https://www.jsclasses.org/smm-maker-profile)
[![GitHub](https://img.shields.io/badge/Code-GitHub-yellow.svg)](https://github.com/leomaurodesenv/smm-maker-profile)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/7d580f40e6a541899ec4cff3b7a5253b)](https://www.codacy.com/app/leomaurodesenv/smm-maker-profile?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=leomaurodesenv/smm-maker-profile&amp;utm_campaign=Badge_Grade)

---
Maker Profile is the player information on Super Mario Maker game. This module can retrive data from the official [bookmark site](https://supermariomakerbookmark.nintendo.net).   
This module can request and fetching data information of Maker Profile just passing the Nintendo ID of the player.  

By response the module call a callback function with 2 arguments `(error, makerProfile)`. These arguments: the first is a boolean to check sucess in fetching; and the second is a json with data information about the user.  

Note: This module makes analysis on the html structure of the bookmark site. In case of site changes, the `smm-maker-profile` system may not work correctly.  

---
## Installation

```shell
npm install --save smm-maker-profile
```
   
---
## Package

-   `getMetaContent`: get profile content.

-   `getMetaCoursesContent`: get profile content and courses details (uploaded, liked, fastest clear and first clear).

-   `getAllContent`: get profile content and courses details (plus data course \[search in each page]).
      
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
   
---
## Example  

Example: Fetching a Maker Profile.
   
```js
/* Include */
var SmmMakerProfile = require('smm-maker-profile');

// ## Try capture some data from ID Nintendo user
// For example get information of BRKsEDU player
// link: https://supermariomakerbookmark.nintendo.net/profile/BRKsEDU

SmmMakerProfile.getMetaContent('BRKsEDU', function(error, makerProfile) {
    if(error) console.log('> Page not found or Nintendo ID inexistent.');
    else{
        console.log(makerProfile);
    }
});
```

---
## Also look ~

-   [License GPL v3](LICENSE)
-   Create by Leonardo Mauro ~ [leomaurodesenv](https://github.com/leomaurodesenv/)
