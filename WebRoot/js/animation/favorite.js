define(['app'], function()
{
	angular.module("bss").animation('.app-repeated', function()
	{
		return {
			move : function(element, done)
			{
				//console.log("move", element);
				$(element).find(".application-wrap").hide();
				$(element).css({
					"width" : '0px'
				});
				$(element[0]).animate({
					width : '407px'
				}, "slow");

				//$(".application li").removeClass("hover");
				setTimeout(function()
				{
					//$(element).find("li").addClass("hover");
					$(element).find(".application-wrap").show();
				}, 600);
			}
		};
	});
	
	angular.module("bss").animation('.service-repeated', function()
	{
		return {
			move : function(element, done)
			{
				//console.log("move", element);
				$(element).find(".application-wrap").hide();
				$(element).css({
					"width" : '0px'
				});
				$(element[0]).animate({
					width : '305px'
				}, "slow");

				//$(".application li").removeClass("hover");
				setTimeout(function()
				{
					//$(element).find("li").addClass("hover");
					$(element).find(".application-wrap").show();
				}, 600);
			}
		};
	});
});
