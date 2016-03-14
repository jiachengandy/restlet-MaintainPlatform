define(['app'], function()
{
	// 用户操作
	angular.module("bss").factory('userManager', function($rootScope, $location)
	{
		var userManager = 
		{
			// 用户登录时调用login与后台交互
			login : function(username, password, code, onafter)
			{
				//针对密码特殊字符转换，使其可提交后台
				var newPasswod = encodeURIComponent(encodeURIComponent(password));
				$rootScope.$bssPost(
						{
							url : "/user/login",
							data : "email=" + username + "&password=" + newPasswod + "&code=" + code,
							exceptionFilter:false,
							success : function(result)
							{
								onafter(result);
							},
						});
			},
			
			// 用户登出
			logout : function(onafter)
			{
				$rootScope.$bssPost(
				{
					url : "/user/logout",
					success : function(result)
					{
						//console.log("logout", result);
						onafter(result);
					},
				});
			},
			
			// 用户注册时，与后台交互
			register : function(username, password, code, onafter)
			{
				//针对密码特殊字符转换，使其可提交后台
				var newPasswod = encodeURIComponent(encodeURIComponent(password));
				$rootScope.$bssPost(
				{
					url : "/user/register",
					data : "email=" + username + "&password=" + newPasswod + "&code=" + code,
					success : function(result)
					{
						//console.log("register", result);
						onafter(result);
					}
				});
			},
			
			// 当用户访问portal时，查询当前的用户信息
			queryUserInfo : function(onafter)
			{
				$rootScope.$bssGet(
				{
					url : "/user/userinfo",
					exceptionFilter:false,
					success : function(result)
					{
						//console.log("userinfo", result);
						onafter(result);
					}
				});
			},
			
			// TODO 方法一模一样，请修改
			// 查询登录信息是否超时
			userTimeout : function(onafter)
			{
				$rootScope.$bssGet(
				{
					url : "/user/userinfo",
					exceptionFilter:false,
					success : function(result)
					{
						onafter(result);
					}
				});
			},
			
			//空间下添加用户
			addUser : function(username, password, code,spaceId,orgId, onafter)
			{
				var newPasswod = encodeURIComponent(encodeURIComponent(password));
				$rootScope.$bssPost(
				{
					url : "/user/addNewUser",
					data : "userName=" + username + "&password=" + newPasswod + "&code=" + code + "&spaceId=" + spaceId + "&orgId=" + orgId,
					success : function(result)
					{
						onafter(result);
					}
				});
			}
			
		};
		return userManager;
	});
	
	// org操作
	angular.module("bss").factory('orgManager', function($rootScope, $location, bssPost, bssGet)
	{
		var orgManager = 
	    {
			// 切换当前登录用户的默认org
			changeDefaultOrg : function(orgId,onafter)
			{
				$rootScope.$bssPost(
				{
					url : "/organization/changeOrg",
					data:"orgId=" + orgId,
					success : function(result)
					{
						//console.log("changeDefaultOrg", result);
						onafter(result);
					}
				});
			},
			queryQuota: function(orgId,onafter){
				
				$rootScope.$bssGet(
				{
					url : "/organization/getUsageOfQuota",
					data:"orgId=" + orgId,
					//exceptionFilter:false,
					success : function(result)
					{
						onafter(result);
					}
				});
			},
			//修改组织下用户权限
			modifyOrgLimit: function(org,onafter){
				$rootScope.$bssPost(
				{
					url : "/organization/getUsageOfQuota",
					data : JSON.stringify(org),
					dataType : "text",
					contentType : "application/json",
					//exceptionFilter:false,
					success : function(result)
					{
						onafter(result);
					}
				});
			}
			
			
	    };
		return orgManager;
	});
	
	// space操作
	angular.module("bss").factory('spaceManager', function($rootScope, $location, bssPost, bssGet)
	{
		var spaceManager = 
			{
			// 切换当前登录用户的默认space
				changeDefaultSpace : function(spaceId,onafter)
				{
					$rootScope.$bssPost(
					{
						url : "/space/change",
						data:"spaceId=" + spaceId,
						success : function(result)
						{
							//console.log("changeDefaultSpace", result);
							onafter(result);
						}
					});
			},
						
			// 添加space
			createSpace : function(spaceName, orgId,onafter)
			{
				$rootScope.$bssPost(
				{
					url : "/space/userAddSpace",
					data:"name=" + spaceName + "&orgid=" + orgId,
					success : function(result)
					{
					//	console.log("createSpace", result);
						onafter(result);
					}
				});
			},
						
			// 删除sapce
			deleteSpace : function(spaceId, orgId, onafter)
			{
				$rootScope.$bssPost(
				{
					url : "/space/deleteSpace",
					data:"spaceId=" + spaceId + "&orgId=" + orgId,
					success : function(result)
					{
						//console.log("deleteSpace", result);
						onafter(result);
					}
				});
			}
			};
		return spaceManager;
	});
	
	// domain操作
	angular.module("bss").factory('domainManager', function($rootScope, $location, bssPost, bssGet)
	{
		var domainManager = 
		{
			// 查询当前所有的system domains
			querySysDomains : function(onafter)
			{
				$rootScope.$bssGet(
				{
					url : "/domain/query/shared/all",
					success : function(result)
					{
						//console.log("sysdomains", result);
						onafter(result);
					}
				});
			},
				
			// 查询当前所有的custom domains
			queryCustomDomains : function(onafter)
			{
				$rootScope.$bssGet(
				{
					url : "/domain/query/private/all",
					success : function(result)
					{
						//console.log("customdomains", result);
						onafter(result);
					}
				});
			},
				
			// 删除 coustom domain
			delCustomDomain : function(deleteDomainList,onsuccess)
			{
				$rootScope.$bssPost(
				{
					url : "/domain/delete/private",
					data: "domainIdList=" + deleteDomainList,
					success : function(result)
					{
						//console.log("delcustomdomains", result);
						onsuccess(result);
					}
				});
			},
				
			// 添加 coustom domain
			addCustomDomain : function(addDomainList, orgId, onsuccess)
			{
				$rootScope.$bssPost(
				{
					url : "/domain/add/private",
					data: "domainList=" + addDomainList + "&orgId=" + orgId,
					success : function(result)
					{
						//console.log("addcustomdomains", result);
						onsuccess(result);
					}
				});
			},
			
			//删除未绑定的route
			delUnboundRoutes : function(delUnboundRoutesList,onsuccess){
				var routeId = delUnboundRoutesList.join(",");
				
				$rootScope.$bssPost(
				{
					url : "/application/route/delete",
					data: "id=" + routeId,
					success : function(result)
					{
						//console.log("delcustomdomains", result);
						onsuccess(result);
					}
				});
//				console.info(routeId);
			}
		};

		return domainManager;
	});
	
	// 邮件重发
	angular.module("bss").factory('resendEmail', function($rootScope, $location, bssPost){
		return function(userName, onafter)
		{
			$rootScope.$bssPost({
				url : "/user/resendEmail",
				data : "userName=" + userName,
				success : function(result)
				{
					onafter(result);
				}
			});
		};
	});	
	
});
