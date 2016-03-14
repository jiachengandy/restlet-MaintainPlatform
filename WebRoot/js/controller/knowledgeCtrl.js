define([ 'app', 'cookie','htmlFilter','utilService','ueditorAll','ueditorConfig','bootstrap','scrollbar','mousewheel'], function() {
	angular.module("bss").controller("knowledgeCtrl", knowledgeCtrl);
	function knowledgeCtrl($scope, $rootScope,utilManager) {
		
		$scope.name_zh = $.cookie("name_zh");
		$scope.initKnowledge = function() {
			$scope.queryKnowledgeTypes();
			$scope.queryKnowledges();
			$scope.knowledgeshow="all";
		};
		$scope.beforeAddKnowledgeType = function(){
			$scope.knowledgeTypeOperation="add";
			$scope.queryKnowledgeTypes();
		};
		/**新增知识类型*/
		$scope.addKnowledgeType=function(){
			var parent_id = null;
			if(typeof $scope.knowledgeType =='undefined'||$scope.knowledgeType==null){
				parent_id = "";
			}
			else{
				parent_id = $scope.knowledgeType.id;
			}
			$scope.$bssPost({
				url:"/knowledge/typeAdd.do",
				data:{name:$scope.knowledgeTypeDesc,"parent_id":parent_id},
				success:function(result){
					$scope.queryKnowledgeTypes();
				}
			});
		};
		/**查询所有的知识*/
		$scope.queryKnowledges=function(cpage){
			$scope.$bssPost({
				url : "/knowledge/all.do",
				cover : false,
				data:{cpage:cpage},
				success : function(result) {
					angular.forEach(result.knowledges,function(item,index,knowledges){
						var text = $("<div>"+item.content+"</div>").text();
						item.content=text.length>200?text.substring(0,200)+"...":text;
					});
					$rootScope.$safeApply($scope, function() {
						$scope.knowledges=result.knowledges;
						$scope.pages=utilManager.showPage(result.page.totalPage);
						$scope.page=result.page;
					});
				}
			});
			$(".knowledge-list").perfectScrollbar();
		};
		/**根据关键字查询*/
		$scope.queryKnowledgesByKeyword=function(cpage)
		{
			var keywords = $scope.keyword;
			cpage =  utilManager.calculatePage(cpage);
			$scope.$bssPost({
				url : "/knowledge.do?keyword",
				cover : false,
				data:{keywords:keywords,cpage:cpage},
				success : function(result) {
					angular.forEach(result.knowledges,function(item,index,knowledges){
						var text = $("<div>"+item.content+"</div>").text();
						item.content=text.length>200?text.substring(0,200)+"...":text;
					});
					$rootScope.$safeApply($scope, function() {
						$scope.knowledges=result.knowledges;
						$scope.pages=utilManager.showPage(result.page.totalPage);
						$scope.page=result.page;
					});
				}
			});
			$(".knowledge-list").perfectScrollbar();
		};
		document.onkeydown = function(event) {
    		var e = event ? event : (window.event ? window.event : null);
    		if (e.keyCode == 13) {
    			 $scope.queryKnowledgesByKeyword();
    		}
    	};
    	/**跳转到知识详情页面*/
		$scope.queryKnowledgeDetail=function(id){
			$scope.knowledgeshow="view";
			//window.location="knowledgeDetail.html?id="+id;
			$scope.$bssPost({
				url : "/knowledge.do?detail",
				cover : false,
				data:{id:id},
				success : function(result) {
					$rootScope.$safeApply($scope, function() {
						$scope.knowledge=result.knowledge;
						$scope.comments = result.comments;
					});
				}
			});
			$(".knowinfo-page-slider").perfectScrollbar();
		};
		/**分页查询*/
		$scope.queryKnowledgesByPage=function(cpage){
			if(cpage<1)
			{
				return;
			}
			var keyword = $scope.keyword;
			var typeid = $(".option-item.current").attr("tid");
			$scope.knowkeyword=keyword;
			if(typeof typeid !='undefined')
			{
				$scope.typeid=typeid;
			}
			if($.trim(keyword)!="")
    		{
    			$scope.queryKnowledgesByKeyword(cpage);
    		}
    		else if(typeof typeid!='undefined' &&typeid!='')
    		{
    			$scope.queryKnowledgesByType(typeid,cpage);
    		}else
    		{
    			$scope.queryKnowledges(cpage);
    		}
		};
		/**根据类型查询*/
		$scope.queryKnowledgesByType=function(typeid,event){
			var cpage = 1;
			if(typeof event =='number')
			{
				cpage=event;
			}else if(typeof event !='undefined')
			{
				var e = event ? event : window.event;
				var cntr = e.srcElement || e.target;
				$(".option-item").removeClass("current");
				$(cntr).parent(".option-item").addClass("current");
			}
			$scope.$bssPost({
				url : "/knowledge.do?type",
				cover : false,
				data:{id:typeid,cpage:cpage},
				success : function(result) {
					angular.forEach(result.knowledges,function(item,index,knowledges){
						var text = $("<div>"+item.content+"</div>").text();
						item.content=text.length>200?text.substring(0,200)+"...":text;
					});
					$rootScope.$safeApply($scope, function() {
						$scope.knowledges=result.knowledges;
						$scope.pages=utilManager.showPage(result.page.totalPage);
						$scope.page=result.page;
					});
				}
			});	
			$(".knowledge-list").perfectScrollbar();
		};
		/**知识详情处理*/
		$scope.iniKnowinfo=function(){
			var id = utilManager.getQueryString("id");
			$scope.$bssPost({
				url : "/knowledge.do?detail",
				cover : false,
				data:{id:id},
				success : function(result) {
					$rootScope.$safeApply($scope, function() {
						$scope.knowledge=result.knowledge;
						$scope.comments = result.comments;
					});
				}
			});
			$scope.queryKnowledgeTypes();
		};
		
		/**初始化添加知识*/
		$scope.initAddKnowledge=function(){
			$scope.knowledgeshow='add';
			 $scope.ue=UE.getEditor('container', {
				initialFrameWidth:1000,
				initialFrameHeight:270
			});
		$(".knowledge-addpage-slider").perfectScrollbar();
		};
		/**添加知识*/
		$scope.addKnowledge=function(){
			var title = $scope.knowTitle;
			if(utilManager.trim(title)==''){
				alert("输入内容不能为空！");
				return;
			}
			var content = $scope.ue.getContent();
			if(utilManager.trim(content)==''){
				alert("输入内容不能为空！");
				return;
			}
			var username = $.cookie("username");
			var typeId = $scope.knowType;
			$scope.$bssPost({
				url : "/knowledge.do?add",
				cover : false,
				data:{title:title,content:content,typeId:typeId,username:username},
				success : function(result) {
					window.location.reload();
				}
			});
		};
		/**删除知识*/
		$scope.deleteKnowledge=function(id){
			if(confirm("确定删除？")){
				$scope.$bssPost({
					url:"/knowledge.do?delete",
					data:{id:id},
					success:function(result){
						window.location.reload();
					}
				});
			}
		};
		$scope.beforeUpdateKnowledge=function(id){
			$scope.knowledgeshow='update';
			$scope.$bssPost({
				url : "/knowledge.do?detail",
				cover : false,
				data:{id:id},
				success : function(result) {
					 var ue=UE.getEditor('container', {
							initialFrameWidth:1000,
							initialFrameHeight:270,
//							/initialContent:result.knowledge.content
						});
					 ue.addListener("ready", function () {
					        ue.setContent(result.knowledge.content);
					});
					$rootScope.$safeApply($scope, function() {
						$scope.knowTitle=result.knowledge.title;
						$scope.knowType = result.knowledge.type_id;
					});
					$(".knowledge-addpage-slider").perfectScrollbar();
				}
			});
		};
		$scope.updateKnowledge=function(){
			var title = $scope.knowTitle;
			if(utilManager.trim(title)==''){
				alert("输入内容不能为空！");
				return;
			}
			var content = $scope.ue.getContent();
			if(utilManager.trim(content)==''){
				alert("输入内容不能为空！");
				return;
			}
			var username = $.cookie("username");
			var typeId = $scope.knowType;
			$scope.$bssPost({
				url : "/knowledge.do?update",
				cover : false,
				data:{title:title,content:content,typeId:typeId,username:username},
				success : function(result) {
					window.location.reload();
				}
			});
		};
		/**查询所有知识类型*/
		$scope.queryKnowledgeTypes=function(){
			$scope.$bssPost({
				url : "/knowledge/typeAll.do",
				cover : false,
				success : function(result) {
					$rootScope.$safeApply($scope, function() {
						$scope.types=result;
					});
					$('.knowledge-type-slider').perfectScrollbar();
				}
			});
		};
		/**发布评论*/
		$scope.publishComment=function(id){
			//var id = utilManager.getQueryString("id");
			var username=$.cookie("username");
			var commentContent =$scope.commentContent;
			$scope.$bssPost({
				url : "/knowledge.do?publishComment",
				cover : false,
				data:{id:id,username:username,content:commentContent},
				success : function(result) {
					$scope.$bssPost({
						url : "/knowledge.do?queryCommentsById",
						data:{id:id},
						cover : false,
						success : function(result) {
							$rootScope.$safeApply($scope, function() {
								$scope.comments=result;
								$scope.commentContent=null;
							});
						}
					});
				}
			});
		};
	};
});
