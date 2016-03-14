define([ 'app' ], function() {
	// 用户操作
	angular.module("bss").factory('knowledgeManager',
			function($rootScope) {
				var knowledgeManager = {
					// 空间下添加用户
					getKnowledges : function(onafter) {
						$rootScope.$bssPost({
							url : "/knowledge/all.do",
							cover : false,
							success : function(result) {
								onafter(result);
							}
						});
					}
				};
				return knowledgeManager;
			});
});
