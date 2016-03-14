define([ 'baseModule' ], function()
{
	/**
	 * @param {Object}
	 *            option { url : 请求地址 e.g. /user/login targetStep : 跳转地址，如果需要的话
	 *            success : 成功之后的异步回调函数 data : 发送数据 }
	 */

	angular.module("bss.core").factory('bssGet', function(bssAjax)
	{
		return function(option)
		{
			option = $.extend(
			{
				type : "GET",
				exceptionFilter : true
			}, option ||
			{});
			bssAjax(option);
		};
	});
	angular.module("bss.core").factory('bssPost', function(bssAjax)
	{
		return function(option)
		{
			option = $.extend(
			{
				type : "POST",
                pageReload : true,
				exceptionFilter : true
			}, option ||
			{});
            bssAjax(option);
		};
	});
	
	// 实现国际化的service，以供组件使用
	angular.module("bss.core").factory('bssI18n',["$rootScope", function($rootScope,$scope)
	{
		return function(key,properties)
		{
        		var i18nval=null;
        		/*// 首先获取当前浏览器语言
				var browserLang  = navigator.language;
				
				// 若当前取不到浏览器语言，则设置默认语言为en_US
				if (browserLang == "" || browserLang == null)
				{
					browserLang = "en";
				}
				
				// 若当前浏览器语言包含zh，即将国际化语言设置为zh_CN，其他情况下都设置为en_US
				if (browserLang.indexOf("zh") != -1)
				{
					browserLang = "zh";
				}
				else
				{
					browserLang = "en";
				}*/
				
        		$rootScope.browserLang  = $rootScope.getCookie("browserLang");
        		if ($rootScope.browserLang == "")
        		{
        			$rootScope.browserLang = "en";
        		}
				
        		var resPath = $rootScope.$webapp + "/i18n/output/";
		        jQuery.i18n.properties({// 加载资浏览器语言对应的资源文件  
		            name : 'message', // 资源文件名称  
		            language : $rootScope.browserLang, //默认为英文当改为zh_CN时页面显示中文语言  
		            path :resPath, // 资源文件路径  
		            mode : 'map', // 用 Map 的方式使用资源文件中的值  
		            cache:true,
		            encoding:'UTF-8', // 设置当前的编码格式为UTF-8
		            callback : function() {// 加载成功后设置显示内容 
		            	if (properties != null)
		            	{
		            		i18nval  = $.i18n.prop (key,properties);
		            	}
		            	else
	            		{
		            		i18nval =  jQuery.i18n.prop(key);
	            		}
		            }  
		        });  
		        return i18nval;
		};
	}]);


	angular.module("bss.core").factory('bssAjax', function($http, $location, $rootScope)
	{
		var coverQ = [];
		function showCover()
		{
			coverQ.push(true);
			$("#coverLayer").css("display", "block");
			$("#coverLoading").css("display", "block");
			$("#coverLayer").css("height", $(document).height());
		}

		function closeCover()
		{
			coverQ.pop();
			if (coverQ.length == 0)
			{
				$("#coverLayer").css("display", "none");
				$("#coverLoading").css("display", "none");
			}
		}

		function relogin()
		{
			$rootScope.$apply(function()
			{
                // 超时跳登录页面 登录后回到超时页面
                window.location = $rootScope.$webapp + "/user/signin#?return_to=" + encodeURIComponent(window.location.href);
			});
		}

		function gotoError(result)
		{
			$rootScope.$apply(function()
			{
                window.location = $rootScope.$webapp + "/system/500#?error=" + result;
			});
		}

		/**
		 * @param {Object}
		 *            option { url : 请求地址 e.g. /user/login targetStep :
		 *            跳转地址，如果需要的话 success : 成功之后的异步回调函数 data : 发送数据 type :
		 *            GET/POST cover : true/false 默认为true，显示遮罩 async :true/false
		 *            默认为true，异步 }
		 */
		function process(option)
		{
			var defaultAjax =
			{
				async : option.async,
				cache : false,
				type : option.type,
				//url : $rootScope.$webapp + "/rest.root" + option.url,
				url : $rootScope.$webapp + "/" + option.url,
				beforeSend : function(xhr)
				{
					option.cover && showCover();
				},
				contentType : 'application/x-www-form-urlencoded; charset=utf-8',
				error : function(result)
				{
					option.cover && closeCover();
					if (result && typeof(result.status) != 'undefined' && result.status == '401')
					{
							relogin();
					}
				},
				success : function(result)
				{
					option.cover && closeCover();
						option.success && option.success.apply(this, arguments);
						if (option.targetStep && result.successful)
						{
							$rootScope.$apply(function()
							{
	                            if (option.pageReload)
	                            {
	                                window.location = option.targetStep;
	                            }
	                            else
	                            {
	                                $location.path(option.targetStep);
	                            }
							});
						}
				}
			};

			option.data && (defaultAjax["data"] = option.data);
			option.dataType && (defaultAjax["dataType"] = option.dataType);
			option.dataFilter && (defaultAjax["dataFilter"] = option.dataFilter);
			option.contentType && (defaultAjax["contentType"] = option.contentType);
			return defaultAjax;
		}

		return function(option)
		{
			if (option.cover == undefined)
			{
				option.cover = true;
			}
			if (option.async == undefined)
			{
				option.async = true;
			}
			$.ajax(process(option));
		};
	});

	angular.module("bss.core").factory('position', function()
	{
		var position =
		{
			margin : function(id)
			{
				var elem = $("#" + id);
				/*
				 * var elemTop = ($(window).height() - elem.height()) / 2; var
				 * elemLeft = ($(window).width() - elem.width()) / 2;
				 */
				var elemTop = elem.height() / 2;
				var elemLeft = elem.width() / 2;
				elem.css(
				{
					"margin-top" : -elemTop,
					"margin-left" : -elemLeft
				});
			}
		};
		return position;
	});
	var popupwinArra = [];
	angular.module("bss.core").factory('popup',
			['$rootScope', '$http', 'position', '$compile', '$location', function($rootScope, $http, position, $compile, $location)
			{
				var popup = function(src, scope)
				{
                    src = $rootScope.$webapp + src;
					$http.get(src).success(function(data)
					{
						if (popupwinArra.length == 0)
						{
							$('<div id="popupwin"></div>').appendTo("body").after('<div class="masklayer" id="masklayer"></div>');
							$(data).appendTo($("#popupwin"));
							var templateElement = angular.element("#popupwin");
							$compile(templateElement)(scope);
							position.margin("popupwin");
							popupwinArra.push(src);
						}
						else
						{
							angular.forEach(popupwinArra, function(popupwin)
							{
								if (src == popupwin)
								{
									return;
								}
							});
						}
					});
				};

				popup.close = function()
				{
					$("#popupwin").remove();
					$(".masklayer").remove();
					popupwinArra = [];
				};

				popup.close = function(src)
				{
					$("#popupwin").remove();
					$(".masklayer").remove();
					popupwinArra = [];
					if (undefined != src && src != "")
					{
                        window.location = src;
//						$location.url(src);
					}

				};

				return popup;
			} ]);

	angular.module("bss").factory('messageBox', [ 'popup', '$rootScope', function(popup, $rootScope)
	{
		var src = "/resource.root/directive/messageBox/messageBox.html";
		var messageBox =
		{
			tip : function(type, description, $scope)
			{
				$scope.messageBox_type = type;
				$scope.messageBox_description = description;
				$scope.messagebox_popup = popup;
				popup(src, $scope);
				$scope.messagebox_extendfn = function()
				{
					popup.close();
				};
			},
			success : function(description, $scope, extendfn)
			{
				$scope.messageBox_type = "success";
				$scope.messageBox_description = description;
				$scope.messagebox_popup = popup;
				popup(src, $scope);
				$scope.messagebox_extendfn = function()
				{
					popup.close();
					extendfn();
				};
			},
			error : function(description, $scope, extendfn)
			{
				$scope.messageBox_type = "error";
				$scope.messageBox_description = description;
				$scope.messagebox_popup = popup;
				popup(src, $scope);
				$scope.messagebox_extendfn = function()
				{
					popup.close();
					extendfn();
				};

			},
			notice : function(description, $scope, extendfn)
			{
				$scope.messageBox_type = "notice";
				$scope.messageBox_description = description;
				$scope.messagebox_popup = popup;
				popup(src, $scope);
				$scope.messagebox_extendfn = function()
				{
					popup.close();
					extendfn();
				};
			},
			confirm : function(description, $scope, extendfn)
			{
				$scope.messageBox_type = "confirm";
				$scope.messageBox_description = description;
				$scope.messagebox_popup = popup;
				popup(src, $scope);
				$scope.messagebox_extendfn = function()
				{
					popup.close();
					extendfn();
				};
			},
			confirmSave : function(description, $scope, extendfn)
			{
				$scope.messageBox_type = "confirmSave";
				$scope.messageBox_description = description;
				$scope.messagebox_popup = popup;
				popup(src, $scope);
				$scope.messagebox_extendfn = function()
				{
					popup.close();
					extendfn();
				};
			}
		};
		return messageBox;
	} ]);
});
