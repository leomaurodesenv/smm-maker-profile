/* Includes */
const Request = require('request');
const DateTime = require('node-datetime');
const HtmlParser = require("htmlparser2");

const Medals = require("./Medals.js");
const Typography = require("./Typography.js");
const CoursesWrapper = require("./CoursesWrapper.js");
const CoursesMetrics = require("./CoursesMetrics.js");

/**
 * @module _SmmMakerProfile
 * This class can request Maker Profile data from a Nintendo ID
 * 
 * @author Leonardo Mauro <leo.mauro.desenv@gmail.com> (http://leonardomauro.com/)
 * @link https://github.com/leomaurodesenv/smm-maker-profile GitHub
 * @license https://opensource.org/licenses/GPL-2.0 GNU Public License (GPL v2)
 * @copyright 2017 Leonardo Mauro
 * @version 1.3.2 2017-07-26
 * @package smm-maker-profile
 * @access public
 */
class _SmmMakerProfile {
    
    /**
     * @method module:_SmmMakerProfile
     * Constructor of class
     * @var {String} _urlMiiverse Rrl base to miiverse
     * @var {String} _urlMakerProfile Url base to maker profile
     * @instance
     * @access public
     * @returns {this}
     */
    constructor() {
        this._urlMiiverse = 'https://miiverse.nintendo.net/users';
        this._urlMakerProfile = 'https://supermariomakerbookmark.nintendo.net/profile';
    }
    
    /**
     * @method module:_SmmMakerProfile::_callbackError
     * Return a error and empty json
     * @arg {Callback} callbackFunction callback of user
     * @access protected
     * @returns {Callback}
     */
    _callbackError(callbackFunction) {
        callbackFunction(true, {});
    }
    
    /**
     * @method module:_SmmMakerProfile::_getMiiUrl
     * Return complete miiverse url
     * @arg {String} nintendoId Nintendo ID of user
     * @access protected
     * @returns {String}
     */
    _getMiiUrl(nintendoId) {
        return `${this._urlMiiverse}/${nintendoId}`;
    }
    
    /**
     * @method module:_SmmMakerProfile::_getMakerProfileUrl
     * Return complete maker profile url
     * @arg {String} nintendoId Nintendo ID of user
     * @access protected
     * @returns {String}
     */
    _getMakerProfileUrl(nintendoId) {
        return `${this._urlMakerProfile}/${nintendoId}`;
    }
    
    /**
     * @method module:_SmmMakerProfile::_getMakerProfileCoursesUrl
     * Return complete maker profile url with get to some type courses
     * @arg {String} nintendoId Nintendo ID of user
     * @arg {String} type Type of courses
     * @arg {Integer} page Number of page
     * @access protected
     * @returns {String}
     */
    _getMakerProfileCoursesUrl(nintendoId, type, page) {
        return `${this._urlMakerProfile}/${nintendoId}?type=${type}&page=${page}#type-selector`;
    }
    
    /**
     * @method module:_SmmMakerProfile::_getCoursesWrapper
     * Search recursively courses wrapper from a type in Maker Profile
     * @arg {String} nintendoId Nintendo ID of user
     * @arg {String} type Type of courses of Maker Profile
     * @arg {Callback} callbackFunction callback of return coursesWrapper
     * @access protected
     * @returns {Callback}
     */
    _getCoursesWrapper(nintendoId, type, callbackFunction) {
        var $this = this,
            coursesWrapper = { count:0, courses:[] };
            /* Check how many courses are with captured to do pagination */
        let paginationTypedContent = function(page, coursesWrapper){
                if(coursesWrapper.count > coursesWrapper.courses.length)
                    paginationRequestContent(page+1, coursesWrapper);
                else callbackFunction(false, coursesWrapper);
            },
            /* Call recursively to request the pages */
            paginationRequestContent = function(page, coursesWrapper) {
                Request($this._getMakerProfileCoursesUrl(nintendoId, type, page), function (error, response, body) {
                    $this._parserPagination(page, body, coursesWrapper, paginationTypedContent);
                    //console.log('type:'+type+'  page:'+page);
                });
            };
        /* First call to recursive */
        paginationRequestContent(1, coursesWrapper);
    }
    
