define([ 'app', 'cookie','utilService' ], function() {
	angular.module("bss").controller("systemCtrl", systemCtrl);
	function systemCtrl($scope, $rootScope,utilManager) {
		$scope.initLog = function() {
			$scope.$bssPost({
				url : "/system.do?operationLogs",
				cover : false,
				success : function(result) {
					angular.forEach(result.object, function(item, index) {
						item.object = item.msg.split(":")[0];
						item.detail = item.msg.split(":")[1];
					});
					$rootScope.$safeApply($scope, function() {
						$scope.logs = result.object;
						$scope.pages = utilManager
								.showPage(result.page.totalPage);
						$scope.page = result.page;
					});
				}
			});
		};
		$scope.queryLogsByPage = function(cpage) {
			cpage = utilManager.calculatePage(cpage);
			$scope.$bssPost({
				url : "/system.do?operationLogs",
				cover : false,
				data:{cpage:cpage},
				success : function(result) {
					angular.forEach(result.object, function(item, index) {
						item.object = item.msg.split(":")[0];
						item.detail = item.msg.split(":")[1];
					});
					$rootScope.$safeApply($scope, function() {
						$scope.logs = result.object;
						$scope.pages = utilManager
								.showPage(result.page.totalPage);
						$scope.page = result.page;
					});
				}
			});
		};
	}
	;
});
