/**
 * @module _CoursesWrapper
 * This class read and interpreter the infos of couses wrapper boxes
 * 
 * @author Leonardo Mauro <leo.mauro.desenv@gmail.com> (http://leonardomauro.com/)
 * @link https://github.com/leomaurodesenv/smm-maker-profile GitHub
 * @license https://opensource.org/licenses/GPL-2.0 GNU Public License (GPL v2)
 * @copyright 2017 Leonardo Mauro
 * @version 1.0.2 2017-07-25
 * @package smm-maker-profile
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
    }
    
    /**
     * @method module:_Medals::getCoursesId
     * Transform [nodes] in [coursesId]
     * @arg {Array} nodes Array of nodes medals
     * @access public
     * @returns {Array}
     */
    getCoursesId(coursesIn, nodes) {
        var courses = (coursesIn.length != 0) ? coursesIn.slice() : [];
        
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
            // Next infos to get:
            //course-header -> difficult, rate
            //course-info -> title, courseImage, marioBrosType, createDate, lastTag, likedCount, playedCount, sharedCount, triedCount [typography], courseImageFull, creatorInfo, courseId
        });
        
        return courses;
    }
    
}

// Module this _CoursesWrapper Class
var CoursesWrapper = new _CoursesWrapper();
module.exports = CoursesWrapper;