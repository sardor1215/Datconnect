"use strict";function _toConsumableArray(e){return _arrayWithoutHoles(e)||_iterableToArray(e)||_unsupportedIterableToArray(e)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(e,t){if(e){if("string"==typeof e)return _arrayLikeToArray(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?_arrayLikeToArray(e,t):void 0}}function _iterableToArray(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}function _arrayWithoutHoles(e){if(Array.isArray(e))return _arrayLikeToArray(e)}function _arrayLikeToArray(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,i=new Array(t);n<t;n++)i[n]=e[n];return i}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function _createClass(e,t,n){return t&&_defineProperties(e.prototype,t),n&&_defineProperties(e,n),e}function _defineProperty(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}
/*!
 * IconicMultiSelect v0.4.0
 * Licence:  MIT
 * (c) 2021 Sidney Wimart.
 */
var IconicMultiSelect=function(){function e(t){var n=t.customCss,i=t.data,o=t.noData,s=t.noResults,l=t.placeholder,r=t.select,a=t.textField,c=t.valueField;_classCallCheck(this,e),_defineProperty(this,"customCss",void 0),_defineProperty(this,"data",void 0),_defineProperty(this,"domElements",{}),_defineProperty(this,"event",function(){}),_defineProperty(this,"noData",void 0),_defineProperty(this,"noResults",void 0),_defineProperty(this,"options",[]),_defineProperty(this,"placeholder",void 0),_defineProperty(this,"prefix","iconic"+Math.floor(1e3+9e3*Math.random())+"-"),_defineProperty(this,"selectContainer",void 0),_defineProperty(this,"selectedOptions",[]),_defineProperty(this,"textField",void 0),_defineProperty(this,"valueField",void 0),this.customCss=n,this.data=null!=i?i:[],this.noData=null!=o?o:"No data found.",this.noResults=null!=s?s:"No results found.",this.placeholder=null!=l?l:"Select...",this.selectContainer=document.querySelector(r),this.textField=null!=a?a:null,this.valueField=null!=c?c:null}return _createClass(e,[{key:"init",value:function(){if(!this.selectContainer||"SELECT"!==this.selectContainer.nodeName)throw new Error("The selector '".concat(element,"' did not select any valid select tag."));this.options=this._getDataFromSettings()||this._getDataFromSelectTag(),this._injectCss(),this._renderMultiselect(),this._renderOptionsList(),this.domElements={clear:document.querySelector(".".concat(this.prefix+"multiselect__clear-btn")),input:document.querySelector(".".concat(this.prefix+"multiselect__input")),optionsContainer:document.querySelector(".".concat(this.prefix+"multiselect__options")),optionsContainerList:document.querySelector(".".concat(this.prefix+"multiselect__options > ul")),options:document.querySelectorAll(".".concat(this.prefix+"multiselect__options"," > ul > li"))},this._enableEventListenners()}},{key:"subscribe",value:function(e){if("function"!=typeof e)throw new Error("parameter in the subscribe method is not a function");this.event=e}},{key:"_addOptionToList",value:function(e){var t=this,n='<span class="'.concat(this.prefix+"multiselect__selected",'" data-value="').concat(e.value,'">').concat(e.text,'<span class="').concat(this.prefix+"multiselect__remove-btn",'">&#10006;</span></span>');this.domElements.input.insertAdjacentHTML("beforebegin",n),document.querySelector('span[data-value="'.concat(e.value,'"]')).firstElementChild.addEventListener("click",function(){var n=Array.from(t.domElements.options).find(function(t){return t.dataset.value==e.value});t._handleOption(n)})}},{key:"_clearSelection",value:function(){var e=this;this.selectedOptions.forEach(function(t){var n=Array.from(e.domElements.options).find(function(e){return e.dataset.value==t.value});e._handleOption(n,!1)}),this._dispatchEvent({action:"CLEAR_ALL_OPTIONS",selection:this.selectedOptions})}},{key:"_closeList",value:function(){this.domElements.input.value="",this.domElements.optionsContainer.style.display="none",this._filterOptions(""),this._removeAllArrowSelected()}},{key:"_dispatchEvent",value:function(e){this.event(e)}},{key:"_enableEventListenners",value:function(){var e=this;this.domElements.clear.addEventListener("click",function(){e._clearSelection()}),this.domElements.options.forEach(function(t){t.addEventListener("click",function(t){var n=t.target;e._handleOption(n),e._closeList()})}),this.domElements.input.addEventListener("focus",function(){e.domElements.optionsContainer.style.display="block",e.domElements.input.placeholder=""}),this.domElements.input.addEventListener("input",function(t){var n=t.target.value;e._filterOptions(n)}),this.domElements.input.addEventListener("keydown",function(t){e._handleArrows(t),e._handleBackspace(t),e._handleEnter(t)})}},{key:"_filterOptions",value:function(e){var t=this;!("block"===this.domElements.optionsContainer.style.display)&&e.length>0&&(this.domElements.optionsContainer.style.display="block");var n=e.toLowerCase();this.domElements.options.forEach(function(e){e.textContent.toLowerCase().startsWith(n)?t.domElements.optionsContainerList.append(e):e.remove()});var i=Array.from(this.domElements.options).some(function(e){return e.textContent.toLowerCase().startsWith(n)});this._showNoResults(!i)}},{key:"_getDataFromSelectTag",value:function(){return Array.from(this.selectContainer.options).map(function(e){return{text:e.text,value:e.value}})}},{key:"_getDataFromSettings",value:function(){var e=this;if(this.data.length>0&&this.valueField&&this.textField){var t="string"==typeof this.valueField,n="string"==typeof this.textField;if(!t||!n)throw new Error("textField and valueField must be of type string");return this.data.map(function(t){return{value:t[e.valueField],text:t[e.textField]}})}return null}},{key:"_handleArrows",value:function(e){if(40===e.keyCode||38===e.keyCode){var t="block"===this.domElements.optionsContainer.style.display,n=document.querySelector(".".concat(this.prefix+"multiselect__options > ul"));if(t){var i=document.querySelector(".".concat(this.prefix,"multiselect__options ul li.arrow-selected")),o={block:"nearest",inline:"nearest"},s={ArrowUp:"previous",Up:"previous",ArrowDown:"next",Down:"next"};if(!i)return n.firstElementChild.classList.add("arrow-selected"),void n.firstElementChild.scrollIntoView();if(i.classList.remove("arrow-selected"),!(i=i[s[e.key]+"ElementSibling"]))return(i=n.children["next"===s[e.key]?0:n.children.length-1]).classList.add("arrow-selected"),void i.scrollIntoView(o);i.classList.add("arrow-selected"),i.scrollIntoView(o)}else this.domElements.optionsContainer.style.display="block",n.firstElementChild.classList.add("arrow-selected"),n.firstElementChild.scrollIntoView()}}},{key:"_handleBackspace",value:function(e){if(8===e.keyCode&&""===e.target.value){var t=this.selectedOptions.length>0?this.selectedOptions[this.selectedOptions.length-1]:null;if(t){var n=document.querySelector('li[data-value="'.concat(t.value,'"]'));this._handleOption(n),0===this.selectedOptions.length&&(this.domElements.optionsContainer.style.display="none")}}}},{key:"_handleEnter",value:function(e){if(13===e.keyCode){var t=document.querySelector(".".concat(this.prefix,"multiselect__options ul li.arrow-selected"));t&&(this._handleOption(t),this._closeList())}}},{key:"_handleClearSelectionBtn",value:function(){this.selectedOptions.length>0?this.domElements.clear.style.display="block":this.domElements.clear.style.display="none"}},{key:"_handleOption",value:function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];if(this.selectedOptions.some(function(t){return t.value==e.dataset.value}))e.classList.remove("".concat(this.prefix,"multiselect__options--selected")),this.selectedOptions=this.selectedOptions.filter(function(t){return t.value!=e.dataset.value}),this._removeOptionFromList(e.dataset.value),t&&this._dispatchEvent({action:"REMOVE_OPTION",value:e.dataset.value,selection:this.selectedOptions});else{var n=this.options.find(function(t){return t.value==e.dataset.value});e.classList.add("".concat(this.prefix,"multiselect__options--selected")),this.selectedOptions=[].concat(_toConsumableArray(this.selectedOptions),[n]),this._addOptionToList(n),t&&this._dispatchEvent({action:"ADD_OPTION",value:e.dataset.value,selection:this.selectedOptions})}this._handleClearSelectionBtn(),this._handlePlaceholder()}},{key:"_handlePlaceholder",value:function(){this.selectedOptions.length>0?this.domElements.input.placeholder="":this.domElements.input.placeholder=this.placeholder}},{key:"_removeAllArrowSelected",value:function(){this.domElements.options.forEach(function(e){e.classList.contains("arrow-selected")&&e.classList.remove("arrow-selected")})}},{key:"_removeOptionFromList",value:function(e){document.querySelector('span[data-value="'.concat(e,'"]')).remove()}},{key:"_renderOptionsList",value:function(){var e='\n        <div style="display: none;" class="'.concat(this.prefix,'multiselect__options">\n          <ul>\n          ').concat(this.options.length>0?this.options.map(function(e){return'\n              <li data-value="'.concat(e.value,'">').concat(e.text,"</li>\n            ")}).join(""):"","\n          ").concat(this._showNoData(0===this.options.length),"\n          </ul>\n        </div>\n      ");document.querySelector(".".concat(this.prefix+"multiselect__container")).insertAdjacentHTML("beforeend",e)}},{key:"_renderMultiselect",value:function(){this.selectContainer.style.display="none";var e='\n      <div class="'.concat(this.prefix+"multiselect__container",'">\n        <div class="').concat(this.prefix+"multiselect__wrapper",'">\n          <input class="').concat(this.prefix+"multiselect__input",'" placeholder="').concat(this.placeholder,'" />\n        </div>\n        <span style="display: none;" class="').concat(this.prefix+"multiselect__clear-btn",'">&#10006;</span>\n      </div>\n    ');this.selectContainer.insertAdjacentHTML("afterend",e)}},{key:"_showNoData",value:function(e){return e?'<p class="'.concat(this.prefix,'multiselect__options--no-data">').concat(this.noData,"</p>"):""}},{key:"_showNoResults",value:function(e){var t=document.querySelector(".".concat(this.prefix,"multiselect__options--no-results"));if(e){var n='<p class="'.concat(this.prefix,'multiselect__options--no-results">').concat(this.noResults,"</p>");!t&&this.domElements.optionsContainerList.insertAdjacentHTML("beforeend",n)}else t&&t.remove()}},{key:"_injectCss",value:function(){var e="\n      <style>\n        .".concat(this.prefix,"multiselect__container {\n          -webkit-box-align: center;\n          -ms-flex-align: center;\n              align-items: center;\n          background-color: #fff;\n          border-radius: 2px;\n          -webkit-box-shadow: 0 1px 3px 0 #d1d1d2, 0 0 0 1px #d1d1d2;\n                  box-shadow: 0 1px 3px 0 #d1d1d2, 0 0 0 1px #d1d1d2;\n          -webkit-box-sizing: border-box;\n                  box-sizing: border-box;\n          display: -webkit-box;\n          display: -ms-flexbox;\n          display: flex;\n          font-family: Arial,Helvetica,sans-serif;\n          min-height: 36px;\n          padding: 4px 8px 0 8px;\n          position: relative;\n          width: 354px;\n        }\n\n        .").concat(this.prefix,"multiselect__container:after {\n          content:'';\n          min-height:inherit;\n          font-size:0;\n        }\n\n        .").concat(this.prefix,"multiselect__container > * {\n          color: #656565;\n          font-size: 14px;\n        }\n\n        .").concat(this.prefix+"multiselect__wrapper"," {\n          display: -webkit-box;\n          display: -ms-flexbox;\n          display: flex;\n          -ms-flex-wrap: wrap;\n              flex-wrap: wrap;\n          height: 100%;\n          width: 100%;\n        }\n\n        .").concat(this.prefix,"multiselect__clear-btn {\n           cursor: pointer;\n           margin-bottom: 4px;\n           margin-left: 4px;\n        }\n\n        .").concat(this.prefix,"multiselect__options {\n          background-color: #f6f6f6;\n          border-radius: 2px;\n          -webkit-box-shadow: 0 1px 3px 0 #d1d1d2, 0 0 0 1px #d1d1d2;\n          box-shadow: 0 1px 3px 0 #d1d1d2, 0 0 0 1px #d1d1d2;\n          left: -1px;\n          position: absolute;\n          top: calc(100% + 3px);\n          width: 100%;\n        }\n\n        .").concat(this.prefix,"multiselect__options ul {\n          list-style: none;\n          margin: 0;\n          padding: 2px 0;\n          max-height: 120px;\n          overflow: auto;\n        }\n\n        .").concat(this.prefix,"multiselect__options ul li {\n          cursor: pointer;\n          padding: 4px 8px;\n        }\n\n        .").concat(this.prefix,"multiselect__options ul p.").concat(this.prefix,"multiselect__options--no-results, \n        .").concat(this.prefix,"multiselect__options ul p.").concat(this.prefix,"multiselect__options--no-data {\n          margin: 0;\n          padding: 8px;\n          text-align: center;\n        }\n\n        .").concat(this.prefix,"multiselect__options ul li.").concat(this.prefix,"multiselect__options--selected {\n          background-color: #ff6358;\n          color: #fff;\n        }\n\n        .").concat(this.prefix,"multiselect__options ul li.").concat(this.prefix,"multiselect__options--selected:hover {\n          background-color: #eb5b51;\n        }\n\n        .").concat(this.prefix,"multiselect__options ul li:hover {\n          background-color: #dedede;\n        }\n\n        .").concat(this.prefix,"multiselect__options ul li.arrow-selected {\n          border: 2px solid rgba(101, 101, 101, 0.5);\n        }\n\n        .").concat(this.prefix,"multiselect__selected {\n          background-color: #656565;\n          border-radius: 2px;\n          color: #fff;\n          margin-bottom: 4px;\n          margin-right: 4px;\n          padding: 4px 8px;\n          display: -webkit-box;\n          display: -ms-flexbox;\n          display: flex;\n          -webkit-box-align: center;\n              -ms-flex-align: center;\n                  align-items: center;\n        }\n\n        .").concat(this.prefix,"multiselect__selected .").concat(this.prefix,"multiselect__remove-btn {\n          cursor: pointer;\n          margin-left: 6px;\n        }\n\n        .").concat(this.prefix,"multiselect__input {\n          border: none;\n          -ms-flex-preferred-size: 40px;\n              flex-basis: 40px;\n          -webkit-box-flex: 1;\n              -ms-flex-positive: 1;\n                  flex-grow: 1;\n          height: 24px;        \n          margin-bottom: 4px;\n          min-width: 40px;\n          outline: none;      \n        }\n      </style>\n      ");this.customCss||document.querySelector("head").insertAdjacentHTML("beforeend",e),this.customCss&&(this.prefix="")}}]),e}();