    /**
     * @method module:_SmmMakerProfile::_getMetaCoursesContent
     * Get count of all types courses in Maker Profile
     * @arg {String} nintendoId Nintendo ID of user
     * @arg {String} body HTML from maker profile
     * @arg {Callback} callbackFunction callback of user
     * @access protected
     * @returns {Callback}
     */
    _getMetaCoursesContent(nintendoId, body, callbackFunction) {
        var $this = this,
            types = ['posted', 'liked', 'fastest_holder', 'first_holder'],
            typesWrapper = [],
            /* Call recursively to request the pages and types */
            paginationWrapperAnalisys = function(type, makerProfile) {
                typesWrapper.push(type);
                if(typesWrapper.length >= types.length)
                    callbackFunction(false, makerProfile);
            },
            /* Do the request count */
            requestContCourses = function(type, callbackTyped){
                Request($this._getMakerProfileCoursesUrl(nintendoId, type, 1), function (error, response, body) {
                    let coursesIn = { count:0, courses:[] };
                    $this._parserPagination(1, body, coursesIn, function(page, coursesWrapper){
                        callbackTyped(coursesWrapper.count);
                    });
                });
            },
            /* The call to create the path in makerProfile */
            paginationCoursesContent = function(error, makerProfile) {
                if(error) callbackFunction(false, makerProfile);
                makerProfile.courses = {};
                /* Check each type */
                types.forEach(type => {
                    requestContCourses(type, function(count){
                        if(type == 'posted') makerProfile.courses.posted = count;
                        else if(type == 'liked') makerProfile.courses.liked = count;
                        else if(type == 'fastest_holder') makerProfile.courses.fastest = count;
                        else if(type == 'first_holder') makerProfile.courses.first = count;
                        paginationWrapperAnalisys(type, makerProfile);
                    });
                });                
        };
        /* Getting the normal content */
        $this._getMakerProfileContent(nintendoId, body, paginationCoursesContent); 
    }
    
    /**
     * @method module:_SmmMakerProfile::_getCoursesContent
     * Search recursively all types courses in Maker Profile
     * @arg {String} nintendoId Nintendo ID of user
     * @arg {String} body HTML from maker profile
     * @arg {Callback} callbackFunction callback of user
     * @access protected
     * @returns {Callback}
     */
    _getCoursesContent(nintendoId, body, callbackFunction) {
        var $this = this,
            types = ['posted', 'liked', 'fastest_holder', 'first_holder'],
            typesWrapper = [],
            /* Call recursively to request the pages and types */
            paginationWrapperAnalisys = function(type, makerProfile) {
                typesWrapper.push(type);
                if(typesWrapper.length >= types.length)
                    callbackFunction(false, makerProfile);
            },
            /* The first call to create the path in makerProfile */
            paginationCoursesContent = function(error, makerProfile) {
                if(error) callbackFunction(false, makerProfile);
                makerProfile.courses = {};
                /* Check each type */
                types.forEach(type => {
                    $this._getCoursesWrapper(nintendoId, type, function(error, courseWrapper){
                        if(type == 'posted') makerProfile.courses.posted = courseWrapper;
                        else if(type == 'liked') makerProfile.courses.liked = courseWrapper;
                        else if(type == 'fastest_holder') makerProfile.courses.fastest = courseWrapper;
                        else if(type == 'first_holder') makerProfile.courses.first = courseWrapper;
                        paginationWrapperAnalisys(type, makerProfile);
                    });
                });
                
        };
        /* Getting the normal content */
        $this._getMakerProfileContent(nintendoId, body, paginationCoursesContent); 
    }
    
