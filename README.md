# DJM
###### Dynamic JSON Manager

#####Description
A jQuery system to deal with HTML elements dynamically through JSON variable data.


#####JSON
JSON format enables you to share non-sensible data between server languages and JavaScript.


#####Application examples:
Multilingual websites

Mass, size and currency converters

Format validation (through RegEx, etc.)


# Demos
## DynamicJsonManager for multilingual support
JSFiddle: http://jsfiddle.net/c0rent1n/wpL1kyj9/


# DynamicJsonManager Instanciation

######	new DynamicJsonManager(
######	        dataToLoad,
######	        parameters,
######	        getterSettings,
######	        djmSuffix
######	);

### Example
	var dataToLoad = ['userJsonFile', 'adminJsonFile']; //Without .json extension
	
	// Suffix to add to "djm" for jquery elements
	// -> $('.jqueryElement').djm_l(functionName, value)
	var djmSuffix = '_l'; 
	
	var djmCallback = function(djmInstance) {
		//Element where to store the root DJM instance
		$('html').djm(djmInstance);
		
		//All your page here
	};

	var parameters = {
		folder: "categoryFolder",
		subFolder: 'specificFolder1',
		callback: djmCallback,
		path: "/json/"
	};

	// With these parameters, the files userJsonFile.json and adminJsonFile.json 
	// must be located in :
	// - "/json/categoryFolder/specificFolder1/"
	// - "/json/categoryFolder/specificFolder2/"
	// - "/json/categoryFolder/specificFolder3/"
	
	// Format of a DJM JSON file
	// {
	//	"djmKey1": "djmValue1 for specificFolder1",
	//	"djmKey2": "djmValue2 for specificFolder1",
	//	"djmKey3": "djmValue3 for specificFolder1"
	// }
	
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


### Data
##### dataToLoad
Array of strings with the name of the JSON files to match with, with no extension.

##### Data Tree Example
	/json/ 
		-> main JSON path
		
	/json/categoryFolder/ 
		-> JSON folder for one instance/jQuery method of DynamicJsonManager
		
	/json/categoryFolder/specificFolder1/ 
		-> JSON sub folder which could be changed dynamically on user action
		
	/json/categoryFolder/specificFolder1/userJsonFile.json 
		-> Example of JSON file 1 with DJM keys and DJM values
		
	/json/categoryFolder/specificFolder1/adminJsonFile.json 
		-> Example of JSON file 2 with DJM keys and DJM values
		
	/json/categoryFolder/specificFolder2/userJsonFile.json 
		-> Example of JSON file 1 with same DJM keys as specificFolder1 and other DJM values
		
	/json/categoryFolder/specificFolder2/adminJsonFile.json 
		-> Example of JSON file 2 with same DJM keys as specificFolder1 and other DJM values


##### ● path = "/"
Path or URL with final slash where JSON files are stored.

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
##### ● ifNotFoundFunction = function(key) {}
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
		// Your modifications on the DJM final value string here
		
		return string;
	}
##### ● ignoreSettings = false
This setting should be used as a specific setting in DJM calls so as to ignore defined settings, to get the value of a DJM key without any transformation.
##### ● noMatchForSubfolder = "{key} (no match for {subFolder}.)"
Message displayed if the DJM key {key} is not found for the subFolder {subFolder} (Parameters automatically replaced in this message: {key}, {folder} and {subFolder}.)


# Integration to jQuery system
#### Here is the magic! 

###### Now you can replace each jQuery method like:
     $('.someElement').html('someText'); 
     $('.someElement').val('someText'); 
     $('.someElement').attr('title', 'someText');
     // etc. 

###### by the jquery.djm methods below... You'll get a highly dynamic HTML page!

### djmSuffix = "_main"
Automatic values for any parameter. 

For example, {key1: "myValue1", key2: "myValue2"}, will replace any DJM parameter "{key1}" by "myValue1" and any DJM parameter "{key2}" by "myValue2".


### jquery.djm Content Methods 
###### (after a DynamicJsonManager Instanciation with djmSuffix == '_l')
##### html
See arguments below.

$('.elementsToGet').djm_l('html', djmKey, djmParameters, specificSettings);

##### val or value
See arguments below.

$('.elementsToGet').djm_l('val', djmKey, djmParameters, specificSettings);

##### title
See arguments below.

$('.elementsToGet').djm_l('title', djmKey, djmParameters, specificSettings);

##### placeholder
See arguments below.

$('.elementsToGet').djm_l('placeholder', djmKey, djmParameters, specificSettings);

##### href
See arguments below.

$('.elementsToGet').djm_l('href', djmKey, djmParameters, specificSettings);

### Arguments
##### djmKey
DJM key to find in JSON files to get its value. Can be a string or an array of strings matching to one or more DJM keys loaded.

##### djmParameters
DJM parameters. 

DJM values in JSON files can contain parameters between brackets. 

Example: 
##### JSON File Sample
	{
		"helloUser": hello {userFirstName}!
	}
##### jQuery Sample with DJM '_l' suffix
	$('.someElement').djm_l('html', 'helloUser', {userFirstName: "Totoro"});

##### specificSettings
Specific DJM settings for the jQuery elements concerned.

### jquery.djm DJM Methods
###### To call on the root DJM element (commonly $('html'))
##### setDjmParameter(parameterName, parameterValue, options) {}
Change a DJM parameter from the DynamicJsonManager object and refresh all HTML elements concerned if dynamic == true.
	$('html').djm_l('setDjmParameter', 'subFolder', 'specificFolder3', {
		"dynamic": true,
		"callback": function(djm) {
	    		//Dynamic changes here if needed
		}
	});
##### getDjmParameter(parameterName)
Get a DJM parameter from the DynamicJsonManager object.
	$('html').djm_l('getDjmParameter', 'subFolder')
You can also use the main DynamicJsonManager instance to access method and properties. 

See below.
##### djm
Get the DynamicJsonManager object

	var djmObject = $('html').djm_l('djm');
	
See the next division to use DynamicJsonManager objects.

### DynamicJsonManager object Methods
##### get(djmKey, djmParameters, specificSettings)
Get the value of a djmKey.

	//Example:
	alert($('html').djm_l('djm').get(djmKey));
	
##### getSuffix()
Get the DJM suffix of the DynamicJsonManager object.

	//Example:
	alert($('html').djm_l('djm').getSuffix());
	
##### load(name, callback = false)
###### name: string
Name of the JSON file to match with, with no extension.
###### callback: function(DynamicJsonManager)
Callback function to execute after loading

##### getParameter(name)
Get the DynamicJsonManager parameter's value.

##### getAll()
Get all DJM contents ("key": "value") as a simple JSON object.
