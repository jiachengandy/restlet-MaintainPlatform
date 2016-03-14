define([ 'app' ], function() {
	
	var showTimeStart = getFormatDate(new Date(), -1);
	var showTimeEnd =getFormatDate(new Date(), -2);
	angular.module("bss").factory('businessManager',
			function($rootScope) {
				var businessManager = {
						getMonitorResult : function(type,onafter,areaCode,stime,etime,cover) {
						var startTime = typeof stime=='undefined'?showTimeStart:stime;
						var endTime = typeof etime=='undefined'?showTimeEnd:etime;
						var area = typeof areaCode=='undefined'?'000':areaCode;
						var loading = typeof cover=='undefined'?false:cover;
						$rootScope.$bssPost({
							url : "/business/monitorResult.do",
							cover : loading,
							data : {type:type, area:area, time:startTime+","+endTime},
							success : function(result) {
								onafter(result);
							}
						});
					},
					getMonitor3GDetail:function(onafter){
						$rootScope.$bssPost({
							url : "/business/monitor3GDetail.do",
							cover : false,
							success : function(result) {
								onafter(result);
							}
						});
					},
					getFormatDate:function(time,offset){
						if(offset == null)
							offset = 0;
						if(offset == -1){
							offset = 0;
							time.setHours(0,0,0,0);
						}
						if(offset == -2){
							offset = 0;
							time.setHours(23,59,59,999);
						}
						var tm = time.getTime() + offset * 1000 * 60 * 60 * 24;
						time = new Date(tm);
						var y = time.getYear();
						if(y < 1000)
							y += 1900;
						var m = time.getMonth() + 1;
						if(m < 10) m = "0" + m;
						var d = time.getDate();
						if(d < 10) d = "0" + d;
						var h = time.getHours();
						if(h < 10) h = "0" + h;
						var mi = time.getMinutes();
						if(mi < 10) mi = "0" + mi;
						return y + "-" + m + "-" + d + " " + h + ":" + mi;
					}
				};
				return businessManager;
			});
	
	function getFormatDate(time, offset){
		if(offset == null)
			offset = 0;
		if(offset == -1){
			offset = 0;
			time.setHours(0,0,0,0);
		}
		if(offset == -2){
			offset = 0;
			time.setHours(23,59,59,999);
		}
		var tm = time.getTime() + offset * 1000 * 60 * 60 * 24;
		time = new Date(tm);
		var y = time.getYear();
		if(y < 1000)
			y += 1900;
		var m = time.getMonth() + 1;
		if(m < 10) m = "0" + m;
		var d = time.getDate();
		if(d < 10) d = "0" + d;
		var h = time.getHours();
		if(h < 10) h = "0" + h;
		var mi = time.getMinutes();
		if(mi < 10) mi = "0" + mi;
		return y + "-" + m + "-" + d + " " + h + ":" + mi;
	};

});
