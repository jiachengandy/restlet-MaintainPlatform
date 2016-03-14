/**
 * 
 */

define([ 'app' ], function() {
	angular.module("bss").filter('htmlFilter', [ '$sce',function($sce) {
		return function(input) {
			return $sce.trustAsHtml(input);
		};;
	}]);
	angular.module("bss").filter('searchFilter', [ '$rootScope',function($rootScope) {
		return function(filterArray, keyword)
		{
			if (!(filterArray instanceof Array))
				return filterArray;
			if (typeof (keyword) == "undefined")
			{
				return filterArray;
			}
			var matchArray = [];
			keyword = keyword.toLocaleLowerCase();
			// 对传入的service进行遍历，若其中包含相关keyword则放入到matchArray中
			if (filterArray != null && filterArray instanceof Array)
			{
				for ( var i = 0; i < filterArray.length; i++)
				{
					var jsonContent =  JSON.stringify(filterArray[i]);
					if(jsonContent.indexOf(keyword)>-1){
						matchArray.push(filterArray[i]);
					}
				}
			}
			return matchArray;
		};
	}]);
});