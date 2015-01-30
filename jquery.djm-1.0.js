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
	var djmSuffixes = new Array();
	// var djm = {};
	
	function updateDjmText(elem, djm)
	{
		elem.each(function() {
			$(this).find('.djm' + djm.getSuffix()).each(function() {
				var djmDetail = $(this).data('djm' + djm.getSuffix());
				
				if (typeof djmDetail != 'undefined') {
					$(this)['djm' + djm.getSuffix()](djmDetail.type, djmDetail.text, djmDetail.args, djmDetail.settings);
				}
			});
		});
	}
	
	function textOperations(elem, text, args, settings, type, djm)
	{
		var djmText = '';
		if (typeof text == 'object') {
			djmText += djm.mget(text, args, settings);
		} else if (typeof text == 'string') {
			// console.log(djm);
			djmText += djm.get(text, args, settings);
		}
		
		return elem.each(function() {
			switch (type) {
				case 'html':
					$(this).html(djmText);
					break;
				case 'value':
				case 'val':
					type = 'val';
					$(this).val(djmText);
					break;
				case 'func':
					// console.log(type);
					// console.log(settings[0]['funcName']);
					// console.log(settings);
					var tempFuncArgs = settings.funcArgs.slice();
					tempFuncArgs[$.inArray('{djmReplace}', tempFuncArgs)] = djmText;
					// console.log(tempFuncArgs);
					$.fn[settings.funcName].apply($(this), tempFuncArgs);
					break;
				case 'placeholder':
					$(this).attr('placeholder', djmText);
					break;
				case 'title':
					type = 'title';
					$(this).attr('title', djmText);
					if ($(this).hasClass('ui-tooltip-trigger')) { 
						if (typeof $(this).data('uiTooltipTitle') != 'undefined') { //For jQuery UI Tooltip
							$(this).data('uiTooltipTitle', djmText);
							// console.log($(this).data());
							$(this).tooltip('close');
							if ($(this).data('uiTooltip').options.disabled == true) {
								$(this).attr('title', '');
							}
						}
					}
					break;
				case 'href':
					type = 'href';
					$(this).prop('href', djmText);
					break;
			}
			djmDataName = 'djm' + djm.getSuffix();
			$(this).addClass(djmDataName).data(djmDataName, {
				"type": type,
				"func": "get",
				"text": text,
				"args": args, 
				"settings": settings
			});
			
			//Setting "Callback function" 
			if (typeof settings != 'undefined' && typeof settings.callback == 'function') {
				settings.callback($(this));
			}
			
		});
	}
	
	//Methods
	var methods = {
		'init': function(dynamicJsonManager) {
			if (typeof dynamicJsonManager === 'object') {
				var djmSuffix = dynamicJsonManager.getSuffix();
				if ($.inArray(djmSuffix, djmSuffixes) == -1) {
					djmSuffixes.push(djmSuffix); 
					// djm[djmSuffix] = dynamicJsonManager;
					$.fn['djm' + djmSuffix] = function(method) {
						if (methods[method]
							&& method != 'init') {
							var djmArguments = Array.prototype.slice.call(arguments, 1);
							djmArguments.unshift(dynamicJsonManager);
							// console.log(djmArguments);
							return methods[method].apply(
								this, 
								djmArguments
							);
						} else {
							$.error('Method ' + method + ' does not exist for djm');
						}
					}
					return this;
				} else {
					$.error('Suffix ' + method + ' already exists for djm');
				}
			} else {
				$.error('Unique parameter is not an object (' + typeof dynamicJsonManager + ')');
			}
		},
		'call': function(djm, funcName, funcArgs) {
			return djm[funcName].apply(this, funcArgs);
		},
		'html': function(djm, text, args, settings) {
			return textOperations(this, text, args, settings, 'html', djm);
		},
		'func': function(djm, text, args, settings) {
			return textOperations(this, text, args, settings, 'func', djm);
		},
		'val': function(djm, text, args, settings) {		
			return textOperations(this, text, args, settings, 'val', djm);
		},
		'value': function(djm, text, args, settings) {		
			return textOperations(this, text, args, settings, 'val', djm);
		},
		'placeholder': function(djm, text, args, settings) {		
			return textOperations(this, text, args, settings, 'placeholder', djm);
		},
		'title': function(djm, text, args, settings) {		
			return textOperations(this, text, args, settings, 'title', djm);
		},
		'href': function(djm, text, args, settings) {		
			return textOperations(this, text, args, settings, 'href', djm);
		},
		'setDjmParameter':  function(djm, djmParameterKey, djmParameterValue, options) { // Doesn't return elements if options.dynamic == true
			djm.setParameter(djmParameterKey, djmParameterValue);
			if (options.dynamic == true) {
				if (typeof options.callback == 'function') {
					var calledbackThis = this;
					djm.setParameter('callback', function() {
						updateDjmText(calledbackThis, djm);
						options.callback(djm);
					});
				}
				djm.eraseContents();
				djm.loadAllData();
			} else {
				if (typeof options.callback == 'function') {
					options.callback(djm);
				}
				return this;
			}
		},
		'getDjmParameter':  function(djm, djmParameterKey) {
			return djm.getParameter(djmParameterKey);
		}		
	};
	
	
    $.fn.djm = function(method)	{
		if (typeof method === 'object') {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist for djm generic');
		}
    };
})(jQuery);