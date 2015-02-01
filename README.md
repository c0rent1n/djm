# djm
Dynamic JSON Manager

This jQuery system enables you to create multi-dynamic HTML elements

# DynamicJsonManager
### Parameters
##### path = "/"
Path or URL with final slash where JSON files are stored.

##### folder = "folder"
Folder concerning the instance of DynamicJsonManager

##### subFolder = "subFolder"
Subfolder for the instance of DynamicJsonManager. By changing this subFolder, you could dynamically load changes.

##### async = true
Asynchronous mode. 
If true, you have to use the callback and put all the code depending on the instance of DynamicJsonManager in it.
If false, the instance will be returned.

##### cache = false
Caching JSON contents

##### callback = false
callback(DynamicJsonManager) {}
Called when all the data is loaded and then replaced by false.

##### data: {}
Free data JSON object

# Demos
## DynamicJsonManager for a website with multilanguage support
JSFiddle: http://jsfiddle.net/c0rent1n/wpL1kyj9/
