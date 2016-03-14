define(['app'], function()
{
	angular.module("bss.core").directive('bssInput', function()
	{
		return {
			restrict : 'AE',
			templateUrl : 'resource.root/directive/input/input.html',
			replace : true,
			transclude : true,
			scope : {
				input_value : "=value",
				validator : "="
			},
			controller : function($scope, $element, $attrs, $rootScope)
			{
				$scope.root = $rootScope;
				$scope.label = $rootScope.$i18n($attrs.label);
				//$scope.tips =  $rootScope.$i18n($attrs.tips);
				if(typeof($attrs.tips) != "undefined")
				{
					$scope.tips = $rootScope.$i18n($attrs.tips);
				}
				$scope.initInputType = function()
				{
					$("#" + $scope.$id);
				};
			},
			compile : function(tElement, tAttr, linker)
			{
				return function($scope, $element, $attrs, $rootScope)
				{
					$scope.type = "text";
					$scope.required = $attrs.required;
					//$scope.tips = $attrs.tips;
					// 实现label中国际化方法
					//$scope.label = $attrs.label;
					//$scope.label = $rootScope.$i18n($attrs.label,"");
					$scope.size = $attrs.size;
					$scope.id = $attrs.id || $scope.$id + "-input";
					$attrs.type && ($scope.type = $attrs.type);
					$attrs.id && ($scope.id = $attrs.id);
					$scope.alwaysValid = false;
					$attrs.alwaysvalid && ($scope.alwaysValid = $attrs.alwaysvalid);

					$scope.valid = false;
					$scope.showTips = true;

					// showimg用来表示当前是否是用户相关，若为用户相关则需要检验后添加勾号，否则不添加
					if ($attrs.showimg == "true") {
						$scope.showimg = true;
					}
					else {
						$scope.showimg = false;
					}

					if ($attrs.validator) {
						$scope.$parent.validateList || ($scope.$parent.validateList = {});
						$scope.$parent.validateList[$scope.$id] = false;

						$scope.$on("$destroy", function()
						{
							//console.log("scope destroyed", $scope.$parent.validateList, $scope.$id);
							delete $scope.$parent.validateList[$scope.$id];
						});
						
						$scope.$on("$validator." + $scope.id, function()
						{
							$scope.vaildate($scope.input_value);
						});

						$scope.$on("Event.submit", function()
						{
							$scope.first = false;
							$scope.vaildate($scope.input_value);
							if ($scope.validPromise) {
								$scope.validPromise.then(function()
								{
									$scope.root.$safeApply($scope, function()
									{
										//console.log("promise validateList deleted", $scope.$parent.validateList);
										delete $scope.$parent.validateList[$scope.$id];
										$scope.$parent.$broadcast("Event.validate", $scope.$parent.validateList);
									});
									//$scope.$parent.$broadcast("Event.validate", $scope.$parent.validateList);
								}, function()
								{
									$scope.$parent.validateList[$scope.$id] = false;
									//$scope.$parent.$broadcast("Event.validate", $scope.$parent.validateList);
								});
							}
							else {
								if ($scope.valid) {
									delete $scope.$parent.validateList[$scope.$id];
									//console.log("validateList deleted", $scope.$parent.validateList);
								}
								else {
									$scope.$parent.validateList[$scope.$id] = false;
								}
								$scope.$parent.$broadcast("Event.validate", $scope.$parent.validateList);
							}
						});

					}

					var oldValue;

					$scope.vaildate = function(value)
					{
						if (value == undefined) {
							value = $scope.input_value = "";
						}

						if (oldValue == value && !$scope.alwaysValid) {
						}
						else {
							oldValue = value;
							$scope.valid = true;
							if ($attrs.validator) {
								var validator = $scope.validator;
								if ( typeof validator == "function") {
									var result = validator.apply(this, arguments);
									if (null != result) {
										//using $q to get an async result
										if (result.then) {
											$scope.validPromise = result;
											result.then(function(temp)
											{
												$scope.valid = true;
												$scope.validateResult = temp;
											}, function(temp)
											{
												$scope.valid = false;
												$scope.validateResult = temp;
											});
										}
										else {
											$scope.validateResult = result;
											if (result == true || result == "true") {
												$scope.valid = true;
											}
											else {
												$scope.valid = false;
											}
										}
									}
								}
							}
						}
					};

					$scope.DealkeyDown = function(evt)
					{
						var evt = window.event ? window.event : evt;
						if (evt.keyCode == 13) {
							//如果按下的是回车键，则执行对应的js函数
							return false;
						}
						else {
							return true;
						}
					};
				};
			}
		};
	});

});
