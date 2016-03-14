define(['app','cookie','applicationService','scrollbar','mousewheel','utilService','bootstrap'], function()
{
	angular.module("bss").controller("applicationCtrl", applicationCtrl);
	function applicationCtrl($scope, $rootScope,applicationManager,utilManager)
	{
		$("[data-toggle='tooltip']").tooltip();
		$scope.initApp=function()
		{
			applicationManager.getServerTestType(function(result){
				var date = new Date();
				angular.forEach(result,function(item,index){
					var time = item.testTime;
					if(typeof time !='undefined'&& null!=time){
						time=time.replace(/-/g, "/ ");
						var date1 =  Date.parse(time);
						var dateSize = (date-date1)/(60*1000);
						if(dateSize>10){
							item.timeSign = "show";
						}
					}
				});
			 var nodeDatas = $scope.testApp(result);
				$rootScope.$safeApply($scope, function() {
					$scope.nodeDatas = nodeDatas;
					$scope.nodeFlag = "key";
				});
				//getServerTestInfo(result[0].flag,result[0].testName);
				//getServerTestInfo(nodeDatas[0].items[0].flag,result[0].testName);
				//$scope.currentItem = nodeDatas[0].items[0].flag;
			});
			$('.aside-slider').perfectScrollbar();
		};
		
		$scope.testApp=function(result)
		{
			var nodeItems = {};
				angular.forEach(result,function(item,index){
					var key = item.nodeName;
					if(key==null){
						nodeItems.temp=[];
					}else{
						nodeItems[key]=[];
					}
				});
			var nodeDatas = [];
				angular.forEach(nodeItems,function(item,index){
					var data = {};
					data.key=index;
					data.value = item;
					data.items = [];
					nodeDatas.push(data);
				});
			angular.forEach(nodeDatas,function(item,index){
					for(var i=0;i<result.length;i++){
						var temp = result[i].nodeName;
						temp = temp==null?"temp":temp;
						if(temp==item.key){
							item.items.push(result[i]);
						}
					}
				});
			angular.forEach(nodeDatas,function(item,index){
				var key = item.key;
				if(key=='temp'){
					nodeDatas.otheritems = item.items;
					//delete nodeDatas.key;
				};
			});
				return nodeDatas;
		};
		
		$scope.showChildItem=function(event){
			var e = event ? event : window.event;
			var cntr = e.srcElement || e.target;
			$(".option-item").removeClass("current");
			$(".item-sign").html("+");
			$(cntr).parents(".option-item").addClass("current");
			var childUl = $(cntr).parents(".option-item").children("ul");
			$(".option-item").children("ul").slideUp();
			if(childUl.css("display")=='none'){
				$(cntr).parents(".option-item").children("ul").slideDown();
				if($(cntr).find(".item-sign").length<1){
					$(cntr).html("-");
				}else{
					$(cntr).find(".item-sign").html("-");
				}
				
			}else{
				$(cntr).parents(".option-item").children("ul").slideUp();
				if($(cntr).find(".item-sign").length<1){
					$(cntr).html("+");
				}else{
				$(cntr).find(".item-sign").html("+");
				}
			}	
			event.stopPropagation();
		};

		$scope.getServerTestInfoByType=function(flag,serverType,event){
			
			$scope.currentItem=flag;
			var e = event ? event : window.event;
			var cntr = e.srcElement || e.target;
			$(".option-item").removeClass("current");
			$(cntr).parents(".option-item").addClass("current");
			var childUl = $(cntr).parent(".option-item").children("ul");
			if(childUl.css("display")=='none'){
				$(cntr).parent(".option-item").children("ul").slideDown();
			}else{
				$(cntr).parent(".option-item").children("ul").slideUp();
			}
			getServerTestInfo(flag,serverType);
		};
		
		function getServerTestInfo(flag,serverType)
		{
			$scope.serverType = serverType;
			$scope.flag =flag; 
			$scope.$bssPost({
				url:"/application/serverTestInfo.do",
				cover:true,
				data:{type:flag},
				success:function(result){
					var servers=[];
					var countall=result.length;
					$rootScope.$safeApply($scope, function() {
						$scope.countall = countall;
					});
					//$(".span-server").text(0);
					//$(".span-exception").text(0);
					$rootScope.$safeApply($scope,function(){
						$scope.span_server = 0;
						$scope.span_exception = 0;
					});
					angular.forEach(result,function(item,index){
						$scope.$bssPost({
							url:"/application/execAppTestSingle.do",
							cover:false,
							data:{server:JSON.stringify(item)},
							success:function(result2){
								$rootScope.$safeApply($scope,function(){
									$scope.span_server = $scope.span_server  + 1;
								});
								if(result2.result != "0"){
									$scope.$safeApply($scope,function(){
										$scope.span_exception = $scope.span_exception + 1;
									});
									item.testInfo="exception";
								}
								var server={serverName:item.serverName,serverIp:item.serverIp,serverPort:item.serverPort,testRst:result2.testRst,taketime:result2.taketime,detailAll:result2,testInfo:item.testInfo,sortFlag:result2.result,state:item.state,configId:item.configId};
								servers.push(server);
								$rootScope.$safeApply($scope, function() {
									var dateTime = utilManager.getLocalTime();
									$scope.dateTime = dateTime;
									$scope.servers = servers;
									$scope.sortFlag = "-sortFlag";
								});
							}
						});
					});
				}
			});	
			$('.server-grid-slider').perfectScrollbar();
		}
		$scope.changeTestState=function(serverIp,serverPort,configId,tempstate){
			var mes ="";
			var state = null;
			if(tempstate=='1'){
				mes = "确定更改f5状态为失效";
				state = "disable";
			}else{
				mes = "确定更改f5状态为生效";
				state ="enable";
			}
			var flag=confirm(mes);
			if(flag==true){
				$scope.$bssPost({
					url:"/application/changef5pState.do",
					data:{username:$.cookie("username"),ip:serverIp,port:serverPort,state:state},
					success:function(result){
						alert("执行f5切换成功！");
						getServerTestInfo($scope.flag,$scope.serverType);
					}
				});
			}
		};
		$scope.queryServerDetail=function(detailAll){
			$scope.detailAll= detailAll;
			$scope.$popup('/html/application/serverPopwin.html', $scope);
		};
	};
});
