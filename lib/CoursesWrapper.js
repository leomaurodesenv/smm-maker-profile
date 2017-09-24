/* Includes */
const Typography = require('./Typography');

/**
 * @module _CoursesWrapper
 * This class read and interpreter the infos of couses wrapper boxes
 * 
 * @author Leonardo Mauro <leo.mauro.desenv@gmail.com> (http://leonardomauro.com/)
 * @link https://github.com/leomaurodesenv/smm-maker-profile GitHub
 * @license https://opensource.org/licenses/GPL-2.0 GNU Public License (GPL v2)
 * @copyright 2017 Leonardo Mauro
 * @package smm-maker-profile | smm-course-search
 * @access public
 */
class _CoursesWrapper {
    
    /**
     * @method module:_CoursesMetrics
     * Constructor of class
     * @var {Regex} _regex Regular expression of course box
     * @instance
     * @access public
     * @returns {this}
     */
    constructor() {
        this._regex = /(?:)course-card(?: |$)/;
        this._gameStyles = {
            sb:'marioBros',
            sb3:'marioBros3',
            sw:'marioWorld',
            sbu:'marioBrosU'
        };
    }
    
    /**
     * @method module:_Medals::getCoursesId
     * Transform [nodes] in [coursesId]
     * @arg {Array} nodes Array of nodes ids
     * @access public
     * @returns {Array}
     */
    getCoursesId(nodes) {
        var courses = [];
        
        nodes.children.forEach(courseNode => {
            let attrClass = courseNode.attribs.class,
                match = attrClass && attrClass.match(this._regex);
            if (!match) return;
            // Getting Id
            courseNode.children.forEach(node => {
                let attrClassCourse = node.attribs.class;
                if(node.name == 'div' && attrClassCourse.match(/^([ ]*)course-info([ ]*)/)){
                    let courseDetail = node.children[3],
                        courseDetailLink = courseDetail.children[2],
                        courseId = courseDetailLink.attribs.href && courseDetailLink.attribs.href.match(/(?![/courses/]).*/);
                    courses.push(courseId[0]);
                }
            });
        });
        
        return courses;
    }
    
    /**
     * @method module:_Medals::_getMaker
     * Transform [node] in [json{makerData}]
     * @arg {Array} miiNode Node with miiverse data
     * @arg {Array} makerNode Node with maker data
     * @access private
     * @returns {Json}
     */
    _getMaker(miiNode, makerNode) {
        var maker = {};
        if(miiNode.name == 'div' && miiNode.attribs.class.match(/^([ ]*)mii-wrapper([ ]*)/)){
            let link = miiNode.children[0].attribs.href && miiNode.children[0].attribs.href.match(/(?![/profile/]).*/),
                nintendoId = link[0] && link[0].match(/^[\w]*/);
            if (!nintendoId) return maker;
            maker.login = nintendoId[0];
            maker.faceImg = miiNode.children[0].children[0].attribs.src;
        }
        if(makerNode.name == 'div' && makerNode.attribs.class.match(/^([ ]*)creator-info([ ]*)/)){
            let flagNode = makerNode.children[0],
                nameNode = makerNode.children[2],
                flagString = flagNode.attribs.class && flagNode.attribs.class.match(/(?![flag ]).*/);
            maker.flag = flagString[0];
            maker.name = nameNode.text;
        }
        
        return maker;
    }
    
    /**
     * @method module:_Medals::_getCreatedAt
     * Transform [node] in [timestamp]
     * @arg {Array} node Node with created at data
     * @access private
     * @returns {String}
     */
    _getCreatedAt(node) {
        let timeInNode = node.text,
            match = timeInNode.match(/^([\d]+) ((mins.)|(hour|day)s?) ago$/);
        var created;
        if(match) {
            let milliSeconds = (match[2] == 'mins.') ? (match[1] * 60000) : 
                (match[2] == 'hour' || match[2] == 'hours') ? (match[1] * 3600000) :
                (match[1] * 86400000);
            created = new Date(new Date().getTime() - milliSeconds);
        }
        else created = new Date(timeInNode);
        created.setUTCHours(created.getUTCHours() - 3);
        return created;
    }
    
