define(['app'], function()
{
	angular.module("bss.core").directive('bssCover', function()
	{
		return {
			restrict : 'AE',
			templateUrl : 'js/directive/html/cover.html',
			replace : true,
			transclude : true
		};
	});
});
