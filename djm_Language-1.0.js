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
function djm_Language()
{
	var locale = arguments[0];
	var dataToLoad = arguments[1];
	var djmSuffix = ((typeof arguments[2] != 'string')
					? '_language'
					: arguments[2]);
	var callback = arguments[3];
	
	
	var defaultGetterSettings = {
		"prefix": "",
		"suffix": "",
		"capitalize": true,
		"ignoreSettings": false,
		"noMatchForSubfolder": "{index} (no translation for {subFolder})"
	}
	
	var djm = new DynamicJsonManager(
		dataToLoad,
		{"folder": "languages",
		 "subFolder": locale,
		 "callback": callback
		 // "shortcutMethods": {
			// "getLocale": {
				// "methodName": "getParameter",
				// "arguments": {
					// 0: "subFolder"
				// }
			// },
			// "setLocale": {
				// "methodName": "setParameter",
				// "arguments": {
					// 0: "subFolder"
				// }
			// }
		 // }
		},
		defaultGetterSettings,
		djmSuffix
	);
	
	// djm.addShortcutMethod('getLocale', 'getParameter', ['subFolder']);
	// djm.addShortcutMethod('setLocale', 'setParameter', ['subFolder', locale]);
	
	return djm;
}