    /**
     * @method module:_SmmMakerProfile::_getMakerProfileContent
     * Html parser to maker profile
     * @arg {String} nintendoId Nintendo ID of user
     * @arg {String} body HTML from maker profile
     * @arg {Callback} callbackFunction callback of user
     * @access protected
     * @returns {Callback}
     */
    _getMakerProfileContent(nintendoId, body, callbackFunction) {
        // Check with page Maker Profile exists
        if((/(class)[ ]*(=)[ \"]*(error-code)/g).test(body))
            this._callbackError(callbackFunction);
        
        // Json with informations about the Maker Profile
        const makerProfile = {
            info:{
                user: nintendoId, 
                userUrl: this._getMakerProfileUrl(nintendoId), 
                miiUrl: this._getMiiUrl(nintendoId) 
            }, // user, userUrl, miiFace, miiUrl, flag, name
            stars: 0, // stars
            medals: [], // array[medals]
            marioChallenge: {}, // easyClears, normalClears, expertClears, superExpertClears
            playHistory: {} // coursesPlayed, coursesCleared, totalPlays, livesLost
        };
        
        // Parser all HTML
        let curNode = {
            attribs: {},
            children: [],
            name: 'root',
            text: []
        };
        let _parserMakerProfile = new HtmlParser.Parser({
            onopentag: function(name, attribs) {
                const node = {
                    attribs: attribs,
                    children: [],
                    name: name,
                    parent: curNode,
                    text: null
                };
                curNode.children.push(node);
                curNode = node;
            }, ontext (text) {
                curNode.text = text;
            }, onclosetag (name) {
                // Which in case the tag has a closed bad
                if(name != curNode.name) return;
                const closedNode = curNode;
                curNode = curNode.parent;
                
                // Which in case no have class
                let attrClass = closedNode.attribs.class;
                if (!!!(attrClass)) return;
                
                // -- Info
                // miiFace
                if (closedNode.name == 'div' && attrClass.match(/([ ]*)mii-wrapper([ ]*)$/)) {
                    let miiFaceNode = closedNode.children[0];
                    if (!!(miiFaceNode))
                        makerProfile.info.miiFace = miiFaceNode.attribs.src;
                }
                // flag, name
                else if (closedNode.name == 'div' && attrClass.match(/([ ]*)user-info([ ]*)$/)) {
                    let flagNode = closedNode.children[0];
                    let nameNode = closedNode.children[1];
                    if (!!(flagNode)) {
                        let flagString = flagNode.attribs.class && flagNode.attribs.class.match(/(?![flag ]).*/);
                        makerProfile.info.flag = flagString[0];
                    }
                    if (!!(nameNode))
                        makerProfile.info.name = nameNode.text;
                }
                
                // -- Star
                else if (closedNode.name == 'div' && attrClass.match(/([ ]*)star([ ]*)$/)) {
                    let starNode = closedNode.children[0];
                    makerProfile.stars = Typography.getNumber(starNode);
                }
                
                // -- Medals (get names or indexes)
                else if (closedNode.name == 'div' && attrClass.match(/([ ]*)medals([ ]*)$/)) {
                    makerProfile.medals = Medals.getMedalsNames(closedNode);
                    //makerProfile.medals = Medals.getMedalsIndexes(closedNode);
                    //makerProfile.medals = makerProfile.medals.map(function(value){return ++value;});
                }
                
                // -- marioChallenge
                else if (closedNode.name == 'div' && attrClass.match(/([ ]*)mario100([ ]*)$/)) {
                    makerProfile.marioChallenge = CoursesMetrics.getMarioChallenge(closedNode.children[1].children[0]);
                }
                
                // -- playHistory
                else if (closedNode.name == 'div' && attrClass.match(/([ ]*)played-courses([ ]*)$/)) {
                    makerProfile.playHistory = CoursesMetrics.getPlayHistory(closedNode.children[1].children[0]);
                }
            }, onend() {
                callbackFunction(false, makerProfile);
            }                                  
        }, {decodeEntities: true, recognizeSelfClosing: true});
        _parserMakerProfile.write(body);
        _parserMakerProfile.end();
    }
    
    
    /**
     * @method module:_SmmMakerProfile::_parserPagination
     * Html parser to courses wrapper, capture courses info
     * @arg {Integer} page Number of page
     * @arg {String} body HTML from maker profile
     * @arg {Object} coursesWrapper Courses group analysing
     * @arg {Callback} callbackFunction callback of user
     * @access protected
     * @returns {Callback}
     */
    _parserPagination(page, body, coursesWrapper, callbackFunction) {
        // Parser all HTML
        let curNode = {
            attribs: {},
            children: [],
            name: 'root',
            text: []
        };
        let _parserMakerProfile = new HtmlParser.Parser({
            onopentag: function(name, attribs) {
                const node = {
                    attribs: attribs,
                    children: [],
                    name: name,
                    parent: curNode,
                    text: null
                };
                curNode.children.push(node);
                curNode = node;
            }, ontext (text) {
                curNode.text = text;
            }, onclosetag (name) {
                // Which in case the tag has a closed bad
                if(name != curNode.name) return;
                const closedNode = curNode;
                curNode = curNode.parent;
                // Which in case no have class
                let attrClass = closedNode.attribs.class;
                if (!!!(attrClass)) return;
                
                // -- coursesWrapper ['type']
                if(closedNode.name == 'div' && attrClass.match(/([ ]*)user-courses-wrapper([ ]*)$/))
                    coursesWrapper.count = Typography.getNumber(closedNode);
                else if (closedNode.name == 'div' && attrClass.match(/([ ]*)two-column-wrapper([ ]*)courses([ ]*)$/))
                    coursesWrapper.courses = CoursesWrapper.getCoursesId(coursesWrapper.courses, closedNode);
            }, onend() {
                callbackFunction(page, coursesWrapper);
            }                                  
        }, {decodeEntities: true, recognizeSelfClosing: true});
        _parserMakerProfile.write(body);
        _parserMakerProfile.end();
    }
    
    /**
     * @method module:_SmmMakerProfile::getMetaContent
     * Do request to meta data and capture callbackFunction from user app
     * @arg {String} nintendoId Nintendo ID of user
     * @arg {Callback} callbackFunction callback of user
     * @access public
     * @returns {Callback}
     */
    getMetaContent(nintendoId, callbackFunction) {
        let $this = this;
        Request($this._getMakerProfileUrl(nintendoId), function (error, response, body) { 
            if (error || response.statusCode != 200) $this._callbackError(callbackFunction);
            else $this._getMakerProfileContent(nintendoId, body, callbackFunction); 
        });
    }
    
    /**
     * @method module:_SmmMakerProfile::getAllContent
     * Do request of all data and capture callbackFunction from user app
     * @arg {String} nintendoId Nintendo ID of user
     * @arg {Callback} callbackFunction callback of user
     * @access public
     * @returns {Callback}
     */
    getMetaCoursesContent(nintendoId, callbackFunction) {
        let $this = this;
        Request($this._getMakerProfileUrl(nintendoId), function (error, response, body) { 
            if (error || response.statusCode != 200) $this._callbackError(callbackFunction);
            else $this._getMetaCoursesContent(nintendoId, body, callbackFunction); 
        });
    }
    
    /**
     * @method module:_SmmMakerProfile::getAllContent
     * Do request of all data and capture callbackFunction from user app
     * @arg {String} nintendoId Nintendo ID of user
     * @arg {Callback} callbackFunction callback of user
     * @access public
     * @returns {Callback}
     */
    getAllContent(nintendoId, callbackFunction) {
        let $this = this;
        Request($this._getMakerProfileUrl(nintendoId), function (error, response, body) { 
            if (error || response.statusCode != 200) $this._callbackError(callbackFunction);
            else $this._getCoursesContent(nintendoId, body, callbackFunction); 
        });
    }
    
}

// Module this _SsmMakerProfile Class
var SmmMakerProfile = new _SmmMakerProfile();
module.exports = SmmMakerProfile;