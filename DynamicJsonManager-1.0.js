function DynamicJsonManager()
{
	this.dataToLoad = arguments[0];
	this.contents = {};
	this.parameters = $.extend({
		"folder": "folder",
		"subFolder": "subFolder",
		"async": false,
		"cache": false,
		"callback": false,
		"data": {},
		"shortcutMethods": {}
	}, arguments[1]);
	this.getterSettings = $.extend({
		"prefix": "", 
		"suffix": "",
		"minimumLength": 2,
		"ifNotFound": "default",
		"ifNotFoundInput": false,
		"ifNotFoundFunction": function(){},
		"capitalize": false,
		"capitalizeAll": false,
		"endCallback": false,
		"dynamicReplace": {},
		"dynamicReplaceAll": {},
		"ignoreSettings": false,
		"noMatchForSubfolder": "{index} (no match for {subFolder}.)"
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
		}
		// console.log(this.dataToLoad);
		var relativPath = this.getParameter('folder') + '/' + this.getParameter('subFolder') + '/' + name + '.json';
		var dynamicJsonManager = this;
		$.ajax({
			type: 'GET',
			url: main_httpRoot + 'json/' + relativPath,
			dataType: 'json',
			cache: dynamicJsonManager.getParameter('cache'),
			async: dynamicJsonManager.getParameter('async')
		}).done(function(response) {
			dynamicJsonManager.contents = $.extend(dynamicJsonManager.contents, response);
			if (typeof callback == 'function') {
				// console.log('____');
				// console.log(dynamicJsonManager);
				// console.log(callback);
				callback(dynamicJsonManager);
			}
		}).fail(function(jqXHR, textStatus) {
			var errorDetail = (typeof jqXHR.responseText != 'undefined' ? ' [' + jqXHR.responseText + ']' : '');
			main_dialog('error', 'djmError', {
				"relativePath": relativPath,
				"errorDetail": errorDetail
			});
		});	
		
		// this.contents = dynamicJsonManager.contents;
		// console.log(this.contents);
	}
	
	// for (var shortcutMethodName in this.parameters.shortcutMethods) {
		// this[shortcutMethodName] = function(argArray) {
			// console.log(shortcutMethodName);
			// console.log(argArray);
			// if (typeof argArray == 'undefined') {
				// argArray = [];
			// }
			// for (var argKey in this.parameters.shortcutMethods[shortcutMethodName].arguments) {
				// argArray[argKey] = this.parameters.shortcutMethods[shortcutMethodName].arguments[argKey];
			// }
			// return this[this.parameters.shortcutMethods[shortcutMethodName]["methodName"]].apply(this, argArray);
		// };
	// }
	
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
		var lastDataNum = this.dataToLoad.length - 1;
		for (var numData = 0; numData < this.dataToLoad.length; numData++) {
			if (typeof this.dataToLoad[numData] == 'string') {
				if (numData == lastDataNum) {
					this.load(this.dataToLoad[numData], this.parameters.callback);
					this.parameters.callback = false;
				} else {
					this.load(this.dataToLoad[numData]);
				}
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
	
	this.mget = function(indexesArray) {
		args = arguments[1];
		tempSettings = arguments[2];
		capitalizeDisabled = false;
		text = '';
		for (var i = 0; i < indexesArray.length; i++) {
			if (!isNaN(parseFloat(indexesArray[i])) && isFinite(indexesArray[i])
				|| (typeof(indexesArray[i]) == 'string' && indexesArray[i].replace(/\s/g, '') == '')  //spaces and numbers translation
			) {
				text += indexesArray[i];
			} else if (typeof indexesArray[i] == 'object') { //jQuery element
				var elements = indexesArray[i].get();
				for (var j = 0; j < elements.length; j++) {
					text += $('<div></div>').html($(elements[j]).clone()).html();
				}
			} else {
				text += this.get(indexesArray[i], args, tempSettings)
			}
			if (!capitalizeDisabled) {
				tempSettings = $.extend({}, tempSettings, {"capitalize": false});
				capitalizeDisabled = true;
			}
		}
		return text;
	}
	
	
	this.get = function(index) {
		//index, $args = array(), $tempSettings = null)
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
		if (typeof index == 'undefined' || index.length < tempSettings.minimumLength) {
			string = index;
		} else {
			if (typeof this.contents[index] == 'undefined') {
				// console.log(tempSettings);
				if (typeof tempSettings.ifNotFound == 'string') {
					switch (tempSettings.ifNotFound) {
						case 'bool':
							return false;
							break;
						case 'key':
							return index;
							break;
						case 'input':
							return tempSettings.ifNotFoundInput;
							break;
						case 'function':
							return tempSettings['ifNotFoundFunction'](index);
							break;
						default:
							string = tempSettings.noMatchForSubfolder;
							args = {
								"index": index, 
								"subFolder": this.getParameter('subFolder')
							};
							tempSettings['ignoreSettings'] = true;
					}
				}
			} else {
				string = this.contents[index];
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
			string = string.replace(stringToReplace, variables[arg]);
		}
		return string;
	}

	//Load everything when the function is called
	this.loadAllData();
}
