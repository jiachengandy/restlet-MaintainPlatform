define(['app'], function()
{
	angular.module("bss").filter('arraySize', function()
	{
		return function(inputArray, begin, end)
		{
			if (!(inputArray instanceof Array))
				return inputArray;
			return inputArray.slice(begin, end);
		};
	});

	angular.module("bss").filter('domainSorter', function()
	{
		return function(domains)
		{
			if (!(domains instanceof Array))
				return domains;

			for ( var i = 0; i < domains.length; i++)
			{
				var domain = domains[i];
				if (domain.domain == window.location.hostname)
				{
					domains.splice(i, 1);
					domains.unshift(domain);
					break;
				}
			}

			return domains;
		};
	});

	// service搜索过滤器
	angular.module("bss").filter(
			'serviceSearchFilter',
			function($rootScope)
			{
				// inputArray表示当前进行过滤的array数据，keyword指当前的搜索条件
				return function(serviceArray, keyword)
				{
					if (!(serviceArray instanceof Array))
						return serviceArray;

					var matchArray = [];

					if (typeof (keyword) == "undefined")
					{
						return serviceArray;
					}

					keyword = keyword.toLocaleLowerCase();
					// 对传入的service进行遍历，若其中包含相关keyword则放入到matchArray中
					if (serviceArray != null && serviceArray instanceof Array)
					{
						for ( var i = 0; i < serviceArray.length; i++)
						{
							for ( var j = 0; j < serviceArray[i].services.length; j++)
							{
								if ((serviceArray[i].services[j].label != null && serviceArray[i].services[j].label.toLocaleLowerCase().indexOf(keyword) > -1)
										|| (serviceArray[i].services[j].provider != null && serviceArray[i].services[j].provider.toLocaleLowerCase().indexOf(keyword) > -1))
								{
									matchArray.push(serviceArray[i]);
									break;
								}
							}
						}
					}

			return matchArray;
		};
	});
	// application搜索过滤器
	angular.module("bss").filter('applicationSearchFilter',function($rootScope)
	{
		// inputArray表示当前进行过滤的array数据，keyword指当前的搜索条件
		return function(applicationArray, keyword)
		{
			if (!(applicationArray instanceof Array))
				return applicationArray;

			var matchArray = [];

			if (typeof (keyword) == "undefined")
			{
				return applicationArray;
			}

			keyword = keyword.toLocaleLowerCase();
			// 对传入的service进行遍历，若其中包含相关keyword则放入到matchArray中
			if (applicationArray != null && applicationArray instanceof Array)
			{
				for ( var i = 0; i < applicationArray.length; i++)
				{
					for ( var j = 0; j < applicationArray[i].application.length; j++)
					{
						if ((applicationArray[i].application[j].name != null && applicationArray[i].application[j].name.toLocaleLowerCase().indexOf(keyword) > -1)
								|| (applicationArray[i].application[j].provider != null && applicationArray[i].application[j].provider.toLocaleLowerCase().indexOf(keyword) > -1))
						{
							matchArray.push(applicationArray[i]);
							break;
						}
					}
				}
			}

			return matchArray;
		};
	});
	angular.module("bss").filter('filterServiceInstances', function()
	{
		return function(insances, bindedInstances)
		{
			if (!(insances instanceof Array && bindedInstances instanceof Array))
			{
				// 避免inputArray没定义
				if (typeof (inputArray) == "undefined")
				{
					return null;
				}
				else
				{
					return inputArray;
				}
			}
			var result = [];
			insances.forEach(function(instance)
			{
				var id = instance.guid;
				var used = false;
				bindedInstances.forEach(function(bindedInstance)
				{
					if (bindedInstance.guid == id)
					{
						used = true;
					}
				});
				if (!used)
				{
					result.push(instance);
				}
			});
			return result;
		};
	});
});
