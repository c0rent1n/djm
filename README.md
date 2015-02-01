# djm
Dynamic JSON Manager

This jQuery system enables you to create multi-dynamic HTML elements

# Demos
## DynamicJsonManager for a website with multilingual support
JSFiddle: http://jsfiddle.net/c0rent1n/wpL1kyj9/


# DynamicJsonManager Instanciation
### Example
	var dataToLoad = ['userJsonFile', 'adminJsonFile']; //Without .json extension
	
	// Suffix to add to "djm" for jquery elements
	// -> $('.jqueryElement').djm_l(functionName, value)
	var djmSuffix = '_l'; 
	
	var djmCallback = function(djmInstance) {
		$('html').djm(djmInstance);
		
		//All your page here
	};

	// The files userJsonFile.json and adminJsonFile.json located in :
	// - "/json/categoryFolder/spectificFolder1/"
	// - "/json/categoryFolder/spectificFolder2/"
	// - "/json/categoryFolder/spectificFolder3/"

	var parameters = {
		folder: "categoryFolder",
		subFolder: 'specificFolder1',
		callback: djmCallback,
		path: "/json/"
	};
	
	var getterSettings = {
		capitalize: true,
		noMatchForSubfolder: "(no JSON file found for {key} in {subFolder})"
	};

	new DynamicJsonManager(
		dataToLoad,
		parameters,
		getterSettings,
		djmSuffix
	);


### Parameters
##### ● path = "/"
Path or URL with final slash where JSON files are stored.

##### ● folder = "folder"
Folder concerning the instance of DynamicJsonManager

##### ● subFolder = "subFolder"
Subfolder for the instance of DynamicJsonManager. By changing this subFolder, you could dynamically load changes.

##### ● async = true
Asynchronous mode. 
If true, you have to use the callback and put all the code depending on the instance of DynamicJsonManager in it.
If false, the instance will be returned.

##### ● cache = false
Caching JSON contents

##### ● callback = false
callback(DynamicJsonManager) {}
Called when all the data is loaded and then replaced by false.

##### ● data: {}
Free data JSON object


### Getter Settings
##### ● autoValues = {}
Automatic values for any parameter. For example, {key1: "myValue1", key2: "myValue2"}, will replace any DJM parameter "{key1}" by "myValue1" and any DJM parameter "{key2}" by "myValue2".
##### ● prefix = "" 
Prefix added before DJM value.
##### ● suffix = ""
Prefix added after DJM value.
##### ● minimumLength = 2
Minimum length of the DJM keys. If minimumLength == 2, all strings passed as DJM keys with less than 2 characters won't be treated and will be displayed without any transformation.
##### ● ifNotFound = "default"
String defining what to do if the DJM key is not found:
	- default: Get DynamicJsonManager.getterSettings.noMatchForSubfolder message.
	- bool: Get false.
	- key: Get the key string
	- input: Get the string DynamicJsonManager.getterSettings.ifNotFoundInput as the DJM value
	- function: Get DynamicJsonManager.getterSettings.ifNotFoundFunction(key)
##### ● ifNotFoundInput = false
String to get if the value of the DJM key is not found and if DynamicJsonManager.getterSettings.ifNotFound == 'input'.
##### ● ifNotFoundFunction = function(key){}
Function to transform the DJM key to get it as its value if its value is not found and if DynamicJsonManager.getterSettings.ifNotFound == 'function'.
	ifNotFoundFunction = function(key) {
		// Your modifications on the DJM key here
		
		return key;
	}
##### ● dynamicReplace = {}
String replacement for the first occurrence in the DJM value. JSON object with: 
	dynamicReplace = {
		"oldValue1": "newValue1",
		"oldValue2": "newValue2"
	}
##### ● dynamicReplaceAll = {}
String replacement for each occurrence in the DJM value. JSON object with: 
	dynamicReplaceAll = {
		"oldValue1": "newValue1",
		"oldValue2": "newValue2"
	}
##### ● capitalize = false
Capitalize the first word of the DJM values.
##### ● capitalizeAll = false
Capitalize each word of the DJM values.
##### ● endCallback = false
This setting should be used as a specific setting in DJM calls so as to change the result of the DJM string from its normal value after transformations. 
	endCallback = function(string) {
		// Your modifications on the DJM string here
		
		return string;
	}
##### ● ignoreSettings = false
This setting should be used as a specific setting in DJM calls so as to ignore defined settings, to get the value of a DJM key without any transformation.
##### ● noMatchForSubfolder = "{key} (no match for {subFolder}.)"
Message displayed if the DJM key {key} is not found for the subFolder {subFolder} (Parameters automatically replaced in this message: {key}, {folder} and {subFolder}.)
