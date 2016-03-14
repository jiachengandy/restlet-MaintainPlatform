define([ 'app' ], function() {
	// 用户操作
	angular.module("bss").factory('hostManager',
			function($rootScope) {
				var hostManager = {
					// 空间下添加用户
					getHostStatistics : function(onafter) {
						$rootScope.$bssPost({
							url : "/host/hostStatistics.do",
							cover : false,
							success : function(result) {
								onafter(result);
							}
						});
					},
					getHostLevels:function(onafter){
						$rootScope.$bssPost({
							url : "/host.do?hostLevels",
							cover : false,
							success : function(result) {
								onafter(result);
							}
						});
					},
					getHostListsByUsetype:function(usetype,onafter){
						$rootScope.$bssPost({
							url : "/host.do?usetype",
							cover : false,
							data:{"type":usetype},
							success : function(result) {
								onafter(result);
							}
						});
					}
				};
				return hostManager;
			});

});
