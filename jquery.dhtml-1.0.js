/*
Copyright (c) 2015 Corentin Peltier c0rent1n.devel@gmail.com
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
(function($)
{	
	var dhtmlSuffixes = new Array();
	var defaultSettings = {}; //by suffix
	
	var converters = {
		jsonConverter: function(sourceNumberAndUnity, destinationUnity, roundDepth, jsonContent) {
			var unities = jsonContent;
			
			if (typeof sourceNumberAndUnity == 'undefined') {
				sourceNumberAndUnity = "0";
			}
			
			if (typeof roundDepth == 'undefined') {
				roundDepth = 2;
			}
			var roundDepthNumber = Math.pow(10, roundDepth);
			
			destinationUnity = destinationUnity.toUpperCase();
			sourceNumberAndUnity = sourceNumberAndUnity.toUpperCase().replace(/\s/g, '').replace(/,/g, '.'); 			
			var sourceNumber = parseFloat(sourceNumberAndUnity);
			if (isNaN(sourceNumber)) {
				sourceNumber = 0;
			}
			var sourceUnity = sourceNumberAndUnity.replace(/[0-9\.]/g, '');
			// alert(sourceNumber);
			// alert(sourceUnity);
			
			
			var sourceNumberInAxis = sourceNumber;
			//Transform source number
			for (var unity in unities) {
				if (unity == sourceUnity) {
					sourceNumberInAxis = (Math.round(sourceNumber / unities[unity] * roundDepthNumber) / roundDepthNumber);
				}
			}
			
			var convertedNumber = sourceNumberAndUnity;
			//Transorm in destination unity
			for (var unity in unities) {
				if (unity == destinationUnity) {
					convertedNumber = (Math.round(sourceNumberInAxis * unities[unity] * roundDepthNumber) / roundDepthNumber) + ' ' + destinationUnity;
					break;
				}
			}
			
			return convertedNumber;
		},
		sizeConverter: function(sourceNumberAndUnity, destinationUnity, roundDepth) {
			if (typeof sourceNumberAndUnity == 'undefined') {
				sourceNumberAndUnity = "0";
			}
			if (typeof roundDepth == 'undefined') {
				roundDepth = 2;
			}
			var roundDepthNumber = Math.pow(10, roundDepth);
			
			sourceNumberAndUnity = sourceNumberAndUnity.toLowerCase().replace(/\s/g, '').replace(/,/g, '.'); 
			
			var sourceNumberAndUnityParts = [];
			var match = '';
			while (match != null) {
				// match = /[0-9\.]+[a-zA-Z'"]*/g.exec(sourceNumberAndUnity);
				match = sourceNumberAndUnity.match(/[0-9\.]+[a-zA-Z'"]*/g);
				if (match != null) {
					sourceNumberAndUnity = sourceNumberAndUnity.substr(match.toString().length);
					sourceNumberAndUnityParts.push(match[0]);
				}
			}
			var sourceNumberInMm = 0;
			for (var i = 0; i < sourceNumberAndUnityParts.length; i++) {
				var number = parseFloat(sourceNumberAndUnityParts[i]);
				var unity = sourceNumberAndUnityParts[i].replace(/[0-9\.]/g, '');
				
				switch (unity) {
					case 'cm':
						sourceNumberInMm += number * 10;
						break;
					case 'dm':
						sourceNumberInMm += number * 100;
						break;
					case 'm':
						sourceNumberInMm += number * 1000;
						break;
					case 'dam':
						sourceNumberInMm += number * 10000;
						break;
					case 'hm':
						sourceNumberInMm += number * 100000;
						break;
					case 'km':
						sourceNumberInMm += number * 1000000;
						break;
					case '\'':
					case 'ft':
					case 'foot':
					case 'feet':
						sourceNumberInMm += number * 304.8;
						break;
					case '"':
					case '\'\'':
					case 'in':
					case 'inch':
					case 'inches':
						sourceNumberInMm += number * 25.4;
						break;
					default: 
						sourceNumberInMm += number;
				}
			}
			
			destinationUnity = destinationUnity.toLowerCase().replace(/\s/g, '');
			var convertedNumber;
			switch (destinationUnity) {
				case 'cm':
					convertedNumber = Math.round(sourceNumberInMm / 10 * roundDepthNumber) / roundDepthNumber + ' cm';
					break;
				case 'dm':
					convertedNumber = Math.round(sourceNumberInMm / 100 * roundDepthNumber) / roundDepthNumber + ' dm';
					break;
				case 'm':
					convertedNumber = Math.round(sourceNumberInMm / 1000 * roundDepthNumber) / roundDepthNumber + ' m';
					break;
				case 'dam':
					convertedNumber = Math.round(sourceNumberInMm / 10000 * roundDepthNumber) / roundDepthNumber + ' dam';
					break;
				case 'hm':
					convertedNumber = Math.round(sourceNumberInMm / 100000 * roundDepthNumber) / roundDepthNumber + ' hm';
					break;
				case 'km':
					convertedNumber = Math.round(sourceNumberInMm / 1000000 * roundDepthNumber) / roundDepthNumber + ' km';
					break;
				case '\'':
				case 'ft':
				case 'foot':
				case 'feet':
					convertedNumber = Math.round(sourceNumberInMm / 304.8 * roundDepthNumber) / roundDepthNumber + '\'';
					break;
				case '"':
				case '\'\'':
				case 'in':
				case 'inch':
				case 'inches':
					convertedNumber = (Math.round(sourceNumberInMm / 25.4 * roundDepthNumber) / roundDepthNumber) + '"';
					break;
				case '"\'':
				case 'feetinches':
				case 'feetinch':
				case 'footinches':
				case 'footinch':
				case 'feetandinches':
				case 'footandinches':
				case 'footandinch':
				case 'feetandinch':
				case 'feet&inches':
				case 'foot&inches':
				case 'foot&inch':
				case 'feet&inch':
				case 'ftandin':
				case 'ft&in':
					var inches = sourceNumberInMm / 25.4;
					var feet = Math.floor(inches / 12);
					inches = Math.round(inches % 12 * roundDepthNumber) / roundDepthNumber;
					convertedNumber = feet + '\'' + inches + '"';
					break;
				default: 
					convertedNumber = Math.round(sourceNumberInMm * roundDepthNumber) / roundDepthNumber + ' mm';
			}
			
			return convertedNumber;
		},
		massConverter: function(sourceNumberAndUnity, destinationUnity, roundDepth) {
			if (typeof sourceNumberAndUnity == 'undefined') {
				sourceNumberAndUnity = "0";
			}
			if (typeof roundDepth == 'undefined') {
				roundDepth = 2;
			}
			var roundDepthNumber = Math.pow(10, roundDepth);
			sourceNumberAndUnity = sourceNumberAndUnity.toLowerCase().replace(/\s/g, '').replace(/,/g, '.');
			
			var sourceNumberAndUnityParts = [];
			var match = '';
			while (match != null) {
				// match = /[0-9\.]+[a-zA-Z'"]*/g.exec();
				match = sourceNumberAndUnity.match(/[0-9\.]+[a-zA-Z'"]*/g);
				if (match != null) {
					sourceNumberAndUnity = sourceNumberAndUnity.substr(match.toString().length);
					sourceNumberAndUnityParts.push(match[0]);					
				}
			}
			var sourceNumberInMg = 0;
			
			for (var i = 0; i < sourceNumberAndUnityParts.length; i++) {
				var number = parseFloat(sourceNumberAndUnityParts[i]);
				var unity = sourceNumberAndUnityParts[i].replace(/[0-9\.]/g, '');
				
				switch (unity) {
					case 'cg':
						sourceNumberInMg += number * 10;
						break;
					case 'dg':
						sourceNumberInMg += number * 100;
						break;
					case 'g':
						sourceNumberInMg += number * 1000;
						break;
					case 'dag':
						sourceNumberInMg += number * 10000;
						break;
					case 'hg':
						sourceNumberInMg += number * 100000;
						break;
					case 'kg':
						sourceNumberInMg += number * 1000000;
						break;
					case 'lb':
					case 'lbm':
					case 'lbs':
					case 'pound':
					case 'pounds':
						sourceNumberInMg += number * 453592.37;
						break;
					case 'oz':
					case 'ounce':
					case 'ounces':
						sourceNumberInMg += number * 28349.5231;
						break;
					default: 
						sourceNumberInMg += number;
				}
			}
			
			destinationUnity = destinationUnity.toLowerCase().replace(/\s/g, '');
			var convertedNumber;
			switch (destinationUnity) {
				case 'cg':
					convertedNumber = Math.round(sourceNumberInMg / 10 * roundDepthNumber) / roundDepthNumber + ' cg';
					break;
				case 'dg':
					convertedNumber = Math.round(sourceNumberInMg / 100 * roundDepthNumber) / roundDepthNumber + ' dg';
					break;
				case 'g':
					convertedNumber = Math.round(sourceNumberInMg / 1000 * roundDepthNumber) / roundDepthNumber + ' g';
					break;
				case 'dag':
					convertedNumber = Math.round(sourceNumberInMg / 10000 * roundDepthNumber) / roundDepthNumber + ' dag';
					break;
				case 'hg':
					convertedNumber = Math.round(sourceNumberInMg / 100000 * roundDepthNumber) / roundDepthNumber + ' hg';
					break;
				case 'kg':
					convertedNumber = Math.round(sourceNumberInMg / 1000000 * roundDepthNumber) / roundDepthNumber + ' kg';
					break;
				case 'lb':
				case 'lbs':
				case 'lbm':
				case 'pound':
				case 'pounds':
					convertedNumber = Math.round(sourceNumberInMg / 453592.37 * roundDepthNumber) / roundDepthNumber + ' lbs';
					break;
				case 'oz':
				case 'ounce':
				case 'ounces':
					convertedNumber = (Math.round(sourceNumberInMg / 28349.5231 * roundDepthNumber) / roundDepthNumber) + ' oz';
					break;
				case '"\'':
				case 'poundsounces':
				case 'poundounces':
				case 'poundounce':
				case 'poundsandounces':
				case 'poundandounces':
				case 'poundandounce':
				case 'poundsandounce':
				case 'pounds&ounces':
				case 'pound&ounces':
				case 'pound&ounce':
				case 'pounds&ounce':
				case 'lbsandoz':
				case 'lbmandoz':
				case 'lbandoz':
				case 'lbs&oz':
				case 'lbm&oz':
				case 'lb&oz':
					var ounces = sourceNumberInMg / 453592.37;
					var pounds = Math.floor(ounces);
					var ounces =  Math.round((ounces - pounds) * 16 * roundDepthNumber) / roundDepthNumber;
					convertedNumber = pounds + ' lbm ' + ounces + ' oz';
					break;
				default: 
					convertedNumber = Math.round(sourceNumberInMg * roundDepthNumber) / roundDepthNumber + ' mg';
			}
			
			return convertedNumber;
		}
	}
	
	
	function updateDhtmlText(elem, dhtmlSuffix, newSettings)
	{
		return elem.each(function() {
			$(elem).find('.dhtml' + dhtmlSuffix).each(function() {
				var dhtmlDetail = $(this).data('dhtml' + dhtmlSuffix);
				if (typeof newSettings == 'object'
					&& typeof dhtmlDetail != 'undefined') {
					newSettings = {"settings": newSettings};
					$(this).data('dhtml' + dhtmlSuffix, $.extend(true, dhtmlDetail, newSettings));
				}
				textOperations($(this), dhtmlDetail.text, dhtmlDetail.settings, dhtmlDetail.type, dhtmlSuffix);
			});
		});
	}
	
	
	function getDhtmlText(elem, dhtmlSuffix, sourceNumberAndUnity, destinationUnity, roundDepth)
	{
		if (typeof roundDepth == 'undefined') {
			roundDepth = 2;
		}
		var settings = defaultSettings[dhtmlSuffix];
		return converters[settings.converter.name + 'Converter'](sourceNumberAndUnity, destinationUnity, roundDepth, settings.converter.content);
	}
	
	function textOperations(elem, text, settings, type, dhtmlSuffix)
	{
		settings = $.extend({}, defaultSettings[dhtmlSuffix], settings);
		
		var dhtmlText = '';
		if (typeof text == 'object') {
			for (var i in text) {
				if (typeof settings == 'object'
					&& typeof settings.converter == 'object'
					&& typeof settings.converter.name == 'string'
					&& typeof settings.converter.to == 'string'
					&& typeof converters[settings.converter.name + 'Converter'] == 'function') {
					dhtmlText += converters[settings.converter.name + 'Converter'](text, settings.converter.to, settings.converter.depth, settings.converter.content);
				} else {
					dhtmlText += text;
				}
			}
		} else if (typeof text == 'string') {
			if (typeof settings == 'object'
				&& typeof settings.converter == 'object'
				&& typeof settings.converter.name == 'string'
				&& typeof settings.converter.to == 'string'
				&& typeof converters[settings.converter.name + 'Converter'] == 'function') {
				dhtmlText += converters[settings.converter.name + 'Converter'](text, settings.converter.to, settings.converter.depth, settings.converter.content);
			} else {
				dhtmlText += text;
			}
		}
		
		return elem.each(function() {
			switch (type) {
				case 'html':
					$(this).html(dhtmlText);
					break;
				case 'value':
				case 'val':
					type = 'val';
					$(this).val(dhtmlText);
					break;
				case 'func':
					// console.log(type);
					// console.log(settings[0]['funcName']);
					// console.log(settings);
					var tempFuncArgs = settings.funcArgs.slice();
					tempFuncArgs[$.inArray('{dhtmlReplace}', tempFuncArgs)] = dhtmlText;
					// console.log(tempFuncArgs);
					$.fn[settings.funcName].apply($(this), tempFuncArgs);
					break;
				case 'placeholder':
					type = 'placeholder';
					$(this).attr('placeholder', dhtmlText);
					break;
				case 'title':
					type = 'title';
					$(this).attr('title', dhtmlText);
					break;
			}
			dhtmlDataName = 'dhtml' + dhtmlSuffix;
			$(this).addClass(dhtmlDataName).data(dhtmlDataName, {
				"type": type,
				"func": "get",
				"text": text, 
				"settings": settings
			});
		});
	}
	
	//Methods
	var methods = {
		'init': function(dhtmlSuffix, settings) {
			if ($.inArray(dhtmlSuffix, dhtmlSuffixes) == -1) {
				dhtmlSuffixes.push(dhtmlSuffix);
				if (typeof settings == 'object') {
					defaultSettings[dhtmlSuffix] = settings;
				}
				$.fn['dhtml' + dhtmlSuffix] = function(method) {
					if (methods[method]
						&& method != 'init'
						&& method != 'clear') {
						var dhtmlArguments = Array.prototype.slice.call(arguments, 1);
						
						dhtmlArguments.unshift(dhtmlSuffix);
						// console.log(dhtmlArguments);
						return methods[method].apply(
							this, 
							dhtmlArguments
						);
					} else {
						$.error('Method "' + method + '" does not exist for dhtml');
					}
				}
				return this;
			} else {
					$.error('Suffix "' + dhtmlSuffix + '" already exists for dhtml');
			}
		},
		'html': function(dhtmlSuffix, text, settings) {
			return textOperations(this, text, settings, 'html', dhtmlSuffix);
		},
		'func': function(dhtmlSuffix, text, settings) {
			return textOperations(this, text, settings, 'func', dhtmlSuffix);
		},
		'val': function(dhtmlSuffix, text, settings) {		
			return textOperations(this, text, settings, 'val', dhtmlSuffix);
		},
		'value': function(dhtmlSuffix, text, settings) {		
			return textOperations(this, text, settings, 'val', dhtmlSuffix);
		},
		'placeholder': function(dhtmlSuffix, text, settings) {		
			return textOperations(this, text, settings, 'placeholder', dhtmlSuffix);
		},
		'title': function(dhtmlSuffix, text, settings) {		
			return textOperations(this, text, settings, 'title', dhtmlSuffix);
		},
		'defaultSettings': function(dhtmlSuffix, settings) { //Update static default settings for the correct dhtmlSuffix	
			defaultSettings[dhtmlSuffix] = settings;
			return this;
		},	
		'extendElementsSettings': function(dhtmlSuffix, settings) {	//Update the settings (and values) of each element contained in "this" with the correct dhtmlSuffix
			return updateDhtmlText(this, dhtmlSuffix, settings);
		},	
		'directConvert': function(dhtmlSuffix, sourceNumberAndUnity, destinationUnity, roundDepth) { //Direct conversion
			return getDhtmlText(this, dhtmlSuffix, sourceNumberAndUnity, destinationUnity, roundDepth);
		}
	};
	
	
    $.fn.dhtml = function(method) {
		switch(method){
			case 'clear':
				if (arguments.length > 1 && $.inArray(arguments[1], dhtmlSuffixes) != -1) {
					dhtmlSuffixes.splice(dhtmlSuffixes.indexOf(arguments[1]), 1);
					dhtmlDataName = 'dhtml' + arguments[1];
					this.removeClass('.' + dhtmlDataName).removeData(dhtmlDataName);
				}
				return this;
				break;
			default:			
				return methods.init.apply(this, arguments);
		}
    };
})(jQuery);