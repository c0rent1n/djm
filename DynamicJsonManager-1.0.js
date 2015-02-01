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
function DynamicJsonManager()
{
	this.dataToLoad = arguments[0];
	this.dataLoadedNumber = 0;
	this.contents = {};
	this.parameters = $.extend({
		path: "/",
		folder: "folder",
		subFolder: "subFolder",
		async: true,
		cache: false,
		callback: false,
		data: {}
	}, arguments[1]);
	this.getterSettings = $.extend({
		autoValues: {}, 
		prefix: "", 
		suffix: "",
		minimumLength: 2,
		ifNotFound: "default",
		ifNotFoundInput: false,
		ifNotFoundFunction: function(){},
		dynamicReplace: {},
		dynamicReplaceAll: {},
		capitalize: false,
		capitalizeAll: false,
		ignoreSettings: false,
		noMatchForSubfolder: "{key} (no match for {subFolder}.)",
		endCallback: false
	}, arguments[2]);
	this.djmSuffix = ((typeof arguments[3] != 'string')
					? '_main'
					: arguments[3]);
					
	this.getParameter = function(parameterName) {
		return this.parameters[parameterName];
	}
	this.setParameter = function(parameterName, parameterValue) {
		this.parameters[parameterName] = parameterValue;
	}
	
	this.getData = function() {
		return this.parameters.data;
	}
	
	this.getSuffix = function() {
		return this.djmSuffix;
	}
	
	this.load = function(name, callback) {
		if ($.inArray(name, this.dataToLoad) == -1) {
			this.dataToLoad.push(name);
			// alert(name);
		}
		
		// console.log(this.dataToLoad);
		var relativPath = this.getParameter('folder') + '/' + this.getParameter('subFolder') + '/' + name + '.json';
		var dynamicJsonManager = this;
		$.ajax({
			type: 'GET',
			url: this.getParameter('path') + relativPath,
			dataType: 'json',
			cache: dynamicJsonManager.getParameter('cache'),
			async: dynamicJsonManager.getParameter('async')
		}).done(function(response) {
			dynamicJsonManager.contents = $.extend(dynamicJsonManager.contents, response);
			// console.log('____');
			// console.log(dynamicJsonManager);
			// console.log(callback);
		
			if (typeof callback == 'function') {
				callback(dynamicJsonManager);
			}
		}).fail(function(jqXHR, textStatus) {
			var errorDetail = (typeof jqXHR.responseText != 'undefined' ? ' [' + jqXHR.responseText + ']' : '');
			// main_dialog('error', 'djmError', {
				// "relativePath": relativPath,
				// "errorDetail": errorDetail
			// });
			alert(errorDetail);
		});	
		
		// this.contents = dynamicJsonManager.contents;
		// console.log(this.contents);
	}
	
	this.eraseContents = function() {
		this.contents = {};
	}
	
	this.getAll = function() {
		var contents = {};
		for (var key in this.contents) {
			contents[key] = this.get(key);
		}
		return contents;
	}
	
	this.loadAllData = function() {
		// var lastDataNum = this.dataToLoad.length - 1;
		for (var numData = 0; numData < this.dataToLoad.length; numData++) {
			if (typeof this.dataToLoad[numData] == 'string') {
				this.load(this.dataToLoad[numData], function(dynamicJsonManager) {
					dynamicJsonManager.dataLoadedNumber++;
					// alert(dynamicJsonManager.dataLoadedNumber +'=='+dynamicJsonManager.dataToLoad.length);
					if (dynamicJsonManager.dataLoadedNumber == dynamicJsonManager.dataToLoad.length) {
						if (typeof dynamicJsonManager.parameters.callback == 'function') {
							dynamicJsonManager.parameters.callback(dynamicJsonManager);
							dynamicJsonManager.parameters.callback = false;
						}
						dynamicJsonManager.dataLoadedNumber = 0;
					}
				});
			}
		}
	}
	
	
	this.setGetterSettings = function(settings)
	{
		success = true;
		for (settingKey in settings) {
			success &= this.setGetterSetting(settingKey, settings[settingKey]);
		}
		return success;
	}
	
	this.setGetterSetting = function(settingKey, settingValue)
	{
		var success = false;
		if (isset(this.getterSettings[settingKey])) {
			this.getterSettings[settingKey] = settingValue;
			success = true;
		}
		return success;
	}
	
	this.mget = function(keysArray) {
		args = arguments[1];
		tempSettings = arguments[2];
		capitalizeDisabled = false;
		text = '';
		for (var i = 0; i < keysArray.length; i++) {
			if (!isNaN(parseFloat(keysArray[i])) && isFinite(keysArray[i])
				|| (typeof(keysArray[i]) == 'string' && keysArray[i].replace(/\s/g, '') == '')  //spaces and numbers translation
			) {
				text += keysArray[i];
			} else if (typeof keysArray[i] == 'object') { //jQuery element
				var elements = keysArray[i].get();
				for (var j = 0; j < elements.length; j++) {
					text += $('<div></div>').html($(elements[j]).clone()).html();
				}
			} else {
				text += this.get(keysArray[i], args, tempSettings)
			}
			if (!capitalizeDisabled) {
				tempSettings = $.extend({}, tempSettings, {"capitalize": false});
				capitalizeDisabled = true;
			}
		}
		return text;
	}
	
	
	this.get = function(key) {
		//key, $args = array(), $tempSettings = null)
		if (typeof arguments[1] == 'undefined') {
			var args = {};
		} else {
			var args = arguments[1];
		}
		if (typeof arguments[2] == 'undefined') {
			var tempSettings = $.extend({}, this.getterSettings);
		} else {
			var tempSettings = $.extend({}, this.getterSettings, arguments[2]);
		}
		
		var string;
		if (typeof key == 'undefined' || key.length < tempSettings.minimumLength) {
			string = key;
		} else {
			if (typeof this.contents[key] == 'undefined') {
				// console.log(tempSettings);
				if (typeof tempSettings.ifNotFound == 'string') {
					switch (tempSettings.ifNotFound) {
						case 'bool':
							return false;
							break;
						case 'key':
							return key;
							break;
						case 'input':
							return tempSettings.ifNotFoundInput;
							break;
						case 'function':
							return tempSettings['ifNotFoundFunction'](key);
							break;
						default:
							string = tempSettings.noMatchForSubfolder;
							args = {
								key: key, 
								folder: this.getParameter('folder'), 
								subFolder: this.getParameter('subFolder')
							};
							tempSettings['ignoreSettings'] = true;
					}
				}
			} else {
				string = this.contents[key];
			}
			
			string = this.doGet(string, args, tempSettings);
			
			if (typeof tempSettings['endCallback'] == 'function') {
				string = tempSettings['endCallback'](string);
			}
		}
			
		return string;
	}
	
	this.doGet = function(string, args, tempSettings) {
		if (typeof string == 'object') {
			var stringsObj = {};
			for (var key in string) {
				stringsObj[key] = this.doGet(string[key], args, tempSettings);
			}
			return stringsObj;
		} else {
			stringType = typeof string;
			
			//Replace args keys by values
			string = this.replaceVariables(string, args);
			
			// console.log(tempSettings);
			if (tempSettings['ignoreSettings'] == false) {
				string = this.applyGetterSettings(string, tempSettings);
			}
			
			switch (stringType) {
				case 'boolean':
					string = Boolean(string);
					break;
				case 'number':
					string = parseFloat(string);
					break;
				default:
			}
			return string;
		}
	}
	
	this.applyGetterSettings = function(string) {
		if (typeof arguments[1] == 'undefined') {
			var tempSettings = undefined;
		} else {
			var tempSettings = arguments[1];
		}
		
		if (typeof tempSettings == 'object') {
			var getterSettings = tempSettings;
		} else {
			var getterSettings = this.getterSettings;
		}
		
		for (getterSettingKey in getterSettings) {
			var getterSettingValue = getterSettings[getterSettingKey];
			switch (getterSettingKey) {
				case 'dynamicReplace':
					for (var key in getterSettingValue) {
						string = string.replace(key, getterSettingValue[key]);
					}
					break;
				case 'dynamicReplaceAll':
					for (var key in getterSettingValue) {
						string = string.replace(new RegExp(key, 'g'), getterSettingValue[key]);
					}
					break;
				case 'capitalize':
					if (getterSettingValue) {
						string = string.substr(0, 1).toUpperCase() + string.substr(1);
					}
					break;	
				case 'capitalizeAll':
					if (getterSettingValue) {
						string = string.replace(/\b./g, function(w){return w.toUpperCase();});
					}
					break;	
				case 'prefix':
					if (typeof getterSettingValue == 'string') {
						string = getterSettingValue + string;
					}
					break;	
				case 'suffix':
					if (typeof getterSettingValue == 'string') {
						string += getterSettingValue;
					}
					break;
				case 'jSuffix': //JSON Suffix
					if (typeof getterSettingValue == 'string') {
						string += this.get(getterSettingValue, null, {"ignoreSettings": true});
					}
					break;			
			}
		}
		
		return string;
	}
	
	this.replaceVariables = function(string, variables) {
		// if (typeof variables == 'string') {
			// variables = {
				// 0: variables
			// };
		// }
		
		for (var arg in variables) {
			var stringToReplace = new RegExp('{' + arg + '}', 'g');
			if (variables[arg] == '' && typeof this.getterSettings.autoValues[arg] == 'string') {
				string = string.replace(stringToReplace, this.getterSettings.autoValues[arg]);
			} else {
				string = string.replace(stringToReplace, variables[arg]);
			}
		}
		return string;
	}

	//Load everything when the function is called
	this.loadAllData();
}
