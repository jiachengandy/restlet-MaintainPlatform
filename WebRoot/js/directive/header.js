define(['app','userService'], function()
{
	angular.module("bss").directive('bssHeader', function()
	{
		return {
			restrict : 'AE',
			templateUrl : 'js/directive/html/header.html',
			replace : true,
			transclude : true,
			scope : {username: "@username",},
			controller : function($scope,$location, $element, $attrs, $rootScope)
			{
				/*var path = window.location.href;
				var start = path.lastIndexOf("/");
				var end =  path.lastIndexOf(".html");
				var key = path.substring(start+1,end);*/
				$scope.getLocalTime =function()
				{
					var now = new Date(); //获取系统日期，即Sat Jul 29 08:24:48 UTC+0800 2006 
					var yy = now.getFullYear(); //截取年，即2006 
					var mm = now.getMonth()+1; //截取月，即07 
					var dd = now.getDate(); //截取日，即29 
					//取时间 
					var hh = now.getHours(); //截取小时，即8 
					var mi = now.getMinutes(); //截取分钟，即34 
					var ss = now.getTime() % 60000; //获取时间，因为系统中时间是以毫秒计算的，
					ss = (ss - (ss % 1000)) / 1000;
					$scope.date = yy+"年"+mm+"月"+dd+"日";
					hh=hh<10?"0"+hh:hh;
					mi=mi<10?"0"+mi:mi;
					ss=ss<10?"0"+ss:ss;
					$rootScope.$safeApply($scope, function() {
					$scope.time = hh+"时"+mi+"分"+ss+"秒";
					});
				};
				window.setInterval(function(){
					$scope.getLocalTime();
				}, 1000);
				$scope.initUrls=function(){
					var role = $.cookie("userRole");
					var username = $.cookie("username");
					$rootScope.$bssPost({
						url:"/user/getReqUrls.do",
						data:{username:username},
						success:function(result){
							$rootScope.$safeApply($scope,function(){
          						$scope.urls=result;
          					});
						}
					});
					$scope.currentMenu = $.cookie("currentMenu");
				};
				var name_zh = $.cookie("name_zh");
				$scope.name_zh = name_zh;
			
				$scope.changeLocation=function(url){
					//window.location.href = url+".html";
					window.location.href = url;
					$.cookie("currentMenu",url);
				};

				// 登出方法
				$scope.logout = function()
				{
					var username = $.cookie("username");
					$rootScope.$bssPost({
						url:"/user/logout.do",
						data:{username:username},
						success:function(result){
							window.location="login";
						}
					});
				};
				
				/**
				 * 切换语言方法，切换之后，将当前语言放到cookie中
				 */
				$scope.changeLanguage = function()
				{
					var language ="";
					if ($rootScope.browserLang == "en")
					{
						language = "zh";
					}
					else
					{
						language = "en";
					}
					
					$rootScope.setCookie('browserLang',language);
					 
				    window.location.reload();
				};
				
				// 在页头切换org时调用的方法
				$scope.changeHeadOrg = function(org, orgId, orgIndex)
				{
					orgManager.changeDefaultOrg(orgId, function(result)
					{
						if (result && typeof(result.codeValue) != "undefined")
						{
							
						}
						else
						{
							$scope.$apply(function()
							{
								$scope.org = org;
								if (org.spaceList && org.spaceList[0]) {
									$scope.space = org.spaceList[0];
								}
								$scope.updateHeader();
								$rootScope.$broadcast("event.spaceorg.change");
								
							});
						}
					});
				};
			},
			compile : function(tElement, tAttr, linker)
			{
				return function($scope, $element, $attrs)
				{
					/*var path = window.location.href;
					var start = path.lastIndexOf("/");
					var end =  path.lastIndexOf(".html");
					var key = path.substring(start+1,end);
					$(".nav-menu li#"+key).addClass("current");*/
				};
			}
		};
	});

});
