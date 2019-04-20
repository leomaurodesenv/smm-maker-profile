/**
 * @module _Medals
 * This class read and interpreter the medals of Maker Profile
 * 
 * @author Leonardo Mauro <leo.mauro.desenv@gmail.com> (http://leonardomauro.com/)
 * @link https://github.com/leomaurodesenv/smm-maker-profile GitHub
 * @license https://opensource.org/licenses/GPL-2.0 GNU Public License (GPL v2)
 * @copyright 2017 Leonardo Mauro
 * @package smm-maker-profile
 * @access public
 */
class _Medals {
    
    /**
     * @method module:_Medals
     * Constructor of class
     * @var {Regex} _regex Regular expression of typography
     * @var {Array} _medalsClasses Class names
     * @var {Array} _medalsNames Medals names for repective class
     * @instance
     * @access public
     * @returns {this}
     */
    constructor() {
        this._regex = /(?:)profile_icon_medal(\d){2}(?:)/g;
        this._medalsClasses = [
            "profile_icon_medal01",
            "profile_icon_medal02",
            "profile_icon_medal03",
            "profile_icon_medal04",
            "profile_icon_medal05",
            "profile_icon_medal06",
            "profile_icon_medal07",
            "profile_icon_medal08",
            "profile_icon_medal09",
            "profile_icon_medal10"
        ];
        
        this._medalsNames = [
            "Goomba", // 1 star
            "Koopa Troopa", // 50 stars
            "Piranha Plant", // 150 stars
            "Spiny", // 300 stars
            "Cheep Cheep", // 500 stars
            "Blooper", // 800 stars
            "Lakitu", // 1,300 stars
            "Bowser", // 2,000 stars
            "Toad", // 3,000 stars
            "Princess Peach" // 5,000 stars
        ];
        
    }
    
    /**
     * @method module:_Medals::getMedalsIndexes
     * Transform [node] in [medals]
     * @arg {Array} nodes Array of nodes medals
     * @access public
     * @returns {Array}
     */
    getMedalsIndexes(nodes) {
        var indexes = [];
        nodes.children.forEach((childNode) => {
            let attrClass = childNode.attribs.class,
                match = attrClass && attrClass.match(this._regex);
            if (!match) { return; }
            indexes.push(this._medalsClasses.indexOf(match[0]));
        });
        return indexes;
    }
    
    /**
     * @method module:_Medals::getMedalsNames
     * Transform [node] in [medals]
     * @arg {Array} nodes Array of nodes medals
     * @access public
     * @returns {Array}
     */
    getMedalsNames(nodes) {
        var medals = [],
            indexes = this.getMedalsIndexes(nodes);
        indexes.forEach((index) => {
            medals.push(this._medalsNames[index]);
        });
        return medals;
    }
}

// Module this _Medals Class
var Medals = new _Medals();
module.exports = Medals;