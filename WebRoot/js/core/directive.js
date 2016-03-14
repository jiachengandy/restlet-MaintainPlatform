define(['core_service'], function()
{
	/**
	 *init core methods in rootScope
	 */
	angular.module("bss").directive("html", function()
	{
		return {
			restrict : "E",
			controller : function($rootScope, $scope,$location, bssGet, bssPost, popup, messageBox,$window,bssI18n, cfg)
			{
//				// Init Client context. Webapp is "/bss" for example.
//				var path = window.location.pathname.split('/');

                var webapp = cfg.contextPath;
                if (!webapp || "/" == webapp)
                {
                    webapp = "";
                }

//				var webapp = "/" + path[1];
//				//没有webapp的名字
//				if (path.length < 3) {
//					webapp = "";
//				}
                
                $rootScope.getCookie = function(name)
				{
					//读取cookies 
				    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
				 
				    if(arr=document.cookie.match(reg))
				    {
				    	 return unescape(arr[2]); 
				    }
				       
				    return ""; 
				};
				
				//删除cookies 
				$rootScope.delCookie = function(name) 
				{ 
				    var exp = new Date(); 
				    exp.setTime(exp.getTime() - 1); 
				    var cval= $rootScope.getCookie(name); 
				    if(cval!=null) 
				    {
				    	document.cookie= name + "="+ "" +";expires="+exp.toGMTString(); 
				    }
				};
				
				$rootScope.setCookie = function(key, value)
				{
					var Days = 30; 
					var exp = new Date(); 
					exp.setTime(exp.getTime() + Days*24*60*60*1000); 
					document.cookie = key + "="+ escape (value) + ";expires=" + exp.toGMTString()+ ";path=" + bssCfg.contextPath;
				};
				
				$rootScope.$window = $window;
				$rootScope.$webapp = webapp;
				$rootScope.$bssGet = bssGet;
				$rootScope.$bssPost = bssPost;
				$rootScope.$popup = popup;
				$rootScope.$messageBox = messageBox;
				$rootScope.$location = $location;
				$rootScope.$i18n = bssI18n;

				// Init common method on scope for directive use
				$rootScope.$safeApply = function($scope, fn)
				{
					fn = fn ||
					function()
					{
					};
					if ($scope.$$phase || $rootScope.$$phase) {
						//don't worry, the value gets set and AngularJS picks up on it...
						return fn();
					}
					else {
						//this will fire to tell angularjs to notice that a change has happened
						//if it is outside of it's own behaviour...
						return $scope.$apply(fn);
					}
				};
				
				//console.log("[html]", $rootScope);
			}
		};
	});

	angular.module("bss").directive("bssHref", function()
	{
		return {
			priority : "1",
			restrict : "A",
			compile : function(telement, attr, linker)
			{
				return function link(scope, element, attrs)
				{
					attrs.$observe("bssHref", function(value)
					{
						if (!value || !scope.onready) {
							return;
						}
						attrs.$set("href", value);
					});
				};
			}
		};
	});
});
