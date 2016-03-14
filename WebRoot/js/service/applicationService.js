define([ 'app' ], function() {
	// 用户操作
	angular.module("bss").factory('applicationManager',
			function($rootScope) {
				var applicationManager = {
					// 空间下添加用户
						getServerTestType : function(onafter) {
						$rootScope.$bssPost({
							url : "/application/serverTestType.do",
							cover : false,
							success : function(result) {
								onafter(result);
							}
						});
					},
				};
				return applicationManager;
			});

});
