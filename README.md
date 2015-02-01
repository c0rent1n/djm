# djm
Dynamic JSON Manager

This jQuery system enables you to create multi-dynamic HTML elements

# Demos
## DynamicJsonManager for a website with multilingual support
JSFiddle: http://jsfiddle.net/c0rent1n/wpL1kyj9/


# DynamicJsonManager Instanciation
### Example
var dataToLoad = ['userJsonFile', 'adminJsonFile']; //Without .json extension

var djmSuffix = '_l'; //suffix to add to "djm" for jquery elements -> $('.jqueryElement').djm_l(functionName, value)

var djmCallback = function(djmInstance) {
	$('html').djm(djmInstance);
	
	//All your page here
};

/*For the files userJsonFile.json and adminJsonFile.json located in :

 - "/json/categoryFolder/spectificFolder1/"

 - "/json/categoryFolder/spectificFolder2/"

 - "/json/categoryFolder/spectificFolder3/"
*/

var parameters = {

	folder: "categoryFolder",
	
	subFolder: 'specificFolder1',
	
	callback: djmCallback,
	
	path: "/json/"
	
};

var getterSettings = {

	capitalize: true,
	
	noMatchForSubfolder: "{index} (no translation for {subFolder})"
	
};

new DynamicJsonManager(
	dataToLoad,
	parameters,
	getterSettings,
	djmSuffix
);


### Parameters
#####* path = "/"
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
  Automatic values for any parameter. For example {}
##### ● prefix = "" 
##### ● suffix = ""
##### ● minimumLength = 2
##### ● ifNotFound = "default"
##### ● ifNotFoundInput = false
##### ● ifNotFoundFunction = function(){}
##### ● capitalize = false
##### ● capitalizeAll = false
##### ● endCallback = false
##### ● dynamicReplace = {}
##### ● dynamicReplaceAll = {}
##### ● ignoreSettings = false
##### ● noMatchForSubfolder
