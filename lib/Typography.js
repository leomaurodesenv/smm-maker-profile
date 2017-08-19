/**
 * @module _Typography
 * This class can read a array of typography nodes to transform in number | text
 * 
 * @author Leonardo Mauro <leo.mauro.desenv@gmail.com> (http://leonardomauro.com/)
 * @link https://github.com/leomaurodesenv/smm-maker-profile GitHub
 * @license https://opensource.org/licenses/GPL-2.0 GNU Public License (GPL v2)
 * @copyright 2017 Leonardo Mauro
 * @version 1.0.2 2017-07-17
 * @package smm-maker-profile
 * @access public
 */
class _Typography {
    
    /**
     * @method module:_Typography
     * Constructor of class
     * @var {Regex} _regex Regular expression of typography
     * @instance
     * @access public
     * @returns {this}
     */
    constructor() {
        this._regex = /(?:)typography-(\d|second)(?: |$)/;
    }
    
    /**
     * @method module:_Typography::getNumber
     * Transform [node] of typography in number
     * @arg {Array} nodes Array of nodes typography
     * @access public
     * @returns {Number}
     */
    getNumber(nodes){
        return +this._getDigits(nodes);
    }
    
    /**
     * @method module:_Typography::_getDigits
     * Transform [node] of typography in number (String)
     * @arg {Array} nodes Array of nodes typography
     * @access protected
     * @returns {String}
     */
    _getDigits(nodes) {
        var digits = '';
        nodes.children.forEach(childNode => {
            let attrClass = childNode.attribs.class,
                match = attrClass && attrClass.match(this._regex);

            if (!match) return;
            if (match[1] === 'second') digits += '.';
            else digits += match[1];
        });
        return digits;
    }
}

// Module this _Typography Class
var Typography = new _Typography();
module.exports = Typography;