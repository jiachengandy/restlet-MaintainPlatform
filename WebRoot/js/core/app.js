define(function(require)
{
	require('core_directive');
	require('headerDirective');
	require('coverDirective');
	//support Array.forEach for IE8
	if (!Array.prototype.forEach) {
		Array.prototype.forEach = function(fun /*, thisp*/)
		{
			var len = this.length;
			if ( typeof fun != "function")
				throw new TypeError();

			var thisp = arguments[1];
			for (var i = 0; i < len; i++) {
				if ( i in this)
					fun.call(thisp, this[i], i, this);
			}
		};
	}
	//console.log("app.js required");
});
