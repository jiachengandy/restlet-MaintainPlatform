define(['app'], function(){
    angular.module("bss.core").directive('bssI18n', function () {
        return {
            templateUrl: "resource.root/directive/i18n/i18n.html",
            restrict: "E",
            replace: false,
            transclude: true,
            scope: {
                key: "@key",
                params: "@params"
            },
            controller: function ($scope, $element, $attrs,$rootScope) {
            	// 取页面传入的key和properties，properties是指当前的占位符，用数组方式依次传入
	           	 $scope.key = $attrs.key;
	             var labelArray = [""];  // jquery i18n源码，如果参数少于2个会不处理，所以这里加个kong字符串，properties文件占位符从1开始
                if ($scope.params) {
                    var params = $scope.params;
                    labelArray = labelArray.concat(params.split("|"));
                }
	            	 
 				 $scope.i18nValue = $rootScope.$i18n($scope.key,labelArray);
            },
            compile: function (tElement, tAttr, linker, controller) {
                return function ($scope, $element, $attrs, parentCtrls,$rootScope) {
                	
                };
            }
        };
    });
});
