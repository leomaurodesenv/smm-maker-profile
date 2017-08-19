/* Includes */
const Typography = require("./Typography.js");

/**
 * @module _CoursesMetrics
 * This class read and interpreter the courses metrics of Maker Profile
 * 
 * @author Leonardo Mauro <leo.mauro.desenv@gmail.com> (http://leonardomauro.com/)
 * @link https://github.com/leomaurodesenv/smm-maker-profile GitHub
 * @license https://opensource.org/licenses/GPL-2.0 GNU Public License (GPL v2)
 * @copyright 2017 Leonardo Mauro
 * @version 1.0.1 2017-07-17
 * @package smm-maker-profile
 * @access public
 */
class _CoursesMetrics {
    
    /**
     * @method module:_CoursesMetrics
     * Constructor of class
     * @instance
     * @access public
     * @returns {this}
     */
    constructor() {
        // two-collumn [mario100 | played-courses] > div.eq(1) > ul (Recive)
        // > li > div.cell 
        // > div.label (Analisys)
        // > div.value (Analisys)
    }
    
    /**
     * @method module:_Medals::getPlayHistory
     * Transform node in {metrics}
     * @arg {Array} nodes Array of courses metrics
     * @access public
     * @returns {Array}
     */
    getPlayHistory(node) {
        var playHistory = {
            coursesPlayed: 0, 
            coursesCleared: 0, 
            totalPlays: 0, 
            livesLost: 0
        };
        node.children.forEach(li => {
            let label = li.children[0].children[0],
                value = li.children[0].children[1];
            
            if(!!(label) && !!(value)){
                if(label.text == 'Courses played')
                    playHistory.coursesPlayed = Typography.getNumber(value);
                else if(label.text == 'Courses cleared')
                    playHistory.coursesCleared = Typography.getNumber(value);
                else if(label.text == 'Total plays')
                    playHistory.totalPlays = Typography.getNumber(value);
                else if(label.text == 'Lives lost')
                    playHistory.livesLost = Typography.getNumber(value);
            }
        });
        return playHistory;
    }
    
    /**
     * @method module:_Medals::getMarioChallenge
     * Transform node in {metrics}
     * @arg {Array} nodes Array of courses metrics
     * @access public
     * @returns {Array}
     */
    getMarioChallenge(node) {
        var marioChallenge = {
            easyClears: 0, 
            normalClears: 0, 
            expertClears: 0, 
            superExpertClears: 0
        };
        node.children.forEach(li => {
            let label = li.children[0].children[0],
                value = li.children[0].children[1];
            
            if(!!(label) && !!(value)){
                if(label.text == 'Easy clears')
                    marioChallenge.easyClears = Typography.getNumber(value);
                else if(label.text == 'Normal clears')
                    marioChallenge.normalClears = Typography.getNumber(value);
                else if(label.text == 'Expert clears')
                    marioChallenge.expertClears = Typography.getNumber(value);
                else if(label.text == 'Super Expert clears')
                    marioChallenge.superExpertClears = Typography.getNumber(value);
            }
        });
        return marioChallenge;
    }
    
}

// Module this _CoursesMetrics Class
var CoursesMetrics = new _CoursesMetrics();
module.exports = CoursesMetrics;