    /**
     * @method module:_Medals::getCoursesDetails
     * Transform [nodes] in [courses Data]
     * @arg {Array} nodes Array of courses with all details
     * @access public
     * @returns {Array}
     */
    getCoursesDetails(nodes) {
        var courses = [];
        
        nodes.children.forEach(courseNode => {
            let attrClass = courseNode.attribs.class,
                match = attrClass && attrClass.match(this._regex);
            if (!match) return;
            // Getting Details
            var courseDetail = {};
            courseNode.children.forEach(node => {
                let attrClassCourse = node.attribs.class;
                if(node.name == 'div' && attrClassCourse.match(/^([ ]*)course-header([ ]*)/)){
                    courseDetail.difficulty = (node.text) ? node.text.toLowerCase() : false;
                    courseDetail.difficulty = (courseDetail.difficulty == 'super expert') ? 'superExpert' : courseDetail.difficulty;
                    courseDetail.clearRate = (node.children.length) ? Typography.getNumber(node.children[1]) : false;
                }
                else if(node.name == 'div' && attrClassCourse.match(/^([ ]*)course-info([ ]*)/)){
                    let courseImgWrapper = node.children[1],
                        courseImgFull = node.children[2],
                        courseDetailLink = node.children[3].children[2],
                        courseId = courseDetailLink.attribs.href && courseDetailLink.attribs.href.match(/(?![/courses/]).*/);
                    courseDetail.title = node.children[0].children[0].text;
                    courseDetail.thumbnailImg = courseImgWrapper.children[0].children[0].attribs.src;
                    let gameStyle = courseImgWrapper.children[1].children[0].attribs.class
                                    && courseImgWrapper.children[1].children[0].attribs.class.match(/(?:^| )common_gs_([A-Za-z0-9]+)(?: |$)/);
                    courseDetail.gameStyle = this._gameStyles[gameStyle[1]];
                    courseDetail.createdAt = this._getCreatedAt(courseImgWrapper.children[1].children[1]);
                    let tag = courseImgWrapper.children[2].text.toLowerCase();
                    courseDetail.tag = (tag && tag !== '---') ? tag : 'none';
                    let courseStats = courseImgWrapper.children[3];
                    courseDetail.stared = Typography.getNumber(courseStats.children[0]);
                    courseDetail.played = Typography.getNumber(courseStats.children[1]);
                    courseDetail.shared = Typography.getNumber(courseStats.children[2]);
                    let clearsAttempts = Typography.getClearsAttempts(courseImgWrapper.children[4]);
                    courseDetail.clears = clearsAttempts[0];
                    courseDetail.attempts = clearsAttempts[1];
                    courseDetail.img = courseImgFull.children[0].attribs.src;
                    courseDetail.maker = this._getMaker(node.children[3].children[0], node.children[3].children[1]);
                    courseDetail.id = courseId[0];
                }
            });
            courses.push(courseDetail);
        });
        
        return courses;
    }
    
    /**
     * @method module:_Medals::getCoursesStaticDetails
     * Transform [nodes] in [courses Data]
     * @arg {Array} nodes Array of courses with some static details
     * @access public
     * @returns {Array}
     */
    getCoursesStaticDetails(nodes) {
        var courses = [];
        
        nodes.children.forEach(courseNode => {
            let attrClass = courseNode.attribs.class,
                match = attrClass && attrClass.match(this._regex);
            if (!match) return;
            // Getting Details
            var courseDetail = {};
            courseNode.children.forEach(node => {
                let attrClassCourse = node.attribs.class;
                if(node.name == 'div' && attrClassCourse.match(/^([ ]*)course-header([ ]*)/)){
                    courseDetail.difficulty = (node.text) ? node.text.toLowerCase() : false;
                    courseDetail.difficulty = (courseDetail.difficulty == 'super expert') ? 'superExpert' : courseDetail.difficulty;
                }
                else if(node.name == 'div' && attrClassCourse.match(/^([ ]*)course-info([ ]*)/)){
                    let courseImgWrapper = node.children[1],
                        courseImgFull = node.children[2],
                        courseDetailLink = node.children[3].children[2],
                        courseId = courseDetailLink.attribs.href && courseDetailLink.attribs.href.match(/(?![/courses/]).*/);
                    courseDetail.title = node.children[0].children[0].text;
                    let gameStyle = courseImgWrapper.children[1].children[0].attribs.class
                                    && courseImgWrapper.children[1].children[0].attribs.class.match(/(?:^| )common_gs_([A-Za-z0-9]+)(?: |$)/);
                    courseDetail.gameStyle = this._gameStyles[gameStyle[1]];
                    courseDetail.createdAt = this._getCreatedAt(courseImgWrapper.children[1].children[1]);
                    courseDetail.maker = this._getMaker(node.children[3].children[0], node.children[3].children[1]);
                    courseDetail.id = courseId[0];
                }
            });
            courses.push(courseDetail);
        });
        
        return courses;
    }
}

// Module this _CoursesWrapper Class
var CoursesWrapper = new _CoursesWrapper();
module.exports = CoursesWrapper;